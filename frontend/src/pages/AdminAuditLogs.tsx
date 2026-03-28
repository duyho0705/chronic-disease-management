import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';

export default function AdminAuditLogs() {
  const [selectedUser, setSelectedUser] = useState('Tất cả người dùng');
  const [selectedModule, setSelectedModule] = useState('Tất cả mô-đun');
  const [searchTerm, setSearchTerm] = useState('');

  const logs = [
    { id: 1, time: '28/05/2024 10:45:22', user: { name: 'Dr. Admin', avatar: 'https://i.pravatar.cc/150?u=admin' }, action: 'Kích hoạt', module: 'Quản lý người dùng', details: 'Khóa tài khoản Bác sĩ Lê Văn Cường', ip: '192.168.1.45', status: 'success' },
    { id: 2, time: '28/05/2024 10:12:05', user: { name: 'Hồ Văn Duy', avatar: 'https://i.pravatar.cc/150?u=duy' }, action: 'Chỉnh sửa', module: 'Hồ sơ phòng khám', details: 'Cập nhật địa chỉ Vitality Dental Care', ip: '113.161.45.22', status: 'success' },
    { id: 3, time: '28/05/2024 09:30:11', user: { name: 'Dr. Admin', avatar: 'https://i.pravatar.cc/150?u=admin' }, action: 'Tạo mới', module: 'Quản lý phòng khám', details: 'Đăng ký phòng khám Nhi Đồng 1', ip: '192.168.1.45', status: 'success' },
    { id: 4, time: '27/05/2024 23:55:40', user: { name: 'Phạm Minh Đức', avatar: 'https://i.pravatar.cc/150?u=duc' }, action: 'Đăng nhập', module: 'Auth', details: 'Đăng nhập thành công từ thiết bị mới', ip: '27.72.105.88', status: 'warning' },
    { id: 5, time: '27/05/2024 16:20:18', user: { name: 'Trần Thị Bình', avatar: 'https://i.pravatar.cc/150?u=binh' }, action: 'Xóa', module: 'Báo cáo', details: 'Xóa bản nháp báo cáo doanh thu tháng 9', ip: '14.161.22.99', status: 'danger' },
    { id: 6, time: '27/05/2024 14:05:33', user: { name: 'Dr. Admin', avatar: 'https://i.pravatar.cc/150?u=admin' }, action: 'Cấu hình', module: 'Hệ thống', details: 'Thay đổi giới hạn tải lên tệp tin lên 50MB', ip: '192.168.1.45', status: 'success' },
  ];

  const handleExport = () => {
    alert('Đang xuất nhật ký hệ thống...');
  };

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">history</span>
              Nhật ký hệ thống
            </h2>
            <p className="text-[16px] text-slate-500 mt-1 font-medium italic">Theo dõi và truy vết mọi hoạt động của người dùng trên toàn hệ thống.</p>
          </div>
          <button
            onClick={handleExport}
            className="bg-slate-900 dark:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all text-[14px] shadow-lg shadow-slate-900/10">
            <span className="material-symbols-outlined text-xl">download</span>
            Xuất dữ liệu (.xlsx)
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
                options={['Tất cả mô-đun', 'Quản lý người dùng', 'Quản lý phòng khám', 'Báo cáo', 'Hệ thống', 'Auth']}
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
                  <th className="px-8 py-5 text-[14px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Thời gian</th>
                  <th className="px-6 py-5 text-[14px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Người dùng</th>
                  <th className="px-6 py-5 text-[14px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Hành động</th>
                  <th className="px-6 py-5 text-[14px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Mô-đun</th>
                  <th className="px-6 py-5 text-[14px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Chi tiết</th>
                  <th className="px-8 py-5 text-[14px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-slate-900 dark:text-white leading-tight">{log.time.split(' ')[0]}</span>
                        <span className="text-[12px] font-bold text-primary opacity-60 mt-0.5">{log.time.split(' ')[1]}</span>
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
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-tighter ${
                        log.status === 'success' ? 'bg-emerald-500/10 text-emerald-600' :
                        log.status === 'warning' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                        <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400">{log.module}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 italic max-w-sm">{log.details}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <code className="text-[12px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">{log.ip}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Disclaimer */}
        <div className="bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
           <div className="flex gap-4">
              <span className="material-symbols-outlined text-slate-400">gavel</span>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-slate-300">Lưu ý:</span> Dữ liệu nhật ký hệ thống được lưu trữ trong 2 năm theo tiêu chuẩn bảo mật y tế. Mọi hành vi tự ý chỉnh sửa nhật ký sẽ bị hệ thống phát hiện và cảnh báo ngay lập tức.
              </p>
           </div>
        </div>
      </section>
    </AdminLayout>
  );
}
