import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';
import CreateUserModal from '../features/admin/components/CreateUserModal';
import EditUserModal from '../features/admin/components/EditUserModal';
import Toast from '../components/ui/Toast';
import { clinicApi } from '../api/clinic';
import { userApi } from '../api/user';

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
  const [clinics, setClinics] = useState<any[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });

  useEffect(() => {
    fetchClinics();
    fetchStats();
  }, []);

  const fetchUsers = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const roleMapping: any = {
        'Quản trị viên': 'ADMIN',
        'Bác sĩ': 'DOCTOR',
        'Quản lý phòng khám': 'CLINIC_MANAGER',
        'Bệnh nhân': 'PATIENT'
      };

      const statusMapping: any = {
        'Hoạt động': 'ACTIVE',
        'Ngưng hoạt động': 'INACTIVE'
      };

      const selectedClinicObj = clinics.find(c => c.name === selectedClinic);

      const params = {
        role: selectedRole !== 'Tất cả vai trò' ? roleMapping[selectedRole] : null,
        status: selectedStatus !== 'Tất cả trạng thái' ? statusMapping[selectedStatus] : null,
        clinicId: selectedClinicObj ? selectedClinicObj.id : null,
        keyword: searchTerm || null,
        page: pagination.page,
        size: pagination.size
      };

      const res = await userApi.getUsers(params);
      if (res && res.data) {
        const mappedUsers = (res.data.content || []).map((u: any) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          phone: u.phone || u.clinicPhone || '--',
          role: u.roleName,
          clinic: u.clinicName || '--',
          clinicPhone: u.clinicPhone,
          date: new Date(u.createdAt).toLocaleDateString('vi-VN'),
          status: u.status,
          avatar: u.avatarUrl || `https://i.pravatar.cc/150?u=${u.email}`,
          rawRole: u.role,
        }));
        setUserList(mappedUsers);
        setPagination(prev => ({ ...prev, total: res.data.totalElements || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [selectedRole, selectedClinic, selectedStatus, searchTerm, pagination.page, pagination.size, clinics]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchClinics = async () => {
    try {
      const res = await clinicApi.getClinics({ size: 100 });
      setClinics(res.data.content || []);
    } catch (error) {
      console.error('Failed to fetch clinics:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await userApi.getUserStats();
      setUserStats(res.data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const clinicOptions = clinics.map(c => c.name);
  const filterClinicOptions = ['Tất cả cơ sở', ...clinicOptions];

  const handleExport = () => {
    const today = new Date().toLocaleDateString('vi-VN');
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
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

  const handleCreateUser = async (apiData: any) => {
    setIsSaving(true);
    try {
      await userApi.createUser(apiData);
      setIsCreateModalOpen(false);
      setToastTitle(`Tài khoản ${apiData.fullName} đã được khởi tạo!`);
      setShowToast(true);
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      console.error('Failed to create user:', error);
      alert('Không thể tạo tài khoản: ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditUser = async (data: any) => {
    setIsSaving(true);
    try {
      await userApi.updateUser(selectedUser.id, data);
      setIsEditModalOpen(false);
      setToastTitle(`Cập nhật tài khoản ${data.fullName} thành công!`);
      setShowToast(true);
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      console.error('Failed to update user:', error);
      alert('Lỗi cập nhật: ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLockUser = async (user: any) => {
    const isCurrentlyActive = user.status === 'Hoạt động';
    const newStatusLabel = isCurrentlyActive ? 'Ngưng hoạt động' : 'Hoạt động';

    // 1. Optimistic UI update (Instant)
    setUserList(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatusLabel } : u));

    try {
      // 2. Secret background update
      await userApi.toggleStatus(user.id);
      const action = isCurrentlyActive ? 'ngưng hoạt động' : 'kích hoạt';
      setToastTitle(`Đã ${action} tài khoản ${user.name}`);
      setShowToast(true);

      // 3. Silent sync (Update statistics quietly)
      fetchStats();
    } catch (error) {
      // Revert if error occurs
      setUserList(prev => prev.map(u => u.id === user.id ? { ...u, status: user.status } : u));
      console.error('Failed to toggle status:', error);
    }
  };

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
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg font-bold transition-all text-[13px] border border-primary/10 active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">ios_share</span>
                Xuất báo cáo
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold transition-all text-[13px] shadow-lg shadow-slate-900/10 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Thêm người dùng mới
              </button>
            </div>
          </div>

          {/* Summary Bento Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { label: 'Tổng người dùng', value: userStats?.totalUsers?.toString() || '0', icon: 'groups', color: 'primary' },
              { label: 'Quản trị viên', value: userStats?.adminCount?.toString() || '0', icon: 'admin_panel_settings', color: 'slate' },
              { label: 'Bác sĩ', value: userStats?.doctorCount?.toString() || '0', icon: 'medical_services', color: 'blue' },
              { label: 'Quản lý phòng khám', value: userStats?.clinicManagerCount?.toString() || '0', icon: 'manage_accounts', color: 'amber' },
              { label: 'Bệnh nhân', value: userStats?.patientCount?.toString() || '0', icon: 'person', color: 'emerald' }
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
                    className="w-full bg-slate-100/80 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-[14px] font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none text-slate-900 dark:text-white"
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
                  options={filterClinicOptions}
                  value={selectedClinic}
                  onChange={setSelectedClinic}
                />
              </div>
              <div>
                <label className="text-[14px] font-medium text-slate-500 mb-2 block px-1">Trạng thái</label>
                <Dropdown
                  options={['Tất cả trạng thái', 'Hoạt động', 'Ngưng hoạt động']}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-primary/5 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="px-8 py-4 text-[15px] text-slate-500 leading-none">
                    <th className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white px-6 py-5">Họ và tên</th>
                    <th className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white px-6 py-5">Liên hệ</th>
                    <th className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white px-6 py-5">Vai trò</th>
                    <th className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white px-6 py-5">Cơ sở</th>
                    <th className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white px-6 py-5">Ngày tạo</th>
                    <th className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white px-6 py-5">Trạng thái</th>
                    <th className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white px-6 py-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {!isLoading && userList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <span className="material-symbols-outlined text-3xl">person_search</span>
                          <p className="font-medium text-[14px]">Không tìm thấy người dùng</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    userList.map((user, idx) => {
                      const isActive = user.status === 'Hoạt động';
                      return (
                        <tr key={idx} className="transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/10">
                                <img alt={user.name} className="w-full h-full object-cover" src={user.avatar} />
                              </div>
                              <div>
                                <p className="text-[14px] font-bold tracking-tight truncate max-w-[150px] text-slate-900 dark:text-white transition-colors">
                                  {user.name}
                                </p>
                                <p className="text-[12px] text-slate-500 font-medium">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{user.phone}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white">{user.clinic}</p>
                            {user.clinicPhone && (
                              <p className="text-[12px] text-slate-500 font-medium mt-1">{user.clinicPhone}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-[14px] text-slate-700 font-medium">{user.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-4 py-1.5 rounded-full text-white text-[14px] font-bold shadow-sm whitespace-nowrap inline-flex tracking-tighter ${isActive ? 'bg-emerald-500' : 'bg-red-500'
                              }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 transition-all">
                              <button
                                onClick={() => { setSelectedUser({ ...user, fullName: user.name }); setIsEditModalOpen(true); }}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-all duration-300"
                                title="Chỉnh sửa"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                onClick={() => handleLockUser(user)}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${isActive
                                  ? 'bg-slate-100 text-slate-400 hover:bg-red-500/10 hover:text-red-500'
                                  : 'bg-red-500/10 text-red-500 hover:bg-emerald-500/10 hover:text-emerald-500'}`}
                                title={isActive ? 'Ngưng hoạt động' : 'Kích hoạt'}
                              >
                                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isActive ? "'FILL' 0" : "'FILL' 1" }}>
                                  {isActive ? 'block' : 'check_circle'}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Box */}
            <div className="bg-slate-50 border-t border-slate-100 py-4">
              <div className="px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1 order-2 md:order-2">
                  <button
                    disabled={pagination.page === 0}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-primary text-white text-[13px] font-extrabold shadow-md">{pagination.page + 1}</button>
                  <button
                    disabled={(pagination.page + 1) * pagination.size >= pagination.total}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>

                <div className="order-3 md:order-1">
                  <p className="text-[14px] font-medium text-slate-500">
                    Hiển thị <span className="text-slate-500 font-medium">{userList.length}</span>/<span className="text-slate-500 font-medium">{pagination.total}</span> tài khoản
                  </p>
                </div>
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
        availableClinics={clinics}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        isSaving={isSaving}
        onSave={handleEditUser}
        availableClinics={clinics}
      />

      <Toast
        show={showToast}
        title={toastTitle}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
