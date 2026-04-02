import { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';
import CreateTicketModal from '../features/admin/components/CreateTicketModal';
import Toast from '../components/ui/Toast';

export default function AdminSupport() {
  const [tickets, setTickets] = useState([
    { id: 'TKT-7821', user: 'BS. Nguyễn Văn An', clinic: 'Phòng khám Đức An', clinicCode: 'VD-301', subject: 'Lỗi đồng bộ dữ liệu', category: 'Kỹ thuật', priority: 'Cao', status: 'Đang xử lý', date: '28/05/2024 14:30', avatar: 'https://i.pravatar.cc/150?u=an' },
    { id: 'TKT-7820', user: 'Quản lý Trần Thị Bình', clinic: 'Phòng khám Thiên Vũ', clinicCode: 'TD-005', subject: 'Cần hướng dẫn về báo cáo quý', category: 'Hỗ trợ nghiệp vụ', priority: 'Trung bình', status: 'Chờ phản hồi', date: '28/05/2024 11:15', avatar: 'https://i.pravatar.cc/150?u=binh' },
    { id: 'TKT-7815', user: 'Hệ thống', clinic: 'Phòng Khám Phong Châu', clinicCode: 'SYS-00', subject: 'Cảnh báo bộ nhớ máy chủ vượt ngưỡng', category: 'Hạ tầng', priority: 'Khẩn cấp', status: 'Mới', date: '28/05/2024 09:00', avatar: 'https://i.pravatar.cc/150?u=system' },
    { id: 'TKT-7798', user: 'BS. Lê Văn Cường', clinic: 'Phòng khám Đức Tín', clinicCode: 'Q7-101', subject: 'Quên mật khẩu bác sĩ', category: 'Hệ thống', priority: 'Cao', status: 'Đã giải quyết', date: '27/05/2024 20:45', avatar: 'https://i.pravatar.cc/150?u=cuong' },
    { id: 'TKT-7782', user: 'BS. Phạm Minh Đức', clinic: 'Phòng khám Vũ An', clinicCode: 'ML-009', subject: 'Yêu cầu tính năng xuất PDF hồ sơ', category: 'Yêu cầu tính năng', priority: 'Thấp', status: 'Đã đóng', date: '27/05/2024 15:30', avatar: 'https://i.pravatar.cc/150?u=duc' },
  ]);

  const [selectedStatus, setSelectedStatus] = useState('Tất cả trạng thái');
  const [selectedPriority, setSelectedPriority] = useState('Tất cả cấp độ');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const statusOptions = ['Mới', 'Đang xử lý', 'Chờ phản hồi', 'Đã giải quyết', 'Đã đóng'];

  const stats = [
    { label: 'Tổng yêu cầu', value: '142', icon: 'confirmation_number', color: 'primary' },
    { label: 'Chờ xử lý', value: '12', icon: 'pending_actions', color: 'amber' },
    { label: 'Khẩn cấp', value: '03', icon: 'report_problem', color: 'red' },
    { label: 'Phản hồi trong 24h', value: '98%', icon: 'speed', color: 'emerald' },
  ];

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleOpenTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  const handleCreateTicket = async (data: any) => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newTicket = {
      id: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
      user: 'Dr. Admin',
      clinic: 'Hệ thống chính',
      clinicCode: 'SYS-01',
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'Mới',
      date: new Date().toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      avatar: 'https://i.pravatar.cc/150?u=admin'
    };
    setTickets([newTicket, ...tickets]);
    setIsSaving(false);
    setIsCreateModalOpen(false);
    setToastTitle(`Yêu cầu #${newTicket.id} đã được gửi thành công!`);
    setShowToast(true);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'Tất cả trạng thái' || t.status === selectedStatus;
    const matchesPriority = selectedPriority === 'Tất cả cấp độ' || t.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedPriority]);

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              Trung tâm hỗ trợ
            </h2>
            <p className="text-[16px] text-slate-500 mt-1 font-medium">Tiếp nhận và quản lý các yêu cầu kỹ thuật từ đội ngũ bác sĩ & phòng khám.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95 transition-all text-[13px]"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            Tạo yêu cầu mới
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                  stat.color === 'red' ? 'bg-red-50 text-red-500' :
                    stat.color === 'amber' ? 'bg-amber-50 text-amber-500' :
                      'bg-emerald-50 text-emerald-500'
                  }`}>
                  <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                </div>
              </div>
              <p className="text-slate-500 text-[15px] font-medium mt-1">{stat.label}</p>
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-primary/5 relative">
          <div className="overflow-visible">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 rounded-t-3xl">
                  <th className="px-8 py-5 text-[15px] font-medium text-slate-600">Mã yêu cầu</th>
                  <th className="px-6 py-5 text-[15px] font-medium text-slate-600">Người gửi & Phòng khám</th>
                  <th className="px-6 py-5 text-[15px] font-medium text-slate-600">Tiêu đề</th>
                  <th className="px-6 py-5 text-[15px] font-medium text-slate-600">Ưu tiên</th>
                  <th className="px-6 py-5 text-[15px] font-medium text-slate-600">Trạng thái</th>
                  <th className="px-8 py-5 text-[15px] font-medium text-slate-600 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {paginatedTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-[14px] font-bold">{t.id}</span>
                      <p className="text-[13px] text-slate-500 font-medium mt-0.5">{t.date}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3 relative group/tooltip">
                        <img className="w-9 h-9 rounded-full ring-2 ring-primary/10" src={t.avatar} alt={t.user} />
                        <div>
                          <p className="text-[14px] font-black text-slate-900 dark:text-white leading-tight cursor-default">{t.user}</p>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-10 mb-2 invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 translate-y-2 group-hover/tooltip:translate-y-0 z-[100]">
                          <div className="bg-slate-900 text-white text-[12px] font-bold px-4 py-2 rounded-2xl whitespace-nowrap shadow-2xl relative">
                            {t.clinic}
                            <div className="absolute top-full left-4 border-[6px] border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-xs">{t.subject}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200">
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-5 min-w-[160px]">
                      <Dropdown
                        options={statusOptions}
                        value={t.status}
                        onChange={(val) => handleStatusUpdate(t.id, val)}
                        variant="badge"
                      />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleOpenTicket(t)}
                        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">forum</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[14px] font-medium text-slate-500">
              Hiển thị <span className="text-slate-900 dark:text-white font-extrabold"> {paginatedTickets.length}</span>/<span className="text-slate-900 dark:text-white font-extrabold">{filteredTickets.length}</span> yêu cầu
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-extrabold transition-all ${currentPage === i + 1
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                    }`}>
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Support Alert Policy */}
        <div className="bg-primary/5 dark:bg-primary/20 p-8 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-xl shrink-0">
            <span className="material-symbols-outlined text-3xl">verified</span>
          </div>
          <div className="flex-1">
            <h5 className="text-[17px] font-bold text-slate-900 dark:text-white mb-2 tracking-tight italic-none">Cam kết chất lượng phản hồi</h5>
            <p className="text-[14px] text-slate-500 font-medium leading-relaxed italic-none">Chúng tôi luôn ưu tiên các yêu cầu kỹ thuật ảnh hưởng đến quá trình khám chữa bệnh tại phòng khám. Các yêu cầu "Khẩn cấp" sẽ được kỹ thuật viên tiếp nhận trong vòng tối đa 15 phút. Đội ngũ Admin kỹ thuật luôn túc trực 24/7 để đảm bảo hệ thống vận hành trơn tru.</p>
          </div>
          <button className="px-6 py-3 font-bold text-primary hover:underline text-sm shrink-0">Xem chi tiết SLA →</button>
        </div>
      </section>

      {/* Support Ticket Detail Modal */}
      {isTicketModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsTicketModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                  <span className="material-symbols-outlined font-bold">support_agent</span>
                </div>
                <div>
                  <h3 className="text-[18px] font-black text-slate-900 dark:text-white leading-tight">Xử lý yêu cầu {selectedTicket.id}</h3>
                  <p className="text-[13px] font-bold text-slate-400 mt-1">{selectedTicket.category} • {selectedTicket.priority}</p>
                </div>
              </div>
              <button onClick={() => setIsTicketModalOpen(false)} className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Conversation Content */}
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 text-left">
              <div className="flex gap-4">
                <img className="w-10 h-10 rounded-xl" src={selectedTicket.avatar} alt={selectedTicket.user} />
                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl rounded-tl-none flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedTicket.user}</span>
                    <span className="text-[11px] font-bold text-slate-400 italic-none">{selectedTicket.date}</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-slate-800 dark:text-white mb-2">{selectedTicket.subject}</h4>
                  <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium italic-none leading-relaxed">
                    Kính thưa Ban quản trị, tôi gặp lỗi khi cố gắng xuất báo cáo doanh thu tuần. Hệ thống báo lỗi "Xác thực không thành công" dù tôi đã đăng nhập bình thường. Mong được hỗ trợ sớm để kịp nộp báo cáo quý.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">AD</div>
                <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl rounded-tr-none flex-1 border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] font-black text-primary uppercase tracking-tighter">HỆ THỐNG (ADMIN)</span>
                    <span className="text-[11px] font-bold text-primary/60 italic-none">Vừa mới xong</span>
                  </div>
                  <p className="text-[14px] text-slate-600 dark:text-slate-300 font-medium italic-none leading-relaxed">
                    Chúng tôi đã ghi nhận yêu cầu của bác sĩ. Kỹ thuật viên đang kiểm tra lại phân quyền tài khoản của bác sĩ trên module Báo cáo.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer / Reply Area */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-4 text-left">
              <div className="relative">
                <textarea
                  rows={2}
                  placeholder="Nhập nội dung phản hồi cho bác sĩ..."
                  className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-[14px] focus:border-primary outline-none transition-all resize-none font-medium"
                ></textarea>
                <div className="absolute right-3 bottom-3 flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">attach_file</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">image</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[11px] font-bold text-slate-400 italic-none">* Sau khi gửi, trạng thái sẽ chuyển thành "Chờ phản hồi"</p>
                <div className="flex gap-3">
                  {(selectedTicket.status === 'Mới' || selectedTicket.status === 'Chờ phản hồi') && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedTicket.id, 'Đang xử lý');
                        setIsTicketModalOpen(false);
                      }}
                      className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-[13px]"
                    >
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      Tiếp nhận yêu cầu
                    </button>
                  )}
                  <button className="bg-emerald-500 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-[13px]">
                    <span className="material-symbols-outlined text-lg rotate-[-45deg] mb-1">send</span>
                    Phản hồi ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isSaving={isSaving}
        onSave={handleCreateTicket}
      />

      <Toast
        show={showToast}
        title={toastTitle}
        onClose={() => setShowToast(false)}
      />
    </AdminLayout>
  );
}
