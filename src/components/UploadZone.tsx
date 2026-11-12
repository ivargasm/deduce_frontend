'use client';

import { useState, useRef } from 'react';
import { useDeductionsStore } from '@/app/store/DeductionsStore';
import { useAuthStore } from '@/app/store/Store';
import {
    uploadInvoiceApi,
    PayrollConflictDetail,
    PayrollConflictError,
} from '@/app/lib/api/invoices';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CloudUpload, FileType } from 'lucide-react';
import { toast } from 'sonner';

interface UploadZoneProps {
    compact?: boolean;
    children?: React.ReactNode;
}

interface PendingPayrollConflict {
    file: File;
    conflict: PayrollConflictDetail;
}

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

const formatDateTime = (iso: string | null) => {
    if (!iso) return 'N/D';
    try {
        const d = new Date(iso);
        return d.toLocaleString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
};

export default function UploadZone({ compact = false, children }: UploadZoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const [pendingConflicts, setPendingConflicts] = useState<PendingPayrollConflict[]>([]);
    const [resolvingConflict, setResolvingConflict] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { isUploading, setUploading, fetchInvoices, fetchSummary } = useDeductionsStore();
    const url = useAuthStore(state => state.url);

    const activeConflictItem = pendingConflicts[0] ?? null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const processFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const xmlFiles = Array.from(files).filter(file => file.name.toLowerCase().endsWith('.xml'));

        if (xmlFiles.length === 0) {
            toast.error('Solo se permiten archivos XML.');
            return;
        }

        setUploading(true);
        let successCount = 0;
        const detectedConflicts: PendingPayrollConflict[] = [];

        for (const file of xmlFiles) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                await uploadInvoiceApi(url, formData);
                successCount++;
            } catch (error: unknown) {
                if (error instanceof PayrollConflictError) {
                    detectedConflicts.push({ file, conflict: error.conflict });
                    continue;
                }
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido al procesar la factura';
                toast.error(`Error en ${file.name}: ${errorMessage}`);
                
                // Break loop if the user hit their plan limit to avoid spamming errors
                if (errorMessage.includes("límite mensual")) {
                    break;
                }
            }
        }

        if (successCount > 0) {
            toast.success(`Se procesaron ${successCount} facturas correctamente.`);
            await fetchInvoices();
            await fetchSummary();
        }

        if (detectedConflicts.length > 0) {
            setPendingConflicts(prev => [...prev, ...detectedConflicts]);
        }

        setUploading(false);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleResolveConflict = async (action: 'replace' | 'keep_both' | 'discard') => {
        if (!activeConflictItem) return;

        if (action === 'discard') {
            toast.info(`Se descartó el archivo ${activeConflictItem.file.name}.`);
            setPendingConflicts(prev => prev.slice(1));
            return;
        }

        setResolvingConflict(true);
        try {
            const formData = new FormData();
            formData.append('file', activeConflictItem.file);
            if (action === 'replace') {
                formData.append(
                    'replace_invoice_id',
                    String(activeConflictItem.conflict.existing_invoice.id)
                );
            } else if (action === 'keep_both') {
                formData.append('force_keep_both', 'true');
            }

            await uploadInvoiceApi(url, formData);
            toast.success(
                action === 'replace'
                    ? 'Recibo de nómina reemplazado correctamente.'
                    : 'Ambos recibos de nómina fueron conservados.'
            );
            setPendingConflicts(prev => prev.slice(1));
            await fetchInvoices();
            await fetchSummary();
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Error al resolver el conflicto de nómina';
            toast.error(msg);
        } finally {
            setResolvingConflict(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        processFiles(e.dataTransfer.files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        processFiles(e.target.files);
    };

    return (
        <div className="w-full h-full">
            <div
                className={children ? `relative w-full h-full cursor-pointer group ${dragActive ? 'bg-primary/5 rounded-xl border-2 border-primary border-dashed' : ''}` : `relative flex flex-col items-center justify-center w-full ${compact ? 'py-4 min-h-32' : 'h-64'} border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out cursor-pointer ${compact ? 'border-transparent bg-transparent hover:border-slate-600' : (dragActive ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500 dark:hover:bg-gray-700')}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                {children ? (
                    <div className="pointer-events-none">
                        {isUploading ? (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                                <p className="text-white font-medium">Procesando XMLs...</p>
                            </div>
                        ) : null}
                        {children}
                    </div>
                ) : (
                    <div className={`flex flex-col items-center justify-center ${compact ? 'pt-2 pb-2' : 'pt-5 pb-6'}`}>
                        {isUploading ? (
                            <div className={`animate-spin rounded-full ${compact ? 'h-8 w-8 mb-2' : 'h-12 w-12 mb-4'} border-b-2 border-primary`}></div>
                        ) : (
                            !compact && <CloudUpload className="w-12 h-12 mb-4 text-gray-500 dark:text-gray-400" />
                        )}

                        {!compact && (
                            <>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">{isUploading ? 'Procesando XMLs...' : 'Haz clic para subir o arrastra los archivos aquí'}</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Solo archivos XML (CFDI 4.0)</p>
                            </>
                        )}
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".xml"
                    multiple
                    onChange={handleChange}
                    disabled={isUploading}
                />
            </div>

            {/* Sección Educativa */}
            {!compact && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-start space-x-3 text-sm text-blue-800 dark:text-blue-200">
                    <FileType className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold mb-1">¿Por qué solo XML?</h4>
                        <p>
                            El XML es el único formato oficial validado por el SAT. Los PDFs pueden contener errores o faltar información clave como la &quot;Forma de Pago&quot; o el &quot;Uso de CFDI&quot;. Si solo tienes el PDF, pídele a tu proveedor el XML o descárgalo desde el portal del SAT.
                        </p>
                    </div>
                </div>
            )}

            {/* Modal de Conflicto de Nómina Re-timbrada */}
            <Dialog
                open={Boolean(activeConflictItem)}
                onOpenChange={(open) => {
                    if (!open && !resolvingConflict) {
                        handleResolveConflict('discard');
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                            Posible Recibo de Nómina Re-timbrado
                        </DialogTitle>
                        <DialogDescription>
                            {activeConflictItem?.conflict.message}{' '}
                            {pendingConflicts.length > 1 && (
                                <span className="font-semibold">
                                    (Conflicto 1 de {pendingConflicts.length})
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {activeConflictItem && (
                        <div className="space-y-4 text-sm">
                            <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800">
                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                    Patrón: {activeConflictItem.conflict.new_invoice.issuer_name} (
                                    {activeConflictItem.conflict.new_invoice.issuer_rfc})
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                    Periodo de pago:{' '}
                                    <span className="font-semibold">
                                        {activeConflictItem.conflict.new_invoice.fecha_inicial_pago || 'N/D'} al{' '}
                                        {activeConflictItem.conflict.new_invoice.fecha_final_pago || 'N/D'}
                                    </span>{' '}
                                    · Tipo de Nómina:{' '}
                                    <span className="font-semibold">
                                        {activeConflictItem.conflict.new_invoice.tipo_nomina === 'E'
                                            ? 'Extraordinaria (E)'
                                            : 'Ordinaria (O)'}
                                    </span>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Recibo Existente */}
                                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                                            Recibo actual en sistema
                                        </span>
                                        {!activeConflictItem.conflict.new_invoice.is_newer && (
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                Más reciente
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 font-mono truncate">
                                        UUID: {activeConflictItem.conflict.existing_invoice.uuid}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Timbrado:{' '}
                                        <span className="font-medium">
                                            {formatDateTime(
                                                activeConflictItem.conflict.existing_invoice.fecha_timbrado
                                            )}
                                        </span>
                                    </p>
                                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Percepciones:</span>
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    activeConflictItem.conflict.existing_invoice.total_amount
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Base Gravable:</span>
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    activeConflictItem.conflict.existing_invoice.taxable_amount
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">ISR Retenido:</span>
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    activeConflictItem.conflict.existing_invoice.isr_retenido
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Nuevo Recibo Subido */}
                                <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/10 p-3 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                                            Nuevo XML subido
                                        </span>
                                        {activeConflictItem.conflict.new_invoice.is_newer && (
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                Más reciente
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 font-mono truncate">
                                        UUID: {activeConflictItem.conflict.new_invoice.uuid}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Timbrado:{' '}
                                        <span className="font-medium">
                                            {formatDateTime(
                                                activeConflictItem.conflict.new_invoice.fecha_timbrado
                                            )}
                                        </span>
                                    </p>
                                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Percepciones:</span>
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    activeConflictItem.conflict.new_invoice.total_amount
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Base Gravable:</span>
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    activeConflictItem.conflict.new_invoice.taxable_amount
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">ISR Retenido:</span>
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    activeConflictItem.conflict.new_invoice.isr_retenido
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Cuando una empresa re-timbra un recibo de nómina del mismo periodo, conservar ambos duplicaría tus ingresos e ISR retenido en el simulador anual. ¿Qué deseas hacer?
                            </p>
                        </div>
                    )}

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={resolvingConflict}
                            onClick={() => handleResolveConflict('discard')}
                        >
                            Descartar el nuevo
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={resolvingConflict}
                            onClick={() => handleResolveConflict('keep_both')}
                        >
                            Conservar ambos
                        </Button>
                        <Button
                            type="button"
                            disabled={resolvingConflict}
                            onClick={() => handleResolveConflict('replace')}
                        >
                            Reemplazar el anterior
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
