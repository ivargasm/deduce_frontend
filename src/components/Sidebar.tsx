"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, HelpCircle, LogOut, Menu, X, Crown, Zap, CreditCard } from "lucide-react";
import { useAuthStore } from "@/app/store/Store";
import { useDeductionsStore } from "@/app/store/DeductionsStore";

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuthStore();
    const { profile, summary, selectedYear, setSelectedYear } = useDeductionsStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Guía de Uso", href: "/dashboard/guia", icon: HelpCircle },
        { name: "Planes", href: "/dashboard/billing", icon: CreditCard },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <>
            {/* Mobile Header (Only visible on small screens) */}
            <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white border-b border-slate-200 z-40 flex items-center px-4 justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="text-xl font-bold font-display text-[var(--color-deduce-navy)]">Deduce</span>
                </div>
            </div>

            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm transition-opacity" 
                    onClick={() => setMobileOpen(false)} 
                />
            )}

            {/* Sidebar Container */}
            <aside className={`w-64 bg-[var(--color-deduce-bg)] border-r border-slate-200 flex flex-col h-screen fixed lg:sticky top-0 z-50 transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 relative">
                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden absolute top-6 right-4 p-2 text-slate-500 hover:bg-slate-200 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                <Link href="/" className="block mb-2">
                    <h1 className="text-2xl font-bold font-display text-[var(--color-deduce-navy)]">Deduce</h1>
                </Link>
                <div className="mb-8 relative group">
                    <select 
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="appearance-none bg-slate-100 hover:bg-slate-200 border-none text-xs text-[var(--color-deduce-navy)] font-bold py-1.5 pl-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-deduce-teal)]/50 cursor-pointer transition-colors"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>Tax Year {y}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <nav className="space-y-2 mb-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-gradient-to-r from-[#89f5e7]/80 to-[#89f5e7]/40 text-[#005049]"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-4">
                {/* Plan Usage Widget */}
                {profile && summary && (
                    <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200">
                        {summary.monthly_invoices_limit === -1 ? (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[var(--color-deduce-teal)]/10 text-[var(--color-deduce-teal)] rounded-lg">
                                    <Crown className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[var(--color-deduce-navy)] uppercase tracking-wide">Plan Premium</p>
                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">Facturas ilimitadas</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-bold text-[var(--color-deduce-navy)] uppercase tracking-wide">Plan Free</p>
                                    <p className="text-xs font-medium text-slate-600">
                                        {summary.monthly_invoices_count} / {summary.monthly_invoices_limit}
                                    </p>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
                                    <div 
                                        className={`h-full transition-all duration-500 ${summary.monthly_invoices_count >= summary.monthly_invoices_limit ? 'bg-red-500' : 'bg-[var(--color-deduce-teal)]'}`}
                                        style={{ width: `${Math.min((summary.monthly_invoices_count / summary.monthly_invoices_limit) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <Link href="/dashboard/billing" className="w-full py-2 bg-[var(--color-deduce-navy)] text-white text-[10px] uppercase font-bold tracking-wider rounded-lg flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors mt-3">
                                    <Zap className="w-3 h-3 text-[#89f5e7]" />
                                    Mejorar a Premium
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 w-full transition-colors">
                        <HelpCircle className="w-5 h-5" />
                        Support
                    </button>
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
        </>
    );
}
