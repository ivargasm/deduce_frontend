'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import JSZip from 'jszip';
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
import { AlertTriangle, CloudUpload, FileType, Crown, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface UploadZoneProps {
    compact?: boolean;
    children?: React.ReactNode;
}

interface PendingPayrollConflict {
    file: File;
    conflict: PayrollConflictDetail;
}

interface QuotaExceededModalData {
    isOpen: boolean;
    filesCount: number;
    currentCount: number;
    monthlyLimit: number;
    omittedCount: number;
}

interface QuotaPartialModalData {
    isOpen: boolean;
    filesToUpload: File[];
    availableQuota: number;
    currentCount: number;
    monthlyLimit: number;
    omittedPayments: number;
    omittedS01: number;
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

const DEDUCTIBLE_KEYWORDS_HINTS = [
    // Medico / Salud
    'medico', 'médico', 'consulta', 'hospital', 'dental', 'dentista', 'laboratorio', 'psicolog',
    'nutriolog', 'lentes', 'oftalmol', 'farmacia', 'medicamento', 'clinico', 'clínico', 'analisis',
    'análisis', 'radiografia', 'radiografía', 'ultrasonido', 'honorarios medicos',
    // Educativo / Colegiaturas
    'colegiatura', 'inscripcion', 'inscripción', 'reinscripcion', 'reinscripción', 'mensualidad',
    'primaria', 'secundaria', 'preescolar', 'kinder', 'maternal', 'bachillerato', 'preparatoria',
    'colegio', 'instituto', 'ensenanza', 'enseñanza', 'educacion', 'educación',
    // Funerales
    'funeraria', 'funerario', 'inhumacion', 'inhumación', 'cremacion', 'cremación', 'ataud', 'ataúd', 'velatorio', 'sepelio',
    // Retiro
    'afore', 'retiro', 'ppr', 'pension', 'pensión',
    // Seguros
    'poliza', 'póliza', 'gastos medicos', 'gastos médicos',
];

export default function UploadZone({ compact = false, children }: UploadZoneProps) {
    const router = useRouter();
    const [dragActive, setDragActive] = useState(false);
    const [pendingConflicts, setPendingConflicts] = useState<PendingPayrollConflict[]>([]);
    const [resolvingConflict, setResolvingConflict] = useState(false);
    const [omitNonDeductibleS01, setOmitNonDeductibleS01] = useState(true);
    const [quotaExceededModal, setQuotaExceededModal] = useState<QuotaExceededModalData | null>(null);
    const [quotaPartialModal, setQuotaPartialModal] = useState<QuotaPartialModalData | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { isUploading, setUploading, fetchInvoices, fetchSummary, summary, profile } = useDeductionsStore();
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

    const executeUpload = async (
        files: File[],
        omittedPayments: number,
        omittedS01: number,
        skippedBecauseOfQuota: number = 0
    ) => {
        setUploading(true);
        let successCount = 0;
        let duplicateCount = 0;
        let quotaExceededDuringUpload = false;
        const detectedConflicts: PendingPayrollConflict[] = [];

        for (const file of files) {
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

                // Si el backend detectó complemento de pago
                if (errorMessage.includes('complemento para recepción de pagos') || errorMessage.includes('CP01')) {
                    omittedPayments++;
                    continue;
                }

                // Si la factura ya fue subida anteriormente (duplicado)
                if (errorMessage.includes('ya fue subida anteriormente')) {
                    duplicateCount++;
                    continue;
                }

                // Si alcanzó el límite del plan mensual (402)
                if (errorMessage.includes('límite mensual')) {
                    quotaExceededDuringUpload = true;
                    break;
                }

                toast.error(`Error en ${file.name}: ${errorMessage}`);
            }
        }

        if (successCount > 0) {
            toast.success(`Se procesaron ${successCount} factura${successCount > 1 ? 's' : ''} correctamente.`);
            await fetchInvoices();
            await fetchSummary();
        }

        if (duplicateCount > 0) {
            toast.info(
                `${duplicateCount} factura${duplicateCount > 1 ? 's' : ''} ya estaba${duplicateCount > 1 ? 'n' : ''} registrada${duplicateCount > 1 ? 's' : ''} previamente en tu cuenta.`
            );
        }

        if (quotaExceededDuringUpload) {
            toast.error('Se detuvo la carga al alcanzar el límite mensual de tu Plan Free. Mejora a Premium para subir facturas ilimitadas.');
        }

        if (skippedBecauseOfQuota > 0) {
            toast.warning(`Se omitieron ${skippedBecauseOfQuota} factura${skippedBecauseOfQuota > 1 ? 's' : ''} que excedían el límite disponible de tu Plan Free.`);
        }

        if (omittedPayments > 0 || omittedS01 > 0) {
            const reasons: string[] = [];
            if (omittedPayments > 0) {
                reasons.push(`${omittedPayments} complemento${omittedPayments > 1 ? 's' : ''} de pago (CP01)`);
            }
            if (omittedS01 > 0) {
                reasons.push(`${omittedS01} factura${omittedS01 > 1 ? 's' : ''} S01 sin deducciones personales`);
            }
            toast.info(`Se omitieron automáticamente ${reasons.join(' y ')} sin consumir tu cuota mensual.`);
        }

        if (detectedConflicts.length > 0) {
            setPendingConflicts(prev => [...prev, ...detectedConflicts]);
        }

        setUploading(false);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const processFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploading(true);

        // 1. Extraer archivos XML directos y descomprimir archivos .ZIP
        const rawFiles = Array.from(files);
        const xmlFiles: File[] = [];

        for (const f of rawFiles) {
            const lowerName = f.name.toLowerCase();
            if (lowerName.endsWith('.xml')) {
                xmlFiles.push(f);
            } else if (lowerName.endsWith('.zip')) {
                try {
                    const zip = await JSZip.loadAsync(f);
                    const entries = Object.keys(zip.files);
                    for (const entryName of entries) {
                        const entry = zip.files[entryName];
                        if (entry.dir || entryName.startsWith('__MACOSX') || entryName.includes('/.')) {
                            continue;
                        }
                        if (entryName.toLowerCase().endsWith('.xml')) {
                            const blob = await entry.async('blob');
                            const cleanName = entryName.split('/').pop() || entryName;
                            xmlFiles.push(new File([blob], cleanName, { type: 'text/xml' }));
                        }
                    }
                } catch (zipErr) {
                    console.error('Error desempacando archivo ZIP:', zipErr);
                    toast.error(`No se pudo leer el archivo ZIP ${f.name}`);
                }
            }
        }

        if (xmlFiles.length === 0) {
            toast.error('No se encontraron archivos XML (.xml o .zip del SAT).');
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
            return;
        }

        // 2. Pre-filtrado inteligente de complementos de pago (CP01) y facturas S01 sin indicios deducibles
        let omittedPaymentsCount = 0;
        let omittedS01Count = 0;
        const filesToUpload: File[] = [];

        for (const file of xmlFiles) {
            let xmlText = '';
            try {
                xmlText = await file.text();
            } catch {
                filesToUpload.push(file);
                continue;
            }

            // Omitir complementos para recepción de pagos (Tipo P o CP01)
            const isPagoComplement =
                /TipoDeComprobante\s*=\s*["']P["']/i.test(xmlText) ||
                /UsoCFDI\s*=\s*["']CP01["']/i.test(xmlText);
            if (isPagoComplement) {
                omittedPaymentsCount++;
                continue;
            }

            // Si está activo el filtro de omitir S01
            if (omitNonDeductibleS01) {
                const isS01 = /UsoCFDI\s*=\s*["']S01["']/i.test(xmlText);
                if (isS01) {
                    const lowerText = xmlText.toLowerCase();
                    const hasDeductibleHint = DEDUCTIBLE_KEYWORDS_HINTS.some(kw => lowerText.includes(kw));
                    if (!hasDeductibleHint) {
                        omittedS01Count++;
                        continue;
                    }
                }
            }

            // Facturas G03 NUNCA se omiten (siempre se analizan para detectar posibles deducciones mal clasificadas)
            filesToUpload.push(file);
        }

        // Si todos los archivos fueron omitidos por los filtros inteligentes
        if (filesToUpload.length === 0) {
            setUploading(false);
            if (omittedPaymentsCount > 0 || omittedS01Count > 0) {
                const reasons: string[] = [];
                if (omittedPaymentsCount > 0) {
                    reasons.push(`${omittedPaymentsCount} complemento${omittedPaymentsCount > 1 ? 's' : ''} de pago (CP01)`);
                }
                if (omittedS01Count > 0) {
                    reasons.push(`${omittedS01Count} factura${omittedS01Count > 1 ? 's' : ''} S01 sin deducciones personales`);
                }
                toast.info(`Se omitieron automáticamente ${reasons.join(' y ')} sin consumir tu cuota mensual.`);
            } else {
                toast.warning('No se encontraron facturas válidas para subir.');
            }
            if (inputRef.current) inputRef.current.value = '';
            return;
        }

        // 3. Validación de Cuota y Plan Free vs Premium
        const isPremium = profile?.subscription_status === 'premium' || summary?.monthly_invoices_limit === -1;
        const monthlyLimit = summary?.monthly_invoices_limit && summary.monthly_invoices_limit > 0
            ? summary.monthly_invoices_limit
            : 30;
        const currentCount = summary?.monthly_invoices_count ?? 0;
        const availableQuota = isPremium ? Infinity : Math.max(0, monthlyLimit - currentCount);

        // Caso A: La cuota mensual ya está totalmente agotada
        if (!isPremium && availableQuota <= 0) {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
            setQuotaExceededModal({
                isOpen: true,
                filesCount: filesToUpload.length,
                currentCount,
                monthlyLimit,
                omittedCount: omittedPaymentsCount + omittedS01Count,
            });
            return;
        }

        // Caso B: El archivo trae más facturas válidas que la cuota disponible restante
        if (!isPremium && filesToUpload.length > availableQuota) {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
            setQuotaPartialModal({
                isOpen: true,
                filesToUpload,
                availableQuota,
                currentCount,
                monthlyLimit,
                omittedPayments: omittedPaymentsCount,
                omittedS01: omittedS01Count,
            });
            return;
        }

        // Caso C: Dentro de cuota o usuario Premium
        await executeUpload(filesToUpload, omittedPaymentsCount, omittedS01Count, 0);
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
        <div className="w-full h-full flex flex-col justify-between gap-3">
            <div
                className={children ? `relative w-full flex-1 flex flex-col cursor-pointer group ${dragActive ? 'bg-primary/5 rounded-xl border-2 border-primary border-dashed' : ''}` : `relative flex flex-col items-center justify-center w-full ${compact ? 'py-4 min-h-32' : 'h-64'} border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out cursor-pointer ${compact ? 'border-transparent bg-transparent hover:border-slate-600' : (dragActive ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500 dark:hover:bg-gray-700')}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                {children ? (
                    <div className="w-full h-full flex flex-col flex-1 pointer-events-none">
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
                                <p className="text-xs text-gray-500 dark:text-gray-400">Archivos XML (CFDI 4.0) o archivos .ZIP del SAT</p>
                            </>
                        )}
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".xml,.zip"
                    multiple
                    onChange={handleChange}
                    disabled={isUploading}
                />
            </div>

            {/* Panel de Filtro Inteligente Informativo */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-2 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={omitNonDeductibleS01}
                            onChange={(e) => setOmitNonDeductibleS01(e.target.checked)}
                            className="rounded border-slate-300 text-[var(--color-deduce-teal)] focus:ring-[var(--color-deduce-teal)] w-4 h-4 cursor-pointer"
                        />
                        <span>Omitir facturas S01 sin efectos fiscales (recomendado)</span>
                    </label>
                    {profile?.subscription_status !== 'premium' && summary?.monthly_invoices_limit && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-full tabular-nums">
                            Cuota: {summary.monthly_invoices_count || 0} / {summary.monthly_invoices_limit} facturas
                        </span>
                    )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                    {omitNonDeductibleS01 ? (
                        <>
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Filtro inteligente activo:</span> Se omitirán complementos de pago (CP01) y facturas S01 sin conceptos deducibles para ahorrar tu cuota mensual. Las facturas <b>G03</b> y cualquier gasto con palabras clave de salud o colegiaturas <b>siempre se procesarán</b> para que puedas pedir su corrección al emisor.
                        </>
                    ) : (
                        <>
                            <span className="font-semibold text-amber-700 dark:text-amber-400">Filtro desactivado:</span> Se procesarán absolutamente todas las facturas XML que subas, consumiendo tu cuota mensual.
                        </>
                    )}
                </p>
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

            {/* Modal: Límite Excedido (0 cuota disponible) */}
            <Dialog
                open={!!quotaExceededModal?.isOpen}
                onOpenChange={(open) => {
                    if (!open) setQuotaExceededModal(null);
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base text-slate-900 dark:text-slate-100">
                                    Límite mensual alcanzado
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Plan Free ({quotaExceededModal?.currentCount || 0} / {quotaExceededModal?.monthlyLimit || 30} facturas procesadas este mes)
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-3 text-sm py-2">
                        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-900 dark:text-amber-200 text-xs leading-relaxed space-y-1.5">
                            <p className="font-semibold text-amber-950 dark:text-amber-100">
                                Has consumido tu cuota mensual de {quotaExceededModal?.monthlyLimit || 30} facturas.
                            </p>
                            <p>
                                Detectamos <b>{quotaExceededModal?.filesCount} facturas válidas</b> en tu archivo que no pueden cargarse en este momento sin actualizar tu plan.
                            </p>
                            {(quotaExceededModal?.omittedCount ?? 0) > 0 && (
                                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                                    (Adicionalmente se omitieron {quotaExceededModal?.omittedCount} comprobantes o complementos no deducibles).
                                </p>
                            )}
                        </div>

                        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                            <p className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <Crown className="w-4 h-4 text-amber-500" />
                                ¿Qué obtienes con el Plan Premium?
                            </p>
                            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                                <li>Subida de <b>facturas XML ilimitadas</b></li>
                                <li>Lectura automática de <b>Recibos de Nómina</b> y <b>Constancias de Retención</b></li>
                                <li>Simulador y desglose de saldo a favor ISR en tiempo real</li>
                            </ul>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setQuotaExceededModal(null)}
                        >
                            Cerrar
                        </Button>
                        <Button
                            type="button"
                            className="bg-[var(--color-deduce-teal)] hover:bg-[var(--color-deduce-teal)]/90 text-white font-medium flex items-center gap-1.5"
                            onClick={() => {
                                setQuotaExceededModal(null);
                                router.push('/dashboard/billing');
                            }}
                        >
                            <Crown className="w-4 h-4" />
                            Mejorar a Plan Premium
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal: Archivo supera cuota restante (ej. 50 facturas en zip y 5 disponibles) */}
            <Dialog
                open={!!quotaPartialModal?.isOpen}
                onOpenChange={(open) => {
                    if (!open) setQuotaPartialModal(null);
                }}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base text-slate-900 dark:text-slate-100">
                                    Límite de facturas en archivo ZIP
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Tu archivo contiene más facturas que tu cuota disponible este mes
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-3 text-sm py-2">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-xs">
                            <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                                <span>Facturas válidas detectadas en ZIP:</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                    {quotaPartialModal?.filesToUpload.length} facturas
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                                <span>Cuota disponible en tu Plan Free:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                    {quotaPartialModal?.availableQuota} factura{(quotaPartialModal?.availableQuota ?? 0) > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                                Has utilizado {quotaPartialModal?.currentCount} de {quotaPartialModal?.monthlyLimit} facturas permitidas este mes.
                            </div>
                        </div>

                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            ¿Cómo deseas procesar tu archivo?
                        </p>

                        <div className="grid gap-2.5">
                            {/* Opción 1: Premium (Recomendado) */}
                            <button
                                type="button"
                                onClick={() => {
                                    setQuotaPartialModal(null);
                                    router.push('/dashboard/billing');
                                }}
                                className="w-full text-left p-3.5 rounded-xl border-2 border-emerald-500/50 hover:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 transition-all flex items-start gap-3 group cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <Crown className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                                            👑 Mejorar a Plan Premium (Recomendado)
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                                            Sin límites
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                                        Carga las <b>{quotaPartialModal?.filesToUpload.length} facturas completas</b> de tu ZIP de inmediato sin esperas ni límites mensuales.
                                    </p>
                                </div>
                            </button>

                            {/* Opción 2: Subir solo las permitidas */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (!quotaPartialModal) return;
                                    const modalData = quotaPartialModal;
                                    setQuotaPartialModal(null);
                                    const partialFiles = modalData.filesToUpload.slice(0, modalData.availableQuota);
                                    const skipped = modalData.filesToUpload.length - modalData.availableQuota;
                                    executeUpload(partialFiles, modalData.omittedPayments, modalData.omittedS01, skipped);
                                }}
                                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 transition-all flex items-start gap-3 group cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                                        Subir solo las primeras {quotaPartialModal?.availableQuota} facturas disponibles
                                    </span>
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        Se agotará tu cuota de este mes. Las restantes <b>{((quotaPartialModal?.filesToUpload.length ?? 0) - (quotaPartialModal?.availableQuota ?? 0))} facturas se omitirán</b>.
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setQuotaPartialModal(null)}
                        >
                            Cancelar carga
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
