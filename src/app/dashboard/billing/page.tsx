'use client';

import { useDeductionsStore } from '@/app/store/DeductionsStore';
import { useAuthStore } from '@/app/store/Store';
import { createCheckoutSessionApi, createPortalSessionApi } from '@/app/lib/api/payments';
import { Card } from '@/components/ui/card';
import { Check, X, Zap, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

export default function BillingPage() {
    const { profile, summary } = useDeductionsStore();
    const url = useAuthStore(state => state.url);
    const currentPlan = profile?.subscription_status || 'free';
    const [isLoading, setIsLoading] = useState(false);
    const [isAnnual, setIsAnnual] = useState(false);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            if (currentPlan === 'premium') {
                const data = await createPortalSessionApi(url);
                if (data.url) {
                    window.location.href = data.url;
                }
            } else {
                const data = await createCheckoutSessionApi(url, isAnnual ? 'annual' : 'monthly');
                if (data.url) {
                    window.location.href = data.url;
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Error al redirigir al pago");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
            <div className="min-h-screen pb-12 w-full">
                {/* Top Header Section */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-8 py-8 border-b border-slate-200 bg-white">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-[var(--color-deduce-navy)]">
                            Planes y Suscripción
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Saca el máximo provecho de Deduce con un plan a tu medida.</p>
                    </div>
                </header>

                <div className="px-8 mt-12 max-w-[1000px] mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <span className={`text-sm font-medium ${!isAnnual ? 'text-[var(--color-deduce-navy)]' : 'text-slate-400'}`}>Mensual</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${isAnnual ? 'bg-[var(--color-deduce-teal)]' : 'bg-slate-300'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-medium ${isAnnual ? 'text-[var(--color-deduce-navy)]' : 'text-slate-400'} flex items-center gap-2`}>
                            Anual
                            <span className="bg-teal-100 text-[var(--color-deduce-teal)] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Ahorra 20%</span>
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Free Plan Card */}
                        <Card className={`p-8 border-2 shadow-sm rounded-2xl bg-white flex flex-col h-full relative overflow-hidden transition-all ${currentPlan === 'free' ? 'border-slate-300' : 'border-slate-100 hover:border-slate-200'}`}>
                            {currentPlan === 'free' && (
                                <div className="absolute top-0 right-0 bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl">
                                    Plan Actual
                                </div>
                            )}

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold font-display text-[var(--color-deduce-navy)]">Gratis</h2>
                                <p className="text-slate-500 text-sm mt-2">Para comenzar a organizar tus deducciones personales.</p>
                            </div>

                            <div className="mb-8">
                                <span className="text-4xl font-extrabold text-[var(--color-deduce-navy)]">$0</span>
                                <span className="text-slate-500 text-sm ml-2">MXN / mes</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-700 text-sm">Hasta {summary?.monthly_invoices_limit !== -1 ? summary?.monthly_invoices_limit : 30} facturas mensuales</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-700 text-sm">Cálculo de deducciones básicas</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-700 text-sm">Simulador de ISR</span>
                                </li>
                                <li className="flex items-start gap-3 opacity-50">
                                    <X className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                    <span className="text-slate-500 text-sm">Análisis de Nómina y Retenciones</span>
                                </li>
                                <li className="flex items-start gap-3 opacity-50">
                                    <X className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                    <span className="text-slate-500 text-sm">Sincronización automática con el SAT</span>
                                </li>
                            </ul>

                            <Button
                                variant={currentPlan === 'free' ? "outline" : "secondary"}
                                className="w-full py-6 rounded-xl font-bold"
                                disabled={currentPlan === 'free'}
                            >
                                {currentPlan === 'free' ? 'Tu plan actual' : 'Seleccionar Gratis'}
                            </Button>
                        </Card>

                        {/* Premium Plan Card */}
                        <Card className={`p-8 border-2 shadow-xl rounded-2xl bg-[var(--color-deduce-navy)] text-white flex flex-col h-full relative overflow-hidden transition-all ${currentPlan === 'premium' ? 'border-[var(--color-deduce-teal)] shadow-[var(--color-deduce-teal)]/20 shadow-2xl' : 'border-slate-700 hover:border-slate-500'}`}>
                            {/* Decorative blur */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-deduce-teal)]/10 blur-3xl rounded-full"></div>

                            {currentPlan === 'premium' && (
                                <div className="absolute top-0 right-0 bg-[var(--color-deduce-teal)] text-[var(--color-deduce-navy)] text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl z-10">
                                    Plan Actual
                                </div>
                            )}

                            <div className="mb-6 relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown className="w-6 h-6 text-[var(--color-deduce-teal)]" />
                                    <h2 className="text-2xl font-bold font-display text-white">Premium</h2>
                                </div>
                                <p className="text-slate-300 text-sm">El poder total para maximizar tu saldo a favor.</p>
                            </div>

                            <div className="mb-8 relative z-10">
                                <span className="text-4xl font-extrabold text-white">{isAnnual ? "$1,910" : "$199"}</span>
                                <span className="text-slate-400 text-sm ml-2">MXN / {isAnnual ? "año" : "mes"}</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1 relative z-10">
                                <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0 mt-0.5" />
                                    <span className="text-slate-100 text-sm font-medium">Facturas Ilimitadas</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0 mt-0.5" />
                                    <span className="text-slate-100 text-sm font-medium">Análisis avanzado de Nóminas y Retenciones</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0 mt-0.5" />
                                    <span className="text-slate-100 text-sm font-medium">Sincronización automática con el SAT (Próximamente)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0 mt-0.5" />
                                    <span className="text-slate-300 text-sm">Soporte prioritario</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0 mt-0.5" />
                                    <span className="text-slate-300 text-sm">Todas las funciones del plan Gratis</span>
                                </li>
                            </ul>

                            <Button
                                onClick={handleSubscribe}
                                className={`w-full py-6 rounded-xl font-bold relative z-10 ${currentPlan === 'premium' ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' : 'bg-[var(--color-deduce-teal)] text-[var(--color-deduce-navy)] hover:bg-[#68e0d1]'}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cargando...
                                    </>
                                ) : currentPlan === 'premium' ? (
                                    'Administrar Suscripción'
                                ) : (
                                    'Mejorar a Premium'
                                )}
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
    );
}
