import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';
import Toast from '../components/ui/Toast';
import CreateServiceModal from '../features/admin/components/CreateServiceModal';
import { medicalServiceApi } from '../api/medicalService';

export default function AdminServices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả danh mục');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả trạng thái');
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await medicalServiceApi.getAll();
      if (res && res.data) {
        // Backend returns real data, frontend might still want some formatting
        // but for now we just use it directly
        setServices(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const categories = ['Tất cả danh mục', 'Gói điều trị', 'Tư vấn online', 'Dịch vụ tại nhà', 'Xét nghiệm chuyên sâu'];

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả danh mục' || s.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Tất cả trạng thái' || (selectedStatus === 'Đang kinh doanh' && s.status === 'Đang kinh doanh') || (selectedStatus === 'Ngừng kinh doanh' && s.status === 'Ngừng kinh doanh');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleStatus = async (id: number, name: string) => {
    try {
      const res = await medicalServiceApi.toggleStatus(id);
      if (res && res.data) {
        setServices(services.map(s => s.id === id ? res.data : s));
        setToastTitle(`Đã chuyển trạng thái dịch vụ ${name}`);
        setShowToast(true);
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
      setToastTitle('Lỗi khi chuyển trạng thái');
      setShowToast(true);
    }
  };

  const handleSaveService = async (data: any) => {
    setIsSaving(true);
    try {
      if (editingService) {
        const res = await medicalServiceApi.update(editingService.id, data);
        if (res && res.data) {
          setServices(services.map(s => s.id === editingService.id ? res.data : s));
          setToastTitle(`Đã cập nhật dịch vụ ${data.name} thành công!`);
        }
      } else {
        const res = await medicalServiceApi.create(data);
        if (res && res.data) {
          setServices([res.data, ...services]);
          setToastTitle(`Đã khởi tạo dịch vụ ${data.name} thành công!`);
        }
      }
      setIsCreateModalOpen(false);
      setEditingService(null);
      setShowToast(true);
    } catch (error) {
      console.error('Failed to save service:', error);
      setToastTitle('Lỗi khi lưu dịch vụ');
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (service: any) => {
    setEditingService(service);
    setIsCreateModalOpen(true);
  };

  const handleCreateOpen = () => {
    setEditingService(null);
    setIsCreateModalOpen(true);
  };

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700 font-display text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {isLoading ? (
              <div className="space-y-3 mb-2">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48 sm:w-80"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-64 sm:w-96"></div>
              </div>
            ) : (
              <>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý Dịch vụ & Gói khám</h2>
                <p className="text-[14px] md:text-[16px] text-slate-500 mt-1 font-medium">Thiết lập các gói chăm sóc sức khỏe và phí dịch vụ y tế.</p>
              </>
            )}
          </div>
          {isLoading ? (
            <div className="w-40 h-10 bg-slate-900 dark:bg-slate-800 animate-pulse rounded-lg shadow-sm"></div>
          ) : (
            <button 
              onClick={handleCreateOpen}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all text-[14.5px]"
            >
              <span className="material-symbols-outlined text-[20px]">add_box</span>
              Tạo dịch vụ mới
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl border border-primary/5 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse text-transparent">X</div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-24"></div>
                <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16"></div>
              </div>
            ))
          ) : (
            [
              { label: 'Tổng số dịch vụ', value: services.length.toString(), icon: 'medical_information', color: 'primary' },
              { label: 'Gói khám hoạt động', value: services.filter(s => s.status === 'Đang kinh doanh').length.toString(), icon: 'package_2', color: 'emerald' },
              { label: 'Ước tính (VNĐ)', value: (services.reduce((acc, s) => acc + (Number(s.price) || 0), 0) / 1000000).toFixed(0) + 'M', icon: 'payments', color: 'amber' },
              { label: 'Lượt đăng ký mới', value: '+124', icon: 'trending_up', color: 'blue' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-all">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 ${stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                  stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                    stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                  <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                </div>
                <p className="text-slate-500 text-[13px] md:text-[15px] font-medium">{stat.label}</p>
                <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
              </div>
            ))
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-2xl shadow-sm border border-primary/5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="relative">
            <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">
              {isLoading ? <div className="h-3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-32 mb-2"></div> : "Tìm kiếm dịch vụ"}
            </label>
            {isLoading ? (
              <div className="h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl w-full"></div>
            ) : (
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                <input 
                  className="w-full bg-white dark:bg-slate-900 border border-slate-400 dark:border-slate-700 rounded-xl pl-11 pr-4 min-h-[42px] text-[14px] font-medium text-slate-700 dark:text-slate-200 outline-none hover:border-slate-500 dark:hover:border-slate-500 focus:border-primary focus:shadow-lg focus:shadow-primary/10 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm" 
                  placeholder="Tên gói hoặc mã..." 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>
          <div>
            <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">
              {isLoading ? <div className="h-3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-20 mb-2"></div> : "Danh mục"}
            </label>
            {isLoading ? (
              <div className="h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl w-full"></div>
            ) : (
              <Dropdown 
                options={categories} 
                value={selectedCategory} 
                onChange={setSelectedCategory}
                icon={<span className="material-symbols-outlined text-[20px] text-slate-400">category</span>}
              />
            )}
          </div>
          <div>
            <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">
              {isLoading ? <div className="h-3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-20 mb-2"></div> : "Trạng thái"}
            </label>
            {isLoading ? (
              <div className="h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl w-full"></div>
            ) : (
              <Dropdown 
                options={['Tất cả trạng thái', 'Đang kinh doanh', 'Ngừng kinh doanh']} 
                value={selectedStatus} 
                onChange={setSelectedStatus}
                icon={<span className="material-symbols-outlined text-[20px] text-slate-400">check_circle</span>}
              />
            )}
          </div>
        </div>

        {/* Services Grid/Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 overflow-hidden shadow-sm p-6 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="h-6 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-24"></div>
                   <div className="h-5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full w-20"></div>
                </div>
                <div className="space-y-2">
                   <div className="h-5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-3/4"></div>
                   <div className="h-3 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-1/4"></div>
                </div>
                <div className="flex gap-4">
                   <div className="h-12 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-xl flex-1"></div>
                   <div className="h-12 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-xl flex-1"></div>
                </div>
                <div className="space-y-2 pt-2">
                   <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-full"></div>
                   <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-5/6"></div>
                   <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-4/6"></div>
                </div>
              </div>
            ))
          ) : (
            filteredServices.map((service) => (
              <div key={service.id} className={`bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col ${service.status === 'Ngừng kinh doanh' ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[12px] font-bold uppercase tracking-wider">{service.category}</span>
                    <span className={`px-3 py-1 rounded-full text-[12px] font-black tracking-tight ${service.status === 'Đang kinh doanh' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}`}>
                      {service.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[18px] font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">{service.name}</h4>
                    <p className="text-slate-400 text-[13px] font-bold">Mã dịch vụ: {service.id}</p>
                  </div>
                  <div className="flex items-center gap-4 py-2">
                    <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Giá dịch vụ</p>
                      <p className="text-lg font-black text-primary leading-none">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Thời hạn</p>
                      <p className="text-lg font-black text-slate-700 dark:text-slate-200 leading-none">{service.duration}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 pt-2">
                    {service.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-primary/5 flex justify-between items-center">
                  <button 
                    onClick={() => handleEditClick(service)}
                    className="text-slate-500 hover:text-primary font-bold text-sm transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                    Chỉnh sửa
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleToggleStatus(service.id, service.name)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${service.status === 'Đang kinh doanh'
                        ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                        : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                        }`}
                      title={service.status === 'Đang kinh doanh' ? 'Ngừng kinh doanh' : 'Kích hoạt lại'}
                    >
                      <span className="material-symbols-outlined text-[20px]">{service.status === 'Đang kinh doanh' ? 'block' : 'play_arrow'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Toast show={showToast} title={toastTitle} onClose={() => setShowToast(false)} />

      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingService(null);
        }}
        isSaving={isSaving}
        onSave={handleSaveService}
        initialData={editingService}
      />
    </AdminLayout>
  );
}
