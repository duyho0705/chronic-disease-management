import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';
import Toast from '../components/ui/Toast';
import MaintenanceConfirmModal from '../features/admin/components/MaintenanceConfirmModal';
import DevelopmentModal from '../features/admin/components/DevelopmentModal';

export default function AdminSettings() {
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');

  const [language, setLanguage] = useState('Tiếng Việt');
  const [timezone, setTimezone] = useState('(GMT+07) Hanoi');
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [devFeature, setDevFeature] = useState('');
  const [securitySettings, setSecuritySettings] = useState({
    specialChar: true,
    upperNumber: true,
    twoFactor: false
  });
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);

  const [thresholds, setThresholds] = useState({
    bp_sys: "140",
    bp_dia: "90",
    hr: "100",
    spo2: "94"
  });

  const [notifications, setNotifications] = useState({
    vital: true,
    support: true,
    revenue: true
  });

  const handleRestoreDefaults = () => {
    setLanguage('Tiếng Việt');
    setTimezone('(GMT+07) Hanoi');
    setSecuritySettings({
      specialChar: true,
      upperNumber: true,
      twoFactor: false
    });
    setThresholds({
      bp_sys: "140",
      bp_dia: "90",
      hr: "100",
      spo2: "94"
    });
    setNotifications({
      vital: true,
      support: true,
      revenue: true
    });
    setToastTitle('Khôi phục thành công');
    setShowToast(true);
  };

  const handleSave = () => {
    setToastTitle('Lưu thành công');
    setShowToast(true);
  };

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display text-left">
        {/* Unified Top Header Area */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-primary/5 relative overflow-hidden group text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">Cấu hình tham số hệ thống</h2>
              <p className="text-[16px] text-slate-500 mt-2 font-medium italic-none">Kiểm soát vận hành, bảo mật và đồng bộ hóa mạng lưới phòng khám toàn quốc</p>
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white rounded-xl font-bold transition-all text-[14px] flex items-center gap-2 whitespace-nowrap shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/20"
            >
              <span className="material-symbols-outlined font-bold text-[20px]">cloud_sync</span>
              Lưu thay đổi ngay
            </button>
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Main Controls - Left Column (Scale: 7) */}
          <div className="col-span-12 lg:col-span-7 space-y-8">

            {/* Section: Medical Thresholds */}
            <section className="bg-blue-50/30 dark:bg-slate-900 p-8 rounded-3xl border border-blue-100 dark:border-slate-800 shadow-sm relative z-10">
              <div className="flex items-center justify-between mb-10 pl-1 border-l-4 border-l-red-500">
                <div className="flex flex-col">
                  <h3 className="text-[19px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">Ngưỡng cảnh báo sinh tồn</h3>
                </div>
                <button 
                  onClick={handleRestoreDefaults}
                  className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-[14px] font-bold shadow-lg shadow-primary/5 transition-all italic-none"
                >
                  Khôi phục mặc định
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { key: "bp_sys", label: "Huyết áp tâm thu", unit: "mmHg", icon: "blood_pressure", val: thresholds.bp_sys, color: "red" },
                  { key: "bp_dia", label: "Huyết áp tâm trương", unit: "mmHg", icon: "heart_check", val: thresholds.bp_dia, color: "red" },
                  { key: "hr", label: "Nhịp tim (BPM)", unit: "BPM", icon: "monitor_heart", val: thresholds.hr, color: "blue" },
                  { key: "spo2", label: "SPO2 tối thiểu", unit: "%", icon: "air", val: thresholds.spo2, color: "emerald" },
                ].map((item, idx) => (
                  <div key={idx} className="relative bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>

                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${item.color === 'emerald' ? 'emerald-500' : item.color + '-500'}/10 text-${item.color === 'emerald' ? 'emerald-500' : item.color + '-500'} transition-transform group-hover:scale-110`}>
                        <span className="material-symbols-outlined text-[28px] select-none">{item.icon}</span>
                      </div>
                       <div className="flex flex-col items-end relative z-10">
                        <span className="text-[14px] font-medium text-slate-400 mb-0.5">Giá trị ngưỡng</span>
                        <div className="flex items-baseline gap-1.5">
                          <input
                            className="w-16 bg-transparent border-none text-[22px] font-black text-slate-900 dark:text-white p-0 text-right focus:ring-0 placeholder:text-slate-300 relative z-20"
                            type="number"
                            value={item.val}
                            onChange={(e) => setThresholds({ ...thresholds, [item.key]: e.target.value })}
                          />
                          <span className="text-[14px] font-medium text-slate-400">{item.unit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-[15px] font-bold text-slate-700 dark:text-slate-200">{item.label}</h4>
                      <p className="text-[14px] font-medium text-slate-400 italic-none">Cảnh báo khi vượt ngưỡng cho phép</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Notification Matrix (Expanded) */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-primary/5 shadow-sm">
              <div className="p-8 border-b border-primary/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                  </div>
                  <h3 className="text-[18px] font-black text-slate-900 dark:text-white tracking-tight">Cấu hình thông báo</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-primary/5 bg-slate-50/30 dark:bg-slate-800/20">
                      <th className="px-8 py-4 text-[15px] font-bold  text-slate-800  italic-none">Sự kiện</th>
                      <th className="px-6 py-4 text-[15px] font-bold  text-slate-800  text-center italic-none">Email</th>
                      <th className="px-6 py-4 text-[15px] font-bold  text-slate-800  text-center italic-none">App</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {[
                      { key: "vital", label: "Cảnh báo sinh tồn", e: notifications.vital, p: true },
                      { key: "support", label: "Yêu cầu hỗ trợ mới", e: notifications.support, p: true },
                      { key: "revenue", label: "Báo cáo doanh thu", e: notifications.revenue, p: false },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-primary/5 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-[15px] font-medium text-slate-500 dark:text-slate-100 tracking-tight italic-none">{row.label}</p>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={row.e} 
                              onChange={(e) => setNotifications({ ...notifications, [row.key]: e.target.checked })}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-transparent dark:border-slate-700"></div>
                          </label>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <label 
                            className="relative inline-flex items-center cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              setDevFeature('Thông báo qua App');
                              setShowDevModal(true);
                            }}
                          >
                            <input type="checkbox" checked={false} readOnly className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-transparent dark:border-slate-700"></div>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Sidebar - (Scale: 5) */}
          <div className="col-span-12 lg:col-span-5 space-y-8">

            {/* Section: Operating Parameters */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-primary/5 shadow-sm space-y-8 relative z-20">
              <div className="flex items-center gap-4 border-l-4 border-l-blue-500 pl-4">
                <h3 className="text-[19px] font-black tracking-tight text-slate-900 dark:text-white">Thiết lập chung</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[15px] font-medium text-slate-500  ml-1 italic-none">Ngôn ngữ hệ thống</label>
                    <Dropdown options={['Tiếng Việt', 'English']} value={language} onChange={setLanguage} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[15px] font-medium text-slate-500  ml-1 italic-none">Múi giờ vận hành</label>
                    <Dropdown options={['(GMT+07) Hanoi', '(GMT+00) UTC']} value={timezone} onChange={setTimezone} />
                  </div>
                </div>

                 <label 
                  className="py-3 px-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-primary/5 flex items-center justify-between cursor-pointer group hover:border-red-500/20 transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMaintenanceModal(true);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-red-500 italic-none">Chế độ bảo trì</span>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isMaintenance} readOnly className="sr-only peer" />
                    <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500 transition-all shadow-inner"></div>
                  </div>
                </label>
              </div>
            </section>

            {/* Section: Security Policy */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-primary/5 shadow-sm space-y-8 relative z-10">
              <div className="flex items-center gap-4 border-l-4 border-l-amber-500 pl-4">
                <h3 className="text-[19px] font-black tracking-tight text-slate-900 dark:text-white">Chính sách bảo mật</h3>
              </div>

              <div className="space-y-4">
                {[
                  { key: "specialChar", label: "Bắt buộc ký tự đặc biệt" },
                  { key: "upperNumber", label: "Bắt buộc chữ hoa & số" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between py-2.5 px-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl cursor-pointer hover:bg-primary/5 transition-all group border border-transparent hover:border-primary/5">
                    <span className="text-[15px] font-medium text-slate-500 dark:text-slate-300">{item.label}</span>
                    <div className="relative inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={securitySettings[item.key as keyof typeof securitySettings]}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-2">
                <div className="pt-2">
                  <label className="text-[15px] font-bold text-slate-700 ml-1 mb-2 block italic-none tracking-tight">Mã khóa API hệ thống</label>
                  <div className="bg-slate-50 dark:bg-slate-800/50 py-1.5 px-4 rounded-2xl flex items-center justify-between border border-primary/5">
                    <input className="flex-1 bg-transparent border-none text-[13px] font-mono font-bold text-slate-400 focus:ring-0 truncate" readOnly type="password" value="sk_live_51MvR8kL6vJtE2X9_damdiep_key" />
                    <div className="flex items-center gap-3 ml-2">
                      <span className="material-symbols-outlined text-slate-400 text-[18px] cursor-pointer hover:text-primary transition-all" title="Sao chép mã">content_copy</span>
                      <span className="material-symbols-outlined text-slate-400 text-[18px] cursor-pointer hover:text-amber-500 transition-all font-bold" title="Làm mới mã">refresh</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Section: Quick Utilities (Bottom Grid) */}
          <section className="col-span-12 bg-slate-900 text-white p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-1000"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[32px]">settings_backup_restore</span>
              </div>
              <div>
                <h4 className="text-[20px] font-black tracking-tight leading-tight">Sao lưu và Khôi phục dữ liệu</h4>
              </div>
            </div>
            <div className="flex gap-4 relative z-10 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-2.5 bg-white/10 rounded-xl font-bold transition-all text-[14px] whitespace-nowrap">Xem lịch sử</button>
              <button className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold transition-all text-[14px] whitespace-nowrap">Backup Ngay</button>
            </div>
          </section>
        </div>

         <MaintenanceConfirmModal
          isOpen={showMaintenanceModal}
          onClose={() => setShowMaintenanceModal(false)}
          onConfirm={() => {
            setIsMaintenance(!isMaintenance);
            setShowMaintenanceModal(false);
            setToastTitle(isMaintenance ? 'Hành động khôi phục hệ thống đã được xác nhận!' : 'Chế độ bảo trì đã được kích hoạt trên toàn hệ thống!');
            setShowToast(true);
          }}
          isEnabling={!isMaintenance}
        />

        <DevelopmentModal
          isOpen={showDevModal}
          onClose={() => setShowDevModal(false)}
          featureName={devFeature}
        />

        <Toast
          show={showToast}
          title={toastTitle}
          onClose={() => setShowToast(false)}
        />
      </section>
    </AdminLayout>
  );
}
