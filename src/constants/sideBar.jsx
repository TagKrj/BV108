// Menu items for sidebar navigation
export const menuItems = [
    {
        id: 1,
        label: 'Kế toán viện phí',
        icon: 'fa-calculator',
        path: '/accounting',
        hasNotification: true,
    },
    {
        id: 2,
        label: 'Nhóm dịch vụ',
        icon: 'fa-chart-bar',
        path: '/estimates',
    },
    // {
    //     id: 3,
    //     label: 'Quyết toán',
    //     icon: 'fa-wallet',
    //     path: '/settlements',
    // },
    {
        id: 4,
        label: 'Dịch vụ',
        icon: 'fa-money-bill-wave',
        path: '/budget',
    },
    // {
    //     id: 5,
    //     label: 'Kế toán lương',
    //     icon: 'fa-truck',
    //     path: '/salary',
    // },
    // {
    //     id: 6,
    //     label: 'Kế toán vật tư',
    //     icon: 'fa-building',
    //     path: '/inventory',
    // },
    // {
    //     id: 7,
    //     label: 'Kế toán tổng hợp',
    //     icon: 'fa-book',
    //     path: '/general-ledger',
    // }
];

// Đối tượng menu riêng biệt cho việc đăng xuất
export const logoutMenuItem = {
    id: 'logout',
    label: 'Đăng xuất',
    icon: 'fa-sign-out-alt',
    path: '/logout',
    isLogout: true
};
