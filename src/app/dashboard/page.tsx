'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/components/ProtectedRoutes';
import { useDeductionsStore } from '@/app/store/DeductionsStore';
import UploadZone from '@/components/UploadZone';
import InvoicesTable from '@/components/InvoicesTable';
import { Card } from "@/components/ui/card";
import { Info, UploadCloud, Building2, Stethoscope, GraduationCap, HeartHandshake, ShieldPlus, AlertTriangle, User, Download, Loader2, Bus, PiggyBank, Archive, Accessibility, Wallet } from 'lucide-react';
import { useAuthStore } from '@/app/store/Store';
import { exportInvoicesApi } from '@/app/lib/api/invoices';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function DashboardPage() {
    const router = useRouter();
    const { profile, summary, fetchProfile, fetchSummary, updateProfile } = useDeductionsStore();
    const { user, url } = useAuthStore();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [income, setIncome] = useState<string>('');
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        fetchProfile().then(() => {
            const currentProfile = useDeductionsStore.getState().profile;
            if (currentProfile && !currentProfile.estimated_annual_income) {
                setShowProfileModal(true);
            }
        });
        fetchSummary();
    }, [fetchProfile, fetchSummary]);

    const handleSaveIncome = async () => {
        const num = parseFloat(income);
        if (!isNaN(num) && num > 0) {
            await updateProfile({ estimated_annual_income: num });
            setShowProfileModal(false);
            fetchSummary();
        }
    };

    const handleExport = async () => {
        if (profile?.subscription_status !== 'premium') {
            toast.error("La exportación de Excel es exclusiva del Plan Premium. ¡Mejora tu plan para habilitarla!");
            return;
        }

        setIsExporting(true);
        try {
            const blob = await exportInvoicesApi(url);
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'reporte_deducciones.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
            toast.success("Excel descargado exitosamente");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Error al exportar");
            }
        } finally {
            setIsExporting(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    // Configuración de categorías para las tarjetas (mock visual para el demo basado en los datos reales)
    const categoryConfigs = [
        { id: "Honorarios médicos, dentales y gastos hospitalarios.", label: "MÉDICOS", icon: Stethoscope, color: "text-green-700", bg: "bg-green-100", border: "border-green-600", bar: "bg-green-600" },
        { id: "Gastos médicos por incapacidad o discapacidad.", label: "INCAPACIDAD", icon: Accessibility, color: "text-indigo-700", bg: "bg-indigo-100", border: "border-indigo-600", bar: "bg-indigo-600" },
        { id: "Gastos de funerales.", label: "FUNERALES", icon: Archive, color: "text-purple-700", bg: "bg-purple-100", border: "border-purple-600", bar: "bg-purple-600" },
        { id: "Donativos.", label: "DONATIVOS", icon: HeartHandshake, color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-300", bar: "bg-slate-300" },
        { id: "Intereses reales efectivamente pagados por créditos hipotecarios.", label: "HIPOTECAS", icon: Building2, color: "text-red-700", bg: "bg-red-100", border: "border-red-600", bar: "bg-red-600" },
        { id: "Aportaciones voluntarias al SAR.", label: "RETIRO (SAR)", icon: PiggyBank, color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-600", bar: "bg-amber-600" },
        { id: "Primas por seguros de gastos médicos.", label: "SEGUROS", icon: ShieldPlus, color: "text-teal-700", bg: "bg-teal-100", border: "border-teal-600", bar: "bg-teal-600" },
        { id: "Gastos de transportación escolar obligatoria.", label: "TRANSPORTE", icon: Bus, color: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-500", bar: "bg-yellow-500" },
        { id: "Depósitos en cuentas para el ahorro.", label: "AHORRO", icon: Wallet, color: "text-cyan-700", bg: "bg-cyan-100", border: "border-cyan-600", bar: "bg-cyan-600" },
        { id: "Pagos por servicios educativos (colegiaturas).", label: "COLEGIATURAS", icon: GraduationCap, color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-500", bar: "bg-orange-500" },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen pb-12 w-full">

                {/* Top Header Section */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-8 py-8 border-b border-slate-200 bg-white">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-[var(--color-deduce-navy)]">
                            Bienvenido, {user?.username || 'Usuario'}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Revisa tu estado fiscal en tiempo real.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center gap-4">
                        <div className="text-right flex flex-col items-end gap-2">
                            <div>
                                <div className="text-sm font-semibold text-[var(--color-deduce-navy)]">{user?.username || 'Usuario'}</div>
                                <div className="text-xs text-slate-500 font-medium font-mono">RFC: {profile?.rfc || 'No registrado'}</div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                                disabled={isExporting}
                                className="text-xs h-8 border-[var(--color-deduce-teal)] text-[var(--color-deduce-navy)] hover:bg-[var(--color-deduce-teal)]/10"
                            >
                                {isExporting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Download className="w-3 h-3 mr-2" />}
                                Exportar Excel
                            </Button>
                        </div>
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
                            <User className="w-6 h-6" />
                        </div>
                    </div>
                </header>

                <div className="px-8 mt-8 max-w-[1200px] mx-auto">
                    {profile?.subscription_status !== 'premium' && (
                        <div className="mb-8 p-6 bg-gradient-to-r from-[var(--color-deduce-navy)] to-[var(--color-deduce-teal)] rounded-xl text-white shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold font-display">Estás en el Plan Libre</h3>
                                <p className="text-slate-200 mt-1">Sube facturas sin límites y habilita la exportación de reportes pasándote a Premium.</p>
                            </div>
                            <Button
                                className="bg-white text-[var(--color-deduce-navy)] hover:bg-slate-100 font-bold px-8 whitespace-nowrap shadow-sm"
                                onClick={() => router.push('/premium')}
                            >
                                Mejorar Plan
                            </Button>
                        </div>
                    )}
                    {/* Top Grid: Limit and Upload */}
                    <section className="grid lg:grid-cols-[1.5fr_1fr] gap-6 mb-8 items-start">
                        {/* Límite de Deducciones Card */}
                        <Card className="p-8 border border-slate-200 shadow-sm rounded-xl bg-white flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-[var(--color-deduce-navy)] flex items-center gap-2">
                                        Límite de Deducciones
                                        <Info className="w-4 h-4 text-slate-400" />
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">Tope de Ley (Art. 151 LISR)</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-[var(--color-deduce-teal)] tabular-nums font-display">
                                        {formatCurrency(summary?.simulated_refund || 0)} <span className="text-xl text-slate-400 font-medium">MXN</span>
                                    </div>
                                    <div className="text-xs font-semibold text-[#86f2e4] tracking-wide uppercase mt-1">
                                        Ahorro estimado actual
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm font-medium mb-3">
                                    <span className="text-[var(--color-deduce-navy)]">
                                        Uso Actual: {formatCurrency(summary?.total_accumulated || 0)} / {summary?.limit ? formatCurrency(summary.limit) : "???"}
                                    </span>
                                    <span className="text-[var(--color-deduce-teal)] tabular-nums">
                                        {summary?.percentage?.toFixed(1) || 0}%
                                    </span>
                                </div>
                                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                    <div
                                        className="h-full bg-[var(--color-deduce-teal)] transition-all duration-1000"
                                        style={{ width: `${Math.min(summary?.percentage || 0, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-semibold uppercase tracking-wider">
                                    <span>Seguro (0%)</span>
                                    <span>En Progreso</span>
                                    <span>Límite (100%)</span>
                                </div>
                                {summary && summary.total_recoverable > 0 && (
                                    <div className="mt-4 p-3 bg-[var(--color-deduce-amber)]/10 border border-[var(--color-deduce-amber)]/20 rounded-lg flex items-start gap-2 text-[var(--color-deduce-navy)] text-sm">
                                        <AlertTriangle className="w-5 h-5 text-[var(--color-deduce-amber)] flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-[var(--color-deduce-amber)]">Tienes {formatCurrency(summary.total_recoverable)} en deducciones bloqueadas.</p>
                                            <p className="text-xs mt-0.5 opacity-80">Tienen errores operativos (ej. Uso CFDI incorrecto) y no aparecerán en el SAT automáticamente. Reclasifícalas en tu anual.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Upload XML Card (Navy Style) */}
                        <UploadZone compact={true}>
                            <Card className="p-8 border border-slate-700 shadow-lg rounded-xl bg-[var(--color-deduce-navy)] text-white relative overflow-hidden flex flex-col justify-center items-center text-center h-full hover:border-slate-500 transition-colors">
                                {/* Decorative blur */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-deduce-teal)]/20 blur-3xl rounded-full"></div>

                                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 relative z-10 border border-slate-700">
                                    <UploadCloud className="w-8 h-8 text-[var(--color-deduce-teal)]" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 relative z-10 font-display">Subir XML</h2>
                                <p className="text-slate-400 text-sm mb-6 max-w-xs relative z-10">
                                    Haz clic o arrastra tus facturas aquí para analizarlas automáticamente.
                                </p>

                                <div className="w-full relative z-10 flex flex-col gap-3">
                                    <div className="flex gap-2 justify-center mt-2">
                                        <span className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">Auto-Detect</span>
                                        <span className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">SAT Sync</span>
                                    </div>
                                </div>
                            </Card>
                        </UploadZone>

                    </section>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-[var(--color-deduce-navy)] font-display">Desglose por Categorías</h2>
                        </div>
                        {/* Desglose por Categorías - Horizontal Scroll */}
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {[...categoryConfigs]
                                .sort((a, b) => {
                                    const amountA = summary?.by_category?.[a.id] || 0;
                                    const amountB = summary?.by_category?.[b.id] || 0;
                                    return amountB - amountA;
                                })
                                .map(cat => {
                                const amount = summary?.by_category?.[cat.id] || 0;
                                const maxAmount = summary?.limit || 1;
                                const percent = Math.min((amount / maxAmount) * 100, 100);
                                const Icon = cat.icon;

                                return (
                                    <div key={cat.id} className="min-w-[240px] flex-shrink-0 snap-start bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2 rounded-lg ${cat.bg} ${cat.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className={`text-xs font-bold px-2 py-1 rounded-md ${cat.bg} ${cat.color}`}>
                                                {percent.toFixed(0)}%
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">{cat.label}</div>
                                            <div className="text-xl font-bold text-[var(--color-deduce-navy)]">{formatCurrency(amount)}</div>
                                        </div>
                                        <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${cat.bar}`} style={{ width: `${percent}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Section: Table */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[var(--color-deduce-navy)] font-display">CFDI Recientes</h2>
                            <button className="text-sm font-semibold text-[var(--color-deduce-teal)] hover:underline">Ver todo</button>
                        </div>
                        <InvoicesTable />
                    </div>

                </div>

                {/* Profile Modal */}
                <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Comencemos tu configuración</DialogTitle>
                            <DialogDescription>
                                Para calcular tu límite legal de deducciones (Art. 151 LISR), necesitamos tu ingreso anual estimado.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="income">Ingreso Anual Estimado (MXN)</Label>
                                <Input
                                    id="income"
                                    type="number"
                                    placeholder="Ej. 400000"
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value)}
                                    className="focus:border-[var(--color-deduce-teal)] focus:ring-[var(--color-deduce-teal)]/10"
                                />
                            </div>
                            <Button onClick={handleSaveIncome} className="w-full bg-[var(--color-deduce-teal)] text-white hover:bg-[#0b7a70]">
                                Guardar y Continuar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </ProtectedRoute>
    );
}
