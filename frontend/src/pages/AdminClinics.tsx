import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

export default function AdminClinics() {
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { title: 'Tổng số phòng khám', value: '24', change: '+4%', icon: 'domain', color: 'primary' },
    { title: 'Đang hoạt động', value: '22', icon: 'check_circle', color: 'emerald' },
    { title: 'Phòng khám tạm khóa', value: '2', icon: 'lock_reset', color: 'red' },
    { title: 'Tổng bác sĩ hệ thống', value: '156', icon: 'person', color: 'indigo' },
  ];

  const clinics = [
    {
      id: 'TA-102',
      name: 'Phòng khám Đa khoa Tâm Anh',
      address: '108 Hoàng Như Tiếp, Long Biên, Hà Nội',
      phone: '024 3872 3872',
      doctors: 42,
      status: 'Đang hoạt động',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0Ii3-LGAIeON1-nk04Zi4Eu2x9EVZ6mFMZ_Dnw0uvY2SL69Hf3NspoaNsLTIoaGambXk8wS59kmGui7ZsRbODIs7z1oaei91X5nNg33Brcu9joYi8A8adAytn1RKXOkxugZM_qc3-tKGkKgceAJHyjUVRDLAzh8PwEk4tLQXdtryIlcAGyBAuJ1dAM_XtzS5CwcjQAsl2jAN2GWDYg722SQihQSP3BY4bd8obcjoudbjweW2zZtHGvG5w6TdjHyuo6VC53Dpxygg'
    },
    {
      id: 'ND-204',
      name: 'Phòng khám Nhi Đồng 1',
      address: '341 Sư Vạn Hạnh, Quận 10, TP.HCM',
      phone: '028 3927 1119',
      doctors: 28,
      status: 'Đang hoạt động',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASIMfKqCxOGTG9uAabZNTIM_sDfKR1h7YtRcQzn_97GnEva9ZtVzXMr_FO0aPHZCTDzT3FjRaOUH_gRdD9N3yfa7sJcDRDllCD6K6N5_-xKrT88ozPNM-ffXS27g-a4UEmAYPRzONw8CdWHj1Ylz08UPYyx4VsPr6SMOLovdbpQTHWiCv6VAcxbbI0hr6ec0bbqTSpS3rc2yGS7D23xR10eUO4r8inNxPC9lgURQ9zS71feqYtD-l1-0L-F2foQYtCzeLzJUWU92Y'
    },
    {
      id: 'VD-301',
      name: 'Vitality Dental Care',
      address: '25 Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '028 3821 1122',
      doctors: 12,
      status: 'Tạm khóa',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDMO02q5y8AcWuVlVoZvVB67uulWro0vTjt6aIUYF1NKHS3GmSaMq06ANB2SwJE2kRufQb89fdaQ9MbMTDErnxvPQ1P9nn0VhgsJdkocIlAYWExvzDT60SQw6cRmuJ1sLNJw9FVQeqSMe_a4zubor4BYdvaSmJWd5ZXWiHZpA32K_Z5bq-93vM7yB3koc--HuB5ePtrAYWSE9UgF00kKzsjO5auuiDTuMiO8-Ho7VU4DZSzNvUpn7h5V7MKYtn9U15Zn7k50YO-Jk'
    },
    {
      id: 'ML-009',
      name: 'Mediscan Central Lab',
      address: '12 Nguyễn Trãi, Quận 5, TP.HCM',
      phone: '028 6677 8899',
      doctors: 15,
      status: 'Đang hoạt động',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUE6bdi3mbjtLGmlTlcWymdQZeI12a8Y93_YVHa_ntUKPDjmIZmLdPDFQ75TYg1G0d3W1Ks8DH2RGp30iZtBOddhlgHoSZ4YovuLDyHTFHeQj4A9lfXL5tMVJNanRU5TcLkDWEjx3Eu2rDcjLR5SNA4d2Vb0ZtXnDorUOQN-_ZOWHvBPGO-Jot_SGbGgABBc_N_d2ir_aSipxlnJym8-LDGOfqSBeO9g8PMW5dXXG9iwhuFJnoHaofPxHa1J4hZVRNIlFk7l6pF4w'
    }
  ];

  return (
    <AdminLayout>
      <div className="p-12 animate-in fade-in duration-700 font-display">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-left">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý Phòng khám</h2>
            <p className="text-[15px] text-slate-500 mt-1">Theo dõi và điều phối mạng lưới y tế</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-all hover:bg-slate-200">
              <span className="material-symbols-outlined text-xl">ios_share</span>
              Xuất báo cáo
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold transition-all hover:opacity-90 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-xl">add</span>
              Thêm phòng khám mới
            </button>
          </div>
        </div>

        {/* Bento Grid Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm group hover:border-primary/20 transition-all text-left">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 flex items-center justify-center text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}`}>
                  <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                </div>
                {stat.change && (
                  <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg text-xs font-bold">{stat.change} month</span>
                )}
              </div>
              <p className="text-slate-500 text-[13px] font-black uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* List Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-primary/10 text-left">
          <div className="px-8 py-6 border-b border-primary/10 flex justify-between items-center">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">Danh sách chi tiết hệ thống</h4>
            <div className="flex gap-2">
              <div className="relative hidden sm:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">Tên phòng khám</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">Địa chỉ</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">Số điện thoại</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 leading-none text-center">Bác sĩ</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">Trạng thái</th>
                  <th className="px-8 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 leading-none text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {clinics.map((clinic, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden border border-primary/10">
                          <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={clinic.image} alt={clinic.name} />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-white text-base leading-tight">{clinic.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Mã: {clinic.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-1 max-w-[200px]">{clinic.address}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400 font-bold">{clinic.phone}</td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-black">{clinic.doctors}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${clinic.status === 'Đang hoạt động'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-600'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${clinic.status === 'Đang hoạt động' ? 'bg-primary' : 'bg-red-600'}`}></span>
                        {clinic.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors" title="Chỉnh sửa">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors" title="Khóa">
                          <span className="material-symbols-outlined text-xl">lock</span>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-500 transition-colors" title="Chi tiết">
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-primary/10 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Đang hiển thị 4 trong 24 phòng khám</span>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-white font-bold text-xs ring-2 ring-primary/20">1</button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-white dark:hover:bg-slate-700">2</button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-white dark:hover:bg-slate-700">3</button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contextual Insights Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-primary/5 dark:bg-primary/10 p-8 rounded-2xl border border-primary/10 flex items-center justify-between">
            <div>
              <h5 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Tăng trưởng hạ tầng quý 3</h5>
              <p className="text-[16px] font-medium text-slate-500 leading-relaxed max-w-md">Mạng lưới Vitality đã mở rộng thêm 2 phòng khám đa khoa mới trong tháng này. Hiệu suất kết nối giữa các đơn vị tăng 15%.</p>
              <button className="mt-4 flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                Xem báo cáo hạ tầng
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="hidden md:block w-32 h-32 opacity-10">
              <span className="material-symbols-outlined text-[8rem]">architecture</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-primary/10 shadow-sm flex flex-col justify-center text-left">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-indigo-500">hub</span>
              <h5 className="text-xl font-black text-slate-900 dark:text-white">Kết nối hệ thống</h5>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  <span>Bảo trì hệ thống</span>
                  <span className="text-primary">Xong</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  <span>Đồng bộ dữ liệu</span>
                  <span className="text-slate-600 dark:text-slate-300">94%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[94%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
