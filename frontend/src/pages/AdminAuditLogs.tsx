import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';
import { auditApi } from '../api/audit';

export default function AdminAuditLogs() {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedModule, setSelectedModule] = useState('Tất cả mô-đun');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [isIpModalOpen, setIsIpModalOpen] = useState(false);
  const [logList, setLogList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        userName: selectedUser || null,
        module: selectedModule !== 'Tất cả mô-đun' ? selectedModule : null,
        keyword: searchTerm || null,
        page: pagination.page,
        size: pagination.size
      };
      const res = await auditApi.getAuditLogs(params);
      if (res && res.data) {
        setLogList(res.data.content || []);
        setPagination(prev => ({ ...prev, total: res.data.totalElements || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser, selectedModule, searchTerm, pagination.page, pagination.size]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 0 }));
  }, [selectedUser, selectedModule, searchTerm]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const ipInfo: any = {
    '192.168.1.45': { location: 'TP. Hồ Chí Minh', isp: 'Viettel Network', type: 'Cá nhân (Dynamic)', country: 'Việt Nam', flag: '🇻🇳', lat: '10.8231', lng: '106.6297', timezone: 'Asia/Ho_Chi_Minh (UTC+7)', zip: '70000', security: 'Sạch (Clean)' },
    '113.161.45.22': { location: 'Đà Nẵng', isp: 'FPT Telecom', type: 'Doanh nghiệp (Static)', country: 'Việt Nam', flag: '🇻🇳', lat: '16.0471', lng: '108.2062', timezone: 'Asia/Ho_Chi_Minh (UTC+7)', zip: '55000', security: 'Sạch (Clean)' },
    '27.72.105.88': { location: 'Hà Nội', isp: 'VNPT Corporation', type: 'Cá nhân (Dynamic)', country: 'Việt Nam', flag: '🇻🇳', lat: '21.0285', lng: '105.8542', timezone: 'Asia/Ho_Chi_Minh (UTC+7)', zip: '10000', security: 'Nghi vấn Proxy' },
    '14.161.22.99': { location: 'Hải Phòng', isp: 'CMC Telecom', type: 'Dự phòng', country: 'Việt Nam', flag: '🇻🇳', lat: '20.8449', lng: '106.6881', timezone: 'Asia/Ho_Chi_Min_h (UTC+7)', zip: '18000', security: 'Sạch (Clean)' },
  };

  const currentInfo = selectedIp ? (ipInfo[selectedIp] || { location: 'Không xác định', isp: 'Ẩn danh/VPN', type: 'N/A', country: 'Ẩn danh', flag: '🌐', lat: '0', lng: '0', timezone: 'N/A', zip: 'N/A', security: 'N/A' }) : null;

  const handleIpClick = (ip: string) => {
    setSelectedIp(ip);
    setIsIpModalOpen(true);
  };

  const handleExport = () => {
    alert(`Đang xuất ${logList.length} bản ghi nhật ký hệ thống...`);
  };

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              Nhật ký hệ thống
            </h2>
            <p className="text-[16px] text-slate-500 mt-1 font-medium">Theo dõi và truy vết mọi hoạt động của người dùng trên toàn hệ thống.</p>
          </div>
          <button
            onClick={handleExport}
            className="bg-slate-900 dark:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all text-[13px] active:scale-95 shadow-lg shadow-slate-900/10"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Xuất dữ liệu
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-primary/5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Tìm kiếm sự kiện</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-[14px] font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none text-slate-900 dark:text-white"
                  placeholder="Nội dung ví dụ: Khóa tài khoản..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Người thực hiện</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">person</span>
                <input
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-[14px] font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none text-slate-900 dark:text-white"
                  placeholder="Tên người thực hiện..."
                  type="text"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Mô-đun</label>
              <Dropdown
                options={['Tất cả mô-đun', 'Quản lý người dùng', 'Quản lý phòng khám', 'Hồ sơ phòng khám', 'Báo cáo', 'Hệ thống', 'Auth']}
                value={selectedModule}
                onChange={setSelectedModule}
              />
            </div>
          </div>
        </div>

        {/* Timeline-style Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-primary/5 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-5 text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none">Thời gian</th>
                  <th className="px-6 py-5 text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none">Người dùng</th>
                  <th className="px-6 py-5 text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none">Hành động</th>
                  <th className="px-6 py-5 text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none">Mô-đun</th>
                  <th className="px-6 py-5 text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none">Chi tiết</th>
                  <th className="px-8 py-5 text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none text-right">Địa chỉ IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {logList.length > 0 ? (
                  logList.map((log: any) => (
                    <tr key={log.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-black text-slate-900 dark:text-white leading-tight">{log.time.split(' ')[0]}</span>
                          <span className="text-[13px] font-medium text-slate-500 dark:text-slate-500 mt-0.5">{log.time.split(' ')[1]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-primary/10"
                            src={log.user.avatar || `https://i.pravatar.cc/150?u=${log.id}`}
                            alt={log.user.name}
                          />
                          <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200">{log.user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[14px] font-bold tracking-tighter text-slate-700 dark:text-slate-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400">{log.module}</span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-sm">
                          {log.details ? log.details
                            .replace(/DOCTOR/g, 'Bác sĩ')
                            .replace(/ADMIN/g, 'Quản trị viên')
                            .replace(/PATIENT/g, 'Bệnh nhân')
                            .replace(/CLINIC_MANAGER/g, 'Quản lý phòng khám') 
                            : '--'}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-right flex justify-end">
                        <code
                          onClick={() => handleIpClick(log.ip)}
                          className="text-[12px] font-mono font-bold text-white bg-emerald-500 px-3 py-1.5 rounded-xl shadow-sm cursor-pointer hover:bg-emerald-600 transition-all flex items-center gap-1.5 select-none"
                        >
                          <span className="material-symbols-outlined text-[16px]">info</span>
                          {log.ip}
                        </code>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <span className="material-symbols-outlined text-3xl">search_off</span>
                        <p className="font-medium text-[14px]">Không tìm thấy nhật ký nào phù hợp</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Box */}
          <div className="bg-slate-50 border-t border-slate-100 py-4">
            <div className="px-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1 order-2 md:order-2">
                <button
                  disabled={pagination.page === 0}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white text-[13px] font-extrabold shadow-md">{pagination.page + 1}</button>
                <button
                  disabled={(pagination.page + 1) * pagination.size >= pagination.total}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>

              <div className="order-3 md:order-1">
                <p className="text-[14px] font-medium text-slate-500">
                  Hiển thị <span className="text-slate-500 font-medium">{logList.length}</span>/<span className="text-slate-500 font-medium">{pagination.total}</span> bản ghi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Disclaimer */}
        <div className="bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-400">gavel</span>
            <p className="text-[14px] text-slate-600 font-medium leading-relaxed">
              <span className="font-medium text-slate-900 dark:text-slate-300">Lưu ý:</span> Dữ liệu nhật ký hệ thống được lưu trữ trong 2 năm theo tiêu chuẩn bảo mật y tế. Mọi hành vi tự ý chỉnh sửa nhật ký sẽ bị hệ thống phát hiện và cảnh báo ngay lập tức.
            </p>
          </div>
        </div>
      </section>

      {/* IP Detail Modal */}
      {isIpModalOpen && selectedIp && currentInfo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop like CreateClinicModal */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
            onClick={() => setIsIpModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-xl text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined font-bold">public</span>
                </div>
                <div>
                  <h2 className="text-[18px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Chi tiết địa chỉ IP</h2>
                  <p className="text-[13px] font-bold text-slate-400 font-mono tracking-tight lowercase">{selectedIp}</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900 text-left">
              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Khu vực / Tỉnh thành</label>
                  <div className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200">
                    {currentInfo.location}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Múi giờ</label>
                  <div className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200">
                    {currentInfo.timezone}
                  </div>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Nhà cung cấp dịch vụ (ISP)</label>
                  <div className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">router</span>
                    {currentInfo.isp}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Loại kết nối</label>
                  <div className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200">
                    {currentInfo.type}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Mã bưu chính (Zip)</label>
                  <div className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200">
                    {currentInfo.zip}
                  </div>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Trạng thái bảo mật</label>
                  <div className={`w-full px-4 py-3 rounded-xl border-2 flex items-center justify-between font-bold text-[14px] ${currentInfo.security.includes('Nghi vấn')
                    ? 'border-amber-500/20 bg-amber-500/5 text-amber-600'
                    : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
                    }`}>
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">
                        {currentInfo.security.includes('Nghi vấn') ? 'warning' : 'verified_user'}
                      </span>
                      {currentInfo.security}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider opacity-60">Verified Admin</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 z-20 transition-all">
              <button
                onClick={() => setIsIpModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Đóng
              </button>
              <button
                onClick={() => window.open(`https://www.google.com/maps?q=${currentInfo.lat},${currentInfo.lng}`, '_blank')}
                className="px-6 py-2.5 text-sm font-extrabold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                Xem bản đồ
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
