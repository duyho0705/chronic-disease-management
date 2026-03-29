import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import TopBar from '../components/common/TopBar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Cảnh báo hệ thống', message: 'Phòng khám Quận 1 đang quá tải bệnh nhân.', time: '5 phút trước', type: 'warning' },
    { id: 2, title: 'Báo cáo mới', message: 'Báo cáo hợp nhất tháng 10 đã sẵn sàng.', time: '2 giờ trước', type: 'info' }
  ]);

  const location = useLocation();

  const navItems = [
    { path: ROUTES.ADMIN.DASHBOARD, label: 'Tổng quan hệ thống', icon: 'dashboard' },
    { path: ROUTES.ADMIN.CLINICS, label: 'Quản lý Phòng khám', icon: 'medical_services' },
    { path: ROUTES.ADMIN.USERS, label: 'Quản lý Người dùng', icon: 'group' },
    { path: ROUTES.ADMIN.SERVICES, label: 'Quản lý Dịch vụ', icon: 'medical_information' },
    { path: ROUTES.ADMIN.REPORTS, label: 'Báo cáo hợp nhất', icon: 'analytics' },
    { path: ROUTES.ADMIN.SUPPORT, label: 'Trung tâm hỗ trợ', icon: 'support_agent' },
    { path: ROUTES.ADMIN.AUDIT_LOGS, label: 'Nhật ký hệ thống', icon: 'history' },
    { path: ROUTES.ADMIN.SETTINGS, label: 'Cấu hình hệ thống', icon: 'settings' },
  ];

  return (
    <div className="flex min-h-screen font-display bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased italic-none">
      {/* Sidebar Navigation - Shared across Admin Pages */}
      <aside className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col z-[150] transition-transform duration-300 w-72 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none shadow-primary/10`}>
        <div className="p-6 flex items-center gap-3 border-b border-primary/5">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>health_metrics</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none">DamDiep</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar italic-none">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={idx}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary font-medium'
                  }`}
                to={item.path}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "''" }}>
                  {item.icon}
                </span>
                <span className="text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-primary/5">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-primary/5">
            <div className="relative">
              <img
                alt="Admin Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp8eIVLC4BZ4z9CdFJzTcJs8De1DnLL5wo5VbLQy5NuDCANMh-0CKHKMwJoCbh5s0Slvw14EtIw0Tbm3MafzdbqttNLujt3iIQj5ApazKXBxRpR_rIvKxOcwXyJSMIn-RaUeXGFZ7Bu4QFE6TPBZpHz7fctMvbAPemEkIOBGp7xzThTxLGPyJNUFqQGz-RbA7WBgMmcAuJSVIhVlfU9qWUOhkwlKz9xhFJaRtxKItToKmF3E-0KwTs16Z7luAeFqGY21AY4QSEanA"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-base font-bold text-slate-900 dark:text-white truncate">Dr. Admin</p>
              <p className="text-sm text-slate-500 font-medium opacity-70 leading-tight">System Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-72 min-h-screen flex-1 flex flex-col">
        <TopBar
          setIsSidebarOpen={setIsSidebarOpen}
          notifications={notifications}
          setNotifications={setNotifications}
          hideProfile={true}
        />
        {children}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3bb9f333; border-radius: 10px; }
      `}</style>
    </div>
  );
}
