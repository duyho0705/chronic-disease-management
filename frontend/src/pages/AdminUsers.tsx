import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';
import CreateUserModal from '../features/admin/components/CreateUserModal';
import EditUserModal from '../features/admin/components/EditUserModal';
import Toast from '../components/ui/Toast';

export default function AdminUsers() {
  const [selectedRole, setSelectedRole] = useState('Tất cả vai trò');
  const [selectedClinic, setSelectedClinic] = useState('Tất cả cơ sở');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả trạng thái');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [userList, setUserList] = useState([
    { id: 'SK-202401', name: 'Nguyễn Văn An', email: 'an.nguyen@songkhoe.vn', phone: '0901234567', role: 'Bác sĩ', clinic: 'Vitality Quận 1', date: '12/05/2024', status: 'Hoạt động', color: 'blue', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwvB0WwbnVoeuJkIw7NRUsoXlEvtFtZR8QA9sXidmwtenN6gmtKZO5gIurtfirDUCksL7br7n-DB_u7J7PJlITPKcoSwXb2kvSJUHtIubJKV01CyxPPmL9EtHHYSYUr64V9KpS1G4MdVozFkbuNuFaZeYMd1wKzVWDB6LFZ2YjGoIHHwSxsTXFRHxpBAbCkzaQUFfjRDpiIQihMFfxnF7ac2zsSP0NqIIOea1DL8JQKX_SOyXO2GdPCrVG0o8owhoM106qX3jeDek' },
    { id: 'SK-202405', name: 'Trần Thị Bình', email: 'binh.tran@songkhoe.vn', phone: '0918889999', role: 'Quản lý phòng khám', clinic: 'Thảo Điền', date: '10/05/2024', status: 'Hoạt động', color: 'amber', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5O8MGbSxtvPubnHb89An3LT3eBFH5swdYtgWJxvGSmG7_8jEtjrU3aDEf9yyHGXNqgkIXWEmRxXwXumzOdCETmDZ7ZtQj2AuinHLnAx5wM9XClAJj0a-QarnY3ewtAelNxGruHaRvmylmcJxqmRBTEOtGmgH0QKuT83Tqp7yW9_ie3Yn41wrcYF7hgGAfVHsgw0V29MBMwrZsQrzaX08ZI95ZlvNjpupttsAivb60dIz38orC-JDEnKI8deTA7WS4vjyYd4wq99Q' },
    { id: 'SK-202398', name: 'Lê Văn Cường', email: 'cuong.le@gmail.com', phone: '0934445555', role: 'Bệnh nhân', clinic: 'Quận 7', date: '28/12/2023', status: 'Ngưng hoạt động', color: 'slate', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKVWeZkKcLGygF5LAwka1yLtX0zhmFm18XZz750oHOVwvNCLOJiJ9RjX3hUpeKad7QhM8BdzYSc5yuHbca4ihXZzPoQvMZaWbPELY1EwyGpDSoL2JmjpSikfciT6HnsJ35mPz0LU4nFhAUTgSBEh4GztHP-DpLGNAfAi9Nau2LvzwIT_NeT1OPv94px9nnPFAFg5UmSgu_EsJrWIwzlAezQSfGxvBOZFm4HKyfxFtnXz1znZYhbqUu9iDGsZQyjgdJ0nFa9zZq6TM' },
    { id: 'SK-202412', name: 'Phạm Minh Đức', email: 'duc.pham@songkhoe.vn', phone: '0983654321', role: 'Quản trị viên', clinic: 'Hệ thống chính', date: '15/05/2024', status: 'Hoạt động', color: 'primary', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhY6l6FKOkVALT_c64u73RTtf4-MnTe9fNirXAqIcMy_lqum8VGh8eQsdvX_yoDAVdMcr-2CgHkzsnJ_LzDNq4hYG7PwXyyrDTdtxLo5ye39FhMB_510ZQrnQuw9TIlq3QNIeRmie7x7u66rHjY6k_HTLeKBzxAlQIUIk9pkZ5HO4PN6YL-JG3uESihBhdIs9J31_PM4hx3oRxx635_5klQWxChBB5pPbfoTrFm3ypmbbeDVZx0dbpcDWzImqYGrdAr9RTnIaC314' }
  ]);

  const availableClinics = ['Tất cả cơ sở', 'Hệ thống chính', 'Vitality Quận 1', 'Thảo Điền', 'Quận 7', 'Mediscan Central Lab'];

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
        <h3>DANH SÁCH NGƯỜI DÙNG HỆ THỐNG - ${today}</h3>
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Số Điện Thoại</th>
              <th>Vai Trò</th>
              <th>Cơ Sở/Phòng Khám</th>
              <th>Ngày Tham Gia</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            ${userList.map(u => `
              <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.phone}</td>
                <td>${u.role}</td>
                <td>${u.clinic}</td>
                <td>${u.date}</td>
                <td>${u.status}</td>
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
    link.download = `Danh_sach_nguoi_dung_${today.replace(/\//g, '-')}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateUser = async (data: any) => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newUser = {
      id: `SK-${new Date().getFullYear()}${Math.floor(Math.random() * 900) + 100}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      clinic: data.clinic,
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'Hoạt động',
      color: 'primary',
      avatar: 'https://i.pravatar.cc/150?u=' + data.email
    };
    setUserList([newUser, ...userList]);
    setIsSaving(false);
    setIsCreateModalOpen(false);
    setToastTitle(`Tài khoản ${data.name} đã được khởi tạo!`);
    setShowToast(true);
  };

  const handleEditUser = async (data: any) => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUserList(userList.map(u => u.id === data.id ? {
      ...u,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      clinic: data.clinic,
      status: data.status === 'ACTIVE' ? 'Hoạt động' : 'Ngưng hoạt động'
    } : u));
    setIsSaving(false);
    setIsEditModalOpen(false);
    setToastTitle(`Cập nhật tài khoản ${data.name} thành công!`);
    setShowToast(true);
  };

  const handleLockUser = async (user: any) => {
    const action = user.status === 'Hoạt động' ? 'khóa' : 'mở khóa';
    const newStatus = user.status === 'Hoạt động' ? 'Ngưng hoạt động' : 'Hoạt động';

    setUserList(userList.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    setToastTitle(`Đã ${action} tài khoản ${user.name}`);
    setShowToast(true);
  };

  const filteredUsers = userList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'Tất cả vai trò' || u.role === selectedRole;
    const matchesClinic = selectedClinic === 'Tất cả cơ sở' || u.clinic === selectedClinic;
    const matchesStatus = selectedStatus === 'Tất cả trạng thái' || 
                         (selectedStatus === 'Hoạt động' && u.status === 'Hoạt động') || 
                         (selectedStatus === 'Đã khóa' && u.status === 'Ngưng hoạt động');
    
    return matchesSearch && matchesRole && matchesClinic && matchesStatus;
  });

  return (
    <>
      <AdminLayout>
        <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display text-left">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý người dùng</h2>
              <p className="text-[16px] text-slate-500 mt-1 font-medium">Phân quyền và quản lý tài khoản toàn hệ thống.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all text-[14px]">
                <span className="material-symbols-outlined text-xl">ios_share</span>
                Xuất báo cáo
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-[14px]"
              >
                <span className="material-symbols-outlined font-bold">person_add</span>
                Thêm người dùng mới
              </button>
            </div>
          </div>

          {/* Summary Bento Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { label: 'Tổng người dùng', value: userList.length.toString(), icon: 'groups', color: 'primary' },
              { label: 'Quản trị viên', value: userList.filter(u => u.role === 'Quản trị viên').length.toString(), icon: 'admin_panel_settings', color: 'slate' },
              { label: 'Bác sĩ', value: userList.filter(u => u.role === 'Bác sĩ').length.toString(), icon: 'medical_services', color: 'blue' },
              { label: 'Quản lý phòng khám', value: userList.filter(u => u.role === 'Quản lý phòng khám').length.toString(), icon: 'manage_accounts', color: 'amber' },
              { label: 'Bệnh nhân', value: userList.filter(u => u.role === 'Bệnh nhân').length.toString(), icon: 'person', color: 'emerald' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm transition-all group hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                    stat.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                      stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                        stat.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}>
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                  </div>
                </div>
                <p className="text-slate-500 text-[15px] font-medium mt-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Filter Section */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-primary/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative">
                <label className="text-[14px] font-medium text-slate-500  mb-2 block px-1">Tìm kiếm</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <input 
                    className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-[14px] font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none" 
                    placeholder="Tên hoặc Email..." 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Vai trò</label>
                <Dropdown
                  options={['Tất cả vai trò', 'Quản trị viên', 'Bác sĩ', 'Quản lý phòng khám', 'Bệnh nhân']}
                  value={selectedRole}
                  onChange={setSelectedRole}
                />
              </div>
              <div>
                <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Phòng khám</label>
                <Dropdown
                  options={availableClinics}
                  value={selectedClinic}
                  onChange={setSelectedClinic}
                />
              </div>
              <div>
                <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Trạng thái</label>
                <Dropdown
                  options={['Tất cả trạng thái', 'Hoạt động', 'Đã khóa']}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-primary/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="px-8 py-4 text-[15px] text-slate-500 leading-none">
                    <th className="font-medium px-6 py-5">Họ và tên</th>
                    <th className="font-medium px-6 py-5">Liên hệ</th>
                    <th className="font-medium px-6 py-5">Vai trò</th>
                    <th className="font-medium px-6 py-5">Cơ sở</th>
                    <th className="font-medium px-6 py-5">Ngày tạo</th>
                    <th className="font-medium px-6 py-5">Trạng thái</th>
                    <th className="font-medium px-6 py-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {filteredUsers.map((user, idx) => (
                    <tr key={idx} className={`hover:bg-primary/5 transition-colors group ${user.status === 'Ngưng hoạt động' ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/10 ${user.status === 'Ngưng hoạt động' ? 'grayscale opacity-70' : ''}`}>
                            <img alt={user.name} className="w-full h-full object-cover" src={user.avatar} />
                          </div>
                          <div>
                            <p className={`text-[16px] font-black tracking-tight truncate max-w-[150px] ${user.status === 'Ngưng hoạt động' ? 'text-slate-400' : 'text-slate-900 dark:text-white group-hover:text-primary transition-colors'}`}>
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-base font-bold ${user.status === 'Ngưng hoạt động' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{user.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[14px] font-bold tracking-tighter shadow-sm ${user.role === 'Bác sĩ' ? 'bg-blue-500 text-white' :
                          user.role === 'Quản trị viên' ? 'bg-primary text-white' :
                            user.role === 'Quản lý phòng khám' ? 'bg-amber-500 text-white' :
                              'bg-slate-400 text-white'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-[14px] font-extrabold ${user.status === 'Ngưng hoạt động' ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>{user.clinic}</p>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-500 font-bold">{user.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-1.5 rounded-full text-white text-[13px] font-black shadow-sm whitespace-nowrap inline-flex tracking-tighter ${user.status === 'Hoạt động' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 transition-all">
                          <button
                            onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-all duration-300"
                            title="Chỉnh sửa"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleLockUser(user)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${user.status === 'Hoạt động'
                              ? 'bg-red-500/5 text-red-500 hover:bg-red-500/10'
                              : 'bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10'}`}
                            title={user.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}
                          >
                            <span className="material-symbols-outlined text-[18px]">{user.status === 'Hoạt động' ? 'lock' : 'lock_open'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-5 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[14px] font-medium text-slate-600">Hiển thị <span className="text-slate-900 font-extrabold">{filteredUsers.length}</span> / <span className="text-slate-900 font-extrabold">{userList.length}</span> tài khoản</p>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-primary transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white text-[13px] font-extrabold shadow-md">1</button>
                <button className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-primary transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </AdminLayout>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isSaving={isSaving}
        onSave={handleCreateUser}
        availableClinics={availableClinics}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        isSaving={isSaving}
        onSave={handleEditUser}
        availableClinics={availableClinics}
      />

      <Toast
        show={showToast}
        title={toastTitle}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
