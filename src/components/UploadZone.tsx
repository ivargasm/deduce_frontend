'use client';

import { useState, useRef } from 'react';
import { useDeductionsStore } from '@/app/store/DeductionsStore';
import { useAuthStore } from '@/app/store/Store';
import { uploadInvoiceApi } from '@/app/lib/api/invoices';
import { CloudUpload, FileType } from 'lucide-react';
import { toast } from 'sonner';

interface UploadZoneProps {
    compact?: boolean;
    children?: React.ReactNode;
}

export default function UploadZone({ compact = false, children }: UploadZoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { isUploading, setUploading, fetchInvoices, fetchSummary } = useDeductionsStore();
    const url = useAuthStore(state => state.url);

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

        for (const file of xmlFiles) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                await uploadInvoiceApi(url, formData);
                successCount++;
            } catch (error: unknown) {
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

        setUploading(false);
        if (inputRef.current) {
            inputRef.current.value = '';
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
        </div>
    );
}
