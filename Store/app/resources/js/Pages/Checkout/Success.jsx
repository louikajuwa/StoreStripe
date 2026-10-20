import { Head, Link } from '@inertiajs/react';

export default function CheckoutSuccess({ product }) {
    return (
        <>
            <Head title="Order Confirmed" />

            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 sm:p-12 w-full max-w-sm sm:max-w-md text-center">

                    {/* Check icon */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        {/* Ping ring */}
                        <div className="absolute inset-0 rounded-full bg-emerald-200 opacity-40 animate-ping" />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        Your payment was successful.<br className="hidden sm:block" />
                        We'll send you a receipt shortly.
                    </p>

                    {/* Product card */}
                    <div className="bg-indigo-50 rounded-2xl px-5 py-4 mb-7 text-left">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1.5">
                            You purchased
                        </p>
                        <p className="font-bold text-indigo-900 text-sm sm:text-base leading-snug">
                            {product.name}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-indigo-600 font-semibold">
                                ${parseFloat(product.price).toFixed(2)}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                Paid
                            </span>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="block w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors active:scale-[0.99] shadow-sm"
                    >
                        Continue Shopping
                    </Link>
                    <p className="mt-4 text-xs text-gray-400">
                        Questions?{' '}
                        <a href="mailto:support@store.com" className="underline hover:text-gray-600 transition-colors">
                            Contact support
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
