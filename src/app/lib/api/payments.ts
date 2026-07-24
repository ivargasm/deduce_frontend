export const createCheckoutSessionApi = async (url: string, interval: 'monthly' | 'annual' = 'monthly'): Promise<{ url: string }> => {
    const response = await fetch(`${url}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ interval }),
    });

    if (!response.ok) {
        throw new Error('No se pudo crear la sesión de pago');
    }

    return await response.json();
};

export const createPortalSessionApi = async (url: string): Promise<{ url: string }> => {
    const response = await fetch(`${url}/api/payments/portal`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('No se pudo abrir el portal de pagos');
    }

    return await response.json();
};
