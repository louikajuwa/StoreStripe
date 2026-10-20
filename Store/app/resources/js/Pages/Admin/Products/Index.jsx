import { Head, Link, router } from '@inertiajs/react';
import AdminNav from '@/Components/AdminNav';
import Pagination from '@/Components/Pagination';
import { useNotify } from '@/Components/Notifications/NotificationProvider';

function EditIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

function ProductAvatar() {
    return (
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        </div>
    );
}

export default function AdminProductsIndex({ products }) {
    const notify = useNotify();

    const handleDelete = async (product) => {
        const ok = await notify.confirm({
            title: 'Delete product?',
            message: `"${product.name}" will be permanently removed. This cannot be undone.`,
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            danger: true,
        });
        if (!ok) return;
        router.delete(`/admin/products/${product.id}`, {
            preserveScroll: true,
            onSuccess: () => notify.toast({ type: 'success', message: `"${product.name}" deleted` }),
            onError: () => notify.toast({ type: 'error', message: 'Could not delete product' }),
        });
    };

    return (
        <>
            <Head title="Products — Admin" />
            <div className="min-h-screen bg-gray-50">
                <AdminNav />

                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

                    {/* Page header */}
                    <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h1>
                            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                                {products.total} {products.total === 1 ? 'product' : 'products'} in your store
                            </p>
                        </div>
                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="hidden sm:inline">Add Product</span>
                            <span className="sm:hidden">Add</span>
                        </Link>
                    </div>

                    {/* Card / Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[450px] max-h-[450px] flex flex-col">
                        {products.data.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-7 h-7 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <p className="font-semibold text-gray-700 mb-1">No products yet</p>
                                <p className="text-sm text-gray-400 mb-6">Add your first product to start selling.</p>
                                <Link
                                    href="/admin/products/create"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                                >
                                    Create product
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* ── Mobile: card list ── */}
                                <div className="sm:hidden divide-y divide-gray-50 flex-1 overflow-y-auto">
                                    {products.data.map((product) => (
                                        <div key={product.id} className="flex items-center gap-3 p-4">
                                            <ProductAvatar />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-gray-900 truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    #{product.id}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                <span className="font-bold text-gray-900 text-sm">
                                                    ${parseFloat(product.price).toFixed(2)}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        aria-label="Edit"
                                                    >
                                                        <EditIcon />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product)}
                                                        className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        aria-label="Delete"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ── Desktop: table ── */}
                                <div className="hidden sm:block overflow-auto flex-1">
                                    <table className="w-full">
                                        <thead className="sticky top-0 z-10">
                                            <tr className="border-b border-gray-100 bg-gray-50/95 backdrop-blur-sm">
                                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {products.data.map((product) => (
                                                <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <ProductAvatar />
                                                            <span className="font-semibold text-gray-900 text-sm">
                                                                {product.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                                                            #{product.id}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-gray-900">
                                                            ${parseFloat(product.price).toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`/admin/products/${product.id}/edit`}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                            >
                                                                <EditIcon />
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(product)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                            >
                                                                <TrashIcon />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>

                    <Pagination links={products.links} meta={products} />
                </main>
            </div>
        </>
    );
}
