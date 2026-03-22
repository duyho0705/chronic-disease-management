
export default function DoctorDashboard() {
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
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">groups</span>
            <span>Danh sách bệnh nhân</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">analytics</span>
            <span>Phân tích nguy cơ</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="#">
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
                  <button className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group">
                    <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <span className="font-bold text-sm">Kê đơn thuốc mới</span>
                  </button>
                  <button className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group">
                    <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined">send</span>
                    </div>
                    <span className="font-bold text-sm">Gửi lời khuyên</span>
                  </button>
                  <button className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group">
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
    </div>
  );
}
