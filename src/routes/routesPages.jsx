import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/dashboard';
import BudgetPage from '../pages/budget';
import EstimatesPage from '../pages/estimates';
import SettlementsPage from '../pages/settlements';
import AccountingPage from '../pages/accounting';
import SalaryPage from '../pages/salary';
import InventoryPage from '../pages/inventory';
import GeneralLedgerPage from '../pages/general-ledger';
import Login from '../pages/login';

// Không cần component ProtectedRoute ở đây nữa vì đã xử lý ở cấp cao hơn trong App.jsx

const AppRoutes = ({ onNavigate }) => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage onNavigate={onNavigate} />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/estimates" element={<EstimatesPage />} />
            <Route path="/settlements" element={<SettlementsPage />} />
            <Route path="/accounting" element={<AccountingPage />} />
            <Route path="/salary" element={<SalaryPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/general-ledger" element={<GeneralLedgerPage />} />
        </Routes>
    );
};

export default AppRoutes;
