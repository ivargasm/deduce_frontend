"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { reset_password } from "../../lib/api/auth";
import { useAuthStore } from "../../store/Store";
import Image from "next/image";
import Link from "next/link";

import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function ResetPasswordClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { url } = useAuthStore();

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setIsLoading(true);

        try {
            if (token) {
                const data = await reset_password(url, password, token);
                if (data) {
                    const result = await data.json();
                    setMessage(result.message);
                    toast.success("¡Éxito!", { description: result.message });
                    setTimeout(() => {
                        router.push("/auth/login");
                    }, 2000);
                } else {
                    setError("Error al enviar la solicitud.");
                    toast.error("Error", { description: "No se pudo restablecer la contraseña." });
                }
            } else {
                setError("Enlace no válido. Por favor, solicite uno nuevo.");
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || "Error al enviar la solicitud.");
            } else {
                setError("Error al enviar la solicitud.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full flex flex-col md:flex-row bg-slate-50">
            {/* Left Side - Image/Branding */}
            <div className="hidden md:flex md:w-5/12 relative bg-[var(--color-deduce-navy)] overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/auth_bg.png"
                        alt="Deduce Abstract Background"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-deduce-navy)]/80 via-transparent to-[var(--color-deduce-navy)]"></div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold font-display tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-deduce-teal)] shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
                        DEDUCE
                    </h1>
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display leading-tight">
                        Seguridad primero.
                    </h2>
                    <p className="text-slate-300 text-lg mb-8">
                        Crea una contraseña segura para proteger tu información fiscal.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-7/12 flex items-center justify-center p-6 md:p-12 relative">

                {/* Decorative background elements for right side */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-deduce-teal)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-deduce-navy)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    <div className="md:hidden flex items-center gap-2 mb-12 justify-center">
                        <div className="w-6 h-6 rounded-md bg-[var(--color-deduce-teal)]"></div>
                        <span className="text-2xl font-bold font-display text-[var(--color-deduce-navy)]">DEDUCE</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-[var(--color-deduce-navy)] font-display mb-2">Restablecer contraseña</h2>
                        <p className="text-slate-500">Ingresa tu nueva contraseña para acceder a tu cuenta.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center">
                                {message}
                            </div>
                        )}

                        {!token && (
                            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm text-center mb-4">
                                No se ha detectado un token de recuperación válido. Por favor, solicita uno nuevo desde la página de recuperación.
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 font-semibold">Nueva Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-12 pr-10 bg-white border-slate-200 shadow-sm transition-all focus:border-[var(--color-deduce-teal)] focus:ring-[var(--color-deduce-teal)]"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={!token}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                    onClick={togglePasswordVisibility}
                                    disabled={!token}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-700 font-semibold">Confirmar Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-12 pr-10 bg-white border-slate-200 shadow-sm transition-all focus:border-[var(--color-deduce-teal)] focus:ring-[var(--color-deduce-teal)]"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={!token}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                    onClick={toggleConfirmPasswordVisibility}
                                    disabled={!token}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !token}
                            className="w-full h-12 bg-[var(--color-deduce-navy)] hover:bg-[var(--color-deduce-navy)]/90 text-white font-bold rounded-lg shadow-md transition-all hover:shadow-lg flex items-center justify-center group"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    Guardar nueva contraseña
                                    <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/auth/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[var(--color-deduce-navy)] transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
