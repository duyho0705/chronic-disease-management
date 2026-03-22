export default function DoctorPrescriptions() {
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
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="/doctor/patients">
                        <span className="material-symbols-outlined">groups</span>
                        <span>Danh sách bệnh nhân</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="/doctor/analytics">
                        <span className="material-symbols-outlined">analytics</span>
                        <span>Phân tích nguy cơ</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium transition-colors" href="/doctor/prescriptions">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>prescriptions</span>
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
                                className="w-10 h-10 rounded-full bg-slate-200 bg-cover bg-center"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvD1gNLm_sBMkVyq8FuYHA20LjP97yY90_RzaDO9mjZaL9ubIXYPTKQeV1FDlhsH3p7qndF3QILzvglilx1ly9Sb7AtePxkBlVz8-5HPGNI5wMlA1c27CCvjNz865bvs_Y9uYkK2245BaMa66pFJCTPXK2wTV6-A4oQjShYdPHNg1nx01j-yW7I48c8aShwiEDSx2B_FE04UGkIxELFaJ-Ho65BrMgC_LF9Yk0dKK7BGEGWjFX4zFwmnNWi44sq8khTm_Q-D-Iig4')" }}
                            ></div>
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
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="w-96 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/50 placeholder-slate-400 text-sm font-medium"
                            placeholder="Tìm kiếm mã đơn, bệnh nhân..."
                            type="text"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 relative hover:bg-slate-100 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 hover:bg-slate-100 transition-colors">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <button className="bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            Kê đơn mới
                        </button>
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Header Section */}
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Đơn thuốc điện tử</h2>
                        <p className="text-slate-500 mt-1">Quản lý và theo dõi phác đồ điều trị của bệnh nhân trực tiếp qua hệ thống</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-6xl text-primary">description</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng đơn thuốc</p>
                            <h3 className="text-3xl font-extrabold text-slate-900">1,284</h3>
                            <div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +12% tháng này
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-t-4 border-t-primary relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-primary">
                                <span className="material-symbols-outlined text-6xl">check_circle</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Đang hiệu lực</p>
                            <h3 className="text-3xl font-extrabold text-slate-900">452</h3>
                            <p className="mt-4 text-[10px] text-slate-500 font-medium">Đang được bệnh nhân sử dụng</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-orange-400">
                                <span className="material-symbols-outlined text-6xl">update</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chờ tái cấp</p>
                            <h3 className="text-3xl font-extrabold text-slate-900">18</h3>
                            <div className="mt-4 flex items-center gap-1 text-orange-500 text-xs font-bold">
                                <span className="material-symbols-outlined text-sm">priority_high</span>
                                Cần phê duyệt ngay
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-blue-400">
                                <span className="material-symbols-outlined text-6xl">task_alt</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hoàn thành</p>
                            <h3 className="text-3xl font-extrabold text-slate-900">814</h3>
                            <p className="mt-4 text-[10px] text-blue-500 font-bold tracking-wide">Tỷ lệ hồi phục: 94.2%</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* Table Section */}
                        <div className="xl:col-span-8 space-y-6">
                            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center border border-slate-100">
                                <div className="relative w-full md:w-auto md:flex-1">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2 bg-white border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                                        placeholder="Tìm bệnh nhân hoặc mã đơn..."
                                        type="text"
                                    />
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <select className="bg-white border border-slate-100 rounded-xl text-xs font-bold py-2 px-4 focus:ring-2 focus:ring-primary/20 outline-none">
                                        <option>Tất cả trạng thái</option>
                                        <option>Đang hiệu lực</option>
                                        <option>Hết hạn</option>
                                        <option>Đã hủy</option>
                                    </select>
                                    <button className="bg-white p-2 rounded-xl text-slate-500 hover:text-primary transition-colors border border-slate-100">
                                        <span className="material-symbols-outlined">calendar_month</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50">
                                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Mã đơn</th>
                                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Bệnh nhân</th>
                                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Chẩn đoán</th>
                                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {[
                                                { id: '#RX-8842', name: 'Nguyễn Văn Hùng', initial: 'NH', diagnosis: 'Viêm họng cấp tính, sốt nhẹ', status: 'Đang hiệu lực', color: 'emerald' },
                                                { id: '#RX-8839', name: 'Trần Thị Mai', initial: 'TM', diagnosis: 'Tăng huyết áp vô căn', status: 'Hết hạn', color: 'slate' },
                                                { id: '#RX-8831', name: 'Lê Anh Dũng', initial: 'LD', diagnosis: 'Phát ban do dị ứng', status: 'Đã hủy', color: 'red' },
                                                { id: '#RX-8825', name: 'Vũ Anh Kiệt', initial: 'VK', diagnosis: 'Đau dây thần kinh tọa', status: 'Đang hiệu lực', color: 'emerald' },
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-4 font-bold text-sm text-primary">{row.id}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full bg-${row.color}-100 flex items-center justify-center text-[10px] font-bold text-${row.color}-600`}>
                                                                {row.initial}
                                                            </div>
                                                            <span className="text-sm font-bold text-slate-700">{row.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-slate-500 font-medium max-w-[200px] truncate">{row.diagnosis}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors">
                                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                                            </button>
                                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                                                                <span className="material-symbols-outlined text-lg">print</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-6 flex items-center justify-between border-t border-slate-50 bg-slate-50/30">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hiển thị 10/1,284 kết quả</p>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm disabled:opacity-50">
                                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                                        </button>
                                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-white text-xs font-extrabold">1</button>
                                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">2</button>
                                        <button className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="xl:col-span-4 space-y-8">
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-sm font-extrabold uppercase tracking-tight text-slate-900 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">pill</span>
                                        Thuốc hay dùng
                                    </h4>
                                    <a className="text-[10px] font-bold text-primary hover:underline" href="#">Tất cả</a>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Paracetamol 500mg', desc: 'Giảm đau, hạ sốt', color: 'primary' },
                                        { name: 'Amoxicillin 250mg', desc: 'Kháng sinh phổ rộng', color: 'blue' },
                                        { name: 'Vitamin C 1000mg', desc: 'Thực phẩm chức năng', color: 'orange' },
                                    ].map((med, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                                            <div className={`w-10 h-10 rounded-xl bg-${med.color === 'primary' ? 'primary' : med.color}-50 flex items-center justify-center text-${med.color === 'primary' ? 'primary' : med.color}-500`}>
                                                <span className="material-symbols-outlined">{med.desc.includes('Kháng sinh') ? 'vaccines' : 'medication'}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-slate-800">{med.name}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">{med.desc}</p>
                                            </div>
                                            <button className="text-slate-200 group-hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-400">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-sm font-extrabold uppercase tracking-tight text-slate-900 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-400">history</span>
                                        Mẫu đơn gần đây
                                    </h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="p-4 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all cursor-pointer border-dashed border border-slate-200">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-slate-800">Điều trị Viêm xoang</span>
                                            <span className="text-[9px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Linh động</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium line-clamp-2">Amoxicillin, Loratadine, Nước muối sinh lý, Xịt mũi Corticoid...</p>
                                    </div>
                                    <button className="w-full py-3 border-2 border-dashed border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:border-primary hover:text-primary transition-all mt-4 flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">save</span>
                                        Lưu đơn hiện tại làm mẫu
                                    </button>
                                </div>
                            </section>

                            <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-primary/20">
                                <div className="relative z-10">
                                    <h5 className="font-extrabold text-lg mb-2 leading-tight">Quy định Kê đơn mới nhất</h5>
                                    <p className="text-xs opacity-90 leading-relaxed mb-4 font-medium">Đảm bảo tuân thủ thông tư 27/2021/TT-BYT về đơn thuốc điện tử an toàn.</p>
                                    <button className="bg-white text-primary px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md hover:bg-emerald-50 transition-colors">
                                        Xem hướng dẫn
                                    </button>
                                </div>
                                <div className="absolute -right-6 -bottom-6 opacity-20">
                                    <span className="material-symbols-outlined text-[120px] rotate-12">verified_user</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
