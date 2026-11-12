'use client';

import { useDeductionsStore, Invoice } from '@/app/store/DeductionsStore';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle2, AlertTriangle, Trash2, Search, Filter, Edit2, Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';

export default function InvoicesTable() {
    const {
        invoices,
        issuerRules,
        selectedYear,
        fetchInvoices,
        fetchIssuerRules,
        isLoading,
        deleteInvoice,
        bulkDeleteInvoices,
        updateInvoice,
    } = useDeductionsStore();
    const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [confirmBulkDeleteOpen, setConfirmBulkDeleteOpen] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
    const [editCfdiUse, setEditCfdiUse] = useState('');
    const [editCurp, setEditCurp] = useState('');
    const [editNivel, setEditNivel] = useState('');
    const [editMatchKeyword, setEditMatchKeyword] = useState('');
    const [applyToSimilar, setApplyToSimilar] = useState(false);
    const [rememberForIssuer, setRememberForIssuer] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todas');

    const nivelesOptions = ["Preescolar", "Primaria", "Secundaria", "Profesional técnico", "Bachillerato o su equivalente"];

    const usoCfdiOptions = [
        { code: 'D01', label: 'D01 - Honorarios médicos, dentales y gastos hospitalarios' },
        { code: 'D02', label: 'D02 - Gastos médicos por incapacidad o discapacidad' },
        { code: 'D03', label: 'D03 - Gastos funerales' },
        { code: 'D04', label: 'D04 - Donativos' },
        { code: 'D05', label: 'D05 - Intereses reales por créditos hipotecarios' },
        { code: 'D06', label: 'D06 - Aportaciones voluntarias al SAR' },
        { code: 'D07', label: 'D07 - Primas por seguros de gastos médicos' },
        { code: 'D08', label: 'D08 - Gastos de transportación escolar obligatoria' },
        { code: 'D09', label: 'D09 - Depósitos en cuentas para el ahorro' },
        { code: 'D10', label: 'D10 - Pagos por servicios educativos (colegiaturas)' },
    ];

    const categories = useMemo(() => {
        const cats = new Set(invoices.map(inv => inv.expense_type).filter(Boolean) as string[]);
        return ['Todas', '⚠️ Con inconsistencias', ...Array.from(cats)];
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesSearch = inv.issuer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  inv.expense_type?.toLowerCase().includes(searchTerm.toLowerCase());
            
            let matchesCategory = false;
            if (categoryFilter === 'Todas') {
                matchesCategory = true;
            } else if (categoryFilter === '⚠️ Con inconsistencias') {
                matchesCategory = inv.status === 'warning' || inv.status === 'invalid';
            } else {
                matchesCategory = inv.expense_type === categoryFilter;
            }

            return matchesSearch && matchesCategory;
        });
    }, [invoices, searchTerm, categoryFilter]);

    const warningInvoicesCount = useMemo(() => {
        return invoices.filter(inv => inv.status === 'warning' || inv.status === 'invalid').length;
    }, [invoices]);

    // Facturas con inconsistencia cuyo UsoCFDI no es D01..D10 (ej. S01, G01, G03 de gastos generales/inversiones)
    const nonDeductibleWarningIds = useMemo(() => {
        return invoices
            .filter(
                inv =>
                    (!inv.invoice_type || inv.invoice_type === 'DEDUCTION') &&
                    (inv.status === 'warning' || inv.status === 'invalid') &&
                    !(inv.cfdi_use || '').toUpperCase().startsWith('D')
            )
            .map(inv => inv.id);
    }, [invoices]);

    useEffect(() => {
        const validSet = new Set(invoices.map(i => i.id));
        setSelectedIds(prev => prev.filter(id => validSet.has(id)));
    }, [invoices]);

    const visibleIds = useMemo(() => filteredInvoices.map(inv => inv.id), [filteredInvoices]);
    const allVisibleSelected = useMemo(
        () => visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id)),
        [visibleIds, selectedIds]
    );

    const toggleSelectAllVisible = (checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => Array.from(new Set([...prev, ...visibleIds])));
        } else {
            const visibleSet = new Set(visibleIds);
            setSelectedIds(prev => prev.filter(id => !visibleSet.has(id)));
        }
    };

    const toggleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => (prev.includes(id) ? prev : [...prev, id]));
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        setIsBulkDeleting(true);
        try {
            const deletedCount = await bulkDeleteInvoices(selectedIds);
            toast.success(`Se eliminaron ${deletedCount} facturas correctamente.`);
            setSelectedIds([]);
            setConfirmBulkDeleteOpen(false);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Error al eliminar las facturas seleccionadas";
            toast.error(msg);
        } finally {
            setIsBulkDeleting(false);
        }
    };

    const savedStudents = useMemo(() => {
        const seen = new Map<string, { curp: string; level: string }>();
        for (const rule of issuerRules) {
            if (rule.student_curp && rule.educational_level) {
                const key = `${rule.student_curp.toUpperCase()}|${rule.educational_level}`;
                if (!seen.has(key)) {
                    seen.set(key, { curp: rule.student_curp.toUpperCase(), level: rule.educational_level });
                }
            }
        }
        for (const inv of invoices) {
            if (inv.student_curp && inv.educational_level) {
                const key = `${inv.student_curp.toUpperCase()}|${inv.educational_level}`;
                if (!seen.has(key)) {
                    seen.set(key, { curp: inv.student_curp.toUpperCase(), level: inv.educational_level });
                }
            }
        }
        return Array.from(seen.values());
    }, [issuerRules, invoices]);

    const matchingPendingCount = useMemo(() => {
        if (!invoiceToEdit) return 0;
        const targetRfc = (invoiceToEdit.issuer_rfc || '').toUpperCase();
        const targetUse = (invoiceToEdit.cfdi_use || '').toUpperCase();
        return invoices.filter(inv =>
            inv.id !== invoiceToEdit.id &&
            (!inv.invoice_type || inv.invoice_type === 'DEDUCTION') &&
            (inv.status === 'warning' || inv.status === 'invalid') &&
            inv.payment_method !== '01' &&
            (inv.issuer_rfc || '').toUpperCase() === targetRfc &&
            (inv.cfdi_use || '').toUpperCase() === targetUse
        ).length;
    }, [invoiceToEdit, invoices]);

    const issuerD10Rules = useMemo(() => {
        if (!invoiceToEdit) return [];
        const targetRfc = (invoiceToEdit.issuer_rfc || '').toUpperCase();
        return issuerRules.filter(
            r => r.issuer_rfc.toUpperCase() === targetRfc && r.cfdi_use.toUpperCase() === 'D10'
        );
    }, [invoiceToEdit, issuerRules]);

    const issuerKnownStudentsCount = useMemo(() => {
        if (!invoiceToEdit) return 0;
        const targetRfc = (invoiceToEdit.issuer_rfc || '').toUpperCase();
        const curps = new Set<string>();
        for (const r of issuerD10Rules) {
            if (r.student_curp) curps.add(r.student_curp.toUpperCase());
        }
        for (const inv of invoices) {
            if (
                (inv.issuer_rfc || '').toUpperCase() === targetRfc &&
                (inv.cfdi_use || '').toUpperCase() === 'D10' &&
                inv.student_curp
            ) {
                curps.add(inv.student_curp.toUpperCase());
            }
        }
        return curps.size;
    }, [invoiceToEdit, issuerD10Rules, invoices]);

    const handleDelete = async () => {
        if (invoiceToDelete) {
            try {
                await deleteInvoice(invoiceToDelete);
                toast.success("Factura eliminada correctamente");
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Error al eliminar la factura");
                }
            } finally {
                setInvoiceToDelete(null);
            }
        }
    };

    const handleOpenEdit = (inv: Invoice) => {
        const cfdiUseUpper = (inv.cfdi_use || '').toUpperCase();
        const targetRfc = (inv.issuer_rfc || '').toUpperCase();
        const rulesForIssuer = issuerRules.filter(
            r => r.issuer_rfc.toUpperCase() === targetRfc && r.cfdi_use.toUpperCase() === 'D10'
        );
        const activeRulesForIssuer = rulesForIssuer.filter(r => r.auto_apply);
        const curpsForIssuer = new Set<string>();
        for (const r of rulesForIssuer) {
            if (r.student_curp) curpsForIssuer.add(r.student_curp.toUpperCase());
        }
        for (const item of invoices) {
            if (
                (item.issuer_rfc || '').toUpperCase() === targetRfc &&
                (item.cfdi_use || '').toUpperCase() === 'D10' &&
                item.student_curp
            ) {
                curpsForIssuer.add(item.student_curp.toUpperCase());
            }
        }

        const singleSafeRule =
            activeRulesForIssuer.length === 1 && curpsForIssuer.size <= 1
                ? activeRulesForIssuer[0]
                : null;
        const currentStudentRule = inv.student_curp
            ? rulesForIssuer.find(r => (r.student_curp || '').toUpperCase() === inv.student_curp!.toUpperCase())
            : singleSafeRule;

        setInvoiceToEdit(inv);
        setEditCfdiUse(cfdiUseUpper);
        setEditCurp(inv.student_curp || (cfdiUseUpper === 'D10' ? (singleSafeRule?.student_curp || '') : ''));
        setEditNivel(inv.educational_level || (cfdiUseUpper === 'D10' ? (singleSafeRule?.educational_level || '') : ''));
        setEditMatchKeyword(currentStudentRule?.match_keyword || '');
        setApplyToSimilar(false);
        setRememberForIssuer(false);
    };

    const handleSaveEdit = async () => {
        if (!invoiceToEdit) return;
        const normalizedUse = editCfdiUse.trim().toUpperCase();
        const normalizedCurp = editCurp.trim().toUpperCase();
        const normalizedNivel = editNivel.trim();

        if (rememberForIssuer && normalizedUse === 'D10' && (!normalizedCurp || !normalizedNivel)) {
            toast.error("Para recordar la regla en colegiaturas (D10) debes capturar CURP y Nivel Educativo");
            return;
        }

        setIsSaving(true);
        try {
            const result = await updateInvoice(invoiceToEdit.id, {
                cfdi_use: normalizedUse,
                student_curp: normalizedCurp,
                educational_level: normalizedNivel,
                apply_to_similar: applyToSimilar,
                remember_for_issuer: rememberForIssuer,
                match_keyword: rememberForIssuer ? editMatchKeyword.trim() : undefined,
            });
            const extraParts: string[] = [];
            if (result?.updated_similar_count && result.updated_similar_count > 0) {
                extraParts.push(`${result.updated_similar_count} similar(es) corregida(s)`);
            }
            if (result?.rule_saved) {
                extraParts.push("regla guardada para futuras cargas");
            }
            toast.success(
                extraParts.length > 0
                    ? `Factura actualizada (${extraParts.join(' · ')})`
                    : "Factura actualizada y re-evaluada correctamente"
            );
            setInvoiceToEdit(null);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Error al actualizar la factura");
            }
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
        fetchIssuerRules();
    }, [fetchInvoices, fetchIssuerRules]);

    if (isLoading && invoices.length === 0) {
        return <div className="text-center py-10">Cargando facturas...</div>;
    }

    if (invoices.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500 bg-white border border-slate-200 rounded-xl">
                Aún no has subido ninguna factura.
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatShortYmd = (ymd?: string | null) => {
        if (!ymd) return null;
        const parts = ymd.slice(0, 10).split('-').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return ymd;
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    };

    return (
        <div className="space-y-4">
            {warningInvoicesCount > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-orange-900 mb-1">
                                Atención requerida
                            </h3>
                            <p className="text-sm text-orange-700">
                                Tienes {warningInvoicesCount} {warningInvoicesCount === 1 ? 'factura' : 'facturas'} con inconsistencias. Búscalas en la tabla usando el filtro &quot;⚠️ Con inconsistencias&quot; para ver qué corregir o eliminar en lote las que no sean deducciones personales.
                            </p>
                        </div>
                    </div>
                    {nonDeductibleWarningIds.length > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0 border-orange-300 bg-white text-orange-900 hover:bg-orange-100"
                            onClick={() => {
                                setCategoryFilter('⚠️ Con inconsistencias');
                                setSelectedIds(nonDeductibleWarningIds);
                                toast.info(
                                    `Se seleccionaron ${nonDeductibleWarningIds.length} facturas con Uso CFDI distinto de D01–D10 (ej. G03/S01).`
                                );
                            }}
                        >
                            Seleccionar no deducibles ({nonDeductibleWarningIds.length})
                        </Button>
                    )}
                </div>
            )}

            {selectedIds.length > 0 && (
                <div className="p-3 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3 text-sm">
                        <span className="font-semibold">
                            {selectedIds.length} {selectedIds.length === 1 ? 'factura seleccionada' : 'facturas seleccionadas'}
                        </span>
                        <button
                            type="button"
                            onClick={() => setSelectedIds([])}
                            className="text-xs text-slate-300 hover:text-white underline"
                        >
                            Desmarcar todas
                        </button>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        disabled={isBulkDeleting}
                        onClick={() => setConfirmBulkDeleteOpen(true)}
                        className="bg-[var(--color-deduce-coral)] text-white hover:bg-red-600 flex items-center gap-1.5"
                    >
                        <Trash2 className="w-4 h-4" />
                        Eliminar seleccionadas ({selectedIds.length})
                    </Button>
                </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Buscar por proveedor o categoría..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-deduce-teal)]"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-deduce-teal)] appearance-none bg-white"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    <Table>
                        <TableHeader className="bg-slate-50/80 sticky top-0 z-10 shadow-sm">
                            <TableRow className="border-b border-slate-200">
                                <TableHead className="w-10 text-center h-12">
                                    <Checkbox
                                        checked={allVisibleSelected}
                                        onCheckedChange={(checked) => toggleSelectAllVisible(Boolean(checked))}
                                        aria-label="Seleccionar facturas visibles"
                                    />
                                </TableHead>
                                <TableHead className="text-xs font-bold text-slate-500 tracking-widest uppercase h-12">Fecha</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500 tracking-widest uppercase h-12">Proveedor</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500 tracking-widest uppercase h-12">Monto</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500 tracking-widest uppercase h-12">Categoría</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500 tracking-widest uppercase h-12">Estado</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500 tracking-widest uppercase h-12 text-center">Acción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                        No se encontraron facturas con esos filtros.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredInvoices.map((inv: Invoice) => {
                                    const isNomina = inv.invoice_type === 'NOMINA';
                                    const isSelected = selectedIds.includes(inv.id);
                                    const pIni = formatShortYmd(inv.fecha_inicial_pago);
                                    const pFin = formatShortYmd(inv.fecha_final_pago);
                                    const taxableVal = inv.taxable_amount ?? inv.total_amount;

                                    return (
                        <TableRow
                            key={inv.id}
                            className={`border-b border-slate-100 hover:bg-slate-50/50 ${isSelected ? 'bg-teal-50/40' : ''}`}
                        >
                            <TableCell className="text-center">
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => toggleSelectOne(inv.id, Boolean(checked))}
                                    aria-label={`Seleccionar factura ${inv.issuer_name}`}
                                />
                            </TableCell>
                            <TableCell className="font-medium text-slate-700">
                                <div>{formatDate(inv.date)}</div>
                                {isNomina && (pIni || pFin) && (
                                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 font-normal">
                                        <span>Periodo: {pIni || '?'} – {pFin || '?'}</span>
                                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                                            {inv.tipo_nomina === 'E' ? 'Ext.' : 'Ord.'}
                                        </span>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="text-sm font-medium text-[var(--color-deduce-navy)]">{inv.issuer_name}</div>
                                {!isNomina && inv.cfdi_use && (
                                    <div className="text-[11px] text-slate-400">
                                        Uso CFDI: <span className="font-mono font-medium text-slate-500">{inv.cfdi_use}</span>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="text-slate-700 tabular-nums font-medium">
                                {isNomina ? (
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-slate-800 font-semibold">
                                                {formatCurrency(inv.total_amount)}
                                            </span>
                                            <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                Bruto
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                                            Gravado: {formatCurrency(taxableVal)} · ISR ret.: {formatCurrency(inv.isr_retenido || 0)}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div>{formatCurrency(inv.deductible_amount)}</div>
                                        {inv.deductible_amount === 0 && inv.total_amount > 0 && (
                                            <div className="text-[11px] text-slate-400 font-normal">
                                                Total CFDI: {formatCurrency(inv.total_amount)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 text-sm">{inv.expense_type}</TableCell>
                            <TableCell>
                                <StatusBadge status={inv.status} messages={inv.warning_messages} />
                                {isNomina && inv.fecha_timbrado && (
                                    <div className="text-[11px] text-slate-400 mt-1">
                                        Timbrado: {formatDate(inv.fecha_timbrado)}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center items-center gap-2">
                                    {(!inv.invoice_type || inv.invoice_type === 'DEDUCTION') && (
                                        <button 
                                            onClick={() => handleOpenEdit(inv)}
                                            className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            title="Editar factura"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setInvoiceToDelete(inv.id)}
                                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        title="Eliminar factura"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={confirmBulkDeleteOpen} onOpenChange={setConfirmBulkDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Eliminar {selectedIds.length} {selectedIds.length === 1 ? 'factura seleccionada' : 'facturas seleccionadas'}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Las {selectedIds.length} facturas seleccionadas serán eliminadas permanentemente de tu historial y se recalculará tu resumen anual.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isBulkDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isBulkDeleting}
                            onClick={(e) => {
                                e.preventDefault();
                                handleBulkDelete();
                            }}
                            className="bg-[var(--color-deduce-coral)] text-white hover:bg-red-600"
                        >
                            {isBulkDeleting ? 'Eliminando...' : `Sí, eliminar (${selectedIds.length})`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={invoiceToDelete !== null} onOpenChange={(open) => !open && setInvoiceToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de eliminar esta factura?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. La factura será eliminada permanentemente de tu historial y ya no sumará a tus deducciones.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-[var(--color-deduce-coral)] text-white hover:bg-red-600">
                            Sí, eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={invoiceToEdit !== null} onOpenChange={(open) => !open && setInvoiceToEdit(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Factura</DialogTitle>
                        <DialogDescription>
                            Puedes actualizar el Uso de CFDI o asignar los datos del alumno si la factura no incluía el Complemento IEDU.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {invoiceToEdit?.warning_messages && invoiceToEdit.warning_messages.length > 0 && (
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                                <p className="font-semibold">Observaciones actuales:</p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    {invoiceToEdit.warning_messages.map((msg, idx) => (
                                        <li key={idx}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Uso CFDI</Label>
                            <select
                                value={editCfdiUse}
                                onChange={(e) => setEditCfdiUse(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-deduce-teal)]"
                            >
                                {invoiceToEdit?.cfdi_use && !usoCfdiOptions.some(opt => opt.code === invoiceToEdit.cfdi_use.toUpperCase()) && (
                                    <option value={invoiceToEdit.cfdi_use.toUpperCase()}>
                                        {invoiceToEdit.cfdi_use.toUpperCase()} - Actual (No deducible / revisar)
                                    </option>
                                )}
                                {usoCfdiOptions.map(opt => (
                                    <option key={opt.code} value={opt.code}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        {editCfdiUse === 'D10' && (
                            <>
                                {savedStudents.length > 0 && (
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-500">Alumno guardado (opcional)</Label>
                                        <select
                                            value=""
                                            onChange={(e) => {
                                                const selected = savedStudents.find(s => `${s.curp}|${s.level}` === e.target.value);
                                                if (selected) {
                                                    setEditCurp(selected.curp);
                                                    setEditNivel(selected.level);
                                                }
                                            }}
                                            className="flex h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-deduce-teal)]"
                                        >
                                            <option value="">Seleccionar alumno capturado previamente...</option>
                                            {savedStudents.map((s) => (
                                                <option key={`${s.curp}|${s.level}`} value={`${s.curp}|${s.level}`}>
                                                    {s.level} — {s.curp}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label>Nivel Educativo</Label>
                                    <select
                                        value={editNivel}
                                        onChange={(e) => setEditNivel(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-deduce-teal)] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Seleccionar nivel...</option>
                                        {nivelesOptions.map(nv => (
                                            <option key={nv} value={nv}>{nv}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>CURP del Alumno</Label>
                                    <Input
                                        value={editCurp}
                                        onChange={(e) => setEditCurp(e.target.value)}
                                        placeholder="18 caracteres"
                                        className="focus:border-[var(--color-deduce-teal)] uppercase"
                                    />
                                </div>
                            </>
                        )}
                        {(matchingPendingCount > 0 || editCfdiUse === 'D10') && (
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                                {matchingPendingCount > 0 && (
                                    <div className="flex items-start space-x-2.5">
                                        <Checkbox
                                            id="apply-similar"
                                            checked={applyToSimilar}
                                            onCheckedChange={(checked) => setApplyToSimilar(checked === true)}
                                            className="mt-0.5"
                                        />
                                        <label htmlFor="apply-similar" className="text-xs text-slate-700 leading-snug cursor-pointer">
                                            <span className="font-semibold">
                                                Aplicar también a otras {matchingPendingCount} {matchingPendingCount === 1 ? 'factura con incidencia' : 'facturas con incidencia'} de este emisor ({selectedYear})
                                            </span>
                                            <span className="block text-slate-500 mt-0.5">
                                                Excluye facturas ya válidas y pagos en efectivo.
                                            </span>
                                        </label>
                                    </div>
                                )}
                                {editCfdiUse === 'D10' && (
                                    <div className="space-y-2">
                                        <div className="flex items-start space-x-2.5">
                                            <Checkbox
                                                id="remember-issuer"
                                                checked={rememberForIssuer}
                                                onCheckedChange={(checked) => setRememberForIssuer(checked === true)}
                                                className="mt-0.5"
                                            />
                                            <label htmlFor="remember-issuer" className="text-xs text-slate-700 leading-snug cursor-pointer">
                                                <span className="font-semibold">
                                                    Recordar CURP y nivel para futuras facturas D10 de {invoiceToEdit?.issuer_name}
                                                </span>
                                                <span className="block text-slate-500 mt-0.5">
                                                    {issuerKnownStudentsCount > 1
                                                        ? `Hay ${issuerKnownStudentsCount} alumnos registrados en este emisor: indica una palabra clave del concepto para aplicar esta regla solo a este alumno.`
                                                        : issuerD10Rules.length > 0
                                                            ? `Ya existe una regla (${issuerD10Rules[0].educational_level} - ${issuerD10Rules[0].student_curp}). Si usas la misma CURP se actualizará; si es otra CURP se agregará aparte.`
                                                            : 'Al subir nuevos XML D10 sin complemento IEDU de esta escuela, se completarán automáticamente si coinciden con este alumno.'}
                                                </span>
                                            </label>
                                        </div>
                                        {rememberForIssuer && (
                                            <div className="pl-6 space-y-1">
                                                <Label className="text-[11px] text-slate-600">
                                                    Palabra clave en concepto (opcional{issuerKnownStudentsCount > 1 ? ' · recomendada' : ''})
                                                </Label>
                                                <Input
                                                    value={editMatchKeyword}
                                                    onChange={(e) => setEditMatchKeyword(e.target.value)}
                                                    placeholder="Ej. Nombre o matrícula del alumno en el XML"
                                                    className="h-8 text-xs bg-white"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setInvoiceToEdit(null)}>Cancelar</Button>
                        <Button onClick={handleSaveEdit} disabled={isSaving} className="bg-[var(--color-deduce-teal)] hover:bg-[#16b5a3] text-[var(--color-deduce-navy)] font-bold">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatusBadge({ status, messages }: { status: string; messages: string[] | null }) {
    if (status === 'valid') {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-deduce-teal)]/10 text-[var(--color-deduce-teal)] text-xs font-semibold tracking-wide border border-[var(--color-deduce-teal)]/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Correcto
            </div>
        );
    }
    if (status === 'warning') {
        return (
            <div className="flex flex-col items-start gap-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-deduce-amber)]/10 text-[var(--color-deduce-amber)] text-xs font-semibold tracking-wide border border-[var(--color-deduce-amber)]/20">
                    <AlertTriangle className="w-3.5 h-3.5" /> Revisar
                </div>
                {messages && messages.length > 0 && (
                    <span className="text-[10px] text-[var(--color-deduce-amber)] truncate max-w-[150px]" title={messages.join(' • ')}>
                        {messages[0]}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-deduce-coral)]/10 text-[var(--color-deduce-coral)] text-xs font-semibold tracking-wide border border-[var(--color-deduce-coral)]/20">
                <AlertCircle className="w-3.5 h-3.5" /> Error
            </div>
            {messages && messages.length > 0 && (
                <span className="text-[10px] text-[var(--color-deduce-coral)] truncate max-w-[150px]" title={messages.join(' • ')}>
                    {messages[0]}
                </span>
            )}
        </div>
    );
}
