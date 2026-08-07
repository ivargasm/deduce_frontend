"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/app/store/Store";
import { useRouter } from "next/navigation";
import { Users, FileText, Settings2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
    fetchAdminUsersApi,
    fetchAdminFiscalYearsApi,
    fetchAdminDeductionLimitsApi,
    updateAdminUserSubscriptionApi,
    updateAdminFiscalYearApi,
    createAdminFiscalYearApi,
    fetchAdminTaxBracketsApi,
    createAdminTaxBracketApi,
    updateAdminTaxBracketApi,
    updateAdminDeductionLimitApi
} from "@/app/lib/api/admin";

// Schemas locales basados en lo que envía el backend
interface UserAdmin {
    id: number;
    username: string;
    email: string;
    subscription_status: string;
    role: string;
    created_at: string;
}

interface FiscalYear {
    year: number;
    uma_annual_value: number;
}

interface DeductionLimit {
    id: number;
    categoria: string;
    tipo_limite: string;
    monto_fijo: number | null;
    porcentaje: number | null;
    cuenta_para_tope_global: boolean;
}

interface TaxBracket {
    id: number;
    year: number;
    lower_limit: number;
    upper_limit: number | null;
    fixed_fee: number;
    tax_rate: number;
}

export default function AdminPanel() {
    const { user, url } = useAuthStore();
    const router = useRouter();

    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
    const [limits, setLimits] = useState<DeductionLimit[]>([]);
    const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>([]);
    const [activeTab, setActiveTab] = useState("users");

    const [searchEmail, setSearchEmail] = useState("");
    const [selectedYear, setSelectedYear] = useState<number | "">("");
    const [newYearValue, setNewYearValue] = useState<string>("");
    const [newUmaValue, setNewUmaValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [usersData, umaData, limitsData] = await Promise.all([
                fetchAdminUsersApi(url),
                fetchAdminFiscalYearsApi(url),
                fetchAdminDeductionLimitsApi(url)
            ]);

            setUsers(usersData);
            setFiscalYears(umaData);
            setLimits(limitsData);

            if (umaData.length > 0 && selectedYear === "") {
                const maxYear = Math.max(...umaData.map((y: FiscalYear) => y.year));
                setSelectedYear(maxYear);
            }

        } catch (error) {
            console.error(error);
            toast.error("Error cargando datos del panel");
        } finally {
            setIsLoading(false);
        }
    }, [url, selectedYear]);

    useEffect(() => {
        if (selectedYear !== "") {
            fetchAdminTaxBracketsApi(url, Number(selectedYear))
                .then(setTaxBrackets)
                .catch(() => toast.error("Error al obtener rangos ISR"));
        }
    }, [selectedYear, url]);

    useEffect(() => {
        if (!user) return;
        if (user.role !== 'admin') {
            toast.error("Acceso denegado");
            router.push("/dashboard");
            return;
        }

        fetchData();
    }, [user, router, fetchData]);

    const updateSubscription = async (userId: number, newStatus: string) => {
        try {
            await updateAdminUserSubscriptionApi(url, userId, newStatus);
            toast.success(`Suscripción actualizada a ${newStatus}`);
            fetchData(); // Recargar
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar suscripción");
        }
    };

    const updateUMA = async (year: number, newValue: number) => {
        try {
            await updateAdminFiscalYearApi(url, year, newValue);
            toast.success(`UMA ${year} actualizada`);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar UMA");
        }
    };

    const handleCreateFiscalYear = async () => {
        if (!newYearValue || !newUmaValue) return toast.error("Ingresa el año y el valor UMA");
        try {
            await createAdminFiscalYearApi(url, Number(newYearValue), Number(newUmaValue));
            toast.success("Año fiscal creado exitosamente");
            setNewYearValue("");
            setNewUmaValue("");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Error al crear año fiscal (¿ya existe?)");
        }
    };

    const updateDeductionLimit = async (limitId: number, field: string, value: number) => {
        try {
            await updateAdminDeductionLimitApi(url, limitId, { [field]: value });
            toast.success("Límite actualizado");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Error actualizando límite");
        }
    };

    const handleUpdateTaxBracket = async (bracketId: number, field: string, value: number | null) => {
        try {
            await updateAdminTaxBracketApi(url, bracketId, { [field]: value });
            toast.success("Rango actualizado");
            if (selectedYear) {
                fetchAdminTaxBracketsApi(url, Number(selectedYear)).then(setTaxBrackets);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error actualizando rango");
        }
    };

    const handleAddTaxBracket = async () => {
        if (!selectedYear) return;
        try {
            await createAdminTaxBracketApi(url, {
                year: Number(selectedYear),
                lower_limit: 0,
                upper_limit: null,
                fixed_fee: 0,
                tax_rate: 0
            });
            toast.success("Rango añadido al final de la tabla");
            fetchAdminTaxBracketsApi(url, Number(selectedYear)).then(setTaxBrackets);
        } catch (error) {
            console.error(error);
            toast.error("Error agregando rango");
        }
    };

    if (isLoading || user?.role !== 'admin') {
        return <div className="p-8 text-center text-slate-500">Cargando panel de administración...</div>;
    }

    const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchEmail.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-display text-[var(--color-deduce-navy)]">Panel de Administración</h1>
                    <p className="text-slate-500">Gestión de usuarios y parámetros fiscales</p>
                </div>
            </div>

            <div className="w-full">
                <div className="bg-slate-100 border border-slate-200 p-1 rounded-xl mb-6 flex gap-2">
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${activeTab === 'users' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-200/50'}`}
                    >
                        <Users className="w-4 h-4" />
                        Usuarios Registrados
                    </button>
                    <button
                        onClick={() => setActiveTab("uma")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${activeTab === 'uma' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-200/50'}`}
                    >
                        <FileText className="w-4 h-4" />
                        UMA y Tablas ISR
                    </button>
                    <button
                        onClick={() => setActiveTab("limits")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${activeTab === 'limits' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-200/50'}`}
                    >
                        <Settings2 className="w-4 h-4" />
                        Límites de Deducción
                    </button>
                </div>

                {/* TABS CONTENT: USERS */}
                {activeTab === "users" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h2 className="font-semibold text-slate-700">Lista de Usuarios ({filteredUsers.length})</h2>
                                <Input
                                    placeholder="Buscar por correo..."
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    className="max-w-xs bg-white"
                                />
                            </div>

                            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">ID</th>
                                            <th className="px-6 py-3 font-semibold">Usuario / Correo</th>
                                            <th className="px-6 py-3 font-semibold">Rol</th>
                                            <th className="px-6 py-3 font-semibold">Registro</th>
                                            <th className="px-6 py-3 font-semibold">Plan Actual</th>
                                            <th className="px-6 py-3 font-semibold text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                                <td className="px-6 py-4 text-slate-500">#{u.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{u.username}</div>
                                                    <div className="text-slate-500">{u.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {u.created_at ? new Date(u.created_at).toLocaleDateString('es-MX') : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${u.subscription_status === 'premium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                                        {u.subscription_status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <select
                                                        value={u.subscription_status}
                                                        onChange={(e) => updateSubscription(u.id, e.target.value)}
                                                        className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg focus:ring-[var(--color-deduce-teal)] focus:border-[var(--color-deduce-teal)] block w-full p-2"
                                                    >
                                                        <option value="free">FREE</option>
                                                        <option value="premium">PREMIUM</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                                    No se encontraron usuarios.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TABS CONTENT: UMA */}
                {activeTab === "uma" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-semibold text-slate-700">Años Fiscales y UMA</h2>
                            </div>
                            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Año Fiscal</th>
                                            <th className="px-6 py-3 font-semibold">Valor Anual UMA ($)</th>
                                            <th className="px-6 py-3 font-semibold text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fiscalYears.map((fy) => (
                                            <tr key={fy.year} className="border-b border-slate-100 hover:bg-slate-50/50">
                                                <td className="px-6 py-4 font-medium text-slate-900">{fy.year}</td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    <input
                                                        type="number"
                                                        defaultValue={fy.uma_annual_value}
                                                        onBlur={(e) => {
                                                            const val = Number(e.target.value);
                                                            if (val && val !== fy.uma_annual_value) {
                                                                updateUMA(fy.year, val);
                                                            }
                                                        }}
                                                        className="border border-slate-200 rounded-md p-1 w-32"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-right text-xs text-slate-400">
                                                    *Se actualiza al salir del campo
                                                </td>
                                            </tr>
                                        ))}
                                        {fiscalYears.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                                                    No hay años fiscales configurados.
                                                </td>
                                            </tr>
                                        )}
                                        {/* Row to add new Year */}
                                        <tr className="bg-slate-50 border-t border-slate-200">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    placeholder="Ej. 2027"
                                                    className="border border-slate-200 rounded-md p-1 w-24 text-sm"
                                                    value={newYearValue}
                                                    onChange={e => setNewYearValue(e.target.value)}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    placeholder="Valor UMA"
                                                    className="border border-slate-200 rounded-md p-1 w-32 text-sm"
                                                    value={newUmaValue}
                                                    onChange={e => setNewUmaValue(e.target.value)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={handleCreateFiscalYear}
                                                    className="px-3 py-1 bg-[var(--color-deduce-teal)] text-white text-xs font-medium rounded-md hover:opacity-90"
                                                >
                                                    Agregar Año
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ISR BRACKETS SECTION */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                                <h2 className="font-semibold text-slate-700">Tablas ISR Anual</h2>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-slate-500 font-medium">Año Fiscal:</label>
                                    <select
                                        className="border border-slate-200 rounded-md text-sm p-1 bg-white"
                                        value={selectedYear}
                                        onChange={e => setSelectedYear(e.target.value ? Number(e.target.value) : "")}
                                    >
                                        <option value="">-- Seleccionar --</option>
                                        {fiscalYears.map(fy => (
                                            <option key={fy.year} value={fy.year}>{fy.year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {selectedYear ? (
                                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm">
                                            <tr>
                                                <th className="px-6 py-3 font-semibold">Límite Inferior</th>
                                                <th className="px-6 py-3 font-semibold">Límite Superior</th>
                                                <th className="px-6 py-3 font-semibold">Cuota Fija</th>
                                                <th className="px-6 py-3 font-semibold">Porcentaje (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {taxBrackets.map((tb) => (
                                                <tr key={tb.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                                    <td className="px-6 py-4">
                                                        $ <input
                                                            type="number"
                                                            step="0.01"
                                                            defaultValue={tb.lower_limit}
                                                            onBlur={(e) => {
                                                                const val = Number(e.target.value);
                                                                if (val !== tb.lower_limit) handleUpdateTaxBracket(tb.id, "lower_limit", val);
                                                            }}
                                                            className="border border-slate-200 rounded-md p-1 w-24 text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        $ <input
                                                            type="number"
                                                            step="0.01"
                                                            defaultValue={tb.upper_limit !== null ? tb.upper_limit : ''}
                                                            onBlur={(e) => {
                                                                const val = e.target.value ? Number(e.target.value) : null;
                                                                if (val !== tb.upper_limit) handleUpdateTaxBracket(tb.id, "upper_limit", val);
                                                            }}
                                                            className="border border-slate-200 rounded-md p-1 w-24 text-sm"
                                                            placeholder="Adelante"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        $ <input
                                                            type="number"
                                                            step="0.01"
                                                            defaultValue={tb.fixed_fee}
                                                            onBlur={(e) => {
                                                                const val = Number(e.target.value);
                                                                if (val !== tb.fixed_fee) handleUpdateTaxBracket(tb.id, "fixed_fee", val);
                                                            }}
                                                            className="border border-slate-200 rounded-md p-1 w-24 text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            defaultValue={(tb.tax_rate * 100).toFixed(2)}
                                                            onBlur={(e) => {
                                                                const val = Number(e.target.value) / 100;
                                                                if (val !== tb.tax_rate) handleUpdateTaxBracket(tb.id, "tax_rate", val);
                                                            }}
                                                            className="border border-slate-200 rounded-md p-1 w-20 text-sm"
                                                        /> %
                                                    </td>
                                                </tr>
                                            ))}
                                            {taxBrackets.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                        No hay rangos configurados para este año.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
                                        <button
                                            onClick={handleAddTaxBracket}
                                            className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-300"
                                        >
                                            + Agregar Rango
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    Selecciona un año fiscal arriba para visualizar y editar sus tablas de ISR.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TABS CONTENT: LIMITS */}
                {activeTab === "limits" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-semibold text-slate-700">Límites de Deducción por Categoría</h2>
                            </div>
                            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Categoría</th>
                                            <th className="px-6 py-3 font-semibold">Tipo de Límite</th>
                                            <th className="px-6 py-3 font-semibold">Porcentaje</th>
                                            <th className="px-6 py-3 font-semibold">Monto Fijo</th>
                                            <th className="px-6 py-3 font-semibold">Tope Global</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {limits.map((l) => (
                                            <tr key={l.categoria} className="border-b border-slate-100 hover:bg-slate-50/50">
                                                <td className="px-6 py-4 font-medium text-slate-900">{l.categoria}</td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                        {l.tipo_limite.replace(/_/g, ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        defaultValue={l.porcentaje !== null ? (l.porcentaje * 100).toFixed(0) : ''}
                                                        onBlur={(e) => {
                                                            const val = e.target.value ? Number(e.target.value) / 100 : null;
                                                            if (val !== l.porcentaje) {
                                                                updateDeductionLimit(l.id, "porcentaje", val as number);
                                                            }
                                                        }}
                                                        className="border border-slate-200 rounded-md p-1 w-20"
                                                        placeholder="-"
                                                    /> %
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    $ <input
                                                        type="number"
                                                        step="0.01"
                                                        defaultValue={l.monto_fijo !== null ? l.monto_fijo : ''}
                                                        onBlur={(e) => {
                                                            const val = e.target.value ? Number(e.target.value) : null;
                                                            if (val !== l.monto_fijo) {
                                                                updateDeductionLimit(l.id, "monto_fijo", val as number);
                                                            }
                                                        }}
                                                        className="border border-slate-200 rounded-md p-1 w-28"
                                                        placeholder="-"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {l.cuenta_para_tope_global ? 'Sí' : 'No'}
                                                </td>
                                            </tr>
                                        ))}
                                        {limits.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                    No hay límites configurados.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
