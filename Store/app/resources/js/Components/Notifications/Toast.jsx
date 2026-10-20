const typeConfig = {
    success: {
        ring: 'border-emerald-200',
        bg: 'bg-white',
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        path: 'M5 13l4 4L19 7',
    },
    error: {
        ring: 'border-red-200',
        bg: 'bg-white',
        iconBg: 'bg-red-50',
        iconColor: 'text-red-600',
        path: 'M6 18L18 6M6 6l12 12',
    },
    info: {
        ring: 'border-indigo-200',
        bg: 'bg-white',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
};

export default function Toast({ toast, onDismiss }) {
    const cfg = typeConfig[toast.type] ?? typeConfig.info;

    return (
        <button
            type="button"
            onClick={onDismiss}
            className={`group flex items-center gap-3 min-w-[260px] max-w-sm pl-3 pr-4 py-3 rounded-xl border ${cfg.ring} ${cfg.bg} shadow-lg shadow-gray-900/5 text-left transition-all hover:shadow-xl animate-toast-in`}
        >
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                <svg className={`w-4 h-4 ${cfg.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={cfg.path} />
                </svg>
            </span>
            <span className="flex-1 text-sm font-medium text-gray-800">
                {toast.message}
            </span>
            <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-xs">×</span>
        </button>
    );
}
