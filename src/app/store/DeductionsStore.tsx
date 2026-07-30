import { create } from 'zustand';
import { useAuthStore } from './Store';
import { fetchProfileApi, updateProfileApi } from '../lib/api/profiles';
import { fetchInvoicesApi, fetchSummaryApi, deleteInvoiceApi, updateInvoiceApi } from '../lib/api/invoices';

export interface Invoice {
    id: number;
    uuid: string;
    issuer_rfc: string;
    issuer_name: string;
    total_amount: number;
    deductible_amount: number;
    cfdi_use: string;
    payment_method: string;
    expense_type: string | null;
    status: string;
    warning_messages: string[] | null;
    date: string;
    created_at: string;
    student_curp?: string | null;
    educational_level?: string | null;
}

export interface InvoiceUpdateData {
    cfdi_use?: string;
    student_curp?: string;
    educational_level?: string;
}

export interface CategorySummary {
    category: string;
    amount: number;
    limit: number | null;
    percentage: number | null;
    is_independent: boolean;
}

export interface InvoiceSummary {
    total_accumulated: number;
    total_recoverable: number;
    monthly_invoices_count: number;
    monthly_invoices_limit: number;
    limit: number | null;
    limit_reason?: string;
    percentage: number | null;
    by_category: Record<string, number>;
    category_details: CategorySummary[];
    simulated_refund: number;
    exact_income?: number;
    exact_retention?: number;
}

export interface UserProfile {
    id: number;
    user_id: number;
    rfc: string | null;
    estimated_annual_income: number | null;
    tax_regime: string | null;
    stripe_customer_id: string | null;
    subscription_status: string;
    prefer_manual_income: boolean;
}

interface DeductionsState {
    invoices: Invoice[];
    summary: InvoiceSummary | null;
    profile: UserProfile | null;
    isUploading: boolean;
    isLoading: boolean;
    selectedYear: number;

    setSelectedYear: (year: number) => void;
    setUploading: (status: boolean) => void;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    fetchInvoices: () => Promise<void>;
    fetchSummary: () => Promise<void>;
    deleteInvoice: (id: number) => Promise<void>;
    updateInvoice: (id: number, data: InvoiceUpdateData) => Promise<void>;
}

export const useDeductionsStore = create<DeductionsState>((set, get) => ({
    invoices: [],
    summary: null,
    profile: null,
    isUploading: false,
    isLoading: false,
    selectedYear: new Date().getFullYear(),

    setSelectedYear: (year) => {
        set({ selectedYear: year });
        // Recargar datos cuando cambie el año
        get().fetchSummary();
        get().fetchInvoices();
    },
    setUploading: (status) => set({ isUploading: status }),

    fetchProfile: async () => {
        const url = useAuthStore.getState().url;
        try {
            const data = await fetchProfileApi(url);
            set({ profile: data });
        } catch (error) {
            console.error(error);
        }
    },

    updateProfile: async (data: Partial<UserProfile>) => {
        const url = useAuthStore.getState().url;
        try {
            const updatedData = await updateProfileApi(url, data);
            set({ profile: updatedData });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    fetchInvoices: async () => {
        set({ isLoading: true });
        try {
            const url = useAuthStore.getState().url;
            const year = get().selectedYear;
            const data = await fetchInvoicesApi(url, year);
            set({ invoices: data });
        } catch (error) {
            console.error('Error fetching invoices', error);
        } finally {
            set({ isLoading: false });
        }
    },
    fetchSummary: async () => {
        try {
            const url = useAuthStore.getState().url;
            const year = get().selectedYear;
            const data = await fetchSummaryApi(url, year);
            set({ summary: data });
        } catch (error) {
            console.error('Error fetching summary', error);
        }
    },

    deleteInvoice: async (id: number) => {
        const url = useAuthStore.getState().url;
        try {
            await deleteInvoiceApi(url, id);
            await get().fetchInvoices();
            await get().fetchSummary();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateInvoice: async (id: number, data: InvoiceUpdateData) => {
        const url = useAuthStore.getState().url;
        try {
            await updateInvoiceApi(url, id, data);
            await get().fetchInvoices();
            await get().fetchSummary();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}));
