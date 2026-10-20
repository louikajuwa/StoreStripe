import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AdminNav from '@/Components/AdminNav';
import Pagination from '@/Components/Pagination';

const statusConfig = {
    paid:    { label: 'Paid',    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending: { label: 'Pending', classes: 'bg-amber-50  text-amber-700  border-amber-200'   },
    failed:  { label: 'Failed',  classes: 'bg-red-50    text-red-600    border-red-200'     },
};

function StatusBadge({ status }) {
    const cfg = statusConfig[status] ?? { label: status, classes: 'bg-gray-50 text-gray-600 border-gray-200' };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cfg.classes}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0" />
            {cfg.label}
        </span>
    );
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
}

export default function AdminPaymentsIndex({ payments: initialPayments }) {
    const [rows,      setRows]      = useState(initialPayments.data);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = io('http://localhost:3000', { transports: ['websocket', 'polling'] });

        socket.on('connect',    () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));

        socket.on('payment-updated', (updated) => {
            setRows((prev) => {
                const exists  = prev.find((p) => p.id === updated.id);
                const flagged = { ...updated, isNew: true };
                const next    = exists
                    ? prev.map((p) => (p.id === updated.id ? flagged : p))
                    : [flagged, ...prev];

                setTimeout(() => setRows((r) => r.map((p) => ({ ...p, isNew: false }))), 3000);
                return next;
            });
        });

        return () => socket.disconnect();
    }, []);

    return (
        <>
            <Head title="Payments — Admin" />
            <div className="min-h-screen bg-gray-50">
                <AdminNav />

                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

                    {/* Page header */}
                    <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payments</h1>
                            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                                {initialPayments.total} total payments
                            </p>
                        </div>

                        {/* Live indicator */}
                        <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm flex-shrink-0 ${
                            connected
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-gray-50 border-gray-200 text-gray-400'
                        }`}>
                            <span className="relative flex h-2 w-2">
                                {connected && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                )}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                            </span>
                            <span className="hidden sm:inline">{connected ? 'Live updates on' : 'Connecting…'}</span>
                            <span className="sm:hidden">{connected ? 'Live' : '…'}</span>
                        </div>
                    </div>

                    {/* Card / Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[450px] max-h-[450px] flex flex-col">
                        {rows.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-7 h-7 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <p className="font-semibold text-gray-700 mb-1">No payments yet</p>
                                <p className="text-sm text-gray-400">
                                    Payments will appear here once customers start checking out.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* ── Mobile: card list ── */}
                                <div className="sm:hidden divide-y divide-gray-50 flex-1 overflow-y-auto">
                                    {rows.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className={`p-4 ${payment.isNew ? 'animate-flash' : ''}`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-gray-900 truncate">
                                                        {payment.customer_name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                                                        {payment.customer_email}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                                    <span className="font-bold text-gray-900 text-sm">
                                                        ${parseFloat(payment.amount).toFixed(2)}
                                                    </span>
                                                    <StatusBadge status={payment.status} />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                                <span className="text-xs text-gray-500 truncate max-w-[55%]">
                                                    {payment.product?.name ?? payment.product_name ?? '—'}
                                                </span>
                                                <span className="text-xs text-gray-400 flex-shrink-0">
                                                    {formatDate(payment.created_at)}
                                                </span>
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
                                                    Customer
                                                </th>
                                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                                                    Product
                                                </th>
                                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {rows.map((payment) => (
                                                <tr
                                                    key={payment.id}
                                                    className={payment.isNew ? 'animate-flash' : 'hover:bg-gray-50/70 transition-colors'}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-gray-900 text-sm">
                                                            {payment.customer_name}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-0.5">
                                                            {payment.customer_email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 hidden lg:table-cell">
                                                        <span className="text-sm text-gray-700">
                                                            {payment.product?.name ?? payment.product_name ?? '—'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-gray-900">
                                                            ${parseFloat(payment.amount).toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={payment.status} />
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell">
                                                        <span className="text-sm text-gray-400">
                                                            {formatDate(payment.created_at)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>

                    <Pagination links={initialPayments.links} meta={initialPayments} />
                </main>
            </div>
        </>
    );
}
