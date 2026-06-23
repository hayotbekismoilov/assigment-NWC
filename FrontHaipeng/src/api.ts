const API_BASE = 'https://api.haipeng.uz/api';

function getToken(): string | null {
    try {
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
            const data = JSON.parse(stored);
            return data.state?.token || null;
        }
    } catch { /* ignore */ }
    return null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Xatolik yuz berdi' }));
        throw new Error(err.detail || `HTTP ${res.status}`);
    }

    return res.json();
}

// ===== AUTH =====
export const api = {
    auth: {
        login: (username: string, password: string) =>
            request<{ access_token: string; user: { id: number; username: string; role: string; full_name: string } }>(
                '/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }
            ),
        me: () => request<{ id: number; username: string; role: string }>('/auth/me'),
    },

    // ===== PRODUCTS =====
    products: {
        list: (params?: Record<string, string | number | boolean>) => {
            const query = params ? '?' + new URLSearchParams(
                Object.entries(params).reduce((acc, [k, v]) => { if (v !== undefined && v !== null) acc[k] = String(v); return acc; }, {} as Record<string, string>)
            ).toString() : '';
            return request<{ total: number; items: any[] }>(`/products${query}`);
        },
        get: (id: string) => request<{ product: any; related: any[] }>(`/products/${id}`),
        create: (data: any) => request<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<any>(`/products/${id}`, { method: 'DELETE' }),
    },

    // ===== CATEGORIES =====
    categories: {
        list: () => request<any[]>('/categories'),
        get: (id: string) => request<any>(`/categories/${id}`),
        create: (data: any) => request<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<any>(`/categories/${id}`, { method: 'DELETE' }),
    },

    // ===== ORDERS =====
    orders: {
        create: (data: any) => request<{ success: boolean; order_number: string; message: string }>(
            '/orders', { method: 'POST', body: JSON.stringify(data) }
        ),
        list: (params?: Record<string, string | number>) => {
            const query = params ? '?' + new URLSearchParams(
                Object.entries(params).reduce((acc, [k, v]) => { if (v !== undefined) acc[k] = String(v); return acc; }, {} as Record<string, string>)
            ).toString() : '';
            return request<{ total: number; items: any[] }>(`/orders${query}`);
        },
        get: (id: number) => request<any>(`/orders/${id}`),
        updateStatus: (id: number, status: string) =>
            request<any>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    },

    // ===== USERS =====
    users: {
        list: (params?: Record<string, string | number>) => {
            const query = params ? '?' + new URLSearchParams(
                Object.entries(params).reduce((acc, [k, v]) => { if (v !== undefined) acc[k] = String(v); return acc; }, {} as Record<string, string>)
            ).toString() : '';
            return request<{ total: number; items: any[] }>(`/users${query}`);
        },
        delete: (id: number) => request<any>(`/users/${id}`, { method: 'DELETE' }),
    },

    // ===== DASHBOARD =====
    dashboard: {
        stats: () => request<any>('/dashboard/stats'),
    },

    // ===== UPLOAD =====
    upload: {
        image: async (file: File): Promise<{ filename: string; url: string }> => {
            const token = getToken();
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({ detail: 'Upload xatolik' }));
                throw new Error(err.detail || 'Upload xatolik');
            }
            const data = await res.json();
            return { filename: data.filename, url: `${API_BASE}/upload/files/${data.filename}` };
        },
        multiple: async (files: File[]): Promise<{ filename: string; url: string }[]> => {
            const token = getToken();
            const formData = new FormData();
            files.forEach(f => formData.append('files', f));
            const res = await fetch(`${API_BASE}/upload/multiple`, {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({ detail: 'Upload xatolik' }));
                throw new Error(err.detail || 'Upload xatolik');
            }
            const data = await res.json();
            return (data.files || []).map((f: any) => ({
                filename: f.filename,
                url: `${API_BASE}/upload/files/${f.filename}`,
            }));
        },
    },

    // ===== SLIDES =====
    slides: {
        list: () => request<any[]>('/slides'),
        listAll: () => request<any[]>('/slides/all'),
        create: (data: any) => request<any>('/slides', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: number, data: any) => request<any>(`/slides/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: number) => request<any>(`/slides/${id}`, { method: 'DELETE' }),
    },

    // ===== SETTINGS =====
    settings: {
        getTelegram: () => request<{ bot_token: string; channel_id: string }>('/settings/telegram'),
        saveTelegram: (data: { bot_token: string; channel_id: string }) =>
            request<any>('/settings/telegram', { method: 'PUT', body: JSON.stringify(data) }),
        testTelegram: () => request<any>('/settings/telegram/test', { method: 'POST' }),
    },
};
