import React from 'react';
import { NavLink } from 'react-router-dom';

interface PatientSidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const PatientSidebar: React.FC<PatientSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const navItems = [
        { path: '/patient', label: 'Bảng điều khiển', icon: 'dashboard' },
        { path: '/patient/prescriptions', label: 'Đơn thuốc', icon: 'prescriptions' },
        { path: '/patient/metrics', label: 'Chỉ số sức khỏe', icon: 'monitoring' },
        { path: '/patient/appointments', label: 'Lịch hẹn', icon: 'calendar_today' },
        { path: '/patient/messages', label: 'Tin nhắn bác sĩ', icon: 'chat' },
        { path: '/patient/profile', label: 'Hồ sơ cá nhân', icon: 'person' },
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

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/patient'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/10'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "''" }}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="w-10 h-10 rounded-full bg-slate-200 bg-cover bg-center shadow-inner"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0IL8Ha85DrLIQW4Y4bRik-fxoCNe-lh7EdSlQJtP3AvZlLOF-v_6fahyzIdteXZ8x4RqXt1QbBv_TFGFijuUfXcPxpBd2JXZ9iv6usWjVuOyKJq7g32UHMfCPIv-pvDzHq9EY4ucfOkJ9IsYKy8rySac2j2sg16xcAzR0XMIq65Y7ez5PPbRpiNPfHC5lP4kkzpn35gPZq_ub95d5J7Zww14hAZU00q5sZxBe7ER6IAorxZdPItiWzMqhKnk00X-9fyxWEpIb5r8')" }}>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">Nguyễn Văn A</p>
                            <p className="text-xs text-slate-500">Bệnh nhân</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Đăng xuất
                    </button>
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

export default PatientSidebar;
