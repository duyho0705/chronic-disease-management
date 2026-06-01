import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import AllNotificationsModal from './AllNotificationsModal';
import { notificationApi } from '../../api/notification';
import { clinicApi } from '../../api/clinic';
import ConfirmActionModal from '../ui/ConfirmActionModal';
import { useWebSocket } from '../../hooks/useWebSocket';

interface TopBarProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  actionButton?: React.ReactNode;
  onOpenProfile?: () => void;
  onOpenChangePassword?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  setIsSidebarOpen,
  notifications,
  setNotifications,
  actionButton,
  onOpenProfile,
  onOpenChangePassword,
}) => {
  const navigate = useNavigate();
  const currentClinicId = localStorage.getItem('clinicId');
  const userRole = localStorage.getItem('userRole');
  const { lastNotification } = useWebSocket();

  useEffect(() => {
    if (lastNotification) {
      setNotifications(prev => [lastNotification, ...prev.filter(n => n.id !== lastNotification.id)]);
    }
  }, [lastNotification, setNotifications]);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [clinicName, setClinicName] = useState(() => localStorage.getItem('cachedClinicName') || "");
  const [clinicLogo, setClinicLogo] = useState(() => localStorage.getItem('cachedClinicLogo') || "");

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isNotificationOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen, isUserMenuOpen]);

  useEffect(() => {
    if (currentClinicId && (userRole?.includes('CLINIC_MANAGER') || userRole?.includes('ADMIN'))) {
      clinicApi.getProfile(currentClinicId).then(res => {
        if (res.data) {
          const name = res.data.name || "Phòng khám";
          const logo = res.data.logoUrl || res.data.imageUrl || "";
          setClinicName(name);
          setClinicLogo(logo);
          localStorage.setItem('cachedClinicName', name);
          localStorage.setItem('cachedClinicLogo', logo);
        }
      }).catch(() => {});
    }
  }, [currentClinicId, userRole]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/?action=login');
  };

  const displayName = clinicName || localStorage.getItem('userName') || "Người dùng";
  const displayAvatar = clinicLogo || localStorage.getItem('userAvatar') || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff`;
  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/50 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[100] transition-all">
      <div className="flex items-center gap-4 flex-1 text-left">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 bg-background-light dark:bg-slate-800 rounded-xl"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
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

        {/* Dark Mode Toggle */}
        <button
          onClick={() => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
          }}
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
          title="Chuyển đổi giao diện sáng/tối"
        >
          <span className="material-symbols-outlined text-xl dark:hidden">dark_mode</span>
          <span className="material-symbols-outlined text-xl hidden dark:block">light_mode</span>
        </button>
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-slate-800 text-slate-600 relative transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {notifications.some(n => !n.read) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            )}
          </button>

          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onClearAll={handleClearAll}
            onViewAll={() => {
              setIsNotificationOpen(false);
              setIsAllNotificationsOpen(true);
            }}
          />
        </div>



        {actionButton}

        {/* Professional User Identity Header Card with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-1.5 pl-3 border border-slate-100 dark:border-slate-800/50 shadow-sm ml-2 group hover:border-primary/20 hover:shadow-md transition-all duration-300 shrink-0 cursor-pointer"
          >
            <div className="text-left hidden md:block shrink-0">
              <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-200 leading-tight whitespace-nowrap pr-1" title={displayName}>
                {displayName}
              </p>
            </div>
            <img
              src={displayAvatar}
              alt="Avatar"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
              }}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-white shadow-sm shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className={`material-symbols-outlined text-slate-400 text-lg transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[200] animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User info header */}
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{displayName}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{(() => { const r = (localStorage.getItem('userRole') || '').replace('ROLE_', ''); if (r === 'ADMIN') return 'Quản trị viên'; if (r === 'CLINIC_MANAGER') return 'Quản lý phòng khám'; if (r === 'DOCTOR') return 'Bác sĩ'; if (r === 'PATIENT') return 'Bệnh nhân'; return r || 'Người dùng'; })()}</p>
              </div>
              
              {/* Menu items */}
              <div className="p-1.5">
                {onOpenProfile && (
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                    Hồ sơ cá nhân
                  </button>
                )}
                {onOpenChangePassword && (
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenChangePassword();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-lg">lock</span>
                    Đổi mật khẩu
                  </button>
                )}
                <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsLogoutConfirmOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
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
      <ConfirmActionModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Xác nhận đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống làm việc?"
        confirmText="Đăng xuất"
        cancelText="Hủy bỏ"
        iconName="logout"
        variant="danger"
      />
      <AllNotificationsModal
        isOpen={isAllNotificationsOpen}
        onClose={() => setIsAllNotificationsOpen(false)}
        onUpdate={fetchNotifications}
      />
    </>
  );
};

export default TopBar;
