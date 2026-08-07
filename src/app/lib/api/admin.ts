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

export const createAdminFiscalYearApi = async (url: string, year: number, uma_annual_value: number) => {
    const res = await fetch(`${url}/api/admin/fiscal-years`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, uma_annual_value })
    });
    if (!res.ok) throw new Error('Error al crear año fiscal');
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

export const updateAdminDeductionLimitApi = async (url: string, limitId: number, data: Record<string, number | null>) => {
    const res = await fetch(`${url}/api/admin/deduction-limits/${limitId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar límite de deducción');
    return res.json();
};

