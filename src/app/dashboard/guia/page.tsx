"use client";

import { useDeductionsStore } from "@/app/store/DeductionsStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info, Crown, UploadCloud, AlertTriangle, FileSpreadsheet, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardGuia() {
    const { profile } = useDeductionsStore();
    const isPremium = profile?.subscription_status === "premium";

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-display text-[var(--color-deduce-navy)] mb-2">
                    Guía de Uso Rápida
                </h1>
                <p className="text-slate-600">
                    Sácale el máximo provecho a tu cuenta y obtén la mayor devolución posible.
                </p>
            </header>

            {!isPremium ? (
                // GUIA FREE
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 flex gap-3">
                        <Info className="w-6 h-6 flex-shrink-0 mt-0.5 text-blue-600" />
                        <div>
                            <h3 className="font-bold mb-1">Estás en el Plan Gratuito</h3>
                            <p className="text-sm">
                                Este plan te permite procesar hasta 30 facturas al mes de forma manual. Si tienes recibos de nómina o necesitas calcular con precisión tus retenciones, considera subir a Premium.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-[var(--color-deduce-navy)]">
                                    <UploadCloud className="w-5 h-5 text-[var(--color-deduce-teal)]" />
                                    1. Subir Facturas (XML)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 space-y-3">
                                <p>Dirígete a la pestaña <strong>Dashboard</strong> y arrastra tus archivos XML descargados del SAT.</p>
                                <p>Nosotros leeremos cada archivo, detectaremos automáticamente los <strong>Complementos de Colegiaturas (IEDU)</strong> y separaremos los montos según el nivel escolar.</p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-[var(--color-deduce-navy)]">
                                    <Info className="w-5 h-5 text-[var(--color-deduce-teal)]" />
                                    2. RFC e Ingresos Manuales
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 space-y-3">
                                <p>Para calcular tu tope de deducciones (15% de tus ingresos o 5 UMA), ve a <strong>Configuración</strong> e ingresa manualmente tu estimación de Ingreso Anual y asegúrate de que tu RFC esté correcto.</p>
                                <p><strong>Tip:</strong> Puedes editar tu RFC o ingresos anuales en cualquier momento.</p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm bg-slate-50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Lock className="w-16 h-16" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                                    <FileSpreadsheet className="w-5 h-5 text-slate-500" />
                                    3. Exportar Excel (PRO)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 space-y-3 relative z-10">
                                <p>La generación de reportes en Excel y el envío automatizado a tu contador están bloqueados en esta versión.</p>
                                <Link href="/premium">
                                    <Button size="sm" variant="outline" className="mt-2 text-[var(--color-deduce-teal)] border-[var(--color-deduce-teal)] hover:bg-[var(--color-deduce-teal)]/10">
                                        Desbloquear con Premium
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CTA a Premium */}
                    <div className="mt-8 bg-gradient-to-r from-[var(--color-deduce-navy)] to-[#0f2942] rounded-2xl p-8 text-white text-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Automatiza tus ingresos reales</h2>
                        <p className="text-slate-300 mb-6 max-w-xl mx-auto">
                            Al hacerte PRO, no necesitas capturar ingresos manuales. Simplemente sube tus <strong>Recibos de Nómina</strong> y <strong>Constancias de Retención</strong> y nosotros extraeremos tu ingreso exacto y las retenciones ya pagadas.
                        </p>
                        <Link href="/premium">
                            <Button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 py-2 h-auto text-lg">
                                Ver planes Premium
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                // GUIA PREMIUM
                <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex gap-3 shadow-sm">
                        <Crown className="w-6 h-6 flex-shrink-0 mt-0.5 text-emerald-600" />
                        <div>
                            <h3 className="font-bold mb-1">¡Gracias por ser PRO!</h3>
                            <p className="text-sm">
                                Tienes acceso ilimitado a todas las herramientas. Aquí te explicamos cómo aprovechar tu suscripción al máximo.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-emerald-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-[var(--color-deduce-navy)]">
                                    <UploadCloud className="w-5 h-5 text-emerald-600" />
                                    Nóminas y Retenciones (Auto)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 space-y-3">
                                <p>Sube tus <strong>Recibos de Nómina</strong> y <strong>Constancias de Retención</strong> junto con tus facturas de gastos. Nuestro sistema extraerá de forma automática tus ingresos reales y retenciones de ISR.</p>
                                <p>Ya no dependes del valor manual que pusiste en configuración; ahora el cálculo de devolución es exacto basándonos en tu sueldo timbrado.</p>
                            </CardContent>
                        </Card>

                        <Card className="border-emerald-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-[var(--color-deduce-navy)]">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    Auditoría de Cierre de Año (Q4)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 space-y-3">
                                <p>A partir de Octubre, nuestro sistema auditará tus ingresos. Si detectamos que te faltan nóminas por subir en el año (diferencia mayor al 20% vs. tu estimado), te avisaremos en el Dashboard.</p>
                                <p>Así podrás subir los XML faltantes o forzar el <strong>Modo Manual</strong> en Configuración, garantizando que tu proyección de devolución sea idéntica a la del SAT.</p>
                            </CardContent>
                        </Card>

                        <Card className="border-emerald-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-[var(--color-deduce-navy)]">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    Alertas Proactivas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 space-y-3">
                                <p>Revisa la tabla en el Dashboard. Si ves un ícono de <strong>⚠️ Alerta</strong>, significa que encontramos una inconsistencia (ej. pagaste en efectivo o el Uso CFDI es incorrecto).</p>
                                <p>Puedes filtrar estas facturas y comunicarte con tu médico/colegio antes del fin de año para pedir la refacturación, salvando así tu deducción.</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-emerald-100 shadow-sm md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-[var(--color-deduce-navy)]">
                                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                                    Colaboración con tu Contador
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 space-y-3">
                                <p>No necesitas mandarle un ZIP lleno de XMLs desordenados a tu contador en abril. Usa el botón <strong>&quot;Enviar a mi Contador&quot;</strong> en el Dashboard.</p>
                                <p>Él recibirá un correo con un archivo Excel impecable, donde vienen resumidos todos tus gastos, retenciones, topes calculados y una pestaña especial con facturas que tienen problemas.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
