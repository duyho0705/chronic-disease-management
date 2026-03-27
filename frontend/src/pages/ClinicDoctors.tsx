import { useState } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';

export default function ClinicDoctors() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo mới', description: 'Có báo cáo tổng quát tháng 12 vừa được tạo.', time: '5 phút trước', read: false },
        { id: 2, title: 'Cảnh báo nguy cơ', description: 'Bệnh nhân Nguyễn Văn An có chỉ số bất thường.', time: '1 giờ trước', read: false },
    ]);

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none">
            {/* Sidebar Navigation */}
            <ClinicSidebar isSidebarOpen={isSidebarOpen} />

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Header */}
                <TopBar 
                    setIsSidebarOpen={setIsSidebarOpen}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    userName="Admin Sarah"
                    userRole="Senior Manager"
                    userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9fuTZde7EUIINhAwZDAYbGdWhfZuvszHFDZODEHBxXo3hRWmKfCmGfg6Xgckf0DONyYs8LQEOXng1sISGQVj9ec2pSs--Gz-xPlj6elGIG3KtZTO9U-57mPPcUxuNMtJbLamHmXAsWrVwobD4Ai-pKgNGU0yfv596RmDCRUawQMx8gmW7E2J_we-R_YITLa95pCcbtDZf6tkb7C6bWKKzwepNG2pc4L5uji1KMHQetqk8390TVAlxrRao3qco3laKWLu0uA-BmQ"
                    showSearch={true}
                    actionButton={
                        <button className="bg-primary text-slate-900 px-6 py-2.5 mr-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 hover:scale-[0.98] transition-all shadow-sm whitespace-nowrap">
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>Thêm bác sĩ</span>
                        </button>
                    }
                />

                {/* Content Canvas */}
                <div className="p-8 space-y-10">
                    {/* Filters & Summary Bento Grid */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Filter Actions */}
                        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-primary/5 shadow-sm flex flex-wrap items-center gap-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Bộ lọc trạng thái:</span>
                            {[
                                { label: 'Tất cả bác sĩ', active: true, pulse: true },
                                { label: 'Đang hoạt động', active: false },
                                { label: 'Nghỉ phép', active: false },
                                { label: 'Đã đủ lịch', active: false }
                            ].map((filter, i) => (
                                <button
                                    key={i}
                                    className={`px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${filter.active
                                            ? 'bg-primary text-slate-900 shadow-lg shadow-primary/10'
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary'
                                        }`}
                                >
                                    {filter.pulse && <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse"></span>}
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Stats Mini Card */}
                        <div className="col-span-12 lg:col-span-4 bg-primary/10 rounded-[2rem] border border-primary/5 p-6 flex items-center justify-between overflow-hidden relative group shadow-sm transition-all hover:shadow-md">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Tổng số bác sĩ</p>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white">42</h3>
                            </div>
                            <div className="w-16 h-16 bg-primary text-slate-900 rounded-2xl flex items-center justify-center relative z-10 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_information</span>
                            </div>
                            {/* Decorative background icon */}
                            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-9xl text-primary/5 group-hover:scale-110 transition-transform">medical_services</span>
                        </div>
                    </div>

                    {/* Doctor Directory Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-primary/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Thông tin bác sĩ</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Chuyên khoa</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Liên hệ</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Bệnh nhân</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Đánh giá</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {[
                                        {
                                            name: 'TS. BS. Nguyễn Văn An', id: 'D-4092', specialty: 'Nội khoa',
                                            email: 'an.nguyen@clinic.vn', phone: '+84 902 345 678', load: 128, rating: '4.9', reviews: 124,
                                            status: 'Đang hoạt động', statusColor: 'primary',
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8l1TSR8QqNUTZi_iBf5NDAWqMisZHLRu3j73Axu4SkhNhEXD2SAg6QXf-qaRl3wE204eABtqWh54oW72o3YdXvWqKIoEH5KTU_hpURc9hEmJIVfRScevIKpEAq26goehjMxlI-2iXQVecGYAo1kwPSR79P-clKbRNtLOd2KfJ5YNE4lAgi_-CWsiTOoQAd397gmPHCt04ABZ26GJnQklEiY4q-CjnZ1bVmUUkOAIxcVrKFY7Sl7JwLW7zh-E-Itsukxb1ID7JwL8'
                                        },
                                        {
                                            name: 'ThS. BS. Lê Thị Bình', id: 'D-2184', specialty: 'Sản phụ khoa',
                                            email: 'binh.le@clinic.vn', phone: '+84 938 112 334', load: 84, rating: '4.8', reviews: 209,
                                            status: 'Nghỉ phép', statusColor: 'slate',
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9yLvMk6BUhpq4FLxSu2u9WQO1rBsyOYInapLQflgOtYBkOYv4CWpEmrU8s0M4CSk9HIjSi9K6OZKi9SwTImJfAdAN4pXHZX4b2_T5fjnkOjUC1yopuqQd7IEiyV32OcQuX4QI4BQ8D7UB_6h0ibu7w5C1KNIDC4TNKFZMajlLwvW4RKVeZTYCdVtkivG8AMdhCpIvCnMhC-CWoEFOkyY48X3MMsPcmIXSwu7rdl870KnZ25XKOoS_dpgNYfgwx-9i1mfQVEzXL-U'
                                        },
                                        {
                                            name: 'BS. CKII. Phạm Quốc Cường', id: 'D-5521', specialty: 'Nhi khoa',
                                            email: 'cuong.pham@clinic.vn', phone: '+84 912 999 000', load: 242, rating: '5.0', reviews: 438,
                                            status: 'Đã đủ lịch', statusColor: 'amber',
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAboso0sxfLLQWXoAkyQ4PjrDzGtVk7eK9A5M0GARfNrFZo2qWjzE0dL0X0SVmT_iNZg4StUX18smTTwilILdTSs1KPADmQto-mphuFNckhqeFUCXDPYsu8U58Ax61i6698FZQi1PYDKwSIgdCXSBTM_KlijtOs3fNISYz3SaIIb3ttQJ-ssqPKMoPuDHNWKlTlaGU6jQ0jVdibdLxl_dZ5ewP6tnuGt8ByfYEgugWhUqDvJHydPhsYoPiygfdgy_4P9YF4YWIOnsc'
                                        },
                                        {
                                            name: 'BS. Hoàng Minh Thư', id: 'D-8832', specialty: 'Tim mạch',
                                            email: 'thu.hoang@clinic.vn', phone: '+84 977 444 555', load: 112, rating: '4.7', reviews: 89,
                                            status: 'Đang hoạt động', statusColor: 'primary',
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUxtUCNo_eOW2i74f9dU2ke3O6DdFpNBqocx0VOIT6cKcbqDmYGlNCySrmpW4jb3yPPO0gvyNcggFq9jn0GsZXoCPmlZBJnP8aJUfU4v6lzivTFEc1ylw3JNb-sGeWVlEueNxMEuGrYnsb-nnyA84Oi5Sf336tH76LxB_vRKDHzz1FBJdVIgoJSfL9piK2ojcWK5DG7lxb8IoQapVNBHG8kMuLkEdXj5Q9wZx16HamSmVAQBXHG8kVj7N9ani-cxxqV-3mUBeWQLo'
                                        }
                                    ].map((dr, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <img alt={dr.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/10" src={dr.img} />
                                                        {dr.status === 'Đang hoạt động' && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-white dark:border-slate-900 rounded-full animate-pulse shadow-sm"></span>}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{dr.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Mã số: {dr.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-lg uppercase tracking-wider">
                                                    {dr.specialty}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{dr.email}</p>
                                                <p className="text-[10px] text-slate-400 font-medium tracking-tight whitespace-nowrap">{dr.phone}</p>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{dr.load}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 text-amber-400">
                                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="text-sm font-black text-slate-900 dark:text-white">{dr.rating}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold">({dr.reviews})</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${dr.statusColor === 'primary' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300' :
                                                        dr.statusColor === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300' :
                                                            'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                                    }`}>
                                                    {dr.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-tertiary hover:bg-tertiary/10 transition-all">
                                                        <span className="material-symbols-outlined text-lg">assignment_ind</span>
                                                    </button>
                                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hiển thị 4 trong số 42 bác sĩ</p>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all disabled:opacity-30" disabled>Trước</button>
                                <div className="flex items-center gap-1.5">
                                    <button className="w-10 h-10 rounded-xl bg-primary text-slate-900 text-xs font-black shadow-lg shadow-primary/20 transition-all">1</button>
                                    <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-xs font-bold text-slate-500 transition-all">2</button>
                                    <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-xs font-bold text-slate-500 transition-all">3</button>
                                </div>
                                <button className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:text-primary transition-all">Sau</button>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Action Bento: Featured Specialists */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Hiệu suất trung bình', val: '94%', sub: 'Trong 30 ngày qua', icon: 'analytics', color: 'primary', bar: true },
                            { label: 'Đánh giá tiêu biểu', val: '4.85/5.0', sub: 'Chất lượng chuyên môn', icon: 'star', color: 'tertiary', stars: true },
                            { label: 'Lịch hẹn tuần này', val: '312', sub: '+12% so với tuần trước', icon: 'calendar_month', color: 'secondary' }
                        ].map((card, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-primary/5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className={`w-12 h-12 bg-${card.color}/10 rounded-2xl flex items-center justify-center text-${card.color}`}>
                                        <span className="material-symbols-outlined">{card.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{card.label}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{card.sub}</p>
                                    </div>
                                </div>
                                <div className="text-4xl font-black text-slate-900 dark:text-white mb-4 relative z-10 leading-none">
                                    {card.val}
                                </div>

                                {card.bar && (
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden relative z-10">
                                        <div className="bg-primary h-full rounded-full transition-all duration-1000 group-hover:bg-primary" style={{ width: '94%' }}></div>
                                    </div>
                                )}

                                {card.stars && (
                                    <div className="flex gap-1 relative z-10">
                                        {[1, 2, 3, 4].map(s => <span key={s} className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                                        <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                                    </div>
                                )}

                                {i === 2 && (
                                    <div className="text-[11px] font-black text-primary flex items-center gap-1 relative z-10 uppercase tracking-tighter">
                                        <span className="material-symbols-outlined text-xs">arrow_upward</span>
                                        Tăng trưởng ổn định
                                    </div>
                                )}

                                <span className={`material-symbols-outlined absolute -right-6 -bottom-6 text-9xl text-${card.color}/5 group-hover:scale-110 transition-transform`}>{card.icon === 'analytics' ? 'trending_up' : card.icon === 'star' ? 'verified' : 'event_available'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
