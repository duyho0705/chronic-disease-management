import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';
import Toast from '../components/ui/Toast';

export default function AdminServices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả danh mục');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả trạng thái');
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');

  const [services, setServices] = useState([
    { id: 'SVC-001', name: 'Gói Chăm sóc Tiểu đường Toàn diện', category: 'Gói điều trị', price: '5,000,000đ', duration: '6 tháng', status: 'Đang kinh doanh', features: ['Khám định kỳ hàng tháng', 'Xét nghiệm đường huyết 24/7', 'Tư vấn dinh dưỡng'] },
    { id: 'SVC-002', name: 'Tư vấn Cao huyết áp từ xa', category: 'Tư vấn online', price: '200,000đ', duration: 'Mỗi lần', status: 'Đang kinh doanh', features: ['Gọi Video call 20p', 'Kê đơn thuốc điện tử', 'Theo dõi huyết áp qua App'] },
    { id: 'SVC-003', name: 'Xét nghiệm Tổng quát tại nhà', category: 'Dịch vụ tại nhà', price: '1,200,000đ', duration: 'Mỗi lần', status: 'Ngừng kinh doanh', features: ['Lấy máu tại nhà', 'Trả kết quả qua App', 'Bác sĩ giải thích kết quả'] },
    { id: 'SVC-004', name: 'Gói Quản lý Tim mạch Cơ bản', category: 'Gói điều trị', price: '3,500,000đ', duration: '12 tháng', status: 'Đang kinh doanh', features: ['Đo điện tâm đồ', 'Tư vấn lối sống', 'Cảnh báo nguy cơ AI'] },
  ]);

  const categories = ['Tất cả danh mục', 'Gói điều trị', 'Tư vấn online', 'Dịch vụ tại nhà', 'Xét nghiệm chuyên sâu'];

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả danh mục' || s.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Tất cả trạng thái' || (selectedStatus === 'Đang kinh doanh' && s.status === 'Đang kinh doanh') || (selectedStatus === 'Ngừng kinh doanh' && s.status === 'Ngừng kinh doanh');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleStatus = (id: string) => {
    setServices(services.map(s => {
      if (s.id === id) {
        const newStatus = s.status === 'Đang kinh doanh' ? 'Ngừng kinh doanh' : 'Đang kinh doanh';
        setToastTitle(`Đã chuyển trạng thái dịch vụ ${s.name}`);
        setShowToast(true);
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý Dịch vụ & Gói khám</h2>
            <p className="text-[16px] text-slate-500 mt-1 font-medium">Thiết lập các gói chăm sóc sức khỏe và phí dịch vụ y tế.</p>
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-200 text-[14px]">
            <span className="material-symbols-outlined font-bold">add_box</span>
            Tạo dịch vụ mới
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Tổng số dịch vụ', value: '12', icon: 'medical_information', color: 'primary' },
            { label: 'Gói khám hoạt động', value: '8', icon: 'package_2', color: 'emerald' },
            { label: 'Doanh thu dự kiến', value: '450M', icon: 'payments', color: 'amber' },
            { label: 'Lượt đăng ký mới', value: '+124', icon: 'trending_up', color: 'blue' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
              </div>
              <p className="text-slate-500 text-[15px] font-medium">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-primary/5 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Tìm kiếm dịch vụ</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-[14px] font-bold outline-none ring-primary/20 focus:ring-2" 
                placeholder="Tên gói hoặc mã..." 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Danh mục</label>
            <Dropdown options={categories} value={selectedCategory} onChange={setSelectedCategory} />
          </div>
          <div>
            <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Trạng thái</label>
            <Dropdown options={['Tất cả trạng thái', 'Đang kinh doanh', 'Ngừng kinh doanh']} value={selectedStatus} onChange={setSelectedStatus} />
          </div>
        </div>

        {/* Services Grid/Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
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
                    <p className="text-lg font-black text-primary leading-none">{service.price}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Thời hạn</p>
                    <p className="text-lg font-black text-slate-700 dark:text-slate-200 leading-none">{service.duration}</p>
                  </div>
                </div>
                <ul className="space-y-2 pt-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                      <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-primary/5 flex justify-between items-center">
                <button className="text-slate-500 hover:text-primary font-bold text-sm transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-xl">edit</span>
                  Chỉnh sửa
                </button>
                <div className="flex gap-3">
                   <button 
                    onClick={() => handleToggleStatus(service.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      service.status === 'Đang kinh doanh' 
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
          ))}
        </div>
      </section>

      <Toast show={showToast} title={toastTitle} onClose={() => setShowToast(false)} />
    </AdminLayout>
  );
}
