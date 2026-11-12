export interface PayrollConflictInvoiceSummary {
    id?: number;
    uuid: string;
    issuer_rfc: string;
    issuer_name: string;
    date: string | null;
    fecha_timbrado: string | null;
    fecha_inicial_pago: string | null;
    fecha_final_pago: string | null;
    tipo_nomina: string;
    total_amount: number;
    taxable_amount: number;
    isr_retenido: number;
    is_newer?: boolean;
}

export interface PayrollConflictDetail {
    code: 'PAYROLL_PERIOD_CONFLICT';
    message: string;
    existing_invoice: PayrollConflictInvoiceSummary & { id: number };
    new_invoice: PayrollConflictInvoiceSummary;
}

export class PayrollConflictError extends Error {
    conflict: PayrollConflictDetail;

    constructor(conflict: PayrollConflictDetail) {
        super(conflict.message || 'Conflicto de periodo de nómina');
        this.name = 'PayrollConflictError';
        this.conflict = conflict;
    }
}

export const uploadInvoiceApi = async (url: string, formData: FormData) => {
    const res = await fetch(`${url}/api/invoices/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        if (res.status === 409 && errorData?.detail?.code === 'PAYROLL_PERIOD_CONFLICT') {
            throw new PayrollConflictError(errorData.detail as PayrollConflictDetail);
        }
        const detailMsg = typeof errorData?.detail === 'string'
            ? errorData.detail
            : errorData?.detail?.message || 'Fallo al subir';
        throw new Error(detailMsg);
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
    data: {
        cfdi_use?: string;
        student_curp?: string;
        educational_level?: string;
        apply_to_similar?: boolean;
        remember_for_issuer?: boolean;
        match_keyword?: string;
    }
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

export const fetchIssuerRulesApi = async (url: string) => {
    const res = await fetch(`${url}/api/invoices/issuer-rules`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener reglas por emisor');
    return res.json();
};

export const updateIssuerRuleApi = async (
    url: string,
    ruleId: number,
    data: { student_curp?: string; educational_level?: string; match_keyword?: string; auto_apply?: boolean }
) => {
    const res = await fetch(`${url}/api/invoices/issuer-rules/${ruleId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || 'Error al actualizar regla');
    }
    return res.json();
};

export const deleteIssuerRuleApi = async (url: string, ruleId: number) => {
    const res = await fetch(`${url}/api/invoices/issuer-rules/${ruleId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al eliminar regla');
    return res.json();
};

export const sendAccountantReportApi = async (url: string, email: string, year: number | null) => {
    const res = await fetch(`${url}/api/invoices/send-report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, year }),
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || 'Error al enviar reporte al contador');
    }
    return res.json();
};
