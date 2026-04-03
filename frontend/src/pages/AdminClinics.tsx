import { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import CreateClinicModal from '../features/admin/components/CreateClinicModal';
import EditClinicModal from '../features/admin/components/EditClinicModal';
import ClinicDetailsModal from '../features/admin/components/ClinicDetailsModal';
import Toast from '../components/ui/Toast';
import { clinicApi } from '../api/clinic';

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
  const [isLoading, setIsLoading] = useState(true);

  const [clinicList, setClinicList] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { title: 'Tổng số phòng khám', value: '0', change: '+0%', icon: 'apartment', color: 'primary' },
    { title: 'Đang hoạt động', value: '0', icon: 'check_circle', color: 'emerald' },
    { title: 'Ngưng hoạt động', value: '0', icon: 'block', color: 'red' },
    { title: 'Tổng bác sĩ hệ thống', value: '0', icon: 'stethoscope', color: 'indigo' },
  ]);

  const fetchClinics = async () => {
    setIsLoading(true);
    try {
      const response = await clinicApi.getClinics({
        keyword: searchTerm,
        status: statusFilter === 'ALL' ? undefined : statusFilter
      });
      const clinics = response.data.content;
      setClinicList(clinics.map((c: any) => ({
        id: c.clinicCode,
        realId: c.id,
        name: c.name,
        address: c.address,
        phone: c.phone,
        doctors: c.doctorCount || 0,
        status: c.status === 'ACTIVE' ? 'Hoạt động' : 'Ngưng hoạt động',
        image: c.imageUrl,
        adminFullName: c.managerName,
        adminEmail: c.managerEmail
      })));

      // Fetch REAL stats from API
      const statsRes = await clinicApi.getClinicStats();
      const s = statsRes.data;
      setStats([
        { title: 'Tổng số phòng khám', value: s.totalClinics.toString(), change: '+0%', icon: 'apartment', color: 'primary' },
        { title: 'Đang hoạt động', value: s.activeClinics.toString(), icon: 'check_circle', color: 'emerald' },
        { title: 'Ngưng hoạt động', value: s.inactiveClinics.toString(), icon: 'block', color: 'red' },
        { title: 'Tổng bác sĩ hệ thống', value: s.totalDoctors.toString(), icon: 'stethoscope', color: 'indigo' },
      ]);
    } catch (error) {
      console.error('Failed to fetch clinics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, [searchTerm, statusFilter]);

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
    try {
      await clinicApi.createClinic({
        name: data.name,
        address: data.address,
        phone: data.phone,
        clinicCode: data.clinicCode,
        adminFullName: data.adminFullName,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
        imageUrl: data.imageUrl
      });

      setToastTitle(`Đã khởi tạo hệ thống cho ${data.name} thành công!`);
      fetchClinics();
    } catch (error: any) {
      console.error('Failed to create clinic:', error);
      const msg = error.response?.data?.message || 'Lỗi hệ thống';
      setToastTitle(msg);
    } finally {
      setIsSaving(false);
      setIsCreateModalOpen(false);
      setShowToast(true);
    }
  };

  const handleEditClinic = async (data: any) => {
    setIsSaving(true);
    try {
      await clinicApi.updateClinic(data.realId, {
        name: data.name,
        address: data.address,
        phone: data.phone,
        status: data.status, // ACTIVE or INACTIVE
        imageUrl: data.imageUrl,
        adminFullName: data.adminFullName,
        adminEmail: data.adminEmail
      });

      setToastTitle(`Cập nhật thông tin ${data.name} thành công!`);
      fetchClinics(); // Sync with DB
    } catch (error) {
      console.error('Failed to update clinic:', error);
      setToastTitle(`Lỗi khi cập nhật ${data.name}`);
    } finally {
      setIsSaving(false);
      setIsEditModalOpen(false);
      setShowToast(true);
    }
  };

  const handleLockClinic = async (clinic: any) => {
    const isCurrentlyActive = clinic.status === 'Hoạt động';
    const newStatusLabel = isCurrentlyActive ? 'Ngưng hoạt động' : 'Hoạt động';
    const action = isCurrentlyActive ? 'ngưng hoạt động' : 'kích hoạt';

    // 1. Optimistic UI update (Instant)
    setClinicList(prev => prev.map(c => c.realId === clinic.realId ? { ...c, status: newStatusLabel } : c));
    setToastTitle(`Đã ${action} phòng khám ${clinic.name} thành công!`);
    setShowToast(true);

    try {
      // 2. Secret background update
      await clinicApi.toggleStatus(clinic.realId);
    } catch (error) {
      // Revert if error occurs
      setClinicList(prev => prev.map(c => c.realId === clinic.realId ? { ...c, status: clinic.status } : c));
      console.error('Failed to toggle status:', error);
      setToastTitle(`Lỗi khi ${action} phòng khám`);
    }
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
    <>
      <AdminLayout>
      <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {isLoading ? (
              <div className="space-y-3 mb-2">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-72"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-96"></div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý cơ sở y tế</h2>
                <p className="text-[16px] text-slate-500 mt-1 font-medium italic-none">Vận hành và giám sát mạng lưới phòng khám toàn hệ thống</p>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {isLoading ? (
              <>
                <div className="w-40 h-10 bg-slate-900 dark:bg-slate-800 animate-pulse rounded-lg shadow-sm"></div>
                <div className="w-32 h-10 bg-white dark:bg-slate-900 animate-pulse rounded-lg border border-primary/10"></div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-[13px] active:scale-95 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                >
                  <span className="material-symbols-outlined text-[18px]">add_location</span>
                  Thêm cơ sở mới
                </button>
                <button
                  onClick={handleExport}
                  className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all text-[13px] border border-primary/10 active:scale-95 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Xuất dữ liệu
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bento Grid Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Skeleton Stats
            [...Array(4)].map((_, idx) => (
              <div key={`stat-skeleton-${idx}`} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm animate-pulse text-left">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                </div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-24 mb-2"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
              </div>
            ))
          ) : (
            stats.map((stat, idx) => (
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
            ))
          )}
        </div>

        {/* List Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-primary/5 text-left">
          <div className="px-8 py-6 border-b border-primary/10 flex justify-between items-center">
            {isLoading ? (
              <div className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48"></div>
            ) : (
              <h4 className="text-[19px] font-bold text-slate-900 dark:text-white">Danh sách chi tiết hệ thống</h4>
            )}
            <div className="flex gap-2">
              {isLoading ? (
                <div className="h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl w-64 hidden sm:block"></div>
              ) : (
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
              )}
              <div className="relative">
                {isLoading ? (
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                ) : (
                  <button
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${statusFilter !== 'ALL' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary border-0'
                      }`}
                    title="Lọc danh sách"
                  >
                    <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  </button>
                )}
                {isFilterDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsFilterDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-primary/5 p-2 z-40 animate-in fade-in slide-in-from-top-2 duration-200">                      {[
                      { id: 'ALL', label: 'Tất cả hệ thống', icon: 'apps' },
                      { id: 'ACTIVE', label: 'Đang hoạt động', icon: 'check_circle' },
                      { id: 'INACTIVE', label: 'Ngưng hoạt động', icon: 'block' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setStatusFilter(item.id as any); setIsFilterDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${statusFilter === item.id
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
                  <th className="px-8 py-4">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48"></div> : <span className="text-[15px] font-medium text-slate-500 leading-none">Tên phòng khám</span>}
                  </th>
                  <th className="px-6 py-4">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16"></div> : <span className="text-[15px] font-medium text-slate-500 leading-none">Mã phòng khám</span>}
                  </th>
                  <th className="px-6 py-4">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-32"></div> : <span className="text-[15px] font-medium text-slate-500 leading-none">Địa chỉ</span>}
                  </th>
                  <th className="px-6 py-4">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-20"></div> : <span className="text-[15px] font-medium text-slate-500 leading-none">Số điện thoại</span>}
                  </th>
                  <th className="px-6 py-4 text-center">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-8 mx-auto"></div> : <span className="text-[15px] font-medium text-slate-500 leading-none">Bác sĩ</span>}
                  </th>
                  <th className="px-6 py-4">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16"></div> : <span className="text-[15px] font-medium text-slate-500 leading-none">Trạng thái</span>}
                  </th>
                  <th className="px-8 py-4 text-right">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-12 ml-auto"></div> : <span className="text-[15px] font-medium text-slate-500 leading-none">Thao tác</span>}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {isLoading ? (
                  // Skeleton Rows for Clinic Table
                  [...Array(5)].map((_, i) => (
                    <tr key={`clinic-skeleton-${i}`} className="animate-pulse">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-48"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-8 mx-auto"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-full w-24"></div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                          <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                          <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredClinics.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <p className="text-slate-500 font-medium">Không tìm thấy phòng khám nào phù hợp.</p>
                    </td>
                  </tr>
                ) : (
                  filteredClinics.map((clinic, idx) => (
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
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <code className="text-[15px] text-slate-600 dark:text-slate-500 font-bold">{clinic.id}</code>
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
                              ? 'bg-blue-500/5 text-blue-500 hover:bg-blue-500/10'
                              : 'bg-red-500/5 text-red-500 hover:bg-red-500/10'}`}
                            title={clinic.status === 'Hoạt động' ? 'Ngưng hoạt động phòng khám' : 'Kích hoạt phòng khám'}
                          >
                            <span className="material-symbols-outlined text-[18px]">{clinic.status === 'Hoạt động' ? 'block' : 'check_circle'}</span>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-primary/10 flex justify-between items-center">
            {isLoading ? (
              <>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48"></div>
                <div className="flex gap-1">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                  <div className="w-8 h-8 rounded-lg bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                <span className="text-[14px] text-slate-500 font-medium">Đang hiển thị {filteredClinics.length}/{clinicList.length} phòng khám</span>
                <div className="flex gap-1">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#3bb9f3] text-white font-bold text-xs ring-2 ring-[#3bb9f3]/20">1</button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contextual Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {isLoading ? (
            <>
              <div className="lg:col-span-2 bg-primary/5 dark:bg-primary/10 p-8 rounded-2xl border border-primary/10 animate-pulse">
                <div className="h-6 bg-primary/10 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-primary/5 rounded w-full mb-2"></div>
                <div className="h-4 bg-primary/5 rounded w-2/3"></div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-primary/10 shadow-sm animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-6"></div>
                <div className="space-y-6">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-full"></div>
                </div>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </AdminLayout>

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
    </>
  );
}
