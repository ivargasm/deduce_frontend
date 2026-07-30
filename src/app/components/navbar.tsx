"use client";

import { useState } from "react";
import { Menu, X, Home, Folder, LogOut, LogIn, Sun, Moon, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {useAuthStore} from "../store/Store";
import { useDeductionsStore } from "../store/DeductionsStore";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { userAuth, logout } = useAuthStore();
    const { profile } = useDeductionsStore();
    const pathname = usePathname();

    const [darkMode, setDarkMode] = useState(false)

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        // En Tailwind v4, podemos alternar la clase 'dark' en el elemento html
        if (darkMode) {
            document.documentElement.classList.remove("dark")
        } else {
            document.documentElement.classList.add("dark")
        }
    }

    // Ocultar Navbar global en la zona del dashboard
    if (pathname?.startsWith('/dashboard')) {
        return null;
    }

    return (
        <nav className="w-full bg-white text-primary dark:bg-primary dark:text-primary shadow-md z-50 relative">
            <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold font-display text-[var(--color-deduce-navy)] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[var(--color-deduce-teal)]"></div>
                    DEDUCE
                </Link>

                {/* Botón de menú en móviles */}
                <button
                    className="md:hidden text-slate-700"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Menú principal */}
                <ul className="hidden md:flex space-x-6 items-center text-slate-700">
                    <li>
                        <Link href="/" className="flex items-center gap-2 hover:text-blue-600">
                            <Home size={20} /> Inicio
                        </Link>
                    </li>
                    <li>
                        <Link href="/como-funciona" className="flex items-center gap-2 hover:text-blue-600">
                            <Info size={20} /> Cómo Funciona
                        </Link>
                    </li>
                    {/* si is Autenticates is Treu mostrar menu dashboard */}
                    {userAuth && (
                        <>
                            <li>
                                <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-600">
                                    <Folder size={20} /> Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="flex items-center gap-2 hover:text-blue-600">
                                    <Menu size={20} /> Configuración
                                </Link>
                            </li>
                            <li>
                                <Link href="/premium" className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                                    <span className="text-xl">✨</span> {profile?.subscription_status === 'premium' ? "Mi Suscripción" : "Hazte Premium"}
                                </Link>
                            </li>
                            <li>
                                <Link onClick={() => { logout(); } } className="flex items-center gap-2 hover:text-blue-600" href={"/"}>
                                    <LogOut size={20} /> Logout
                                </Link>
                            </li>
                        </>
                    )}
                    {!userAuth && (
                        <li>
                            <Link href="/auth/login" className="flex items-center gap-2 hover:text-blue-600">
                                <LogIn size={20} /> Login
                            </Link>
                        </li>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleDarkMode}
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                </ul>
            </div>

            {/* Menú desplegable en móviles */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <ul className="flex flex-col items-center space-y-4 py-4">
                        <li>
                            <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                                <Home size={20} /> Inicio
                            </Link>
                        </li>
                        <li>
                            <Link href="/como-funciona" className="flex items-center gap-2 text-slate-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                                <Info size={20} /> Cómo Funciona
                            </Link>
                        </li>
                        {userAuth && (
                            <>
                                <li>
                                    <Link href="/dashboard" className="flex items-center gap-2 text-slate-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                                        <Folder size={20} /> Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/profile" className="flex items-center gap-2 text-slate-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                                        <Menu size={20} /> Configuración
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/premium" className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium" onClick={() => setMenuOpen(false)}>
                                        <span className="text-xl">✨</span> {profile?.subscription_status === 'premium' ? "Mi Suscripción" : "Hazte Premium"}
                                    </Link>
                                </li>
                                <li>
                                    <Link onClick={() => { logout(); }} className="flex items-center gap-2 text-slate-700 hover:text-blue-600" href={"/"}>
                                        <LogOut size={20} /> Logout
                                    </Link>
                                </li>
                            </>
                        )}
                        {!userAuth && (
                            <li>
                                <Link href="/auth/login" className="flex items-center gap-2 text-slate-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                                    <LogIn size={20} /> Login
                                </Link>
                            </li>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                            className="text-slate-700"
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                    </ul>
                </div>
            )}
        </nav>
    );
}
