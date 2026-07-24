'use client';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuthStore } from "../store/Store";
import { useDeductionsStore } from "../store/DeductionsStore";
import { createCheckoutSessionApi } from "../lib/api/payments";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PremiumPage() {
    const { userAuth, url } = useAuthStore();
    const { profile } = useDeductionsStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isAnnual, setIsAnnual] = useState(false);
    const router = useRouter();

    const handleSubscribe = async () => {
        if (!userAuth) {
            router.push('/auth/login?redirect=/premium');
            return;
        }
        setIsLoading(true);
        try {
            const data = await createCheckoutSessionApi(url, isAnnual ? 'annual' : 'monthly');
            window.location.href = data.url;
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error al iniciar el pago", { description: error.message });
            } else {
                toast.error("Error al iniciar el pago");
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-deduce-background)] font-sans pt-12">
            {/* Hero Section */}
            <div className="pt-24 pb-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-display text-[var(--color-deduce-navy)] mb-4">
                    Planes diseñados para tu salud fiscal.
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
                    Desde control básico hasta estrategias avanzadas de deducción.
                    Encuentra el plan que se ajusta a tu actividad profesional.
                </p>
                <div className="flex items-center justify-center gap-3">
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
            </div>

            {/* Pricing Cards */}
            <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-8 mb-24">
                {/* Plan Libre */}
                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-sm font-bold tracking-wider uppercase text-slate-500 mb-2">Plan Libre</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-5xl font-bold font-display text-[var(--color-deduce-navy)]">$0</span>
                        <span className="text-slate-500">/mes</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0" />
                            <span className="text-slate-600">30 CFDI al mes</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0" />
                            <span className="text-slate-600">Dashboard básico</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0" />
                            <span className="text-slate-600">Alertas estándar</span>
                        </li>
                        <li className="flex items-start gap-3 opacity-50">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0"></div>
                            <span className="text-slate-600 line-through">Estimador avanzado</span>
                        </li>
                    </ul>
                    <Button
                        variant="outline"
                        className="w-full border-slate-200 text-[var(--color-deduce-navy)] hover:bg-slate-50"
                        onClick={() => router.push(userAuth ? '/dashboard' : '/auth/register')}
                    >
                        Comenzar Gratis
                    </Button>
                </div>

                {/* Plan Estratega */}
                <div className="bg-white rounded-xl border-2 border-[var(--color-deduce-navy)] p-8 shadow-lg relative">
                    <div className="absolute top-0 right-4 -translate-y-1/2 bg-[var(--color-deduce-navy)] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                        Recomendado
                    </div>
                    <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--color-deduce-navy)] mb-2">Plan Estratega</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-5xl font-bold font-display text-[var(--color-deduce-navy)]">${isAnnual ? '159' : '199'}</span>
                        <span className="text-slate-500">/mes</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0" />
                            <span className="text-slate-600">CFDI ilimitados</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0" />
                            <span className="text-slate-600">Estimador de ahorro avanzado</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0" />
                            <span className="text-slate-600">Alertas proactivas</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0" />
                            <span className="text-slate-600">Exportación para contador</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[var(--color-deduce-teal)] shrink-0" />
                            <span className="text-slate-600">Soporte prioritario</span>
                        </li>
                    </ul>
                    <Button
                        className="w-full bg-[var(--color-deduce-navy)] hover:bg-slate-800 text-white"
                        onClick={handleSubscribe}
                        disabled={isLoading || profile?.subscription_status === 'premium'}
                    >
                        {isLoading ? "Procesando..." : (profile?.subscription_status === 'premium' ? "Plan Actual" : "Suscribirse Ahora")}
                    </Button>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="max-w-4xl mx-auto px-4 mb-24">
                <h3 className="text-2xl font-bold text-center text-[var(--color-deduce-navy)] font-display mb-8">Compara las funciones</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="py-4 px-4 text-sm font-semibold text-slate-500 w-1/2">Funcionalidad</th>
                                <th className="py-4 px-4 text-sm font-semibold text-slate-500 text-center">Libre</th>
                                <th className="py-4 px-4 text-sm font-semibold text-slate-900 text-center">Estratega</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-slate-100">
                                <td className="py-4 px-4 text-slate-600">Límite mensual de facturas (CFDI)</td>
                                <td className="py-4 px-4 text-center text-slate-500">30</td>
                                <td className="py-4 px-4 text-center font-semibold text-[var(--color-deduce-navy)]">Ilimitado</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="py-4 px-4 text-slate-600">Dashboard de impuestos</td>
                                <td className="py-4 px-4 text-center text-slate-500">Básico</td>
                                <td className="py-4 px-4 text-center font-semibold text-[var(--color-deduce-navy)]">Avanzado</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="py-4 px-4 text-slate-600">Detección de gastos deducibles</td>
                                <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-[var(--color-deduce-teal)] mx-auto" /></td>
                                <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-[var(--color-deduce-teal)] mx-auto" /></td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="py-4 px-4 text-slate-600">Estimador de ahorro en tiempo real</td>
                                <td className="py-4 px-4 text-center text-slate-300">—</td>
                                <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-[var(--color-deduce-teal)] mx-auto" /></td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="py-4 px-4 text-slate-600">Exportación Excel/PDF</td>
                                <td className="py-4 px-4 text-center text-slate-300">—</td>
                                <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-[var(--color-deduce-teal)] mx-auto" /></td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="py-4 px-4 text-slate-600">Soporte técnico</td>
                                <td className="py-4 px-4 text-center text-slate-500">Estándar</td>
                                <td className="py-4 px-4 text-center font-semibold text-[var(--color-deduce-navy)]">Prioritario</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto px-4 mb-24">
                <h3 className="text-2xl font-bold text-center text-[var(--color-deduce-navy)] font-display mb-8">Preguntas Frecuentes</h3>
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[var(--color-deduce-navy)] mb-2">¿Mis datos están seguros?</h4>
                        <p className="text-sm text-slate-600">Utilizamos encriptación de grado bancario (AES-256) y conexiones directas seguras con el SAT. Tu información fiscal nunca se comparte con terceros sin tu consentimiento explícito.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[var(--color-deduce-navy)] mb-2">¿Deduce reemplaza a mi contador?</h4>
                        <p className="text-sm text-slate-600">No. Deduce es una herramienta para optimizar tus gastos y facilitar el trabajo de tu contador. De hecho, el Plan Estratega permite exportar reportes listos para que tu contador los procese en minutos.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[var(--color-deduce-navy)] mb-2">¿Puedo cambiar de plan en cualquier momento?</h4>
                        <p className="text-sm text-slate-600">Sí, puedes subir de nivel a Estratega o volver al Plan Libre cuando lo desees. Los cambios se reflejan al final de tu período de facturación actual.</p>
                    </div>
                </div>
            </div>

            {/* CTA Footer */}
            <div className="max-w-5xl mx-auto px-4 mb-12">
                <div className="bg-[var(--color-deduce-navy)] rounded-2xl overflow-hidden flex flex-col md:flex-row items-center">
                    <div className="p-12 md:w-1/2 text-white">
                        <h3 className="text-3xl font-bold font-display mb-4">Empieza a optimizar tus impuestos hoy mismo.</h3>
                        <p className="text-slate-300 mb-8">Únete a cientos de profesionales en México que ya ahorran con inteligencia artificial.</p>
                        <Button
                            className="bg-[var(--color-deduce-teal)] hover:bg-teal-500 text-white font-semibold px-8"
                            onClick={() => router.push(userAuth ? '/dashboard' : '/auth/register')}
                        >
                            Crear mi cuenta gratuita
                        </Button>
                    </div>
                    <div className="md:w-1/2 h-64 md:h-auto bg-slate-800 relative w-full flex-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-[var(--color-deduce-navy)] opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                            <div className="w-full max-w-sm h-48 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
                                <div className="h-8 bg-white/20 w-full flex items-center px-4 gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col gap-3">
                                    <div className="h-4 w-1/2 bg-white/20 rounded"></div>
                                    <div className="h-20 w-full bg-white/10 rounded flex items-end gap-2 p-2">
                                        <div className="w-1/4 bg-[var(--color-deduce-teal)] rounded-t" style={{ height: '40%' }}></div>
                                        <div className="w-1/4 bg-[var(--color-deduce-teal)] rounded-t" style={{ height: '70%' }}></div>
                                        <div className="w-1/4 bg-[var(--color-deduce-teal)] rounded-t" style={{ height: '50%' }}></div>
                                        <div className="w-1/4 bg-[var(--color-deduce-teal)] rounded-t" style={{ height: '90%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Footer just for pricing page */}
            <footer className="border-t border-slate-200 bg-white py-8">
                <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-sm bg-[var(--color-deduce-teal)]"></div>
                        <span className="font-bold text-[var(--color-deduce-navy)]">Deduce</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        © 2026 Deduce. Cumplimiento fiscal simplificado.
                    </div>
                    <div className="flex gap-4 text-sm text-slate-500">
                        <Link href="/privacidad" className="hover:text-[var(--color-deduce-navy)]">Privacidad</Link>
                        <Link href="/terminos" className="hover:text-[var(--color-deduce-navy)]">Términos</Link>
                        <Link href="#" className="hover:text-[var(--color-deduce-navy)]">Contacto</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
