export const uploadInvoiceApi = async (url: string, formData: FormData) => {
    const res = await fetch(`${url}/api/invoices/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || 'Fallo al subir');
    }
    return res.json();
};

export const fetchInvoicesApi = async (url: string) => {
    const res = await fetch(`${url}/api/invoices/`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener facturas');
    return res.json();
};

export const fetchSummaryApi = async (url: string) => {
    const res = await fetch(`${url}/api/invoices/summary`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener resumen');
    return res.json();
};

export const exportInvoicesApi = async (url: string) => {
    const res = await fetch(`${url}/api/invoices/export`, {
        method: 'GET',
        credentials: 'include',
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || 'Error al exportar facturas');
    }
    
    // Obtener el blob del archivo
    const blob = await res.blob();
    return blob;
};

export const deleteInvoiceApi = async (url: string, invoiceId: number) => {
    const res = await fetch(`${url}/api/invoices/${invoiceId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al eliminar factura');
    return res.json();
};
