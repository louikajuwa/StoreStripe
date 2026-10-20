import { Head, Link, useForm } from '@inertiajs/react';
import AdminNav from '@/Components/AdminNav';

function FieldError({ message }) {
    if (!message) return null;
    return (
        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {message}
        </p>
    );
}

export default function AdminProductsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name:  '',
        price: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/products');
    };

    return (
        <>
            <Head title="New Product — Admin" />
            <div className="min-h-screen bg-gray-50">
                <AdminNav />

                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-5 sm:mb-6">
                        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600 transition-colors">
                            Products
                        </Link>
                        <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-semibold text-gray-700">New Product</span>
                    </div>

                    <div className="max-w-xl">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Card header */}
                            <div className="px-5 py-4 sm:px-8 sm:py-5 border-b border-gray-100">
                                <h1 className="text-base sm:text-lg font-bold text-gray-900">Create Product</h1>
                                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Add a new product to your store</p>
                            </div>

                            <form onSubmit={submit} className="p-5 sm:p-8 space-y-5 sm:space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Product Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        autoFocus
                                        placeholder="e.g. Wireless Headphones"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    />
                                    <FieldError message={errors.name} />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Price (USD) <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold select-none">
                                            $
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="0.00"
                                            className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>
                                    <FieldError message={errors.price} />
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors shadow-sm text-center"
                                    >
                                        {processing ? 'Creating…' : 'Create Product'}
                                    </button>
                                    <Link
                                        href="/admin/products"
                                        className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-semibold text-center transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
