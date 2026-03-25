import React from 'react';

const PatientProfile: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-8 animate-in fade-in duration-500">
            {/* Profile Header */}
            <header className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative">
                        <img
                            alt="Profile Large"
                            className="size-32 rounded-full border-4 border-primary/20 object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbiJ7I6ctWWGnLQNqOglT3drtEvxoxgYwECbwnYBCihONL1qNBKpbHcL2VeMYUVBj31tQd7ASwCsOQomYDGohIQ2rXA8jbkkTL4YM-fQv-tjNXzsQCNAQaHW7nG9UMdlyukB3l3PUh4hEh7vuj6jVuptgmzF1tXf-qIYhm_A4v8uOwZc5wDGnVt7nJTqMvmi9Wh6zLunQYlemDuQWa26BnYtYKxxG7LoL4xdQW2RXEPZBLTGvX4w5JtK0Q0ycV_kMsrUEhwFQLZtA"
                        />
                        <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full border-2 border-white dark:border-slate-900">
                            <span className="material-symbols-outlined text-sm block">edit</span>
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nguyễn Văn A</h2>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                                Đang hoạt động - Đang theo dõi
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">ID Bệnh nhân: <span className="font-mono text-primary font-semibold">#99283</span> • Tham gia tháng 01/2023</p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-primary text-lg">bloodtype</span>
                                <span>Nhóm máu O+</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-primary text-lg">height</span>
                                <span>172 cm</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-primary text-lg">weight</span>
                                <span>68 kg</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <button className="px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-lg hover:bg-primary/90 transition-colors">Tải báo cáo</button>
                        <button className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Chỉnh sửa hồ sơ</button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                {/* Left Column: Personal & Contact */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person</span>
                                Thông tin cá nhân
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                            {[
                                { label: 'Họ và tên', value: 'Nguyễn Văn A' },
                                { label: 'Ngày sinh', value: '15 tháng 5, 1975 (48 tuổi)' },
                                { label: 'Giới tính', value: 'Nam' },
                                { label: 'Nhóm máu', value: 'O+ (Dương tính)' },
                                { label: 'Chiều cao', value: '172 cm' },
                                { label: 'Cân nặng', value: '68 kg' },
                            ].map((item, idx) => (
                                <div key={idx} className="border-b border-slate-100 dark:border-slate-800 pb-2">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">{item.label}</p>
                                    <p className="text-sm font-medium">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">contact_page</span>
                                Thông tin liên hệ
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-400">call</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-semibold">Số điện thoại</p>
                                    <p className="text-sm font-medium">+84 90 123 4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-400">mail</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-semibold">Địa chỉ Email</p>
                                    <p className="text-sm font-medium">nguyen.vana@email.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-400">location_on</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-semibold">Địa chỉ nhà</p>
                                    <p className="text-sm font-medium">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Medical History & Emergency */}
                <div className="space-y-6">
                    {/* Medical History Summary */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-slate-100">
                            <span className="material-symbols-outlined text-primary">history_edu</span>
                            Tóm tắt y tế
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Bệnh mãn tính</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold border border-red-100 dark:border-red-900/30">Tiểu đường Type 2</span>
                                    <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold border border-red-100 dark:border-red-900/30">Cao huyết áp</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Dị ứng</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-bold border border-orange-100 dark:border-orange-900/30">Penicillin</span>
                                    <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-bold border border-orange-100 dark:border-orange-900/30">Đậu phộng</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Thuốc đang sử dụng</p>
                                <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
                                    <li className="flex items-center gap-2 italic">
                                        <span className="size-1.5 rounded-full bg-primary"></span>
                                        Metformin 500mg
                                    </li>
                                    <li className="flex items-center gap-2 italic">
                                        <span className="size-1.5 rounded-full bg-primary"></span>
                                        Lisinopril 10mg
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    {/* Emergency Contact */}
                    <section className="bg-primary/10 dark:bg-primary/5 rounded-xl p-6 border-2 border-dashed border-primary/30">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-100">
                            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>emergency_home</span>
                            Liên hệ khẩn cấp
                        </h3>
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Nguyễn Thị B</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Mối quan hệ: Vợ</p>
                            <div className="flex items-center gap-2 text-primary">
                                <span className="material-symbols-outlined text-lg">call</span>
                                <span className="text-sm font-bold">+84 91 987 6543</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest text-center">
                            Cập nhật thông tin khẩn cấp
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
