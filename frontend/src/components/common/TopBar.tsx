import React, { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';

interface TopBarProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  actionButton?: React.ReactNode;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  showSearch?: boolean;
  hideProfile?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  setIsSidebarOpen,
  notifications,
  setNotifications,
  actionButton,
  userName = "BS. Lê Minh Tâm",
  userRole = "Bác sĩ chuyên khoa",
  userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDvD1gNLm_sBMkVyq8FuYHA20LjP97yY90_RzaDO9mjZaL9ubIXYPTKQeV1FDlhsH3p7qndF3QILzvglilx1ly9Sb7AtePxkBlVz8-5HPGNI5wMlA1c27CCvjNz865bvs_Y9uYkK2245BaMa66pFJCTPXK2wTV6-A4oQjShYdPHNg1nx01j-yW7I48c8aShwiEDSx2B_FE04UGkIxELFaJ-Ho65BrMgC_LF9Yk0dKK7BGEGWjFX4zFwmnNWi44sq8khTm_Q-D-Iig4",
  showSearch = false,
  hideProfile = false
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-primary/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[100] transition-all">
      <div className="flex items-center gap-4 flex-1 text-left">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 bg-background-light dark:bg-slate-800 rounded-xl"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {showSearch && (
          <div className="relative w-full max-w-md group hidden md:block ml-4">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full pl-12 pr-6 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-bold placeholder:text-slate-400 transition-all shadow-sm" 
              placeholder="Tìm kiếm..." 
              type="text"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        {/* Animated Vietnam Flag */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-800 group cursor-default">
          <div className="w-6 h-4 relative overflow-hidden rounded-sm shadow-sm animate-flag-wave">
            <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect width="30" height="20" fill="#da251d" />
              <polygon points="15,4 11.47,14.85 20.71,8.15 9.29,8.15 18.53,14.85" fill="#ffff00" />
            </svg>
          </div>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase hidden xs:inline">VN</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-slate-800 text-slate-600 relative transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            )}
          </button>

          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </div>

        <button className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-slate-800 text-slate-600 transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>

        <div className="hidden xs:block h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 md:mx-2"></div>
        {actionButton}

        {!hideProfile && (
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-[15px] font-extrabold text-slate-900 dark:text-white leading-none">{userName}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{userRole}</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 border-2 border-white dark:border-slate-800 shadow-md shadow-primary/10 overflow-hidden cursor-pointer"
              style={{ backgroundImage: `url('${userAvatar}')`, backgroundSize: 'cover' }}>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes flag-wave {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-flag-wave {
          animation: flag-wave 2s infinite ease-in-out;
        }
      `}</style>
    </header>
  );
};

export default TopBar;
