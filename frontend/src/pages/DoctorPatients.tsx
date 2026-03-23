import { useState } from 'react';

export default function DoctorPatients() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Cảnh báo chỉ số', message: 'Bệnh nhân Nguyễn Văn An có chỉ số đường huyết cao bất thường.', time: '5 phút trước', type: 'warning' },
    { id: 2, title: 'Lịch hẹn mới', message: 'Bạn có một yêu cầu đặt lịch hẹn mới từ Lê Thị Bình.', time: '2 giờ trước', type: 'info' }
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  return (
    <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col z-[150] transition-transform duration-300 w-72 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none shadow-primary/10`}>
        <div className="p-6 flex items-center gap-3 border-b border-primary/5">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined fill-1">health_metrics</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">Sống Khỏe</h1>
            <p className="text-xs text-primary font-semibold tracking-wide">Hệ thống quản lý</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-all" href="/doctor">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Bảng điều khiển</span>
          </a>

          <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/10 transition-all" href="/doctor/patients">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            <span>Danh sách bệnh nhân</span>
          </a>

          {[
            { name: 'Phân tích nguy cơ', icon: 'analytics', href: '/doctor/analytics' },
            { name: 'Đơn thuốc điện tử', icon: 'prescriptions', href: '/doctor/prescriptions' },
            { name: 'Lịch hẹn khám', icon: 'calendar_today', href: '/doctor/appointments' },
          ].map((item, idx) => (
            <a key={idx} className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-all" href={item.href}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </a>
          ))}

          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-all" href="/doctor/messages">
            <span className="material-symbols-outlined">chat</span>
            <span>Tin nhắn</span>
            <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
          </a>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full bg-slate-200"
                data-alt="Bác sĩ Lê Minh Tâm portrait profile"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvD1gNLm_sBMkVyq8FuYHA20LjP97yY90_RzaDO9mjZaL9ubIXYPTKQeV1FDlhsH3p7qndF3QILzvglilx1ly9Sb7AtePxkBlVz8-5HPGNI5wMlA1c27CCvjNz865bvs_Y9uYkK2245BaMa66pFJCTPXK2wTV6-A4oQjShYdPHNg1nx01j-yW7I48c8aShwiEDSx2B_FE04UGkIxELFaJ-Ho65BrMgC_LF9Yk0dKK7BGEGWjFX4zFwmnNWi44sq8khTm_Q-D-Iig4')" }}>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">BS. Lê Minh Tâm</p>
                <p className="text-xs text-slate-500">Chuyên khoa Nội</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-sm">logout</span>
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        {/* Top Bar */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-primary/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[100] transition-all">
          <div className="flex items-center gap-4 flex-1 text-left">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 bg-background-light dark:bg-slate-800 rounded-xl"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden sm:block w-96 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/50 placeholder-slate-400 text-sm"
                placeholder="Tìm kiếm bệnh nhân, hồ sơ..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-slate-800 text-slate-600 relative transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
              >
                <span className="material-symbols-outlined">notifications</span>
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-[110]" onClick={() => setIsNotificationOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-[120] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 transform-gpu">
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white text-left">Thông báo</h3>
                      {notifications.length > 0 && (
                        <button onClick={() => setNotifications([])} className="text-[13px] font-extrabold text-primary hover:underline tracking-tight">Xóa tất cả</button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                          {notifications.map((notif) => (
                            <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                              <div className="flex gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.type === 'warning' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                  <span className="material-symbols-outlined text-lg">{notif.type === 'warning' ? 'error' : 'info'}</span>
                                </div>
                                <div className="space-y-1 text-left">
                                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-primary transition-colors">{notif.title}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{notif.message}</p>
                                  <p className="text-[10px] font-medium text-slate-400 mt-1">{notif.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-4xl opacity-20">notifications_off</span>
                          </div>
                          <p className="text-sm font-extrabold tracking-tight text-slate-300 dark:text-slate-600">Không có thông báo</p>
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                        <button className="w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-all shadow-sm">Xem tất cả thông báo</button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-slate-800 text-slate-600">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <button className="bg-primary hover:bg-primary/90 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all">
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Thêm bệnh nhân
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Danh sách bệnh nhân</h2>
              <p className="text-slate-500 font-medium">Quản lý và theo dõi lộ trình chăm sóc sức khỏe của 128 bệnh nhân đang điều trị trực tiếp.</p>
            </div>
            <button
              className="bg-primary text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined">person_add</span>
              Thêm bệnh nhân mới
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Filter 1 */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">filter_list</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 mb-0.5">Loại bệnh</p>
                <div className="relative">
                  <select className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 w-full cursor-pointer appearance-none p-0 pr-8 relative z-10">
                    <option>Tất cả bệnh lý</option>
                    <option>Tiểu đường Type 2</option>
                    <option>Tăng huyết áp</option>
                    <option>Tim mạch</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                </div>
              </div>
            </div>

            {/* Filter 2 */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                <span className="material-symbols-outlined text-xl">error</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 mb-0.5">Mức độ nguy cơ</p>
                <div className="relative">
                  <select className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 w-full cursor-pointer appearance-none p-0 pr-8 relative z-10">
                    <option>Mọi mức độ</option>
                    <option>Nguy cơ cao</option>
                    <option>Cần theo dõi</option>
                    <option>Bình thường</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-1">Tổng bệnh nhân</p>
                <p className="text-2xl font-extrabold text-slate-900">1,284</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-primary">groups</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-1">Cần can thiệp</p>
                <p className="text-2xl font-extrabold text-red-500">12</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <span className="material-symbols-outlined text-red-600">notification_important</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 pb-32">
            <div className="">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Bệnh nhân</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Mã Bệnh nhân</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Tuổi</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Chỉ số</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Cập nhật</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Nguy cơ</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: "Nguyễn Văn An", disease: "Tiểu đường Type 2", id: "BN-001", age: 54, glucose: "8.2", bp: "125/80", update: "10:30 Hôm nay", risk: "Nguy cơ cao", riskColor: "red" },
                    { name: "Lê Thị Bình", disease: "Tăng huyết áp", id: "BN-042", age: 62, glucose: "5.6", bp: "145/95", update: "08:15 Hôm nay", risk: "Cần theo dõi", riskColor: "orange" },
                    { name: "Trần Văn Cường", disease: "Tim mạch mãn tính", id: "BN-998", age: 45, glucose: "4.8", bp: "118/75", update: "17:40 Hôm qua", risk: "Bình thường", riskColor: "emerald" },
                    { name: "Phạm Thị Dung", disease: "Tiểu đường thai kỳ", id: "BN-115", age: 29, glucose: "7.1", bp: "110/70", update: "23/10", risk: "Cần theo dõi", riskColor: "orange" }
                  ].map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-900">{p.name}</p>
                            <p className="text-[13px] text-slate-500">{p.disease}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[15px] font-medium text-slate-600">{p.id}</td>
                      <td className="px-6 py-5 text-[15px] font-medium text-slate-600">{p.age}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">{p.glucose} mmol/L</span>
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">{p.bp} mmHg</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-500 font-medium">{p.update}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 bg-${p.riskColor}-50 text-${p.riskColor}-600 text-xs font-extrabold rounded-full ring-1 ring-${p.riskColor}-200`}>
                          {p.risk}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === p.id ? null : p.id)}
                          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all ml-auto">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>

                        {activeMenu === p.id && (
                          <>
                            <div className="fixed inset-0 z-[100]" onClick={() => setActiveMenu(null)}></div>
                            <div className="absolute right-6 top-12 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden text-left">
                              <button className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">visibility</span>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Xem chi tiết hồ sơ</span>
                              </button>
                              <button
                                onClick={() => { setIsAdviceModalOpen(true); setActiveMenu(null); }}
                                className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">send</span>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Gửi lời khuyên</span>
                              </button>
                              <button
                                onClick={() => { setIsPrescriptionModalOpen(true); setActiveMenu(null); }}
                                className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">description</span>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Kê đơn thuốc</span>
                              </button>
                              <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                              <button
                                onClick={() => { setIsModalOpen(true); setActiveMenu(null); }}
                                className="w-full px-4 py-3 text-left hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors flex items-center gap-3 group">
                                <span className="material-symbols-outlined text-primary text-xl">event</span>
                                <span className="text-sm font-bold text-primary">Đặt lịch tái khám</span>
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-6 flex items-center justify-between border-t border-slate-50">
              <p className="text-xs text-slate-500 font-medium">Hiển thị <span className="text-slate-900 font-bold">1-10</span> trong số <span className="text-slate-900 font-bold">128</span> bệnh nhân</p>
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <button className="w-8 h-8 bg-primary text-slate-900 text-xs font-bold rounded-lg">1</button>
                <button className="w-8 h-8 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-lg">2</button>
                <button className="w-8 h-8 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-lg">3</button>
                <span className="text-slate-300 mx-1">...</span>
                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}