import AdminLayout from '../layouts/AdminLayout';

export default function AdminUsers() {

  const users = [
    { id: 'SK-202401', name: 'Nguyễn Văn An', email: 'an.nguyen@songkhoe.vn', phone: '090 123 4567', role: 'Bác sĩ', clinic: 'Vitality Quận 1', date: '12/05/2024', status: 'Hoạt động', color: 'blue', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwvB0WwbnVoeuJkIw7NRUsoXlEvtFtZR8QA9sXidmwtenN6gmtKZO5gIurtfirDUCksL7br7n-DB_u7J7PJlITPKcoSwXb2kvSJUHtIubJKV01CyxPPmL9EtHHYSYUr64V9KpS1G4MdVozFkbuNuFaZeYMd1wKzVWDB6LFZ2YjGoIHHwSxsTXFRHxpBAbCkzaQUFfjRDpiIQihMFfxnF7ac2zsSP0NqIIOea1DL8JQKX_SOyXO2GdPCrVG0o8owhoM106qX3jeDek' },
    { id: 'SK-202405', name: 'Trần Thị Bình', email: 'binh.tran@songkhoe.vn', phone: '091 888 9999', role: 'Quản lý', clinic: 'Thảo Điền', date: '10/05/2024', status: 'Hoạt động', color: 'amber', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5O8MGbSxtvPubnHb89An3LT3eBFH5swdYtgWJxvGSmG7_8jEtjrU3aDEf9yyHGXNqgkIXWEmRxXwXumzOdCETmDZ7ZtQj2AuinHLnAx5wM9XClAJj0a-QarnY3ewtAelNxGruHaRvmylmcJxqmRBTEOtGmgH0QKuT83Tqp7yW9_ie3Yn41wrcYF7hgGAfVHsgw0V29MBMwrZsQrzaX08ZI95ZlvNjpupttsAivb60dIz38orC-JDEnKI8deTA7WS4vjyYd4wq99Q' },
    { id: 'SK-202398', name: 'Lê Văn Cường', email: 'cuong.le@gmail.com', phone: '093 444 5555', role: 'Bệnh nhân', clinic: 'Quận 7', date: '28/12/2023', status: 'Đã khóa', color: 'slate', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKVWeZkKcLGygF5LAwka1yLtX0zhmFm18XZz750oHOVwvNCLOJiJ9RjX3hUpeKad7QhM8BdzYSc5yuHbca4ihXZzPoQvMZaWbPELY1EwyGpDSoL2JmjpSikfciT6HnsJ35mPz0LU4nFhAUTgSBEh4GztHP-DpLGNAfAi9Nau2LvzwIT_NeT1OPv94px9nnPFAFg5UmSgu_EsJrWIwzlAezQSfGxvBOZFm4HKyfxFtnXz1znZYhbqUu9iDGsZQyjgdJ0nFa9zZq6TM' },
    { id: 'SK-202412', name: 'Phạm Minh Đức', email: 'duc.pham@songkhoe.vn', phone: '098 765 4321', role: 'Admin', clinic: 'Hệ thống chính', date: '15/05/2024', status: 'Hoạt động', color: 'primary', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhY6l6FKOkVALT_c64u73RTtf4-MnTe9fNirXAqIcMy_lqum8VGh8eQsdvX_yoDAVdMcr-2CgHkzsnJ_LzDNq4hYG7PwXyyrDTdtxLo5ye39FhMB_510ZQrnQuw9TIlq3QNIeRmie7x7u66rHjY6k_HTLeKBzxAlQIUIk9pkZ5HO4PN6YL-JG3uESihBhdIs9J31_PM4hx3oRxx635_5klQWxChBB5pPbfoTrFm3ypmbbeDVZx0dbpcDWzImqYGrdAr9RTnIaC314' }
  ];

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex text-[11px] font-bold text-slate-400 gap-2 mb-2 uppercase tracking-widest">
              <span>Cấu hình</span>
              <span>/</span>
              <span className="text-primary">Quản lý người dùng</span>
            </nav>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý người dùng</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium opacity-70">Phân quyền và quản lý tài khoản toàn hệ thống.</p>
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-[14px]">
            <span className="material-symbols-outlined font-bold">person_add</span>
            Thêm người dùng mới
          </button>
        </div>

        {/* Summary Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            { label: 'Tổng người dùng', value: '1,284', icon: 'groups', color: 'primary' },
            { label: 'Admin', value: '12', icon: 'admin_panel_settings', color: 'slate' },
            { label: 'Bác sĩ', value: '86', icon: 'medical_services', color: 'blue' },
            { label: 'Quản lý', value: '24', icon: 'manage_accounts', color: 'amber' },
            { label: 'Bệnh nhân', value: '1,162', icon: 'person', color: 'emerald' }
          ].map((stat, idx) => (
            <div key={idx} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border-b-4 border-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} shadow-sm hover:shadow-md transition-all group`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                <span className={`material-symbols-outlined text-lg text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} opacity-50 group-hover:opacity-100 transition-opacity`}>{stat.icon}</span>
              </div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Filter Section - Standard Doctor Input Style */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-primary/5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">Tìm kiếm</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-[14px] font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none" placeholder="Tên hoặc Email..." type="text"/>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">Vai trò</label>
              <select className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-[14px] font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none appearance-none italic-none">
                <option>Tất cả vai trò</option>
                <option>Admin</option>
                <option>Bác sĩ</option>
                <option>Quản lý</option>
                <option>Bệnh nhân</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">Phòng khám</label>
              <select className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-[14px] font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none appearance-none italic-none">
                <option>Tất cả cơ sở</option>
                <option>Vitality Quận 1</option>
                <option>Thảo Điền</option>
                <option>Quận 7</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">Trạng thái</label>
              <select className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-[14px] font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none appearance-none italic-none">
                <option>Tất cả trạng thái</option>
                <option>Hoạt động</option>
                <option>Đã khóa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-primary/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary/5 text-sm font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-5">Họ và tên</th>
                  <th className="px-6 py-5">Email/SĐT</th>
                  <th className="px-6 py-5">Vai trò</th>
                  <th className="px-6 py-5">Cơ sở</th>
                  <th className="px-6 py-5">Ngày tạo</th>
                  <th className="px-6 py-5">Trạng thái</th>
                  <th className="px-6 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {users.map((user, idx) => (
                  <tr key={idx} className={`hover:bg-primary/5 transition-colors group ${user.status === 'Đã khóa' ? 'bg-slate-50/50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/10 ${user.status === 'Đã khóa' ? 'grayscale opacity-70' : ''}`}>
                          <img alt={user.name} className="w-full h-full object-cover" src={user.avatar}/>
                        </div>
                        <div>
                          <p className={`text-[16px] font-extrabold tracking-tight truncate max-w-[150px] ${user.status === 'Đã khóa' ? 'text-slate-400' : 'text-slate-900 dark:text-white group-hover:text-primary transition-colors'}`}>
                            {user.name}
                          </p>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-base font-bold ${user.status === 'Đã khóa' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{user.email}</p>
                      <p className="text-sm text-slate-500 font-medium">{user.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-tight shadow-sm ${
                        user.role === 'Bác sĩ' ? 'bg-blue-500 text-white' :
                        user.role === 'Admin' ? 'bg-primary text-white' :
                        user.role === 'Quản lý' ? 'bg-amber-500 text-white' :
                        'bg-slate-400 text-white'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-[14px] font-bold ${user.status === 'Đã khóa' ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>{user.clinic}</p>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-500 font-medium">{user.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-1.5 rounded-full text-white text-[13px] font-bold shadow-sm whitespace-nowrap inline-flex ${
                        user.status === 'Hoạt động' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button className={`p-2 rounded-full transition-all ${user.status === 'Đã khóa' ? 'text-slate-400' : 'text-red-400 hover:bg-red-50'}`}>
                          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: user.status === 'Đã khóa' ? "'FILL' 1" : "''" }}>
                            {user.status === 'Đã khóa' ? 'lock' : 'lock_open'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination - Standard Doctor Table Footer */}
          <div className="px-6 py-5 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[13px] font-bold text-slate-500">Hiển thị <span className="text-slate-900 font-extrabold">1-10</span> / <span className="text-slate-900 font-extrabold">1,284</span> tài khoản</p>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary text-white text-[13px] font-extrabold shadow-md">1</button>
              <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white text-[13px] font-bold transition-all">2</button>
              <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white text-[13px] font-bold transition-all">3</button>
              <span className="px-2 text-slate-300 font-bold">...</span>
              <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white text-[13px] font-bold transition-all">128</button>
              <button className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
