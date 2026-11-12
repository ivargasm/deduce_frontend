import { create } from 'zustand';
import { useAuthStore } from './Store';
import { fetchProfileApi, updateProfileApi } from '../lib/api/profiles';
import {
    fetchInvoicesApi,
    fetchSummaryApi,
    deleteInvoiceApi,
    bulkDeleteInvoicesApi,
    updateInvoiceApi,
    fetchIssuerRulesApi,
    updateIssuerRuleApi,
    deleteIssuerRuleApi,
} from '../lib/api/invoices';

export interface Invoice {
    id: number;
    uuid: string;
    issuer_rfc: string;
    issuer_name: string;
    total_amount: number;
    deductible_amount: number;
    taxable_amount?: number | null;
    cfdi_use: string;
    payment_method: string;
    expense_type: string | null;
    status: string;
    warning_messages: string[] | null;
    invoice_type?: string;
    date: string;
    created_at: string;
    student_curp?: string | null;
    educational_level?: string | null;
    isr_retenido?: number;
    fecha_inicial_pago?: string | null;
    fecha_final_pago?: string | null;
    tipo_nomina?: string | null;
    fecha_timbrado?: string | null;
}

export interface InvoiceUpdateData {
    cfdi_use?: string;
    student_curp?: string;
    educational_level?: string;
    apply_to_similar?: boolean;
    remember_for_issuer?: boolean;
    match_keyword?: string;
}

export interface InvoiceUpdateResult extends Invoice {
    updated_similar_count?: number;
    rule_saved?: boolean;
}

export interface UserIssuerRule {
    id: number;
    issuer_rfc: string;
    issuer_name?: string | null;
    cfdi_use: string;
    student_curp?: string | null;
    educational_level?: string | null;
    match_keyword?: string | null;
    auto_apply: boolean;
}

export interface CategorySummaryBreakdown {
    label: string;
    amount: number;
    limit?: number | null;
}

export interface CategorySummary {
    category: string;
    amount: number;
    limit: number | null;
    percentage: number | null;
    is_independent: boolean;
    student_curp?: string | null;
    breakdown?: CategorySummaryBreakdown[] | null;
    limit_note?: string | null;
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
    deductions_tax_savings?: number;
    exact_income?: number;
    exact_taxable_income?: number;
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
    issuerRules: UserIssuerRule[];
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
    fetchIssuerRules: () => Promise<void>;
    updateIssuerRule: (id: number, data: { student_curp?: string; educational_level?: string; match_keyword?: string; auto_apply?: boolean }) => Promise<void>;
    deleteIssuerRule: (id: number) => Promise<void>;
    deleteInvoice: (id: number) => Promise<void>;
    bulkDeleteInvoices: (ids: number[]) => Promise<number>;
    updateInvoice: (id: number, data: InvoiceUpdateData) => Promise<InvoiceUpdateResult>;
}

export const useDeductionsStore = create<DeductionsState>((set, get) => ({
    invoices: [],
    issuerRules: [],
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

    bulkDeleteInvoices: async (ids: number[]) => {
        const url = useAuthStore.getState().url;
        try {
            const res = await bulkDeleteInvoicesApi(url, ids);
            await get().fetchInvoices();
            await get().fetchSummary();
            return res.deleted_count;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    fetchIssuerRules: async () => {
        try {
            const url = useAuthStore.getState().url;
            const data = await fetchIssuerRulesApi(url);
            set({ issuerRules: data });
        } catch (error) {
            console.error('Error fetching issuer rules', error);
        }
    },

    updateIssuerRule: async (id, data) => {
        const url = useAuthStore.getState().url;
        await updateIssuerRuleApi(url, id, data);
        await get().fetchIssuerRules();
    },

    deleteIssuerRule: async (id) => {
        const url = useAuthStore.getState().url;
        await deleteIssuerRuleApi(url, id);
        await get().fetchIssuerRules();
    },

    updateInvoice: async (id: number, data: InvoiceUpdateData) => {
        const url = useAuthStore.getState().url;
        try {
            const result: InvoiceUpdateResult = await updateInvoiceApi(url, id, data);
            await get().fetchInvoices();
            await get().fetchSummary();
            if (result?.rule_saved) {
                await get().fetchIssuerRules();
            }
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}));
