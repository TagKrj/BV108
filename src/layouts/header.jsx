import React, { useState } from 'react';

/**
 * Header Component
 * 
 * @param {Array} breadcrumbItems - Custom breadcrumb items array
 * @param {Object} breadcrumbItems[].label - The text to display
 * @param {string} breadcrumbItems[].path - The link path
 * @param {boolean} breadcrumbItems[].active - Whether this is the current page
 * 
 * @example
 * // Custom breadcrumb usage:
 * <Header breadcrumbItems={[
 *   { label: 'Dashboard', path: '/' },
 *   { label: 'Doanh thu', path: '/revenue' },
 *   { label: 'Chi tiết', path: '/revenue/detail', active: true }
 * ]} />
 */
const Header = ({ breadcrumbItems = [], onBreadcrumbClick }) => {
    const [notificationCount] = useState(3);

    // Default breadcrumb if not provided
    const defaultBreadcrumb = [
        { label: 'Dashboard', path: '/' },
        { label: 'Viện phí', path: '/accounting', active: true }
    ];

    const breadcrumbs = breadcrumbItems.length > 0 ? breadcrumbItems : defaultBreadcrumb;

    return (
        <header className="header bg-white h-[73px] border-b border-gray-200 flex items-center px-8">
            <div className="header-content w-full flex items-center justify-between">
                {/* Breadcrumb Section */}
                <nav className="breadcrumb flex items-center gap-4">
                    {breadcrumbs.map((item, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <span className="breadcrumb-separator text-gray-400">
                                    <i className="fas fa-chevron-right text-[11px]"></i>
                                </span>
                            )}
                            <a
                                href={item.path}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (onBreadcrumbClick && !item.active) {
                                        onBreadcrumbClick(item.path);
                                    }
                                }}
                                className={`breadcrumb-item text-sm transition-colors ${item.active
                                        ? 'text-[#2D5016] font-bold cursor-default'
                                        : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                                    }`}
                            >
                                {item.label}
                            </a>
                        </React.Fragment>
                    ))}
                </nav>

                {/* User Info Section */}
                <div className="user-info flex items-center gap-6">
                    {/* Notification Icon */}
                    <div
                        className="notification-icon relative cursor-pointer group"
                        onClick={() => console.log('Show notifications')}
                    >
                        <i className="fas fa-bell text-gray-500 text-lg group-hover:text-gray-700 transition-colors"></i>
                        {notificationCount > 0 && (
                            <span
                                className="notification-badge absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                                title={`${notificationCount} thông báo mới`}
                            ></span>
                        )}
                    </div>

                    {/* User Profile */}
                    <div
                        className="user-profile flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                        onClick={() => console.log('Show user menu')}
                    >
                        {/* Avatar */}
                        <div className="avatar w-10 h-10 bg-[#2D5016] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-base">TH</span>
                        </div>

                        {/* User Details */}
                        <div className="user-details">
                            <h4 className="text-sm font-bold text-gray-800 leading-tight">Trung tá Hoàng</h4>
                            <p className="text-xs text-gray-500 leading-tight mt-0.5">Trưởng phòng Tài chính</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
