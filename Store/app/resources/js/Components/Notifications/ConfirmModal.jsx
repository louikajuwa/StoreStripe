import { useEffect, useRef } from 'react';

export default function ConfirmModal({ state, onResolve }) {
    const confirmRef = useRef(null);
    const { title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false } = state;

    useEffect(() => {
        confirmRef.current?.focus();
        const onKey = (e) => {
            if (e.key === 'Escape') onResolve(false);
            else if (e.key === 'Enter') onResolve(true);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onResolve]);

    const confirmClasses = danger
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-indigo-600 hover:bg-indigo-700 text-white';

    const iconClasses = danger
        ? 'bg-red-50 text-red-600'
        : 'bg-indigo-50 text-indigo-600';

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) onResolve(false);
            }}
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6 animate-modal-in">
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClasses}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 9v2m0 4h.01M5 19h14a2 2 0 001.84-2.75L13.74 4a2 2 0 00-3.48 0l-7.1 12.25A2 2 0 005 19z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900">{title}</h3>
                        {message && (
                            <p className="text-sm text-gray-500 mt-1">{message}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onClick={() => onResolve(false)}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmRef}
                        type="button"
                        onClick={() => onResolve(true)}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors shadow-sm ${confirmClasses}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
