"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../store/Store";
import Link from "next/link"
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { toast } from "sonner";

const registerSchema = z.object({
    username: z.string()
        .min(3, "Mínimo 3 caracteres")
        .max(50, "Máximo 50 caracteres")
        .regex(/^[a-zA-Z0-9]+$/, "Solo letras y números"),
    email: z.string()
        .min(1, "El correo electrónico es requerido")
        .email("Ingresa un correo electrónico válido")
        .max(50, "El correo electrónico es demasiado largo"),
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(100, "La contraseña es demasiado larga")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[a-z]/, "Debe contener al menos una minúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
    confirmPassword: z.string(),
    accept_terms: z.boolean().refine((val) => val === true, {
        message: "Debes aceptar los Términos y Condiciones",
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');
    const { registerUser, userValid, userAuth, user } = useAuthStore();

    const [globalError, setGlobalError] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        mode: "onChange",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            accept_terms: false
        },
    });

    const acceptTerms = watch("accept_terms");

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

    const onSubmit = async (data: RegisterFormValues) => {
        setGlobalError("");
        setIsSubmitting(true);

        try {
            await registerUser(data.username, data.email, data.password, data.accept_terms);
            toast.success("Registro exitoso", {
                description: "Bienvenido a Deduce."
            });
            router.push(redirectUrl || "/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setGlobalError(err.message);
            } else {
                setGlobalError("Ha ocurrido un error inesperado al registrarte.");
            }
        } finally {
            setIsSubmitting(false);
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
                        Toma el control de tu devolución fiscal.
                    </h2>
                    <p className="text-slate-300 text-lg mb-8">
                        Únete a DEDUCE y comienza a clasificar automáticamente tus CFDI. Diseñado para simplificar tu declaración anual.
                    </p>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full md:w-7/12 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">

                {/* Decorative background elements for right side */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-deduce-teal)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-deduce-navy)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="w-full max-w-lg relative z-10 py-8">
                    <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="w-6 h-6 rounded-md bg-[var(--color-deduce-teal)]"></div>
                        <span className="text-2xl font-bold font-display text-[var(--color-deduce-navy)]">DEDUCE</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-[var(--color-deduce-navy)] font-display mb-2">Crear tu cuenta</h2>
                        <p className="text-slate-500">Únete a nuestra plataforma para gestionar tus deducciones.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {globalError && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                                {globalError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-slate-700 font-semibold">Usuario</Label>
                                <Input
                                    id="username"
                                    placeholder="Ej. juanperez"
                                    className={`h-11 bg-white border-slate-200 shadow-sm transition-all focus:border-[var(--color-deduce-teal)] focus:ring-[var(--color-deduce-teal)] ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    {...register("username")}
                                />
                                {errors.username && <p className="text-red-500 text-xs font-medium">{errors.username.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-semibold">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@ejemplo.com"
                                    className={`h-11 bg-white border-slate-200 shadow-sm transition-all focus:border-[var(--color-deduce-teal)] focus:ring-[var(--color-deduce-teal)] ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 font-semibold">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`h-11 pr-10 bg-white border-slate-200 shadow-sm transition-all focus:border-[var(--color-deduce-teal)] focus:ring-[var(--color-deduce-teal)] ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
                            {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-700 font-semibold">Repetir contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`h-11 pr-10 bg-white border-slate-200 shadow-sm transition-all focus:border-[var(--color-deduce-teal)] focus:ring-[var(--color-deduce-teal)] ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    {...register("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs font-medium">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="pt-2">
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="terms"
                                    checked={acceptTerms}
                                    onCheckedChange={(checked) => setValue("accept_terms", checked === true, { shouldValidate: true })}
                                    className={`mt-1 ${errors.accept_terms ? "border-red-500" : "border-slate-300"}`}
                                />
                                <div className="space-y-1 leading-none">
                                    <label htmlFor="terms" className="text-sm font-medium text-slate-700 leading-snug cursor-pointer">
                                        He leído y acepto los{" "}
                                        <Link href="/terminos" target="_blank" className="text-[var(--color-deduce-teal)] hover:underline font-bold">
                                            Términos y Condiciones
                                        </Link>{" "}
                                        y el{" "}
                                        <Link href="/privacidad" target="_blank" className="text-[var(--color-deduce-teal)] hover:underline font-bold">
                                            Aviso de Privacidad
                                        </Link>.
                                    </label>
                                    {errors.accept_terms && (
                                        <p className="text-red-500 text-xs font-medium mt-1">{errors.accept_terms.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 mt-4 bg-[var(--color-deduce-navy)] hover:bg-[var(--color-deduce-navy)]/90 text-white font-bold rounded-lg shadow-md transition-all hover:shadow-lg flex items-center justify-center group"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    Crear Cuenta
                                    <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        ¿Ya tienes una cuenta?{" "}
                        <Link href="/auth/login" className="font-bold text-[var(--color-deduce-navy)] hover:text-[var(--color-deduce-teal)] transition-colors">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="flex-1 w-full flex items-center justify-center min-h-screen bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-deduce-teal)]" /></div>}>
            <RegisterContent />
        </Suspense>
    );
}
