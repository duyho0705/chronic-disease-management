import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

interface ClinicSidebarProps {
    isSidebarOpen: boolean;
}

const ClinicSidebar: React.FC<ClinicSidebarProps> = ({ isSidebarOpen }) => {
    const navItems = [
        { path: ROUTES.CLINIC.DASHBOARD, label: 'Tổng quan', icon: 'dashboard' },
        { path: ROUTES.CLINIC.PATIENTS, label: 'Bệnh nhân', icon: 'group' },
        { path: ROUTES.CLINIC.DOCTORS, label: 'Bác sĩ', icon: 'medical_services' },
        { path: ROUTES.CLINIC.REPORTS, label: 'Báo cáo', icon: 'analytics' },
        { path: ROUTES.CLINIC.ALERTS, label: 'Cảnh báo nguy cơ', icon: 'emergency' },
    ];

    return (
        <aside className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col z-[150] transition-transform duration-300 w-72 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none shadow-primary/10 font-display`}>
            <div className="p-6 flex items-center gap-3 border-b border-primary/5">
                <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-white shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined fill-1">health_metrics</span>
                </div>
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">DamDiep</h1>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar italic-none">
                {navItems.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.path}
                        end={item.path === ROUTES.CLINIC.DASHBOARD}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${isActive && item.path !== '#'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: (isActive && item.path !== '#') ? "'FILL' 1" : "''" }}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <button className="w-full bg-primary text-slate-900 font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span className="text-xs uppercase tracking-widest">Xuất dữ liệu</span>
                </button>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    <NavLink className="text-slate-600 dark:text-slate-400 flex items-center px-4 py-2.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all text-xs font-bold uppercase tracking-wider" to="#">
                        <span className="material-symbols-outlined mr-3 text-lg">help</span> Hỗ trợ
                    </NavLink>
                    <NavLink className="text-red-500 flex items-center px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all text-xs font-bold uppercase tracking-wider" to="/">
                        <span className="material-symbols-outlined mr-3 text-lg">logout</span> Đăng xuất
                    </NavLink>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
            `}</style>
        </aside>
    );
};

export default ClinicSidebar;
