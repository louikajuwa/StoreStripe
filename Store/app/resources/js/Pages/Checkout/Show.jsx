import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { router } from '@inertiajs/react';

/* ── Inline checkout form ── */
function CheckoutForm({ product }) {
    const stripe    = useStripe();
    const elements  = useElements();

    const [name,       setName]       = useState('');
    const [email,      setEmail]      = useState('');
    const [processing, setProcessing] = useState(false);
    const [error,      setError]      = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        try {
            const res = await fetch(`/checkout/${product.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'X-CSRF-TOKEN':  document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                    'Accept':        'application/json',
                },
                body: JSON.stringify({ customer_name: name, customer_email: email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message ?? 'Failed to create payment.');
            }

            const { clientSecret } = await res.json();

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name, email },
                },
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
            } else if (result.paymentIntent.status === 'succeeded') {
                router.visit(`/checkout/${product.id}/success`);
            }
        } catch (err) {
            setError(err.message);
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="john@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Card Details</label>
                <div className="border border-gray-200 rounded-xl px-4 py-3.5 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '15px',
                                    color: '#111827',
                                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                                    '::placeholder': { color: '#9ca3af' },
                                },
                                invalid: { color: '#ef4444' },
                            },
                        }}
                    />
                </div>
                <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Encrypted and never stored
                </p>
            </div>

            {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm tracking-wide transition-colors active:scale-[0.99] shadow-sm"
            >
                {processing ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Processing…
                    </span>
                ) : (
                    `Pay $${parseFloat(product.price).toFixed(2)}`
                )}
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 pt-1">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    SSL Secured
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Powered by Stripe
                </div>
            </div>
        </form>
    );
}

/* ── Page ── */
export default function CheckoutShow({ product, stripeKey }) {
    const stripePromise = loadStripe(stripeKey);

    return (
        <>
            <Head title={`Checkout — ${product.name}`} />

            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3">
                    <Link
                        href="/"
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
                        aria-label="Back to shop"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="flex items-center gap-2 text-sm min-w-0">
                        <Link href="/" className="text-gray-400 hover:text-gray-700 transition-colors whitespace-nowrap">Shop</Link>
                        <svg className="w-3 h-3 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-semibold text-gray-900 truncate">Checkout</span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-10">

                    {/* ── Payment form ── */}
                    <div className="lg:col-span-3 order-2 lg:order-1">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-5 sm:mb-6">
                                Payment Details
                            </h2>
                            <Elements stripe={stripePromise}>
                                <CheckoutForm product={product} />
                            </Elements>
                        </div>
                    </div>

                    {/* ── Order summary ── */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 sm:p-6 lg:sticky lg:top-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Order Summary
                            </p>

                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm leading-tight">
                                        {product.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">Qty: 1</p>
                                </div>
                                <span className="font-bold text-gray-900 text-sm flex-shrink-0">
                                    ${parseFloat(product.price).toFixed(2)}
                                </span>
                            </div>

                            <div className="border-t border-gray-200 pt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-700">${parseFloat(product.price).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-emerald-600 font-semibold">Free</span>
                                </div>
                                <div className="flex justify-between text-base font-bold pt-2.5 border-t border-gray-200">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-indigo-600">${parseFloat(product.price).toFixed(2)}</span>
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-gray-400 text-center">
                                Test card: <span className="font-mono font-semibold">4242 4242 4242 4242</span>
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}
