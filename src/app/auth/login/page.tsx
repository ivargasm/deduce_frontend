"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../store/Store";
import Link from "next/link"
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

const loginSchema = z.object({
    email: z.string().email({ message: "Ingresa un correo electrónico válido" }),
    password: z.string().min(1, { message: "La contraseña es requerida" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');
    const { url, loginUser, userValid, userAuth, user } = useAuthStore();

    const [globalError, setGlobalError] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        mode: "onChange",
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const validateUser = async () => {
            await userValid();
        };
        validateUser();
    }, [userValid]);

    useEffect(() => {
        if ((userAuth || user)) {
            router.push(redirectUrl || '/dashboard');
        }
    }, [user, userAuth, router, redirectUrl]);

    const onSubmit = async (data: LoginFormValues) => {
        setGlobalError("");
        setIsSubmitting(true);

        try {
            await loginUser(data.email, data.password);
            router.push(redirectUrl || "/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setGlobalError(err.message);
            } else {
                setGlobalError("Ha ocurrido un error inesperado");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 w-full flex flex-col md:flex-row bg-slate-50">
            {/* Left Side - Image/Branding */}
            <div className="hidden md:flex md:w-1/2 relative bg-[var(--color-deduce-navy)] overflow-hidden flex-col justify-between p-12 text-white">
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
                        Optimiza tu carga fiscal de forma inteligente.
                    </h2>
                    <p className="text-slate-300 text-lg mb-8">
                        Automatiza la clasificación de tus facturas y descubre el máximo potencial de tus deducciones personales en segundos.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
                
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
                        <h2 className="text-3xl font-bold text-[var(--color-deduce-navy)] font-display mb-2">Bienvenido de nuevo</h2>
                        <p className="text-slate-500">Ingresa a tu cuenta para continuar.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {globalError && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                                {globalError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-semibold">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@correo.com"
                                className={`h-12 bg-white border-slate-200 shadow-sm transition-all focus:border-[var(--color-deduce-teal)] focus:ring-[var(--color-deduce-teal)] ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-700 font-semibold">Contraseña</Label>
                                <Link href="/auth/forgot-password" className="text-xs font-semibold text-[var(--color-deduce-teal)] hover:text-[var(--color-deduce-navy)] transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`h-12 pr-10 bg-white border-slate-200 shadow-sm transition-all focus:border-[var(--color-deduce-teal)] focus:ring-[var(--color-deduce-teal)] ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-[var(--color-deduce-navy)] hover:bg-[var(--color-deduce-navy)]/90 text-white font-bold rounded-lg shadow-md transition-all hover:shadow-lg flex items-center justify-center group"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        ¿No tienes una cuenta?{" "}
                        <Link href="/auth/register" className="font-bold text-[var(--color-deduce-navy)] hover:text-[var(--color-deduce-teal)] transition-colors">
                            Regístrate ahora
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex-1 w-full flex items-center justify-center min-h-screen bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-deduce-teal)]" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
