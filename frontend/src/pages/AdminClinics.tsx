import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import CreateClinicModal from '../features/admin/components/CreateClinicModal';
import EditClinicModal from '../features/admin/components/EditClinicModal';
import ClinicDetailsModal from '../features/admin/components/ClinicDetailsModal';
import Toast from '../components/ui/Toast';

export default function AdminClinics() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');

  const [clinicList, setClinicList] = useState([
    {
      id: 'TA-102',
      name: 'Phòng khám Đa khoa Tâm Anh',
      address: '108 Hoàng Như Tiếp, Long Biên, Hà Nội',
      phone: '02438723872',
      doctors: 42,
      status: 'Hoạt động',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0Ii3-LGAIeON1-nk04Zi4Eu2x9EVZ6mFMZ_Dnw0uvY2SL69Hf3NspoaNsLTIoaGambXk8wS59kmGui7ZsRbODIs7z1oaei91X5nNg33Brcu9joYi8A8adAytn1RKXOkxugZM_qc3-tKGkKgceAJHyjUVRDLAzh8PwEk4tLQXdtryIlcAGyBAuJ1dAM_XtzS5CwcjQAsl2jAN2GWDYg722SQihQSP3BY4bd8obcjoudbjweW2zZtHGvG5w6TdjHyuo6VC53Dpxygg'
    },
    {
      id: 'ND-204',
      name: 'Phòng khám Nhi Đồng 1',
      address: '341 Sư Vạn Hạnh, Quận 10, TP.HCM',
      phone: '02839271119',
      doctors: 28,
      status: 'Hoạt động',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASIMfKqCxOGTG9uAabZNTIM_sDfKR1h7YtRcQzn_97GnEva9ZtVzXMr_FO0aPHZCTDzT3FjRaOUH_gRdD9N3yfa7sJcDRDllCD6K6N5_-xKrT88ozPNM-ffXS27g-a4UEmAYPRzONw8CdWHj1Ylz08UPYyx4VsPr6SMOLovdbpQTHWiCv6VAcxbbI0hr6ec0bbqTSpS3rc2yGS7D23xR10eUO4r8inNxPC9lgURQ9zS71feqYtD-l1-0L-F2foQYtCzeLzJUWU92Y'
    },
    {
      id: 'VD-301',
      name: 'Vitality Dental Care',
      address: '25 Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '02838211122',
      doctors: 12,
      status: 'Ngưng hoạt động',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDMO02q5y8AcWuVlVoZvVB67uulWro0vTjt6aIUYF1NKHS3GmSaMq06ANB2SwJE2kRufQb89fdaQ9MbMTDErnxvPQ1P9nn0VhgsJdkocIlAYWExvzDT60SQw6cRmuJ1sLNJw9FVQeqSMe_a4zubor4BYdvaSmJWd5ZXWiHZpA32K_Z5bq-93vM7yB3koc--HuB5ePtrAYWSE9UgF00kKzsjO5auuiDTuMiO8-Ho7VU4DZSzNvUpn7h5V7MKYtn9U15Zn7k50YO-Jk'
    },
    {
      id: 'ML-009',
      name: 'Mediscan Central Lab',
      address: '12 Nguyễn Trãi, Quận 5, TP.HCM',
      phone: '02866778899',
      doctors: 15,
      status: 'Hoạt động',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUE6bdi3mbjtLGmlTlcWymdQZeI12a8Y93_YVHa_ntUKPDjmIZmLdPDFQ75TYg1G0d3W1Ks8DH2RGp30iZtBOddhlgHoSZ4YovuLDyHTFHeQj4A9lfXL5tMVJNanRU5TcLkDWEjx3Eu2rDcjLR5SNA4d2Vb0ZtXnDorUOQN-_ZOWHvBPGO-Jot_SGbGgABBc_N_d2ir_aSipxlnJym8-LDGOfqSBeO9g8PMW5dXXG9iwhuFJnoHaofPxHa1J4hZVRNIlFk7l6pF4w'
    }
  ]);

  const stats = [
    { title: 'Tổng số phòng khám', value: clinicList.length.toString(), change: '+4%', icon: 'apartment', color: 'primary' },
    { title: 'Đang hoạt động', value: clinicList.filter(c => c.status === 'Hoạt động').length.toString(), icon: 'check_circle', color: 'emerald' },
    { title: 'Phòng khám tạm khóa', value: clinicList.filter(c => c.status === 'Ngưng hoạt động').length.toString(), icon: 'lock_reset', color: 'red' },
    { title: 'Tổng bác sĩ hệ thống', value: '156', icon: 'stethoscope', color: 'indigo' },
  ];

  const handleExport = () => {
    const today = new Date().toLocaleDateString('vi-VN');
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <style>
          th { background: #3bb9f3; color: white; font-weight: bold; border: 0.5pt solid #ccc; }
          td { border: 0.5pt solid #ccc; mso-number-format:"\\@"; }
        </style>
      </head>
      <body>
        <h3>DANH SÁCH CHI TIẾT PHÒNG KHÁM - ${today}</h3>
        <table border="1">
          <thead>
            <tr>
              <th>Mã Phòng Khám</th>
              <th>Tên Phòng Khám</th>
              <th>Địa Chỉ</th>
              <th>Số Điện Thoại</th>
              <th>Số Lượng Bác Sĩ</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            ${clinicList.map(c => `
              <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.address}</td>
                <td>${c.phone}</td>
                <td>${c.doctors}</td>
                <td>${c.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Danh_sach_phong_kham_${today.replace(/\//g, '-')}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateClinic = async (data: any) => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newClinic = {
      ...data,
      id: data.clinicCode,
      image: data.imageUrl,
      doctors: 0,
      status: 'Hoạt động'
    };
    setClinicList([newClinic, ...clinicList]);
    setIsSaving(false);
    setIsCreateModalOpen(false);
    setToastTitle(`Đã khởi tạo hệ thống cho ${data.name} thành công!`);
    setShowToast(true);
  };

  const handleEditClinic = async (data: any) => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setClinicList(clinicList.map(c => c.id === data.id ? {
      ...c,
      name: data.name,
      address: data.address,
      phone: data.phone,
      status: data.status === 'ACTIVE' ? 'Hoạt động' : 'Ngưng hoạt động'
    } : c));
    setIsSaving(false);
    setIsEditModalOpen(false);
    setToastTitle(`Cập nhật thông tin ${data.name} thành công!`);
    setShowToast(true);
  };

  const handleLockClinic = async (clinic: any) => {
    const action = clinic.status === 'Hoạt động' ? 'khóa' : 'mở khóa';
    const newStatus = clinic.status === 'Hoạt động' ? 'Ngưng hoạt động' : 'Hoạt động';

    // Simulate API
    setClinicList(clinicList.map(c => c.id === clinic.id ? { ...c, status: newStatus } : c));
    setToastTitle(`Đã ${action} phòng khám ${clinic.name}`);
    setShowToast(true);
  };

  const filteredClinics = clinicList.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && c.status === 'Hoạt động') ||
      (statusFilter === 'INACTIVE' && c.status === 'Ngưng hoạt động');
    return matchesSearch && matchesStatus;
  });


  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý Phòng khám</h2>
            <p className="text-[16px] text-slate-500 mt-1 font-medium">Theo dõi và điều phối mạng lưới y tế</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-all hover:bg-slate-200"
            >
              <span className="material-symbols-outlined text-xl">ios_share</span>
              Xuất báo cáo
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold transition-all hover:opacity-90 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Thêm phòng khám mới
            </button>
          </div>
        </div>

        {/* Bento Grid Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm group hover:border-primary/20 transition-all text-left">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 flex items-center justify-center text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}`}>
                  <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                </div>
                {stat.change && (
                  <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg text-[13px] font-bold">{stat.change} tháng</span>
                )}
              </div>
              <p className="text-slate-500 text-[15px] font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* List Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-primary/5 text-left">
          <div className="px-8 py-6 border-b border-primary/10 flex justify-between items-center">
            <h4 className="text-[19px] font-bold text-slate-900 dark:text-white">Danh sách chi tiết hệ thống</h4>
            <div className="flex gap-2">
              <div className="relative hidden sm:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${statusFilter !== 'ALL' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary border-0'
                    }`}
                  title="Lọc danh sách"
                >
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                </button>

                {isFilterDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsFilterDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-primary/5 p-2 z-40 animate-in fade-in slide-in-from-top-2 duration-200">                      {[
                      { id: 'ALL', label: 'Tất cả hệ thống', icon: 'apps' },
                      { id: 'ACTIVE', label: 'Đang hoạt động', icon: 'check_circle' },
                      { id: 'INACTIVE', label: 'Đang tạm dừng', icon: 'block' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setStatusFilter(item.id as any); setIsFilterDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${statusFilter === item.id
                            ? 'bg-primary/10 text-primary'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                      >
                        <span className={`material-symbols-outlined text-[18px] ${statusFilter === item.id ? 'text-primary' : 'text-slate-400'}`}>{item.icon}</span>
                        {item.label}
                        {statusFilter === item.id && <span className="material-symbols-outlined text-sm ml-auto">check</span>}
                      </button>
                    ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-4 text-[15px] font-medium text-slate-500 leading-none">Tên phòng khám</th>
                  <th className="px-6 py-4 text-[15px] font-medium text-slate-500 leading-none">Địa chỉ</th>
                  <th className="px-6 py-4 text-[15px] font-medium text-slate-500 leading-none">Số điện thoại</th>
                  <th className="px-6 py-4 text-[15px] font-medium text-slate-500 leading-none text-center">Bác sĩ</th>
                  <th className="px-6 py-4 text-[15px] font-medium text-slate-500 leading-none">Trạng thái</th>
                  <th className="px-8 py-4 text-[15px] font-medium text-slate-500 leading-none text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredClinics.map((clinic, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden border border-primary/10">
                          {clinic.image ? (
                            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={clinic.image} alt={clinic.name} />
                          ) : (
                            <span className="material-symbols-outlined text-primary/40">home_health</span>
                          )}
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-white text-base leading-tight">{clinic.name}</span>
                          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{clinic.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 relative group/address">
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[220px]">
                        {clinic.address}
                      </p>
                      {/* Premium Tooltip */}
                      <div className="absolute left-6 bottom-[80%] hidden group-hover/address:block z-50 animate-in fade-in zoom-in duration-200 pointer-events-none">
                        <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white text-[13px] font-medium px-4 py-2.5 rounded-xl shadow-2xl border border-white/10 backdrop-blur-md w-max max-w-[320px] leading-relaxed">
                          {clinic.address}
                          <div className="absolute top-full left-4 border-8 border-transparent border-t-slate-900/95 dark:border-t-slate-800/95"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400 font-bold">{clinic.phone}</td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[15px] font-bold text-slate-700 dark:text-slate-200">{clinic.doctors}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-white text-[13px] font-bold shadow-sm whitespace-nowrap inline-flex tracking-tighter ${clinic.status === 'Hoạt động' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}>
                        {clinic.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 transition-all">
                        <button
                          onClick={() => { setSelectedClinic(clinic); setIsEditModalOpen(true); }}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-all duration-300"
                          title="Chỉnh sửa"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleLockClinic(clinic)}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${clinic.status === 'Hoạt động'
                            ? 'bg-red-500/5 text-red-500 hover:bg-red-500/10'
                            : 'bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10'}`}
                          title={clinic.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}
                        >
                          <span className="material-symbols-outlined text-[18px]">{clinic.status === 'Hoạt động' ? 'lock' : 'lock_open'}</span>
                        </button>
                        <button
                          onClick={() => { setSelectedClinic(clinic); setIsDetailsModalOpen(true); }}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-500/5 text-indigo-500 hover:bg-indigo-500/10 transition-all duration-300"
                          title="Chi tiết"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-primary/10 flex justify-between items-center">
            <span className="text-[14px] text-slate-500 font-medium">Đang hiển thị {filteredClinics.length}/{clinicList.length} phòng khám</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-primary/5 dark:bg-primary/10 p-8 rounded-2xl border border-primary/10 flex items-center justify-between">
            <div>
              <h5 className="text-[19px] font-bold text-slate-900 dark:text-white mb-2">Tăng trưởng hạ tầng quý 3</h5>
              <p className="text-[16px] font-medium text-slate-500 leading-relaxed max-w-md">Mạng lưới Vitality đã mở rộng thêm 2 phòng khám đa khoa mới trong tháng này. Hiệu suất kết nối giữa các đơn vị tăng 15%.</p>
              <button className="mt-4 flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                Xem báo cáo hạ tầng
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-primary/10 shadow-sm flex flex-col justify-center text-left">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-indigo-500">hub</span>
              <h5 className="text-xl font-black text-slate-900 dark:text-white">Kết nối hệ thống</h5>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-[14px] font-medium text-slate-500 mb-2">
                  <span>Bảo trì hệ thống</span>
                  <span className="text-primary">Xong</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[14px] font-medium text-slate-500 mb-2">
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
      </section>

      <CreateClinicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isSaving={isSaving}
        onSave={handleCreateClinic}
      />

      <EditClinicModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        clinic={selectedClinic}
        isSaving={isSaving}
        onSave={handleEditClinic}
      />

      <ClinicDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        clinic={selectedClinic}
      />

      <Toast
        show={showToast}
        title={toastTitle}
        onClose={() => setShowToast(false)}
      />
    </AdminLayout>
  );
}
