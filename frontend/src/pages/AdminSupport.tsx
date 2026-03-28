import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';

export default function AdminSupport() {
  const [selectedStatus, setSelectedStatus] = useState('Tất cả trạng thái');
  const [selectedPriority, setSelectedPriority] = useState('Tất cả cấp độ');
  const [searchTerm, setSearchTerm] = useState('');

  const tickets = [
    { id: 'TKT-7821', user: 'BS. Nguyễn Văn An', clinic: 'Vitality Quận 1', subject: 'Lỗi đồng bộ dữ liệu', category: 'Kỹ thuật', priority: 'Cao', status: 'Đang xử lý', date: '28/05/2024 14:30', avatar: 'https://i.pravatar.cc/150?u=an' },
    { id: 'TKT-7820', user: 'Quản lý Trần Thị Bình', clinic: 'Thảo Điền', subject: 'Cần hướng dẫn về báo cáo quý', category: 'Hỗ trợ nghiệp vụ', priority: 'Trung bình', status: 'Chờ phản hồi', date: '28/05/2024 11:15', avatar: 'https://i.pravatar.cc/150?u=binh' },
    { id: 'TKT-7815', user: 'Hệ thống', clinic: 'Tự động', subject: 'Cảnh báo bộ nhớ máy chủ vượt ngưỡng', category: 'Hạ tầng', priority: 'Khẩn cấp', status: 'Mới', date: '28/05/2024 09:00', avatar: 'https://i.pravatar.cc/150?u=system' },
    { id: 'TKT-7798', user: 'BS. Lê Văn Cường', clinic: 'Quận 7', subject: 'Quên mật khẩu bác sĩ', category: 'Hệ thống', priority: 'Cao', status: 'Đã giải quyết', date: '27/05/2024 20:45', avatar: 'https://i.pravatar.cc/150?u=cuong' },
    { id: 'TKT-7782', user: 'BS. Phạm Minh Đức', clinic: 'Hệ thống chính', subject: 'Yêu cầu tính năng xuất PDF hồ sơ', category: 'Yêu cầu tính năng', priority: 'Thấp', status: 'Đã đóng', date: '27/05/2024 15:30', avatar: 'https://i.pravatar.cc/150?u=duc' },
  ];

  const stats = [
    { label: 'Tổng yêu cầu', value: '142', icon: 'confirmation_number', color: 'primary' },
    { label: 'Chờ xử lý', value: '12', icon: 'pending_actions', color: 'amber' },
    { label: 'Khẩn cấp', value: '03', icon: 'report_problem', color: 'red' },
    { label: 'Phản hồi trong 24h', value: '98%', icon: 'speed', color: 'emerald' },
  ];

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
              Trung tâm hỗ trợ (Help Desk)
            </h2>
            <p className="text-[16px] text-slate-500 mt-1 font-medium">Tiếp nhận và quản lý các yêu cầu kỹ thuật từ đội ngũ bác sĩ & phòng khám.</p>
          </div>
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all text-[14px] shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-xl">add_task</span>
            Tạo yêu cầu mới
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                  stat.color === 'red' ? 'bg-red-50 text-red-500' :
                  stat.color === 'amber' ? 'bg-amber-50 text-amber-500' :
                  'bg-emerald-50 text-emerald-500'
                }`}>
                  <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm font-bold opacity-70 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-primary/5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Tìm kiếm yêu cầu</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input 
                  className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-[14px] font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none" 
                  placeholder="Tiêu đề, mã yêu cầu hoặc người gửi..." 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Trạng thái xử lý</label>
              <Dropdown
                options={['Tất cả trạng thái', 'Mới', 'Đang xử lý', 'Chờ phản hồi', 'Đã giải quyết', 'Đã đóng']}
                value={selectedStatus}
                onChange={setSelectedStatus}
              />
            </div>
            <div>
              <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Độ ưu tiên</label>
              <Dropdown
                options={['Tất cả cấp độ', 'Khẩn cấp', 'Cao', 'Trung bình', 'Thấp']}
                value={selectedPriority}
                onChange={setSelectedPriority}
              />
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-primary/5 relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-5 text-[14px] font-bold text-slate-500 uppercase tracking-wider">Mã yêu cầu</th>
                  <th className="px-6 py-5 text-[14px] font-bold text-slate-500 uppercase tracking-wider">Người gửi & Phòng khám</th>
                  <th className="px-6 py-5 text-[14px] font-bold text-slate-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-5 text-[14px] font-bold text-slate-500 uppercase tracking-wider">Phân loại</th>
                  <th className="px-6 py-5 text-[14px] font-bold text-slate-500 uppercase tracking-wider">Ưu tiên</th>
                  <th className="px-6 py-5 text-[14px] font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-8 py-5 text-[14px] font-bold text-slate-500 uppercase tracking-wider text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-sm font-mono font-bold text-primary">{t.id}</span>
                      <p className="text-[11px] text-slate-400 font-bold mt-0.5">{t.date}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img className="w-9 h-9 rounded-full ring-2 ring-primary/10" src={t.avatar} alt={t.user}/>
                        <div>
                           <p className="text-[14px] font-black text-slate-900 dark:text-white leading-tight">{t.user}</p>
                           <p className="text-[12px] font-bold text-slate-400 mt-0.5">{t.clinic}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-xs">{t.subject}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`flex items-center gap-1.5 text-[13px] font-black ${
                          t.priority === 'Khẩn cấp' ? 'text-red-500' :
                          t.priority === 'Cao' ? 'text-amber-600' :
                          t.priority === 'Trung bình' ? 'text-blue-500' :
                          'text-slate-400'
                       }`}>
                          <span className={`w-2 h-2 rounded-full ${
                             t.priority === 'Khẩn cấp' ? 'bg-red-500 animate-pulse' :
                             t.priority === 'Cao' ? 'bg-amber-600' :
                             t.priority === 'Trung bình' ? 'bg-blue-500' :
                             'bg-slate-400'
                          }`}></span>
                          {t.priority}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-[12px] font-black tracking-tighter shadow-sm text-white ${
                            t.status === 'Đã giải quyết' ? 'bg-emerald-500' :
                            t.status === 'Đang xử lý' ? 'bg-blue-500' :
                            t.status === 'Chờ phản hồi' ? 'bg-amber-500' :
                            t.status === 'Mới' ? 'bg-indigo-500' :
                            'bg-slate-400'
                        }`}>
                           {t.status}
                        </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-[20px]">forum</span>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Alert Policy */}
        <div className="bg-primary/5 dark:bg-primary/20 p-8 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center gap-6">
           <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-xl shrink-0">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
           </div>
           <div className="flex-1">
              <h5 className="text-[17px] font-bold text-slate-900 dark:text-white mb-2 tracking-tight italic-none">Cam kết chất lượng phản hồi (SLA)</h5>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed italic-none">Chúng tôi luôn ưu tiên các yêu cầu kỹ thuật ảnh hưởng đến quá trình khám chữa bệnh tại phòng khám. Các yêu cầu "Khẩn cấp" sẽ được kỹ thuật viên tiếp nhận trong vòng tối đa **15 phút**. Đội ngũ Admin kỹ thuật luôn túc trực 24/7 để đảm bảo hệ thống vận hành trơn tru.</p>
           </div>
           <button className="px-6 py-3 font-bold text-primary hover:underline text-sm shrink-0">Xem chi tiết SLA →</button>
        </div>
      </section>
    </AdminLayout>
  );
}
