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
import { AlertCircle, CheckCircle2, AlertTriangle, Trash2, Search, Filter } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';

export default function InvoicesTable() {
    const { invoices, fetchInvoices, isLoading, deleteInvoice } = useDeductionsStore();
    const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todas');

    const categories = useMemo(() => {
        const cats = new Set(invoices.map(inv => inv.expense_type).filter(Boolean) as string[]);
        return ['Todas', ...Array.from(cats)];
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesSearch = inv.issuer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  inv.expense_type?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'Todas' || inv.expense_type === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [invoices, searchTerm, categoryFilter]);

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
