import { useState } from 'react';

export default function DoctorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
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
          <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium transition-colors" href="/doctor">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span>Bảng điều khiển</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="/doctor/patients">
            <span className="material-symbols-outlined">groups</span>
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
          {/* Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined size-6">person</span>
                </div>
                <span className="text-xs font-bold text-green-500 flex items-center">+2.4% <span className="material-symbols-outlined text-xs">trending_up</span></span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Tổng bệnh nhân</h3>
              <p className="text-3xl font-extrabold mt-1">1,250</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined size-6">emergency</span>
                </div>
                <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">Cảnh báo</span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Nguy cơ cao</h3>
              <p className="text-3xl font-extrabold mt-1 text-red-500">12</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500">
                  <span className="material-symbols-outlined size-6">event_upcoming</span>
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Lịch hẹn chờ</h3>
              <p className="text-3xl font-extrabold mt-1">08</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-500">
                  <span className="material-symbols-outlined size-6">mail</span>
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Tin nhắn mới</h3>
              <p className="text-3xl font-extrabold mt-1">05</p>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* High Risk Patients Section */}
            <section className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500">warning</span>
                  Phân tích nguy cơ cao
                </h2>
                <button className="text-primary text-sm font-bold hover:underline">Xem tất cả</button>
              </div>
              <div className="space-y-4">
                {/* Patient Card 1 */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-l-4 border-l-red-500 border-y border-r border-primary/5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden"
                      data-alt="Portrait of patient Nguyễn Văn A"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUstbGh5q911TPTLus7gX2RIO2ML_RSZbjV67EFkDBw0zf6vQQzS7IP3LwXkWI6OWS4mwx5KhEFyn-NJ5T-OeMOhMLb321T1uEw1ypz_mfVSy4RJSGZA4h5NHgwDOx8syKTRjqsnQ5cRRZlRIs0lxo8cA7nJHIBpBUgVAUxh3e6QkBpGR5iW1WaEsU3Xu5JdVd5WA_HjKsBFimtKG_GF5CgYz-JAa03FTdaPVVyoP_Kqd8-PCCC03jKnqOMbqTRYOC5StfAJMV2wM')" }}>
                    </div>
                    <div>
                      <p className="font-bold text-lg">Nguyễn Văn A</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>65 tuổi</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>Tăng huyết áp vô căn</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center px-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Xu hướng HA</p>
                    <p className="text-red-500 font-extrabold text-lg">165/105</p>
                    <p className="text-[10px] text-red-400 font-medium">Tăng mạnh (+12)</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-3 py-1 rounded-full text-center">Nguy cấp</span>
                    <button className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-lg transition-colors">Chi tiết</button>
                  </div>
                </div>

                {/* Patient Card 2 */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-l-4 border-l-amber-500 border-y border-r border-primary/5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden"
                      data-alt="Portrait of patient Trần Thị B"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCCDiBOPC4Ri1uCn0UiQKsD0FNq2ppk_uufmJ8W853OiEN3FNDmSyauZYh6rl-IhcTT89g2n_dlyl37uVr1KjOwv8CLC6IjiAM1cZBiELmdPBdGK70zx7052NrAvmXu7gXJ3sHiz3GEMfdCHKfb_Bnid5RhmQZawRE1pPFWJcTLkQhUj8qmOgQ87zWDN9l5Ob5D6U3Ab--WDeLBpzwytlNhMQDzDRPCqyY7Ga_WkyOVyTF0KbP3EH2JiGgiSX7mIfXPQx5acbe6Hmc')" }}>
                    </div>
                    <div>
                      <p className="font-bold text-lg">Trần Thị B</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>52 tuổi</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>Rối loạn nhịp tim</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center px-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Nhịp tim</p>
                    <p className="text-amber-500 font-extrabold text-lg">112 bpm</p>
                    <p className="text-[10px] text-amber-400 font-medium">Không ổn định</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-3 py-1 rounded-full text-center">Cần theo dõi</span>
                    <button className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-lg transition-colors">Chi tiết</button>
                  </div>
                </div>
              </div>

              {/* Trend Chart Placeholder */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold">Xu hướng sức khỏe cộng đồng</h3>
                    <p className="text-xs text-slate-500">Thống kê dữ liệu lâm sàng theo tuần</p>
                  </div>
                  <select className="text-xs border-primary/10 rounded-lg bg-background-light dark:bg-slate-800 focus:ring-primary">
                    <option>7 ngày qua</option>
                    <option>30 ngày qua</option>
                  </select>
                </div>
                <div className="h-48 flex items-end justify-between gap-2 px-2">
                  <div className="w-full bg-primary/20 rounded-t-lg relative group h-[40%]">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">42</div>
                  </div>
                  <div className="w-full bg-primary/30 rounded-t-lg relative group h-[60%]"></div>
                  <div className="w-full bg-primary/40 rounded-t-lg relative group h-[55%]"></div>
                  <div className="w-full bg-primary/60 rounded-t-lg relative group h-[75%]"></div>
                  <div className="w-full bg-primary rounded-t-lg relative group h-[90%]"></div>
                  <div className="w-full bg-primary/80 rounded-t-lg relative group h-[85%]"></div>
                  <div className="w-full bg-primary/70 rounded-t-lg relative group h-[70%]"></div>
                </div>
                <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Th2</span><span>Th3</span><span>Th4</span><span>Th5</span><span>Th6</span><span>Th7</span><span>CN</span>
                </div>
              </div>
            </section>

            {/* Sidebar Content */}
            <aside className="space-y-8">
              {/* Quick Actions */}
              <section>
                <h2 className="text-xl font-extrabold mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => setIsPrescriptionModalOpen(true)}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group">
                    <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <span className="font-bold text-sm">Kê đơn thuốc mới</span>
                  </button>
                  <button 
                    onClick={() => setIsAdviceModalOpen(true)}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group">
                    <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined">send</span>
                    </div>
                    <span className="font-bold text-sm">Gửi lời khuyên</span>
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group">
                    <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined">event</span>
                    </div>
                    <span className="font-bold text-sm">Đặt lịch tái khám</span>
                  </button>
                </div>
              </section>
              
              {/* Recent Appointments */}
              <section>
                <h2 className="text-xl font-extrabold mb-4">Lịch hẹn sắp tới</h2>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm divide-y divide-primary/5 overflow-hidden">
                  <div className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Hôm nay</p>
                      <p className="text-lg font-extrabold text-primary leading-none">14:30</p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold truncate text-sm">Lê Văn C</p>
                      <p className="text-xs text-slate-500">Khám định kỳ Tiểu đường</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                  </div>
                  <div className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Hôm nay</p>
                      <p className="text-lg font-extrabold text-primary leading-none">15:15</p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold truncate text-sm">Phạm Minh H</p>
                      <p className="text-xs text-slate-500">Tư vấn xét nghiệm</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                  </div>
                  <div className="p-4 flex items-center gap-4 bg-background-light dark:bg-slate-800/50">
                    <div className="flex-shrink-0 text-center opacity-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Mai</p>
                      <p className="text-lg font-extrabold text-slate-400 leading-none">09:00</p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold truncate text-sm opacity-50">Hoàng Thu T</p>
                      <p className="text-xs text-slate-500">Kiểm tra hậu phẫu</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-3 border border-dashed border-primary/30 text-primary font-bold text-sm rounded-xl hover:bg-primary/5 transition-colors">
                  Xem toàn bộ lịch trình
                </button>
              </section>
            </aside>
          </div>

          {/* Patient Management Table */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold">Quản lý bệnh nhân gần đây</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-xs font-bold">Lọc theo khoa</button>
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-xs font-bold">Xuất báo cáo</button>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary/5 border-b border-primary/5">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Bệnh nhân</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Chỉ số gần nhất</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tình trạng</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cập nhật lần cuối</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  <tr className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full bg-slate-200"
                          data-alt="Patient Lê Văn C avatar"
                          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJEsF1IgDAZeuRPhLHaETdduvDn0twzgerBYISsu1tmyhYPZUrXiZR1mfQ0OWEP-jGEPlV2VzQcbWcusjUKCa_2Dtm0-leXmrRQvCS2y_3HimgCcjd-B3S40Prl4L-3riU5-mixukjTxc51XQ8vKFAsOcUiotrLEN2amViOh_IXjuESo6OGTG_yqQ0kup5LPHi5wdUkRbGAwk1WTQtE1rxscpA2ZH7E_6XCLaXZM_tK9LzC5sQNdUIApT3pQ30RJM5n8bnHoo7qf0')" }}>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Lê Văn C</p>
                          <p className="text-[10px] text-slate-400">ID: #SK-2034</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <div className="text-xs">
                          <p className="text-slate-400">Glucose</p>
                          <p className="font-bold">7.2 mmol/L</p>
                        </div>
                        <div className="text-xs">
                          <p className="text-slate-400">SpO2</p>
                          <p className="font-bold">98%</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-md">Ổn định</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">10 phút trước</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full bg-slate-200"
                          data-alt="Patient Phạm Minh H avatar"
                          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVWHXZK60rwm9MmaiA29VqP8ASQil3c591s5uuDkVdKwjsRUz9RHL00AwcIvKfnm7sTOXzKNKN-nbUXzpn8_j5rS9-8y8-OLkWoG_bIJ-tvNu7kA5TN0IqYWvQTamN9pwGFHfvgkGuyil2rYepRAyvMBn9AzFgopcwac8GX4iwy5aaHqtE6N4CzrwJf_kIMQWAO0QGQRpmQCZwYxcMQqaUSBGFRzbKGyvoidiTokz-2varrt7wx1PwpL0TgtgO3T9xoYBE0wh875k')" }}>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Phạm Minh H</p>
                          <p className="text-[10px] text-slate-400">ID: #SK-2155</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <div className="text-xs">
                          <p className="text-slate-400">Huyết áp</p>
                          <p className="font-bold">135/85</p>
                        </div>
                        <div className="text-xs">
                          <p className="text-slate-400">BMI</p>
                          <p className="font-bold">24.5</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-amber-100 text-amber-600 text-[10px] font-bold rounded-md">Cần kiểm tra</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">2 giờ trước</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Rescheduling Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200 border border-primary/10 transition-all">
            <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 transition-all">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Đặt lịch tái khám</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">Thiết lập lịch hẹn tiếp theo cho bệnh nhân của bạn</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              >
                <span className="material-symbols-outlined font-bold">close</span>
              </button>
            </div>

            <div className="p-10 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold border-l-4 border-primary pl-2">Thông tin bệnh nhân</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                      </div>
                      <select className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-bold text-sm appearance-none outline-none shadow-sm transition-all">
                        <option value="1">Nguyễn Văn A - ID: BN-8842</option>
                        <option value="2">Trần Thị B - ID: BN-8839</option>
                        <option value="3">Lê Văn C - ID: BN-2034</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 font-bold">
                        <span className="material-symbols-outlined">expand_more</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold border-l-4 border-primary pl-2">Chọn ngày khám</label>
                    <div className="p-8 border border-slate-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-800/20 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <button className="p-2 hover:bg-primary/10 rounded-xl transition-all text-slate-400 hover:text-primary">
                          <span className="material-symbols-outlined font-bold">chevron_left</span>
                        </button>
                        <span className="text-sm font-extrabold uppercase tracking-widest text-primary">Tháng 11, 2024</span>
                        <button className="p-2 hover:bg-primary/10 rounded-xl transition-all text-slate-400 hover:text-primary">
                          <span className="material-symbols-outlined font-bold">chevron_right</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-7 text-center text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-widest opacity-60">
                        <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                      </div>
                      <div className="grid grid-cols-7 gap-3">
                        {[27, 28, 29, 30, 31].map(d => <div key={d} className="text-xs h-10 flex items-center justify-center text-slate-300 font-medium">{d}</div>)}
                        {[1, 2, 3, 4].map(d => <button key={d} className="text-xs font-bold h-10 flex items-center justify-center rounded-xl hover:bg-primary/10 hover:text-primary transition-all">{d}</button>)}
                        <button className="text-xs font-extrabold h-10 flex items-center justify-center rounded-xl bg-primary text-slate-900 shadow-xl shadow-primary/20 transform scale-110 z-10">5</button>
                        {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(d => <button key={d} className="text-xs font-bold h-10 flex items-center justify-center rounded-xl hover:bg-primary/10 hover:text-primary transition-all">{d}</button>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold border-l-4 border-primary pl-2">Hình thức khám bệnh</label>
                    <div className="flex gap-4">
                      <label className="flex-1 cursor-pointer group">
                        <input defaultChecked className="peer hidden" name="resched-type" type="radio" />
                        <div className="flex flex-col items-center gap-3 px-4 py-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all hover:border-primary/30">
                          <span className="material-symbols-outlined text-3xl font-light group-hover:scale-110 transition-transform">person_pin_circle</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest">Trực tiếp</span>
                        </div>
                      </label>
                      <label className="flex-1 cursor-pointer group">
                        <input className="peer hidden" name="resched-type" type="radio" />
                        <div className="flex flex-col items-center gap-3 px-4 py-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all hover:border-primary/30">
                          <span className="material-symbols-outlined text-3xl font-light group-hover:scale-110 transition-transform">videocam</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest">Online</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold border-l-4 border-primary pl-2">Giờ khám ưu tiên</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30'].map(time => (
                        <button
                          key={time}
                          className={`py-3 text-xs font-extrabold rounded-xl border-2 transition-all ${
                            time === '09:00' 
                            ? 'border-primary bg-primary/5 text-primary scale-105 shadow-sm shadow-primary/10' 
                            : 'border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-primary/30'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold border-l-4 border-primary pl-2">Ghi chú lâm sàng</label>
                    <textarea
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium transition-all shadow-sm outline-none resize-none"
                      placeholder="BS ghi chú thêm dặn dò cho bệnh nhân tại đây..."
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-10 py-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 z-10 transition-all">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-10 py-3 text-sm font-extrabold text-slate-900 bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95 transform"
              >
                <span className="material-symbols-outlined font-bold">send</span>
                Lưu &amp; Gửi thông báo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Advice Modal */}
      {isAdviceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setIsAdviceModalOpen(false)}
          ></div>
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 border border-primary/10 transition-all">
            <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 transition-all">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Gửi lời khuyên chuyên môn</h2>
              <button 
                onClick={() => setIsAdviceModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500"
              >
                <span className="material-symbols-outlined font-bold">close</span>
              </button>
            </div>

            <div className="p-10 space-y-8 overflow-y-auto max-h-[80vh] custom-scrollbar text-left">
              <div className="flex items-center gap-6 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden shadow-inner flex-shrink-0"
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUstbGh5q911TPTLus7gX2RIO2ML_RSZbjV67EFkDBw0zf6vQQzS7IP3LwXkWI6OWS4mwx5KhEFyn-NJ5T-OeMOhMLb321T1uEw1ypz_mfVSy4RJSGZA4h5NHgwDOx8syKTRjqsnQ5cRRZlRIs0lxo8cA7nJHIBpBUgVAUxh3e6QkBpGR5iW1WaEsU3Xu5JdVd5WA_HjKsBFimtKG_GF5CgYz-JAa03FTdaPVVyoP_Kqd8-PCCC03jKnqOMbqTRYOC5StfAJMV2wM')`, backgroundSize: 'cover' }}>
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white text-lg">Nguyễn Văn A</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-70">ID: BN-12345678</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold border-l-4 border-primary pl-2 uppercase tracking-tight">Danh mục lời khuyên</label>
                <select className="w-full rounded-xl border-none bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none py-3.5 px-4 shadow-sm transition-all appearance-none cursor-pointer">
                  <option>Dinh dưỡng & Chế độ ăn</option>
                  <option>Vận động / Thể dục</option>
                  <option>Sử dụng thuốc đúng cách</option>
                  <option>Theo dõi chỉ số tại nhà</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold border-l-4 border-primary pl-2 uppercase tracking-tight">Nội dung tư vấn</label>
                <textarea
                  className="w-full rounded-2xl border-none bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-primary/50 min-h-[150px] p-5 outline-none transition-all shadow-sm resize-none"
                  placeholder="Bác sĩ nhập lời khuyên chi tiết tại đây..."
                ></textarea>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-2">Gợi ý mẫu nhanh</p>
                <div className="flex flex-wrap gap-2">
                  {['Hạn chế muối', 'Đi bộ 30p mỗi ngày', 'Theo dõi huyết áp sáng/tối', 'Uống đủ 2L nước'].map(template => (
                    <button
                      key={template}
                      className="px-5 py-2 bg-white dark:bg-slate-800 hover:bg-primary hover:text-slate-900 border border-slate-100 dark:border-slate-700 rounded-full text-xs font-bold transition-all text-slate-600 dark:text-slate-400 shadow-sm active:scale-95"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-10 py-6 bg-slate-50 dark:bg-slate-900/50 flex gap-4 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-10">
              <button
                onClick={() => setIsAdviceModalOpen(false)}
                className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                type="button"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => setIsAdviceModalOpen(false)}
                className="flex-[1.5] py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-slate-900 font-extrabold text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                type="button"
              >
                <span className="material-symbols-outlined font-bold">send</span>
                Gửi lời khuyên ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal - Redesigned to match test.html 100% */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setIsPrescriptionModalOpen(false)}
          ></div>
          
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">description</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Kê đơn thuốc mới</h2>
              </div>
              <button 
                onClick={() => setIsPrescriptionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-8 text-left">
              {/* Patient & Diagnosis Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bệnh nhân</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                    <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none text-slate-900 dark:text-white font-medium">
                      <option>Nguyễn Văn A</option>
                      <option>Trần Thị B</option>
                      <option>Lê Văn C</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chẩn đoán hiện tại</label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium"
                    placeholder="Nhập chẩn đoán..."
                    type="text"
                    defaultValue="Viêm họng cấp / Theo dõi đái tháo đường"
                  />
                </div>
              </div>

              {/* Medication Dynamic List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">pill</span>
                    Danh sách thuốc
                  </h3>
                  <button className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Thêm thuốc
                  </button>
                </div>
                <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Tên thuốc &amp; Hàm lượng</th>
                        <th className="px-4 py-3">Liều dùng</th>
                        <th className="px-4 py-3">Tần suất</th>
                        <th className="px-4 py-3">Thời gian</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-4 text-slate-900 dark:text-white">
                          <div className="font-medium">Metformin 500mg</div>
                          <div className="text-xs text-slate-400">Uống sau khi ăn</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-900 dark:text-white">1 viên</td>
                        <td className="px-4 py-4 text-sm text-slate-900 dark:text-white">Sáng 1, Tối 1</td>
                        <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">30 ngày</td>
                        <td className="px-4 py-4 text-right">
                          <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-4 text-slate-900 dark:text-white">
                          <div className="font-medium">Paracetamol 500mg</div>
                          <div className="text-xs text-slate-400">Khi sốt trên 38.5 độ</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-900 dark:text-white">1 viên</td>
                        <td className="px-4 py-4 text-sm text-slate-900 dark:text-white">Cách 4-6 giờ</td>
                        <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">5 ngày</td>
                        <td className="px-4 py-4 text-right">
                          <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes & Follow-up Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-sm">edit_note</span>
                    Ghi chú dược sĩ/bệnh nhân
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-slate-900 dark:text-white text-sm"
                    placeholder="Nhập lời dặn thêm..."
                    rows={3}
                  ></textarea>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">event_repeat</span>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Hẹn tái khám</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Tự động nhắc lịch cho bệnh nhân</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ngày tái khám dự kiến</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
                      <input
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium"
                        type="date"
                        defaultValue="2023-12-25"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsPrescriptionModalOpen(false)}
                className="px-6 py-2.5 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => setIsPrescriptionModalOpen(false)}
                className="px-8 py-2.5 rounded-lg font-bold bg-primary text-slate-900 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                Lưu &amp; Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
