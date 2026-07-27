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
import { AlertCircle, CheckCircle2, AlertTriangle, Trash2, Search, Filter, Edit2, Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';

export default function InvoicesTable() {
    const { invoices, fetchInvoices, isLoading, deleteInvoice, updateInvoice } = useDeductionsStore();
    const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
    const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
    const [editCfdiUse, setEditCfdiUse] = useState('');
    const [editCurp, setEditCurp] = useState('');
    const [editNivel, setEditNivel] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todas');

    const nivelesOptions = ["Preescolar", "Primaria", "Secundaria", "Profesional técnico", "Bachillerato o su equivalente"];

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
                matchesCategory = inv.status === 'warning';
            } else {
                matchesCategory = inv.expense_type === categoryFilter;
            }

            return matchesSearch && matchesCategory;
        });
    }, [invoices, searchTerm, categoryFilter]);

    const warningInvoicesCount = useMemo(() => {
        return invoices.filter(inv => inv.status === 'warning').length;
    }, [invoices]);

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
        setInvoiceToEdit(inv);
        setEditCfdiUse(inv.cfdi_use || '');
        setEditCurp(inv.student_curp || '');
        setEditNivel(inv.educational_level || '');
    };

    const handleSaveEdit = async () => {
        if (!invoiceToEdit) return;
        setIsSaving(true);
        try {
            await updateInvoice(invoiceToEdit.id, {
                cfdi_use: editCfdiUse,
                student_curp: editCurp,
                educational_level: editNivel,
            });
            toast.success("Factura actualizada correctamente");
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
    }, [fetchInvoices]);

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

    return (
        <div className="space-y-4">
            {warningInvoicesCount > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-4">
                    <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-orange-900 mb-1">
                            Atención requerida
                        </h3>
                        <p className="text-sm text-orange-700">
                            Tienes {warningInvoicesCount} {warningInvoicesCount === 1 ? 'factura' : 'facturas'} con inconsistencias. Búscalas en la tabla usando el filtro &quot;⚠️ Con inconsistencias&quot; para ver qué corregir.
                        </p>
                    </div>
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
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                        No se encontraron facturas con esos filtros.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredInvoices.map((inv: Invoice) => (
                        <TableRow key={inv.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <TableCell className="font-medium text-slate-700">{formatDate(inv.date)}</TableCell>
                            <TableCell>
                                <span className="text-sm font-medium text-[var(--color-deduce-navy)]">{inv.issuer_name}</span>
                            </TableCell>
                            <TableCell className="text-slate-700 tabular-nums font-medium">{formatCurrency(inv.deductible_amount)}</TableCell>
                            <TableCell className="text-slate-600 text-sm">{inv.expense_type}</TableCell>
                            <TableCell>
                                <StatusBadge status={inv.status} messages={inv.warning_messages} />
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center items-center gap-2">
                                    <button 
                                        onClick={() => handleOpenEdit(inv)}
                                        className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                        title="Editar factura"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
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
                    ))
                )}
            </TableBody>
                    </Table>
                </div>
            </div>

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
                        <div className="space-y-2">
                            <Label>Uso CFDI</Label>
                            <Input
                                value={editCfdiUse}
                                onChange={(e) => setEditCfdiUse(e.target.value)}
                                placeholder="Ej. D10"
                                className="focus:border-[var(--color-deduce-teal)]"
                            />
                        </div>
                        {editCfdiUse === 'D10' && (
                            <>
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
                    <span className="text-[10px] text-[var(--color-deduce-amber)] truncate max-w-[150px]" title={messages[0]}>
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
                <span className="text-[10px] text-[var(--color-deduce-coral)] truncate max-w-[150px]" title={messages[0]}>
                    {messages[0]}
                </span>
            )}
        </div>
    );
}
