import { Head, Link } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

function ProductIcon({ className = '' }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

export default function ProductsIndex({ products }) {
    return (
        <>
            <Head title="Shop" />

            {/* ── Header ── */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 font-extrabold text-gray-900">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <span className="text-base sm:text-lg">Store</span>
                    </Link>
                    <Link
                        href="/admin/login"
                        className="text-xs sm:text-sm text-gray-400 hover:text-indigo-600 transition-colors font-medium"
                    >
                        Admin →
                    </Link>
                </div>
            </header>

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 text-white">
                {/* Decorative blobs */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute -top-8 left-1/4 w-56 h-56 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-300 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
                    <span className="inline-block text-xs font-bold tracking-widest uppercase text-indigo-200 mb-3">
                        Free shipping · Every order
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                        Quality products,<br className="hidden sm:block" /> great prices.
                    </h1>
                    <p className="mt-3 sm:mt-4 text-indigo-100 text-sm sm:text-lg max-w-xs sm:max-w-md mx-auto">
                        Discover our curated collection. Every order ships fast and free.
                    </p>
                </div>
            </section>

            {/* ── Products ── */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {products.data.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ProductIcon className="w-8 h-8 text-indigo-300" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-700 mb-1">No products yet</h2>
                        <p className="text-gray-400 text-sm">Check back soon for new arrivals.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-5 sm:mb-6">
                            <h2 className="font-bold text-gray-900 text-base sm:text-lg">All Products</h2>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                                {products.total} items
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                            {products.data.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-square bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-indigo-100/0 group-hover:bg-indigo-100/30 transition-colors duration-300" />
                                        <ProductIcon className="w-10 h-10 sm:w-14 sm:h-14 text-indigo-200 group-hover:text-indigo-300 group-hover:scale-110 transition-all duration-300" />
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 mb-2">
                                            {product.name}
                                        </h3>
                                        <div className="mt-auto">
                                            <p className="text-base sm:text-xl font-extrabold text-indigo-600 mb-2.5">
                                                ${parseFloat(product.price).toFixed(2)}
                                            </p>
                                            <Link
                                                href={`/checkout/${product.id}`}
                                                className="block text-center py-2 sm:py-2.5 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
                                            >
                                                Buy Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Pagination links={products.links} meta={products} />
                    </>
                )}
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-gray-100 mt-4">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Store. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Secure payments by Stripe
                    </div>
                </div>
            </footer>
        </>
    );
}
