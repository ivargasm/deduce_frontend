'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoutes';
import { useDeductionsStore } from '@/app/store/DeductionsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

export default function ProfilePage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profile, fetchProfile, updateProfile, isLoading } = useDeductionsStore();
    const [rfc, setRfc] = useState('');
    const [income, setIncome] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile().then(() => {
            const currentProfile = useDeductionsStore.getState().profile;
            if (currentProfile) {
                setRfc(currentProfile.rfc || '');
                setIncome(currentProfile.estimated_annual_income?.toString() || '');
            }
        });
    }, [fetchProfile]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const dataToUpdate: { rfc?: string; estimated_annual_income?: number } = {};
            if (rfc.trim() !== '') dataToUpdate.rfc = rfc.trim().toUpperCase();
            if (income.trim() !== '') {
                const num = parseFloat(income);
                if (!isNaN(num) && num > 0) {
                    dataToUpdate.estimated_annual_income = num;
                }
            }

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
        <ProtectedRoute>
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
        </ProtectedRoute>
    );
}
