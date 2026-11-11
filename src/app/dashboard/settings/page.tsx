'use client';

import { useEffect, useState } from 'react';
import { useDeductionsStore } from '@/app/store/DeductionsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { AlertTriangle, Trash2, GraduationCap } from 'lucide-react';

export default function ProfilePage() {
    const {
        summary,
        issuerRules,
        fetchProfile,
        fetchSummary,
        fetchIssuerRules,
        updateProfile,
        updateIssuerRule,
        deleteIssuerRule,
        isLoading,
    } = useDeductionsStore();
    const [rfc, setRfc] = useState('');
    const [income, setIncome] = useState('');
    const [preferManual, setPreferManual] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile().then(() => {
            const currentProfile = useDeductionsStore.getState().profile;
            if (currentProfile) {
                setRfc(currentProfile.rfc || '');
                setIncome(currentProfile.estimated_annual_income?.toString() || '');
                setPreferManual(currentProfile.prefer_manual_income || false);
            }
        });
        fetchSummary();
        fetchIssuerRules();
    }, [fetchProfile, fetchSummary, fetchIssuerRules]);

    const handleToggleRule = async (ruleId: number, currentActive: boolean) => {
        try {
            await updateIssuerRule(ruleId, { auto_apply: !currentActive });
            toast.success(!currentActive ? "Regla activada" : "Regla pausada");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Error al actualizar la regla");
        }
    };

    const handleDeleteRule = async (ruleId: number, issuerName: string) => {
        try {
            await deleteIssuerRule(ruleId);
            toast.success(`Regla eliminada (${issuerName})`);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Error al eliminar la regla");
        }
    };

    const hasExactIncome = summary && summary.exact_income && summary.exact_income > 0;
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const dataToUpdate: { rfc?: string; estimated_annual_income?: number; prefer_manual_income?: boolean } = {};
            if (rfc.trim() !== '') dataToUpdate.rfc = rfc.trim().toUpperCase();
            if (income.trim() !== '') {
                const num = parseFloat(income);
                if (!isNaN(num) && num > 0) {
                    dataToUpdate.estimated_annual_income = num;
                }
            }
            dataToUpdate.prefer_manual_income = preferManual;

            await updateProfile(dataToUpdate);
            toast.success("Perfil actualizado correctamente");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Error al actualizar el perfil");
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
            <div className="container mx-auto py-8 max-w-2xl px-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Configuración</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Datos Fiscales</CardTitle>
                        <CardDescription>
                            Configura tu información para que el asistente pueda validar tus facturas y calcular tu tope.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="rfc">RFC</Label>
                            <Input
                                id="rfc"
                                placeholder="Ej. ABCD123456XYZ"
                                value={rfc}
                                onChange={(e) => setRfc(e.target.value.toUpperCase())}
                            />
                            <p className="text-xs text-gray-500">
                                Las facturas que subas deben estar emitidas a este RFC para ser válidas.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="income">Ingreso Anual Estimado (MXN)</Label>
                            {hasExactIncome ? (
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg border ${preferManual ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'}`}>
                                        <p className={`font-semibold ${preferManual ? 'text-orange-800 dark:text-orange-300' : 'text-emerald-800 dark:text-emerald-300'}`}>
                                            Ingreso Comprobado: {formatCurrency(summary.exact_income!)}
                                        </p>
                                        <p className={`text-sm mt-1 ${preferManual ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                            {preferManual 
                                                ? "Has forzado el uso de tu estimación manual, por lo que este ingreso automático será ignorado para el cálculo global." 
                                                : "Detectamos tus recibos de nómina. Este valor exacto está sustituyendo a tu estimación manual para calcular tu tope de deducciones y tu reembolso real."}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="override" 
                                            checked={preferManual} 
                                            onCheckedChange={(checked) => setPreferManual(checked as boolean)}
                                        />
                                        <label
                                            htmlFor="override"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Forzar uso de ingreso manual (Si te faltan recibos de nómina)
                                        </label>
                                    </div>
                                    {preferManual && (
                                        <div className="mt-2 space-y-2">
                                            <Input
                                                id="income"
                                                type="number"
                                                placeholder="Ej. 400000"
                                                value={income}
                                                onChange={(e) => setIncome(e.target.value)}
                                            />
                                            <p className="text-xs text-gray-500">
                                                Al estar forzado, este valor será usado para el cálculo.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Input
                                        id="income"
                                        type="number"
                                        placeholder="Ej. 400000"
                                        value={income}
                                        onChange={(e) => setIncome(e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Usado para calcular tu tope de 15%.
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg flex items-start space-x-3 text-sm text-yellow-800 dark:text-yellow-200 mt-4">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold mb-1">¡Cuidado al cambiar el RFC!</h4>
                                <p>
                                    Si cambias tu RFC, las facturas que hayas subido anteriormente ya no coincidirán con tu perfil actual.
                                    Asegúrate de que este RFC sea tuyo.
                                </p>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSave} disabled={isSaving || isLoading}>
                            {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-[var(--color-deduce-teal)]" />
                            Reglas de Colegiaturas por Emisor (D10)
                        </CardTitle>
                        <CardDescription>
                            Cuando subas nuevas facturas D10 sin complemento IEDU de estas instituciones (y que no sean pago en efectivo), Deduce aplicará estos datos automáticamente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {issuerRules.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                Aún no tienes reglas guardadas. Puedes activar una desde el modal de <strong>Editar Factura</strong> marcando la opción <em>Recordar CURP y nivel</em>.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {issuerRules.map((rule) => (
                                    <div
                                        key={rule.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/70"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-slate-900">
                                                    {rule.issuer_name || rule.issuer_rfc}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                                                    {rule.issuer_rfc}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600">
                                                Uso: <strong>{rule.cfdi_use}</strong> · Nivel: <strong>{rule.educational_level || '-'}</strong> · CURP: <span className="font-mono">{rule.student_curp || '-'}</span>
                                            </p>
                                            <div className="flex items-center gap-2 pt-1">
                                                <span className="text-[11px] text-slate-500 whitespace-nowrap">Palabra clave:</span>
                                                <Input
                                                    key={`${rule.id}-${rule.match_keyword || ''}`}
                                                    defaultValue={rule.match_keyword || ''}
                                                    placeholder="Opcional (ej. nombre del alumno)"
                                                    onBlur={(e) => {
                                                        const nextVal = e.target.value.trim();
                                                        if (nextVal !== (rule.match_keyword || '')) {
                                                            updateIssuerRule(rule.id, { match_keyword: nextVal })
                                                                .then(() => toast.success("Palabra clave actualizada"))
                                                                .catch(() => toast.error("Error al actualizar palabra clave"));
                                                        }
                                                    }}
                                                    className="h-7 text-xs bg-white max-w-xs"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleRule(rule.id, rule.auto_apply)}
                                                className={rule.auto_apply ? "text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" : "text-slate-600"}
                                            >
                                                {rule.auto_apply ? "Activa" : "Pausada"}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteRule(rule.id, rule.issuer_name || rule.issuer_rfc)}
                                                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                                title="Eliminar regla"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
    );
}
