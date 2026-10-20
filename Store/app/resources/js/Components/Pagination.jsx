import { Link } from '@inertiajs/react';

export default function Pagination({ links, meta }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs sm:text-sm text-gray-400 order-2 sm:order-1">
                Showing{' '}
                <span className="font-semibold text-gray-600">{meta.from}–{meta.to}</span>
                {' '}of{' '}
                <span className="font-semibold text-gray-600">{meta.total}</span>
            </p>
            <div className="flex items-center gap-1 flex-wrap justify-center order-1 sm:order-2">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url ?? '#'}
                        preserveScroll
                        className={`min-w-[36px] h-9 flex items-center justify-center px-2.5 sm:px-3 text-sm rounded-xl border transition-all
                            ${link.active
                                ? 'bg-indigo-600 border-indigo-600 text-white font-semibold shadow-sm'
                                : link.url
                                ? 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                : 'border-transparent text-gray-300 cursor-not-allowed pointer-events-none'
                            }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
