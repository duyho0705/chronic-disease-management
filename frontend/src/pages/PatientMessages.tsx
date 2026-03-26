import React from 'react';

const PatientMessages: React.FC = () => {
    return (
        <div className="flex -m-8 h-[calc(100vh-80px)] overflow-hidden animate-in fade-in duration-700 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 font-display">
            {/* Contact List Sidebar */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col shrink-0">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Tin nhắn</h2>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                        <input className="w-full pl-10 pr-4 py-2 rounded-xl border-none bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-primary text-sm" placeholder="Tìm kiếm bác sĩ..." type="text" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-2 space-y-2 custom-scrollbar">
                    {/* Contact Item Active */}
                    <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl cursor-pointer border border-primary/20 mb-2">
                        <div className="relative shrink-0">
                            <img className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2y9wBw8SitILxg_TGGl3CwbmOQ4FE9TNGFjLhqjCzKbOlHyUwc_eXUv4FvbYp5E7bdqCiuuzDNOBZw4FkfttdL6ZkriSrWNH8OKrbFpz4JO6JaQef4zdnvmG4bVBQV5MPyVsWAk2MTWRbsTISbhHsf5WP_-ogb5fxbYoLwRdSslADbE2Iy38B03qJlm5PiiRnpEwESaxK19FHCpdyucpr8Wf5xWF4HicAdjge_EC9FceHVPdzgPygX-NvK7T4vdDhtIc2FDVgouQ" alt="Bác sĩ" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-[15px] truncate text-slate-900 dark:text-white mb-0.5">BS. Nguyễn Văn An</h4>
                                <span className="text-xs text-slate-500">2 phút</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">Vâng, chỉ số này hơi cao...</p>
                        </div>
                    </div>

                    {/* Contact Items */}
                    {[
                        { name: 'BS. Trần Thị Mai', msg: 'Hẹn gặp bạn vào tuần tới.', time: '1 giờ', active: false, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXXbab1ccgnCKdnhzgiQXMbEgBqhAyFjYgui6FDdCVpRlHZJ48ewQUPiVyZlXtSKlOiyeuoTcBSWMXS0--nPsVarwRhJrUgxHZDMgX2Y9Fszyx7_5pARJQPkmH7KN2EVBXjgnE3H2GEfcPimMNue2EyJyrmoc1JRlC6Dvex1yzWmgpJxMHWVsC6foPCY3lF2DudB5Kdcp3yeOmTWyZZX5S46hnFr3Ao91z_roxOHrSqK23CST2S0qT2IC3oDRsb9Ldu4j79Lhwqng' },
                        { name: 'BS. Lê Hoàng', msg: 'Đã nhận kết quả xét nghiệm.', time: '5 giờ', active: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa84EcwSbxEYIfKo-yj-yV4KaprgsjgfFpDRx09iTaxtwu6tkrTejILQ5RyXTh8DQVV-Jm8j2x7h71d_xr4tlijEybplV-DJdGxE-IxjwIIWVUWGSP5Jnbaj6kuCepzWO9751Aj0KvwB3IOS6-v9NtoTxzTf6QOoJtOIORTM9DhTdyr9TaVdsP8NRHHgWSGQ2aIOSDOUW5PL_Y1Ms-HJSn-mBM_eYV_ljGzm2lhA6sC7EYTDs-9DjIvimHoZntr9oyqFIPOZUyHq4' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors mb-2 group">
                            <div className="relative shrink-0">
                                <img className="w-12 h-12 rounded-full object-cover" src={item.img} alt={item.name} />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-slate-900 rounded-full ${item.active ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h4 className="font-bold text-[15px] truncate text-slate-800 dark:text-slate-200">{item.name}</h4>
                                    <span className="text-xs text-slate-500">{item.time}</span>
                                </div>
                                <p className="text-sm text-slate-500 truncate">{item.msg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                            <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFi_ZAhdk0ljDOJPm4mUtZkpHBNTudLa8l2SuzII456-reZE6Q4vc2KE3H-3bKXU4eZq_gbOvfIY4JoVxUZ_Herg68mmmnVcL80c6EQiiuH9DYBLUK6HfMnDYnQ8YDRGV_zhwlOPEA7x05UmkRXW8fwD2rZ8chQu00kS1LcOebroDD6oFiEDN1E2pkzO_LKQY5rMQ_0Ov_ZxeOCgYARBHMKtlhwttPq7YwjXvK_2Vswzg-j38DfgbqD1yoLhZpgbCDrVKWKPK9OY0" alt="Bác sĩ" />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-[15px] text-slate-900 dark:text-white">BS. Nguyễn Văn An</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                            <span className="material-symbols-outlined text-xl">videocam</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                            <span className="material-symbols-outlined text-xl">call</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 lg:hidden">
                            <span className="material-symbols-outlined text-xl">info</span>
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* Timestamp */}
                    <div className="flex justify-center">
                        <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-500 font-bold">Hôm nay, 14:30</span>
                    </div>

                    {/* Message Left (Doctor) */}
                    <div className="flex items-end gap-3 max-w-[80%]">
                        <img className="w-8 h-8 rounded-full shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgtFOUxGDEE0Vrp0H3Ang4WSSWstxA7nzBU5Jkh33FnKO-NMVYm2TRTJHYSsTksFRbaHW5EnF5EBN_-2f7lbqJ3ai0ftY0IItssPucJ4F1oThfFsvD_UexlwLzeY6WU-AK1MXST1RVrKMJCEj8c_CqqKxdmY1DuH2vUExEOSRGsFQbpg4qcAojd8uiULas1YdhRiY8uJzHHEjsxuVsKhIaMSFr6H44SQ7dpT46ELKvepUf0eneLcbfq3yMvbJzYKS8V-RP0ivt7kA" alt="Avatar bác sĩ" />
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm">
                            <p className="text-sm text-slate-700 dark:text-slate-300">Chào bạn, tôi đã nhận được thông báo về chỉ số đường huyết sáng nay của bạn. Bạn cảm thấy thế nào?</p>
                        </div>
                    </div>

                    {/* Message Right (Patient) */}
                    <div className="flex flex-col items-end gap-2 ml-auto max-w-[80%]">
                        <div className="bg-primary text-white p-4 rounded-2xl rounded-br-none shadow-md shadow-primary/20">
                            <p className="text-sm font-medium">Chào bác sĩ, sáng nay tôi đo được 165 mg/dL sau khi ăn sáng. Tôi thấy hơi chóng mặt nhẹ.</p>
                        </div>
                        <span className="text-[12px] text-slate-400">14:35</span>
                    </div>

                    {/* Message Right (Patient Image) */}
                    <div className="flex flex-col items-end gap-2 ml-auto max-w-[80%]">
                        <div className="bg-primary/5 border border-primary/20 p-2 rounded-2xl rounded-br-none">
                            <div className="relative group cursor-pointer overflow-hidden rounded-xl">
                                <img className="w-64 h-40 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPCX2LKtWkB_Q6JY5_JbL_6fetTiL5EsBhKzry3LMydf_FRwjrwu39p2HuhVgTs2YL-vmU3G4se8Yd_WrQVv8xGJiJ1tYVqL8WDaXIbM01pWwaJxuQCO2QYsIwypyAw216ik5L68D_hLpHyjA5IJJnsG2Xh2kPiyHHbSvH8XPOQydsR4mGrcvmUq-ih476hRUh9HmBUYmcqu8wzXndHgi-_Ow088DYmC8AB3dGJgZE7f7BWBzkgQfnAw_mV7ymevWDx4KX7rdqGwA" alt="Huyết áp" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="material-symbols-outlined text-white">zoom_in</span>
                                </div>
                            </div>
                            <p className="text-[11px] mt-2 text-slate-500 px-2 italic">Kết quả đo huyết áp kèm theo</p>
                        </div>
                    </div>

                    {/* Message Left (Doctor) */}
                    <div className="flex items-end gap-3 max-w-[80%]">
                        <img className="w-8 h-8 rounded-full shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApQWBoWOwyomZS4N7f5N6p3JCuVbH8FLgqd4T8m2rHZDDAB6ugayDnSjtMbFK8e4jx7RvZYbKHEFgO5eNSp2E-pCdd5Uvr1HE5bo_d0rZC1TynQrxzAYJUVqXOnKoDQIk0SX7_TGSwMuqCfS91u5tLnX4q6mZ6ViyJBgxlKoU5zC1vmodp7jl2kJrnc6ecQhR41J6tKh3zQY48YOM_hr_zlkuo59WA2MHLYslbAhp5udE9De17RNqJxsV_SZfydKJS2MJn_jJPqoA" alt="Avatar bác sĩ" />
                        <div className="space-y-2">
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm text-slate-700 dark:text-slate-300">
                                <p className="text-sm">Chỉ số này hơi cao so với mức mục tiêu của chúng ta (dưới 140 mg/dL sau ăn). Bạn có quên dùng thuốc sáng nay không?</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm text-slate-700 dark:text-slate-300">
                                <p className="text-sm">Vui lòng uống thêm nhiều nước lọc, nghỉ ngơi 30 phút và đo lại nhé. Nếu vẫn trên 160 kèm chóng mặt tăng dần, hãy nhắn tôi ngay.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 transition-all focus-within:ring-2 focus-within:ring-primary/20">
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">add_circle</span>
                        </button>
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">image</span>
                        </button>
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">sentiment_satisfied</span>
                        </button>
                        <input className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-slate-800 dark:text-white placeholder-slate-400 font-display" placeholder="Nhập tin nhắn..." type="text" />
                        <button className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 font-display">
                            <span className="material-symbols-outlined font-bold">send</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Doctor Profile Detail Sidebar */}
            <div className="hidden xl:flex w-80 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-col overflow-y-auto shrink-0 custom-scrollbar animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-8 text-center bg-white/50 dark:bg-slate-900/50 mb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative inline-block mb-4">
                        <img className="w-32 h-32 rounded-3xl object-cover shadow-xl border-4 border-white dark:border-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK3T3hEyXn7tO3gFlXlWA4w14ErCBqQ5fumhqu_QXr-3u0JH9FVUc7RTeblwmBJcBRUQWtTzM52V9B3g83oxcgIMw932v-HaSbKV1NQltjoGLGzn42oVd0ijAM-GghQ_rAnQDCuxrNBVmjaCaj3PtPL2PN40m2nQdrTJsjXIdXX3HZvy4E3Bf-oVR5xxFjwkfx9sPF_XnMU-qQ9haftK6BPT4N1WJuxgkbWVu4qR7h5caQgXDb1sYTRjdlAuC5lwSK3Eg6hmfXxAc" alt="Bác sĩ" />
                        <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-xl border-4 border-slate-50 dark:border-slate-900">
                            <span className="material-symbols-outlined text-sm font-bold">verified</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">BS. Nguyễn Văn An</h3>
                    <p className="text-slate-500 text-sm mt-1">Chuyên khoa Nội tiết & Đái tháo đường</p>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex-1">
                            <p className="text-[14px] text-slate-400 font-medium">Kinh nghiệm</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">12 năm</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex-1">
                            <p className="text-[14px] text-slate-400 font-medium">Đánh giá</p>
                            <p className="text-sm font-bold flex items-center gap-1 justify-center text-slate-900 dark:text-white">4.9 <span className="material-symbols-outlined text-yellow-400 text-[14px] fill-1">star</span></p>
                        </div>
                    </div>
                </div>
                <div className="px-6 space-y-6 flex-1 py-4">
                    <div>
                        <h4 className="text-sm font-bold text-slate-500 mb-3">Giới thiệu</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                            Chuyên gia điều trị các bệnh lý mãn tính, đặc biệt là tiểu đường tuýp 2 và cao huyết áp. Tốt nghiệp Đại học Y Dược TP.HCM.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-500 mb-3">Thông tin liên hệ</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary text-sm font-bold">location_on</span>
                                <span className="text-slate-600 dark:text-slate-400 font-medium">Phòng khám Quận 1, TP.HCM</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary text-sm font-bold">schedule</span>
                                <span className="text-slate-600 dark:text-slate-400 font-medium">08:00 - 17:00 (T2 - T7)</span>
                            </li>
                        </ul>
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button className="w-full py-3 bg-primary text-slate-900 font-medium rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all mb-3 flex items-center justify-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-sm font-bold">event</span>
                            Đặt lịch hẹn ngay
                        </button>
                        <button className="w-full py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all text-sm">
                            Xem hồ sơ chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientMessages;
