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

export const fetchInvoicesApi = async (url: string, year?: number) => {
    const res = await fetch(`${url}/api/invoices/${year ? `?year=${year}` : ''}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener facturas');
    return res.json();
};

export const fetchSummaryApi = async (url: string, year?: number) => {
    const res = await fetch(`${url}/api/invoices/summary${year ? `?year=${year}` : ''}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener resumen');
    return res.json();
};

export const exportInvoicesApi = async (url: string, year?: number) => {
    const res = await fetch(`${url}/api/invoices/export${year ? `?year=${year}` : ''}`, {
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

export const updateInvoiceApi = async (
    url: string, 
    invoiceId: number, 
    data: { cfdi_use?: string; student_curp?: string; educational_level?: string }
) => {
    const res = await fetch(`${url}/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || 'Error al actualizar factura');
    }
    return res.json();
};
