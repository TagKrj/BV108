/**
 * API Endpoints Constants
 * Tập trung quản lý tất cả các API endpoints
 */

export const API_VERSION = 'v1';

// Base endpoints
export const BASE_ENDPOINTS = {
    AUTH: '/auth',
    PATIENTS: '/patients',
    ACCOUNTING: '/accounting',
    SERVICES: '/services',
    INVENTORY: '/inventory',
    BUDGET: '/budget',
    ESTIMATES: '/estimates',
    SETTLEMENTS: '/settlements',
    SALARY: '/salary',
    GENERAL_LEDGER: '/general-ledger',
};

// Accounting endpoints
export const ACCOUNTING_ENDPOINTS = {
    RECEIPTS: `${BASE_ENDPOINTS.ACCOUNTING}/receipts`,
    RECEIPT_DETAIL: (id) => `${BASE_ENDPOINTS.ACCOUNTING}/receipts/${id}`,
    ADVANCE_PAYMENT: `${BASE_ENDPOINTS.ACCOUNTING}/advance-payment`,
    COMPLETE_PAYMENT: `${BASE_ENDPOINTS.ACCOUNTING}/complete-payment`,
    DISCHARGE_PAYMENT: `${BASE_ENDPOINTS.ACCOUNTING}/discharge-payment`,
    STATISTICS: `${BASE_ENDPOINTS.ACCOUNTING}/statistics`,
    REVENUE_REPORT: `${BASE_ENDPOINTS.ACCOUNTING}/reports/revenue`,
};

// Auth endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: `${BASE_ENDPOINTS.AUTH}/login`,
    LOGOUT: `${BASE_ENDPOINTS.AUTH}/logout`,
    REFRESH_TOKEN: `${BASE_ENDPOINTS.AUTH}/refresh`,
    PROFILE: `${BASE_ENDPOINTS.AUTH}/profile`,
};

// Patient endpoints
export const PATIENT_ENDPOINTS = {
    LIST: BASE_ENDPOINTS.PATIENTS,
    DETAIL: (id) => `${BASE_ENDPOINTS.PATIENTS}/${id}`,
    SEARCH: `${BASE_ENDPOINTS.PATIENTS}/search`,
};

// Service endpoints
export const SERVICE_ENDPOINTS = {
    LIST: BASE_ENDPOINTS.SERVICES,
    DETAIL: (code) => `${BASE_ENDPOINTS.SERVICES}/${code}`,
    SEARCH: `${BASE_ENDPOINTS.SERVICES}/search`,
};

export default {
    BASE_ENDPOINTS,
    ACCOUNTING_ENDPOINTS,
    AUTH_ENDPOINTS,
    PATIENT_ENDPOINTS,
    SERVICE_ENDPOINTS,
};
