
export default function DoctorMessages() {
  return (
    <div className="flex h-screen overflow-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
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
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="/doctor/prescriptions">
            <span className="material-symbols-outlined">prescriptions</span>
            <span>Đơn thuốc điện tử</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="/doctor/appointments">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Lịch hẹn khám</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium transition-colors" href="/doctor/messages">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
            <span>Tin nhắn</span>
            <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
          </a>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full bg-slate-200" 
                data-alt="Bác sĩ Lê Minh Tâm portrait profile"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvD1gNLm_sBMkVyq8FuYHA20LjP97yY90_RzaDO9mjZaL9ubIXYPTKQeV1FDlhsH3p7qndF3QILzvglilx1ly9Sb7AtePxkBlVz8-5HPGNI5wMlA1c27CCvjNz865bvs_Y9uYkK2245BaMa66pFJCTPXK2wTV6-A4oQjShYdPHNg1nx01j-yW7I48c8aShwiEDSx2B_FE04UGkIxELFaJ-Ho65BrMgC_LF9Yk0dKK7BGEGWjFX4zFwmnNWi44sq8khTm_Q-D-Iig4')" }}>
              </div>
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
      <main className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-primary/5 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="w-96 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/50 placeholder-slate-400 text-sm"
              placeholder="Tìm kiếm bệnh nhân, hồ sơ..." 
              type="text" 
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-slate-800 text-slate-600 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-slate-800 text-slate-600">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <button className="bg-primary hover:bg-primary/90 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all">
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Thêm bệnh nhân
            </button>
          </div>
        </header>

        
<div className="flex flex-1 overflow-hidden w-full">
                {/* Left Column: Contact List */}
                <section
                    className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900/50">
                    <div className="p-4">
                        <div className="relative">
                            <span
                                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50"
                                placeholder="Tìm kiếm bệnh nhân..." type="text" />
                        </div>
                    </div>
                    <div className="flex border-b border-slate-200 dark:border-slate-800">
                        <button className="flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary">Tất
                            cả</button>
                        <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-700">Chưa
                            đọc</button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Patient Items */}
                        <div className="p-3 space-y-2">
                            <div
                                className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 cursor-pointer">
                                <div className="relative">
                                    <img className="size-12 rounded-full object-cover"
                                        data-alt="Chân dung bệnh nhân Nguyễn Văn A"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoRl8NTd68SRL_B98uIoSixtoSFJ_WzA_ARggqrddikGEZU5TvmSR2m3O5T1qeyIddTDbGEQsvKPHA9OaIHqdKNbaEb5u1y6Z7lJWYLA551IOrhSYBeCp6TvkUP0oZmg2-z7exCQilm2RhKk0JK8sQVbBkzugjOEBNCgSHCs-VPqtPnPKKBpqqAOzq715qm4QoA0LGmVrHKy2xEvxEK6dE-Oul3-ud2Yg-oRnIg92B1uE_UK7HuaIQHwfRC0N3gSrAxqZqnfedqwU" />
                                    <span
                                        className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h3 className="text-sm font-bold truncate">Nguyễn Văn A</h3>
                                        <span className="text-[10px] text-slate-400">10:45</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">Bác sĩ ơi, chỉ số
                                        huyết áp...</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span
                                            className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-md font-bold">Nguy
                                            cơ cao</span>
                                    </div>
                                </div>
                                <div
                                    className="size-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                                    2</div>
                            </div>
                            <div
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <img className="size-12 rounded-full object-cover grayscale"
                                    data-alt="Chân dung bệnh nhân Trần Thị B"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBhD6WWkEmCMteDAhlg1khjJmteYcqGR_yWPtw7M8cvkR3Pz1-1ppF9o5AMWC6HaT2f-5pYOc8QcYtyOYqIwns5BwN129P-TJ0KCcF__-O9EC29r_C_OwDHLBNK4gPhThgBbxZTnZh6_65fKk1BuXOPABOf5XFyVqBB3elRY41Rw1LVHLJb67lK83eFMaCHBlpb8wxLmEDLfeNEowQbIJP7cHp5YfLb_9os0KnEGIqfCwFAk7CcH4yVH_nP5tWbnE2ExIYImKwspU" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h3 className="text-sm font-bold truncate">Trần Thị B</h3>
                                        <span className="text-[10px] text-slate-400">Hôm qua</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">Vâng, tôi đã nhận được đơn thuốc.</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span
                                            className="px-1.5 py-0.5 bg-green-100 text-green-600 text-[10px] rounded-md font-bold">Bình
                                            thường</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <img className="size-12 rounded-full object-cover" data-alt="Chân dung bệnh nhân Lê Văn C"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc-MU_mpYw71RWBRumDqWQSpX2jT6lqY_yymf4_8OwEvcAeGZzV7l3yAxJ5MF7jROH6_6fdNdNvtucQdPatsAfzP-B49W4vIFviX6tGN97yhtJTuP3BrvS6YgON1wqQxZEmplohMDKvuNYebXLrTKsq0q12FH8pdkhC93H4v8cZNbJLFkBV_JVSSRhTFssTOzM27hXOpef5uBaFNc9JV_YDbeJBtL4rMTTD0AGoZ3LRXHFIL1qr8Avgse8OBgMCCLHYBPdo6QmmNo" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h3 className="text-sm font-bold truncate">Lê Văn C</h3>
                                        <span className="text-[10px] text-slate-400">Thứ 2</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">Cảm ơn bác sĩ nhiều lắm!</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span
                                            className="px-1.5 py-0.5 bg-green-100 text-green-600 text-[10px] rounded-md font-bold">Bình
                                            thường</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Middle Column: Chat Window */}
                <section className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
                    {/* Chat Header */}
                    <div
                        className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-slate-200 overflow-hidden">
                                <img className="w-full h-full object-cover" data-alt="Bệnh nhân Nguyễn Văn A"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdl4_kksFbT62gfvrg2CtlonSa7Z4-XZM2ZIIqD7GDwP0MfR5hA225V5R9ZKlvhjbsete2hJmTwvUHA_aosstZHoV6tM2vXEU5Q7nW9_5dd5svAhpeCbuKH5HmqayCaC04rkWo-EfotJUxEp69MkUz4mEdX8saH1A0UNs5zJJID7n-JJeGjmcq0eSP0Mso0S5aDqFBNhamVQmSpaLrCkNv4TaoqSZ06oNBkzC6TNiRCcAwxJsvIX-khxQ-w5pAG3Of0yZJFNenY1M" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold leading-none">Nguyễn Văn A</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="size-2 rounded-full bg-green-500"></span>
                                    <span className="text-xs text-slate-500">Đang hoạt động • 10:45 AM</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                <span className="material-symbols-outlined">call</span>
                            </button>
                            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                <span className="material-symbols-outlined">videocam</span>
                            </button>
                        </div>
                    </div>
                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        <div className="flex justify-center">
                            <span
                                className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full text-slate-500 font-medium">HÔM
                                NAY</span>
                        </div>
                        {/* Patient Message */}
                        <div className="flex gap-3 max-w-[80%]">
                            <img className="size-8 rounded-full self-end" data-alt="Avatar bệnh nhân"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCugxZ95a_v-3AW68QiUMCSrPj_G-Cfl0ygNoDoBH7sjAURggNcXC4KC--moLZZMx3B4m2TOx_TS2VSfyS5bdD4YaETWmaqCLr3CZ7R9OdnTHG8Bgj9y_85jABmvPBkBLEG3k9NC8VUHMJaiWJj3VxNxeKgSWQO0R8WO6MAqJUiDUhV_5kwUUr6_pM0uyhB9LlpdE78cWs5v7fs5GdNu-IK_wZy9ueZZJtcxuEnj3qcCXD--kAUEoOF6ST-sWqLlqrhX0FhvBFloJs" />
                            <div
                                className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700">
                                <p className="text-sm">Bác sĩ ơi, chỉ số huyết áp của tôi sáng nay đo là 160/95 mmHg. Tôi
                                    cảm thấy hơi chóng mặt, có cần điều chỉnh thuốc không ạ?</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">10:42 AM</span>
                            </div>
                        </div>
                        {/* Doctor Message */}
                        <div className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto">
                            <div className="bg-primary text-white p-3 rounded-2xl rounded-br-none shadow-md">
                                <p className="text-sm">Chào anh A, chỉ số 160/95 là khá cao. Anh hãy nghỉ ngơi tại chỗ trong
                                    15-20 phút, tránh vận động mạnh và đo lại nhé.</p>
                                <span className="text-[10px] opacity-70 mt-1 block text-right">10:44 AM</span>
                            </div>
                        </div>
                        {/* Patient Message */}
                        <div className="flex gap-3 max-w-[80%]">
                            <img className="size-8 rounded-full self-end" data-alt="Avatar bệnh nhân"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbj29KgBXLWBPKSZdaUeM5dWr-bzaBrxa3Dw06ijYcBv7WpYsmU9h9wHJI4ypLmiHnLjbeN_T8jHyd8Qhvi4Cj_v2O2TiOU06IqDmQ0GSixl8-bDsmQxuEgYA4Vfr4z0dld7KPJWUkoFonI5L0C3uYrACQqyPeSvoYFOj5lGL2m9-gAQbUit8mJzvKR7fBr9KqNks5Mlez4_BHEEe_Rr1mqNlJy6Er3yK2YSfLiI8LgKltFrE3Olj4Qx_LS47T4cc8LK8zvADUjmQ" />
                            <div
                                className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700">
                                <p className="text-sm">Vâng, tôi đang nằm nghỉ rồi ạ. Tôi có nên uống thêm liều thuốc hạ áp
                                    dự phòng không?</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">10:45 AM</span>
                            </div>
                        </div>
                    </div>
                    {/* Message Input Area */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full whitespace-nowrap">
                                <span className="material-symbols-outlined text-sm">recommend</span>
                                Gửi khuyến nghị
                            </button>
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded-full whitespace-nowrap">
                                <span className="material-symbols-outlined text-sm">warning</span>
                                Gửi cảnh báo
                            </button>
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full whitespace-nowrap">
                                <span className="material-symbols-outlined text-sm">medication</span>
                                Đơn thuốc mới
                            </button>
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="flex gap-1 mb-2">
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">image</span>
                                </button>
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">attach_file</span>
                                </button>
                            </div>
                            <div className="flex-1 relative">
                                <textarea
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/50 resize-none"
                                    placeholder="Nhập tin nhắn..." rows={1}></textarea>
                            </div>
                            <button
                                className="bg-primary hover:bg-primary/90 text-white p-3 rounded-xl shadow-lg transition-transform active:scale-95">
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                </section>
                {/* Right Column: Patient Summary */}
                <section
                    className="w-72 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col p-5 overflow-y-auto custom-scrollbar">
                    <div className="text-center mb-6">
                        <div className="size-20 mx-auto rounded-full border-4 border-primary/20 p-1 mb-3">
                            <img className="w-full h-full rounded-full object-cover" data-alt="Chân dung chi tiết bệnh nhân"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFISugC6Rpeutv2EMF1mKJgLNRCsl5qg11rlHsyeW10Tt4IwD3QZojRXX5GNm14e17phWogUWTZ9RbzM7u4B4JLFRLuUJHOm6CwJeyKFiNRnfIKR4EjL8PovYrTnfnrwp4tmXdx_mSmmk1h5zbrLbXWbNLQfGgExg9bpqRJ7FKBe7b4iOWCETJ8kbntW4QnsM9NZPvhI__l-PXLbH3vDpL6RlU37IfywN4bCq7fGM2znIa4C9kC0i69IVkBLa1reGlZjaIyPGD1CA" />
                        </div>
                        <h3 className="font-bold text-lg">Nguyễn Văn A</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Nam, 58 tuổi</p>
                    </div>
                    <div className="space-y-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-slate-500">CHỈ SỐ SINH TỒN</h4>
                                <span className="text-[10px] text-primary font-bold">Cập nhật 1h trước</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-red-500 text-sm">blood_pressure</span>
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Huyết áp</span>
                                    </div>
                                    <span className="text-sm font-bold text-red-500">160/95</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-500 text-sm">favorite</span>
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Nhịp tim</span>
                                    </div>
                                    <span className="text-sm font-bold">82 bpm</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-orange-500 text-sm">water_drop</span>
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Đường huyết</span>
                                    </div>
                                    <span className="text-sm font-bold">6.8 mmol/L</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Lối tắt nhanh
                            </h4>
                            <button
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                    <span className="text-sm font-medium">Xem hồ sơ đầy đủ</span>
                                </div>
                                <span
                                    className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                            </button>
                            <button
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">pill</span>
                                    <span className="text-sm font-medium">Kê đơn thuốc</span>
                                </div>
                                <span
                                    className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                            </button>
                            <button
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">history</span>
                                    <span className="text-sm font-medium">Lịch sử khám</span>
                                </div>
                                <span
                                    className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-lg">info</span>
                            <h5 className="text-xs font-bold text-primary">Ghi chú nhanh</h5>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">Bệnh nhân có tiền sử cao huyết
                            áp mãn tính, cần theo dõi sát sao vào buổi sáng.</p>
                    </div>
                </section>
            
</div>
</main>
</div>
);}