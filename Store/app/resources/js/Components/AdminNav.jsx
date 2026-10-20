import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navLinks = [
    {
        href: '/admin/products',
        label: 'Products',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    },
    {
        href: '/admin/payments',
        label: 'Payments',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
    },
];

export default function AdminNav() {
    const { url, props } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);
    const flash = props.flash;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/admin/logout');
    };

    return (
        <>
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-14 sm:h-16">

                        {/* Brand */}
                        <Link href="/admin/products" className="flex items-center gap-2.5 font-bold text-gray-900">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <span className="text-sm sm:text-base">
                                Store <span className="text-gray-400 font-normal">Admin</span>
                            </span>
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden sm:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const active = url.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                            active
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex items-center gap-2">
                            {/* Desktop logout */}
                            <button
                                onClick={handleLogout}
                                className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {mobileOpen ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile dropdown */}
                    {mobileOpen && (
                        <div className="sm:hidden border-t border-gray-100 py-2 pb-3">
                            {navLinks.map((link) => {
                                const active = url.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 mx-1 rounded-xl text-sm font-medium transition-colors ${
                                            active
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className={active ? 'text-indigo-600' : 'text-gray-400'}>
                                            {link.icon}
                                        </span>
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <div className="border-t border-gray-100 mt-2 pt-2 mx-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-3 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Flash messages */}
            {flash?.success && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {flash.success}
                    </div>
                </div>
            )}
        </>
    );
}
