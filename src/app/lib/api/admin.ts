export const fetchAdminUsersApi = async (url: string) => {
    const res = await fetch(`${url}/api/admin/users`, {
        credentials: "include"
    });
    if (!res.ok) throw new Error('Error al obtener usuarios');
    return res.json();
};

export const fetchAdminFiscalYearsApi = async (url: string) => {
    const res = await fetch(`${url}/api/admin/fiscal-years`, {
        credentials: "include"
    });
    if (!res.ok) throw new Error('Error al obtener años fiscales');
    return res.json();
};

export const fetchAdminDeductionLimitsApi = async (url: string) => {
    const res = await fetch(`${url}/api/admin/deduction-limits`, {
        credentials: "include"
    });
    if (!res.ok) throw new Error('Error al obtener límites de deducción');
    return res.json();
};

export const updateAdminUserSubscriptionApi = async (url: string, userId: number, newStatus: string) => {
    const res = await fetch(`${url}/api/admin/users/${userId}/subscription`, {
        method: "PUT",
        credentials: "include",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ subscription_status: newStatus })
    });
    if (!res.ok) throw new Error('Error al actualizar suscripción');
    return res.json();
};

export const updateAdminFiscalYearApi = async (url: string, year: number, newValue: number) => {
    const res = await fetch(`${url}/api/admin/fiscal-years/${year}`, {
        method: "PUT",
        credentials: "include",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ uma_annual_value: newValue })
    });
    if (!res.ok) throw new Error('Error al actualizar UMA');
    return res.json();
};

export const createAdminFiscalYearApi = async (
    url: string,
    year: number,
    uma_annual_value: number,
    copy_brackets_from_year?: number | null
) => {
    const res = await fetch(`${url}/api/admin/fiscal-years`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            year,
            uma_annual_value,
            copy_brackets_from_year: copy_brackets_from_year ?? null,
        })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || 'Error al crear año fiscal');
    }
    return res.json();
};

export const deleteAdminFiscalYearApi = async (url: string, year: number) => {
    const res = await fetch(`${url}/api/admin/fiscal-years/${year}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || 'Error al eliminar año fiscal');
    }
    return res.json();
};

export const copyAdminTaxBracketsApi = async (
    url: string,
    source_year: number,
    target_year: number,
    overwrite = false
) => {
    const res = await fetch(`${url}/api/admin/tax-brackets/copy`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_year, target_year, overwrite })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || 'Error al copiar tabla ISR');
    }
    return res.json();
};

export const fetchAdminTaxBracketsApi = async (url: string, year?: number) => {
    const query = year ? `?year=${year}` : '';
    const res = await fetch(`${url}/api/admin/tax-brackets${query}`, {
        credentials: "include"
    });
    if (!res.ok) throw new Error('Error al obtener rangos de ISR');
    return res.json();
};

export const createAdminTaxBracketApi = async (
    url: string, 
    data: { year: number; lower_limit: number; upper_limit: number | null; fixed_fee: number; tax_rate: number }
) => {
    const res = await fetch(`${url}/api/admin/tax-brackets`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear rango de ISR');
    return res.json();
};

export const updateAdminTaxBracketApi = async (url: string, bracketId: number, data: Record<string, number | null>) => {
    const res = await fetch(`${url}/api/admin/tax-brackets/${bracketId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar rango de ISR');
    return res.json();
};

export const deleteAdminTaxBracketApi = async (url: string, bracketId: number) => {
    const res = await fetch(`${url}/api/admin/tax-brackets/${bracketId}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || 'Error al eliminar rango de ISR');
    }
    return res.json();
};

export interface DeductionLimitPayload {
    categoria: string;
    tipo_limite: string;
    monto_fijo: number | null;
    porcentaje: number | null;
    cuenta_para_tope_global: boolean;
    fuente_legal?: string | null;
}

export const createAdminDeductionLimitApi = async (url: string, data: DeductionLimitPayload) => {
    const res = await fetch(`${url}/api/admin/deduction-limits`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || 'Error al crear límite de deducción');
    }
    return res.json();
};

export const seedAdminDeductionLimitsApi = async (url: string) => {
    const res = await fetch(`${url}/api/admin/deduction-limits/seed`, {
        method: "POST",
        credentials: "include"
    });
    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || 'Error al cargar límites oficiales del SAT');
    }
    return res.json();
};

export const updateAdminDeductionLimitApi = async (url: string, limitId: number, data: Record<string, number | boolean | string | null>) => {
    const res = await fetch(`${url}/api/admin/deduction-limits/${limitId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar límite de deducción');
    return res.json();
};

export const deleteAdminDeductionLimitApi = async (url: string, limitId: number) => {
    const res = await fetch(`${url}/api/admin/deduction-limits/${limitId}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!res.ok) throw new Error('Error al eliminar límite de deducción');
    return res.json();
};

