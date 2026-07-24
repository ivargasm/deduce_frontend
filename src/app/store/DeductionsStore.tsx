import { create } from 'zustand';
import { useAuthStore } from './Store';
import { fetchProfileApi, updateProfileApi } from '../lib/api/profiles';
import { fetchInvoicesApi, fetchSummaryApi, deleteInvoiceApi } from '../lib/api/invoices';

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
}

export interface InvoiceSummary {
    total_accumulated: number;
    total_recoverable: number;
    monthly_invoices_count: number;
    monthly_invoices_limit: number;
    limit: number | null;
    percentage: number | null;
    by_category: Record<string, number>;
    simulated_refund: number;
}

export interface UserProfile {
    id: number;
    user_id: number;
    rfc: string | null;
    estimated_annual_income: number | null;
    tax_regime: string | null;
    stripe_customer_id: string | null;
    subscription_status: string;
}

interface DeductionsState {
    invoices: Invoice[];
    summary: InvoiceSummary | null;
    profile: UserProfile | null;
    isUploading: boolean;
    isLoading: boolean;

    setUploading: (status: boolean) => void;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    fetchInvoices: () => Promise<void>;
    fetchSummary: () => Promise<void>;
    deleteInvoice: (id: number) => Promise<void>;
}

export const useDeductionsStore = create<DeductionsState>((set, get) => ({
    invoices: [],
    summary: null,
    profile: null,
    isUploading: false,
    isLoading: false,

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
        const url = useAuthStore.getState().url;
        try {
            const data = await fetchInvoicesApi(url);
            set({ invoices: data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSummary: async () => {
        const url = useAuthStore.getState().url;
        try {
            const data = await fetchSummaryApi(url);
            set({ summary: data });
        } catch (error) {
            console.error(error);
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
    }
}));
