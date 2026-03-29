import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';

export default function AdminAuditLogs() {
  const [selectedUser, setSelectedUser] = useState('Tất cả người dùng');
  const [selectedModule, setSelectedModule] = useState('Tất cả mô-đun');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [isIpModalOpen, setIsIpModalOpen] = useState(false);

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

  const logs = [
    { id: 1, time: '28/05/2024 10:45:22', user: { name: 'Dr. Admin', avatar: 'https://i.pravatar.cc/150?u=admin' }, action: 'Kích hoạt', module: 'Quản lý người dùng', details: 'Khóa tài khoản Bác sĩ Lê Văn Cường', ip: '192.168.1.45', status: 'success' },
    { id: 2, time: '28/05/2024 10:12:05', user: { name: 'Hồ Văn Duy', avatar: 'https://i.pravatar.cc/150?u=duy' }, action: 'Chỉnh sửa', module: 'Hồ sơ phòng khám', details: 'Cập nhật địa chỉ Vitality Dental Care', ip: '113.161.45.22', status: 'success' },
    { id: 3, time: '28/05/2024 09:30:11', user: { name: 'Dr. Admin', avatar: 'https://i.pravatar.cc/150?u=admin' }, action: 'Tạo mới', module: 'Quản lý phòng khám', details: 'Đăng ký phòng khám Nhi Đồng 1', ip: '192.168.1.45', status: 'success' },
    { id: 4, time: '27/05/2024 23:55:40', user: { name: 'Phạm Minh Đức', avatar: 'https://i.pravatar.cc/150?u=duc' }, action: 'Đăng nhập', module: 'Auth', details: 'Đăng nhập thành công từ thiết bị mới', ip: '27.72.105.88', status: 'warning' },
    { id: 5, time: '27/05/2024 16:20:18', user: { name: 'Trần Thị Bình', avatar: 'https://i.pravatar.cc/150?u=binh' }, action: 'Xóa', module: 'Báo cáo', details: 'Xóa bản nháp báo cáo doanh thu tháng 9', ip: '14.161.22.99', status: 'danger' },
    { id: 6, time: '27/05/2024 14:05:33', user: { name: 'Dr. Admin', avatar: 'https://i.pravatar.cc/150?u=admin' }, action: 'Cấu hình', module: 'Hệ thống', details: 'Thay đổi giới hạn tải lên tệp tin lên 50MB', ip: '192.168.1.45', status: 'success' },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm);
    const matchesUser = selectedUser === 'Tất cả người dùng' || log.user.name === selectedUser;
    const matchesModule = selectedModule === 'Tất cả mô-đun' || log.module === selectedModule;

    return matchesSearch && matchesUser && matchesModule;
  });

  const handleExport = () => {
    alert(`Đang xuất ${filteredLogs.length} bản ghi nhật ký hệ thống...`);
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
            className="bg-slate-900 dark:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-[14px]">
            <span className="material-symbols-outlined text-xl">download</span>
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
                  className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-[14px] font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none"
                  placeholder="Nội dung ví dụ: Khóa tài khoản..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Người thực hiện</label>
              <Dropdown
                options={['Tất cả người dùng', 'Dr. Admin', 'Hồ Văn Duy', 'Trần Thị Bình', 'Phạm Minh Đức']}
                value={selectedUser}
                onChange={setSelectedUser}
              />
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
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
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
                            src={log.user.avatar}
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
                        <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-sm">{log.details}</p>
                      </td>
                      <td className="px-8 py-5 text-right flex justify-end">
                        <code
                          onClick={() => handleIpClick(log.ip)}
                          className="text-[12px] font-mono font-bold text-white bg-emerald-500 px-3 py-1.5 rounded-xl shadow-sm cursor-pointer hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-1.5 select-none"
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
                        <span className="material-symbols-outlined text-4xl">search_off</span>
                        <p className="font-bold text-[15px]">Không tìm thấy nhật ký nào phù hợp</p>
                        <p className="text-[13px] font-medium">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
              >
                Đóng
              </button>
              <button
                onClick={() => window.open(`https://www.google.com/maps?q=${currentInfo.lat},${currentInfo.lng}`, '_blank')}
                className="px-6 py-2.5 text-sm font-extrabold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 active:scale-95"
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
