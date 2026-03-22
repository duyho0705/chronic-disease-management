export default function DoctorPatients() {
  return (
    <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-white">
            <span className="material-symbols-outlined fill-1">health_metrics</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">Sống Khỏe</h1>
            <p className="text-xs text-primary font-semibold uppercase tracking-wider">Hệ thống quản lý</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="/doctor">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Bảng điều khiển</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium transition-colors" href="/doctor/patients">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            <span>Danh sách bệnh nhân</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="/doctor/analytics">
             <span className="material-symbols-outlined">analytics</span>
            <span>Phân tích nguy cơ</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="/doctor/prescriptions">
            <span className="material-symbols-outlined">prescriptions</span>
            <span>Đơn thuốc điện tử</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="/doctor/appointments">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Lịch hẹn khám</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="/doctor/messages">
            <span className="material-symbols-outlined">chat</span>
            <span>Tin nhắn</span>
            <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
          </a>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full bg-slate-200" 
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
      <main className="flex-1 ml-72">
        {/* Top Bar */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-primary/5 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="w-96 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/50 placeholder-slate-400 text-sm"
              placeholder="Tìm kiếm bệnh nhân, hồ sơ..." 
              type="text" 
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-slate-800 text-slate-600 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
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
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Loại bệnh</p>
                        <select className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 w-full cursor-pointer appearance-none p-0 pr-6">
                            <option>Tất cả bệnh lý</option>
                            <option>Tiểu đường Type 2</option>
                            <option>Tăng huyết áp</option>
                            <option>Tim mạch</option>
                        </select>
                    </div>
                </div>

                {/* Filter 2 */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-primary/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                        <span className="material-symbols-outlined text-xl">error</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Mức độ nguy cơ</p>
                        <select className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 w-full cursor-pointer appearance-none p-0 pr-6">
                            <option>Mọi mức độ</option>
                            <option>Nguy cơ cao</option>
                            <option>Cần theo dõi</option>
                            <option>Bình thường</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-slate-100">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng bệnh nhân</p>
                        <p className="text-2xl font-extrabold text-slate-900">1,284</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <span className="material-symbols-outlined text-primary">groups</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-slate-100">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cần can thiệp</p>
                        <p className="text-2xl font-extrabold text-red-500">12</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl">
                        <span className="material-symbols-outlined text-red-600">notification_important</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Bệnh nhân</th>
                                <th className="px-6 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Mã BN</th>
                                <th className="px-6 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Tuổi</th>
                                <th className="px-6 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Chỉ số</th>
                                <th className="px-6 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Cập nhật</th>
                                <th className="px-6 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Nguy cơ</th>
                                <th className="px-6 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
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
                                                <p className="text-sm font-bold text-slate-900">{p.name}</p>
                                                <p className="text-xs text-slate-500">{p.disease}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-600">{p.id}</td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-600">{p.age}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg">{p.glucose} mmol/L</span>
                                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg">{p.bp} mmHg</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-xs text-slate-500 font-medium">{p.update}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 bg-${p.riskColor}-50 text-${p.riskColor}-600 text-[10px] font-extrabold uppercase rounded-full ring-1 ring-${p.riskColor}-200`}>
                                            {p.risk}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">chat</span></button>
                                            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">prescriptions</span></button>
                                            <button className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20">Chi tiết</button>
                                        </div>
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