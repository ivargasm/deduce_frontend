'use client';

import { useEffect, useState } from 'react';
import { useDeductionsStore } from '@/app/store/DeductionsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

export default function ProfilePage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profile, summary, fetchProfile, fetchSummary, updateProfile, isLoading } = useDeductionsStore();
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
    }, [fetchProfile, fetchSummary]);

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
            </div>
    );
}
