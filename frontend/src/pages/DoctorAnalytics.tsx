
import { useState } from 'react';
 
export default function DoctorAnalytics() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-all" href="/doctor/patients">
            <span className="material-symbols-outlined">groups</span>
            <span>Danh sách bệnh nhân</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/10 transition-all" href="/doctor/analytics">
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
            <span>Phân tích nguy cơ</span>
          </a>
          {[
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
            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Phân tích nguy cơ</h2>
                <p className="text-slate-500 mt-1">Hệ thống giám sát và dự báo rủi ro sức khỏe bệnh nhân</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng ca nguy cơ</p>
                            <h3 className="text-2xl font-extrabold mt-1">1,284</h3>
                        </div>
                        <span className="material-symbols-outlined text-blue-500 bg-blue-50 p-2.5 rounded-xl text-xl">monitoring</span>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-blue-600 font-bold">
                        <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
                        +12% so với tháng trước
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-red-500 hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nguy cơ cao</p>
                            <h3 className="text-2xl font-extrabold mt-1 text-red-500">42</h3>
                        </div>
                        <span className="material-symbols-outlined text-red-500 bg-red-100 p-2.5 rounded-xl text-xl"
                            style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 italic font-medium">Cần can thiệp khẩn cấp ngay</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-orange-500 hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Xu hướng xấu</p>
                            <h3 className="text-2xl font-extrabold mt-1 text-orange-600">156</h3>
                        </div>
                        <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-2.5 rounded-xl text-xl">trending_down</span>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-orange-600 font-bold">
                        Dự báo tăng 5% tới
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-primary hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ổn định</p>
                            <h3 className="text-2xl font-extrabold mt-1 text-primary">1,086</h3>
                        </div>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2.5 rounded-xl text-xl"
                            style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-primary font-bold">
                        Duy trì trạng thái tốt
                    </div>
                </div>
            </div>

            {/* Middle Section: Chart & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h4 className="text-lg font-bold">Xu hướng sức khỏe cộng đồng</h4>
                            <p className="text-sm text-slate-500">Biến động chỉ số trung bình (7 ngày qua)</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="px-4 py-2 bg-primary/5 text-primary text-xs font-bold rounded-lg border border-emerald-100">Huyết
                                áp</button>
                            <button
                                className="px-4 py-2 hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-lg transition-colors">Đường
                                huyết</button>
                        </div>
                    </div>
                    {/* Chart Simulation */}
                    <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-slate-100 pb-2">
                        <div className="w-full flex flex-col items-center group">
                            <div
                                className="w-full bg-primary/20 group-hover:bg-primary/30 transition-colors rounded-t-lg h-32 relative">
                                <div
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    124</div>
                            </div>
                            <span className="text-[10px] mt-2 text-slate-400 font-bold">T2</span>
                        </div>
                        <div className="w-full flex flex-col items-center group">
                            <div className="w-full bg-primary/30 h-40 rounded-t-lg relative"></div>
                            <span className="text-[10px] mt-2 text-slate-400 font-bold">T3</span>
                        </div>
                        <div className="w-full flex flex-col items-center group">
                            <div className="w-full bg-primary/40 h-48 rounded-t-lg relative"></div>
                            <span className="text-[10px] mt-2 text-slate-400 font-bold">T4</span>
                        </div>
                        <div className="w-full flex flex-col items-center group">
                            <div className="w-full bg-primary/60 h-56 rounded-t-lg relative"></div>
                            <span className="text-[10px] mt-2 text-slate-400 font-bold">T5</span>
                        </div>
                        <div className="w-full flex flex-col items-center group">
                            <div className="w-full bg-primary/40 h-44 rounded-t-lg relative"></div>
                            <span className="text-[10px] mt-2 text-slate-400 font-bold">T6</span>
                        </div>
                        <div className="w-full flex flex-col items-center group">
                            <div className="w-full bg-primary/30 h-36 rounded-t-lg relative"></div>
                            <span className="text-[10px] mt-2 text-slate-400 font-bold">T7</span>
                        </div>
                        <div className="w-full flex flex-col items-center group">
                            <div className="w-full bg-primary/80 h-60 rounded-t-lg relative"></div>
                            <span className="text-[10px] mt-2 text-slate-400 font-bold">CN</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-primary/80"></span>
                            <span className="text-xs text-slate-500">Trung bình nhóm nguy cơ</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                            <span className="text-xs text-slate-500">Ngưỡng an toàn (120 mmHg)</span>
                        </div>
                    </div>
                </div>
                {/* AI Insights Panel */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary"
                            style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        <h4 className="text-lg font-bold">AI Insights</h4>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-l-4 border-red-500">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-red-500 text-sm">emergency</span>
                            <span className="text-xs font-extrabold text-red-500 uppercase tracking-wider">Cảnh báo khẩn</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Bệnh nhân Trần Anh có SpO2 giảm đột ngột (88%)
                        </p>
                        <button className="mt-3 text-xs font-bold text-primary hover:underline">Liên hệ ngay →</button>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-l-4 border-orange-500">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-orange-500 text-sm">groups_2</span>
                            <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">Phân tích cụm</span>
                        </div>
                        <p className="text-sm text-slate-900 dark:text-slate-100 font-semibold">Phát hiện cụm 15 bệnh nhân tại Quận 7 có dấu hiệu tăng huyết áp.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/5 border-l-4 border-primary">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-sm">query_stats</span>
                            <span className="text-xs font-extrabold text-primary uppercase tracking-wider">Dự báo biến chứng</span>
                        </div>
                        <p className="text-sm text-slate-900 dark:text-slate-100 font-semibold">Nguy cơ suy thận độ 1 tăng 12% ở nhóm tiểu đường Type 2.</p>
                    </div>
                </div>
            </div>

            {/* Patient Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Bệnh nhân nguy cơ cao</h4>
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-100 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-sm">filter_list</span>
                        Lọc dữ liệu
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                                <th className="px-8 py-4 border-b border-slate-100">Bệnh nhân</th>
                                <th className="px-8 py-4 border-b border-slate-100">Chỉ số mới nhất</th>
                                <th className="px-8 py-4 border-b border-slate-100">Phân tích từ AI</th>
                                <th className="px-8 py-4 text-right border-b border-slate-100 whitespace-nowrap">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { name: "Nguyễn Văn Nam", id: "001", initials: "NN", bp: "158/95", icon: "arrow_upward", alert: "Huyết áp tăng liên tục 3 ngày", color: "red" },
                                { name: "Trần Thị Hoa", id: "045", initials: "TH", bp: "8.2 mmol/L", icon: "trending_up", alert: "Đường huyết sau ăn bất thường", color: "orange" },
                                { name: "Lý Văn Mạnh", id: "112", initials: "LM", bp: "91 bpm", icon: "heart_broken", alert: "Nhịp tim nhanh kèm hạ áp", color: "red" }
                            ].map((p, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {p.initials}</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">ID: SK-{p.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold text-${p.color}-500`}>{p.bp}</span>
                                            <span className={`material-symbols-outlined text-${p.color}-500 text-sm`}>{p.icon}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full bg-${p.color}-50 text-${p.color}-600 text-[10px] font-bold gap-1 border border-${p.color}-100`}>
                                            <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                                            {p.alert}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                                <span className="material-symbols-outlined text-xl">chat</span>
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                                <span className="material-symbols-outlined text-xl">visibility</span>
                                            </button>
                                            <button className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Hiển thị 3 trên 42 ca nguy cơ</p>
                    <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-400 border border-transparent hover:border-slate-100">
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold shadow-sm">1</button>
                        <button className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 text-xs font-bold transition-all border border-transparent hover:border-slate-100">2</button>
                        <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-400 border border-transparent hover:border-slate-100">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        
        </div>
      </main>
    </div>
  );
}