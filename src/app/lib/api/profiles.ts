export const fetchProfileApi = async (url: string) => {
    const res = await fetch(`${url}/api/profiles/me`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener perfil');
    return res.json();
};

export const updateProfileApi = async (url: string, data: unknown) => {
    const res = await fetch(`${url}/api/profiles/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar perfil');
    return res.json();
};
