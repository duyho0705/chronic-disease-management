import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VelorahLandingPage: React.FC = () => {
    const navigate = useNavigate();
    
    // States for interactive components
    const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({
        0: true, // first one open by default
    });
    
    const [bookingForm, setBookingForm] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        department: 'Nội Tổng Quát',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Smooth scroll implementation
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.currentTarget as HTMLAnchorElement;
            const targetId = target.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const element = document.querySelector(targetId);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        };

        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => anchor.addEventListener('click', handleAnchorClick as any));

        // Header transparency scroll effect
        const handleScroll = () => {
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('shadow-md');
                    header.classList.remove('shadow-sm');
                } else {
                    header.classList.add('shadow-sm');
                    header.classList.remove('shadow-md');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            anchors.forEach(anchor => anchor.removeEventListener('click', handleAnchorClick as any));
        };
    }, []);

    const toggleFaq = (index: number) => {
        setFaqOpen(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            alert(`Đặt lịch thành công! Cảm ơn Quý khách ${bookingForm.name}. Bộ phận chăm sóc khách hàng của phòng khám Tâm An sẽ liên hệ qua hotline ${bookingForm.phone} trong vòng 10-15 phút để xác nhận giờ khám cụ thể.`);
            setIsSubmitting(false);
            setBookingForm({
                name: '',
                phone: '',
                email: '',
                date: '',
                department: 'Nội Tổng Quát',
                message: ''
            });
        }, 1500);
    };

    const services = [
        { id: 1, name: 'Khám Tổng Quát', icon: 'stethoscope', desc: 'Kiểm tra sức khỏe định kỳ, phát hiện sớm các nguy cơ tiềm ẩn.' },
        { id: 2, name: 'Nội Tổng Quát', icon: 'medical_services', desc: 'Chẩn đoán và điều trị chuyên sâu các bệnh lý nội khoa mãn tính.' },
        { id: 3, name: 'Nhi Khoa', icon: 'child_care', desc: 'Chăm sóc sức khỏe y tế toàn diện cho trẻ nhỏ tận tâm, nhẹ nhàng.' },
        { id: 4, name: 'Da Liễu', icon: 'dermatology', desc: 'Khám điều trị các bệnh về da và thẩm mỹ công nghệ cao.' },
        { id: 5, name: 'Tim Mạch', icon: 'cardiology', desc: 'Đo điện tim, siêu âm tim, kiểm soát tối ưu huyết áp.' },
        { id: 6, name: 'Xét Nghiệm', icon: 'biotech', desc: 'Hệ thống máy xét nghiệm phân tích máu, sinh hóa chuẩn xác.' },
        { id: 7, name: 'Gói Sức Khỏe', icon: 'health_and_safety', desc: 'Thiết kế đa dạng gói tầm soát ung thư, tiểu đường chuyên biệt.' },
        { id: 8, name: 'Cấp Cứu 24/7', icon: 'e911_emergency', desc: 'Đội ngũ trực cấp cứu phản ứng nhanh hỗ trợ các tình huống khẩn cấp.' },
    ];

    const faqs = [
        { q: 'Phòng khám có áp dụng thanh toán Bảo hiểm Y tế không?', a: 'Có, phòng khám đa khoa Tâm An áp dụng thanh toán Bảo hiểm Y tế (BHYT) nhà nước và liên kết với các đơn vị bảo hiểm tư nhân lớn để hỗ trợ tối đa chi phí cho bệnh nhân.' },
        { q: 'Quy trình đặt lịch hẹn khám bệnh như thế nào?', a: 'Quý khách có thể điền form đăng ký trực tuyến trên website, gọi điện trực tiếp tới hotline hoặc nhắn tin. Nhân viên y tế sẽ xác nhận giờ khám cụ thể trong 15 phút, giúp quý khách không phải xếp hàng chờ đợi khi tới phòng khám.' },
        { q: 'Phí tư vấn ban đầu của bác sĩ chuyên khoa là bao nhiêu?', a: 'Phí tư vấn chuyên khoa ban đầu dao động từ 150.000đ - 300.000đ tùy thuộc vào chuyên khoa và bác sĩ trực tiếp khám. Bảng giá dịch vụ xét nghiệm, chụp chiếu luôn được niêm yết công khai và minh bạch.' },
        { q: 'Thời gian làm việc của phòng khám như thế nào?', a: 'Phòng khám hoạt động liên tục từ 7:00 đến 20:00 tất cả các ngày trong tuần (từ Thứ Hai đến Chủ Nhật). Bộ phận cấp cứu và hỗ trợ Hotline hoạt động 24/7.' }
    ];

    return (
        <div className="bg-background text-on-background font-body-md overflow-x-hidden min-h-screen">
            {/* Header: TopNavBar */}
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface/95 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#008fcc] font-bold text-2xl">favorite</span>
                        Tâm An <span className="text-[#008fcc]">Clinic</span>
                    </span>
                </div>
                <nav className="hidden lg:flex items-center gap-8">
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#dich-vu">Dịch vụ</a>
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#ve-chung-toi">Về chúng tôi</a>
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#bac-si">Đội ngũ bác sĩ</a>
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#uu-diem">Tại sao chọn Tâm An</a>
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#y-kien">Đánh giá</a>
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#hoi-dap">Giải đáp</a>
                </nav>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/login')} className="bg-[#6CD1FD] text-slate-950 px-5 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform duration-150 shadow-sm hover:bg-[#5bc0ec]">
                        Đăng nhập
                    </button>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 medical-gradient overflow-hidden">
                    <div className="container mx-auto px-gutter grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6CD1FD]/10 text-secondary text-xs uppercase tracking-wider font-bold">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6CD1FD] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6CD1FD]"></span>
                                </span>
                                Chăm Sóc Sức Khỏe Toàn Diện
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white leading-tight">
                                Your Health, <br />
                                <span className="text-[#008fcc]">Our Commitment</span>
                            </h1>
                            <p className="text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                                Phòng khám đa khoa Tâm An cam kết cung cấp dịch vụ y tế chuẩn mực cao. Đội ngũ bác sĩ chuyên khoa giàu y đức cùng công nghệ chẩn đoán tiên tiến sẽ là điểm tựa sức khỏe vững chắc cho cả gia đình bạn.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <a className="bg-[#6CD1FD] text-slate-950 px-6 py-3 rounded-lg text-sm font-bold text-center shadow-md hover:bg-[#5bc0ec] transition-all" href="#dat-lich">
                                    Đặt Lịch Hẹn Khám
                                </a>
                                <a className="border border-[#008fcc] text-[#008fcc] px-6 py-3 rounded-lg text-sm font-bold text-center hover:bg-[#6CD1FD]/10 transition-all" href="#lien-he">
                                    Liên Hệ Với Chúng Tôi
                                </a>
                            </div>
                            
                            {/* Short rating / trust numbers in Hero */}
                            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-8">
                                <div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">4.9<span className="text-[#008fcc] text-lg">★</span></p>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Đánh giá từ người bệnh</p>
                                </div>
                                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">15+</p>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Năm kinh nghiệm y tế</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative hidden md:block">
                            <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700">
                                <img className="w-full h-auto object-cover" alt="Professional doctor medical team standing together" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0Y9Ci5_18-JlAS8604YAJ-iTkJskctpY3DL0XpMZWTCi6MLtoqHMofdHi3L43zACPGbYyhMvJEeGOtavQmOCxV8bD_y1s5GGWmiO9PmEj3TP41x5GZoTA0RnypG0-0t1G3EjqgGO_JDDiUCAlQTuQzygukHjFI7JhrKL-AVPb9FzpAjHuufdhWKiuyx7Fe99NJ36rhaznkcmqN5H0wr69cCW1NYyh2ySXEsnP7Ntz9ywvyVchz9crlym_ReAv68E_3Tbi0bVNlA6H"/>
                            </div>
                            {/* Floating satisfaction tag */}
                            <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-5 rounded-xl soft-elevation max-w-xs animate-bounce-slow border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="bg-[#6CD1FD]/20 p-2.5 rounded-full">
                                        <span className="material-symbols-outlined text-[#008fcc] font-bold text-2xl">verified_user</span>
                                    </div>
                                    <div>
                                        <p className="text-[#008fcc] font-black text-lg">98%</p>
                                        <p className="text-on-surface-variant text-xs font-bold">Hài lòng tuyệt đối</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Indicators Section */}
                <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
                    <div className="container mx-auto px-gutter text-center space-y-6">
                        <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Tiêu chuẩn chất lượng & Đối tác liên kết y tế</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
                            <span className="font-bold text-slate-500 text-sm tracking-widest border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded">ISO 9001:2015</span>
                            <span className="font-bold text-slate-500 text-sm tracking-widest border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded">BỘ Y TẾ CẤP PHÉP</span>
                            <span className="font-bold text-slate-500 text-sm tracking-widest border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded">BẢO HIỂM LIÊN KẾT</span>
                            <span className="font-bold text-slate-500 text-sm tracking-widest border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded">CHUẨN QUỐC TẾ</span>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-20 bg-surface" id="dich-vu">
                    <div className="container mx-auto px-gutter">
                        <div className="text-center mb-12 space-y-3">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Dịch Vụ Chuyên Khoa Mũi Nhọn</h2>
                            <div className="w-20 h-1 bg-[#6CD1FD] mx-auto rounded-full"></div>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
                                Tâm An mang đến đa dạng giải pháp điều trị kỹ thuật cao phù hợp với từng bệnh nhân.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {services.map(service => (
                                <div key={service.id} className="bg-surface-container-lowest p-6 rounded-xl soft-elevation hover-elevation transition-all group border border-outline-variant/30 flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 bg-[#6CD1FD]/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#6CD1FD] transition-colors">
                                            <span className="material-symbols-outlined text-[#008fcc] text-2xl group-hover:text-slate-950">{service.icon}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{service.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{service.desc}</p>
                                    </div>
                                    <div className="pt-4">
                                        <a href="#dat-lich" className="text-xs font-bold text-[#008fcc] hover:text-[#006ab8] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Tìm hiểu thêm <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Clinic Section */}
                <section className="py-20 bg-white dark:bg-slate-900" id="ve-chung-toi">
                    <div className="container mx-auto px-gutter grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="text-xs font-bold text-[#008fcc] uppercase tracking-wider">Giới thiệu phòng khám Tâm An</span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">Y Đức Đi Đầu - Công Nghệ Dẫn Lối</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                Phòng khám Tâm An quy tụ đội ngũ bác sĩ chuyên khoa có thâm niên công tác tại các bệnh viện lớn trên toàn quốc. Chúng tôi xây dựng môi trường khám chữa bệnh chuẩn mực, thân thiện, và áp dụng công nghệ chẩn đoán hình ảnh, xét nghiệm hiện đại để đưa ra phác đồ chính xác nhất.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <h4 className="font-bold text-[#008fcc] text-lg mb-1">Sứ Mệnh</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Kiến tạo trải nghiệm y khoa nhân văn, đặt sức khỏe bệnh nhân làm kim chỉ nam.</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <h4 className="font-bold text-[#008fcc] text-lg mb-1">Tầm Nhìn</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Trở thành chuỗi phòng khám chuẩn mực y khoa chất lượng hàng đầu Việt Nam.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <img className="rounded-xl shadow-lg w-full h-[320px] object-cover" alt="Clinic modern facilities and equipment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0Y9Ci5_18-JlAS8604YAJ-iTkJskctpY3DL0XpMZWTCi6MLtoqHMofdHi3L43zACPGbYyhMvJEeGOtavQmOCxV8bD_y1s5GGWmiO9PmEj3TP41x5GZoTA0RnypG0-0t1G3EjqgGO_JDDiUCAlQTuQzygukHjFI7JhrKL-AVPb9FzpAjHuufdhWKiuyx7Fe99NJ36rhaznkcmqN5H0wr69cCW1NYyh2ySXEsnP7Ntz9ywvyVchz9crlym_ReAv68E_3Tbi0bVNlA6H"/>
                            <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white p-6 rounded-lg hidden md:block max-w-[200px]">
                                <p className="text-3xl font-black text-[#6CD1FD]">100%</p>
                                <p className="text-xs text-slate-300 font-medium">Trang bị y tế đạt chuẩn nhập khẩu thế hệ mới nhất.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Doctors Section */}
                <section className="py-20 bg-surface" id="bac-si">
                    <div className="container mx-auto px-gutter">
                        <div className="text-center mb-12 space-y-3">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Đội Ngũ Bác Sĩ Chuyên Gia</h2>
                            <div className="w-20 h-1 bg-[#6CD1FD] mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Doctor 1 */}
                            <div className="bg-surface-container-lowest rounded-xl overflow-hidden soft-elevation group hover-elevation transition-all border border-slate-100 dark:border-slate-800">
                                <div className="aspect-[3/4] overflow-hidden">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Doctor profile 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB193elf3eybRvRJRZNlhXPpEHPQKGFsZuCUsgQvXNE1o1ZUVJA4vrLcOwZMhTJx284mPE3ahjSlLX80e2DJU9RHZy0VhTRFW4bA384NJhl9GgXY2TmaZZJ7DKa9EtRrGeT2ke25Yssk0DVFywB_X0qqJjh8g3xY0i1FkWxHH7CoetWCcA5ZWufgjBUU5DUJGJ6hlJxMv7eaH2IXNSOuo3aT98go39Tw_h2754yeDFVENq93INwJ8bjW24mJ3CWpbCu_QmvxyLsFsBg"/>
                                </div>
                                <div className="p-6 text-center">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">BS.CKII Nguyễn Văn A</h4>
                                    <p className="text-[#008fcc] text-xs font-bold mt-1">Trưởng khoa Nội tổng quát - 22 năm KN</p>
                                    <p className="text-[11px] text-slate-400 mt-2">Nguyên Phó trưởng khoa Bệnh viện Chợ Rẫy</p>
                                </div>
                            </div>
                            {/* Doctor 2 */}
                            <div className="bg-surface-container-lowest rounded-xl overflow-hidden soft-elevation group hover-elevation transition-all border border-slate-100 dark:border-slate-800">
                                <div className="aspect-[3/4] overflow-hidden">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Doctor profile 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhdP_MLPQOCqgClDWCX0qEgaIJry848yDsOuP4uxVM3I9XoNl4lTnotFBrUMYTZvNSKzZn9bjNva1X5htOeFQNkabKGnaN4Wd8SbeJAlHFFwloXxQ-TB_xbTuMnFEdpuPOJGU0hHI2FtopBp_cIVQ1lMcKgOPs56P2q6LM1aXsBx8tt_9GWqvMplXt-OFcDxXVmYsnNYIpWKSCzphgfpwxAnhxpkAkr7DLAzPZI7x1PJwgEPfPV8Qx8LhES5Yy-e7PTWqqOQfuzJ8j"/>
                                </div>
                                <div className="p-6 text-center">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">BS.CKI Trần Thị B</h4>
                                    <p className="text-[#008fcc] text-xs font-bold mt-1">Chuyên khoa Nhi - 15 năm KN</p>
                                    <p className="text-[11px] text-slate-400 mt-2">Thành viên Hội Nhi khoa Việt Nam</p>
                                </div>
                            </div>
                            {/* Doctor 3 */}
                            <div className="bg-surface-container-lowest rounded-xl overflow-hidden soft-elevation group hover-elevation transition-all border border-slate-100 dark:border-slate-800">
                                <div className="aspect-[3/4] overflow-hidden">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Doctor profile 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVLbEXPCPzS6WINh39T33rfVEb4VZLxfHYYt7gb2gAjCkXjvitaolN5YG_26_9dDaPgHLvjXtnEq0A-kzubYODLq5mYNeYyviODrajwN9ylmZRmmnuTPEDIj5e13Fe0VvAfegiB6_s_Shu4D4vjMi5zwlu5sFUpVoT8UtIki5gLN5lFt9Z5E-0MXNKPZBUo4f0ZaxJh0pg6BwXhGUS67kxIlR1Zg5EFWVyY9R4b9bN3K8lJ_GwEu0RArgXJZSA8H7L6ss27dRjpeB3"/>
                                </div>
                                <div className="p-6 text-center">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">ThS.BS Lê Văn C</h4>
                                    <p className="text-[#008fcc] text-xs font-bold mt-1">Nha khoa Thẩm mỹ - 12 năm KN</p>
                                    <p className="text-[11px] text-slate-400 mt-2">Chứng chỉ quốc tế cấy ghép Implant</p>
                                </div>
                            </div>
                            {/* Doctor 4 */}
                            <div className="bg-surface-container-lowest rounded-xl overflow-hidden soft-elevation group hover-elevation transition-all border border-slate-100 dark:border-slate-800">
                                <div className="aspect-[3/4] overflow-hidden">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Doctor profile 4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4_6lXQy6vK9GHSH5v9IXBcA2z2K8rhW1Y4pJuBcJxYpDCK5izPMKX5WwU9LUsXSvieEZc2K2sL6-Eifqyjc8HZbrRRZaOVRN-VW_7pOJaHjEPJRPzjQ_L3UU8Av7KwfhgrfMXgxUBqbySfTCy1_qG0yEfiXdEBV0DnzpNe21e1lLpIeE9SsAG86uCZi2hyWrkzfQWvH33xPVy2_jKachW-n0IspipcERheMbCw0xBUvBKGs4P6IUjxsItM680o_SZykYNAS5lkP7e"/>
                                </div>
                                <div className="p-6 text-center">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">BS. Phạm Thị D</h4>
                                    <p className="text-[#008fcc] text-xs font-bold mt-1">Sản Phụ Khoa - 10 năm KN</p>
                                    <p className="text-[11px] text-slate-400 mt-2">Nguyên Bác sĩ Bệnh viện Phụ Sản Hà Nội</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-20 bg-white dark:bg-slate-900" id="uu-diem">
                    <div className="container mx-auto px-gutter">
                        <div className="text-center mb-12 space-y-3">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Tại Sao Nên Chọn Phòng Khám Tâm An?</h2>
                            <div className="w-20 h-1 bg-[#6CD1FD] mx-auto rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">local_hospital</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bác Sĩ Giàu Kinh Nghiệm</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Đội ngũ y bác sĩ vững vàng chuyên môn, chu đáo và thấu hiểu tâm lý bệnh nhân.</p>
                            </div>
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">precision_manufacturing</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Công Nghệ Hiện Đại</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Thiết bị siêu âm 4D, nội soi tiêu hóa, máy xét nghiệm tự động thế hệ mới nhất.</p>
                            </div>
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">payments</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chi Phí Hợp Lý</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Bảng giá công khai, hợp lý, hỗ trợ thủ tục Bảo hiểm y tế bảo lãnh nhanh chóng.</p>
                            </div>
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">patient_list</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chăm Sóc Cá Nhân Hóa</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Phác đồ điều trị được cá nhân hóa chặt chẽ theo hồ sơ bệnh án điện tử riêng biệt.</p>
                            </div>
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">speed</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quy Trình Nhanh Chóng</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Đặt lịch trực tuyến, bỏ qua thủ tục chờ đợi, hỗ trợ đón tiếp ngay khi tới phòng khám.</p>
                            </div>
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">support_agent</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hỗ Trợ 24/7</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Đường dây nóng hỗ trợ hướng dẫn dùng thuốc và xử lý tình huống khẩn cấp 24 giờ.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Patient Testimonials Section */}
                <section className="py-20 bg-surface-container-low" id="y-kien">
                    <div className="container mx-auto px-gutter">
                        <div className="text-center mb-12 space-y-3">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Đánh Giá Từ Người Bệnh</h2>
                            <div className="w-20 h-1 bg-[#6CD1FD] mx-auto rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Testimonial 1 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl soft-elevation border border-slate-100 dark:border-slate-800 space-y-4">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                    "Tôi bị tiểu đường mãn tính nhiều năm, từ ngày chuyển qua theo dõi tại đây tôi rất an tâm. Quy trình đặt khám nhanh, bác sĩ A tư vấn tỉ mỉ và chỉnh liều thuốc rất chuẩn xác."
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700">
                                        TH
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Chú Trần Hải</h4>
                                        <p className="text-[11px] text-slate-400">Bệnh nhân Nội tiết</p>
                                    </div>
                                </div>
                            </div>
                            {/* Testimonial 2 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl soft-elevation border border-slate-100 dark:border-slate-800 space-y-4">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                    "Bé nhà mình rất sợ đi khám bệnh nhưng khi tới khoa Nhi gặp bác sĩ B thì lại cực kỳ hợp tác. Phòng khám vô trùng sạch sẽ, nhiều góc trang trí hoạt hình dễ thương giúp bé quên đi căng thẳng."
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700">
                                        MA
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Chị Minh Anh</h4>
                                        <p className="text-[11px] text-slate-400">Phụ huynh bé Gia Bảo</p>
                                    </div>
                                </div>
                            </div>
                            {/* Testimonial 3 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl soft-elevation border border-slate-100 dark:border-slate-800 space-y-4">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                    "Tôi làm răng sứ thẩm mỹ tại đây. Bác sĩ C làm cực kỳ nhẹ tay, hoàn toàn không đau như tôi nghĩ ban đầu. Nụ cười mới giúp tôi tự tin hơn rất nhiều."
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700">
                                        KV
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Chị Khánh Vân</h4>
                                        <p className="text-[11px] text-slate-400">Khách hàng Nha khoa</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="py-16 bg-[#005eb8] text-white">
                    <div className="container mx-auto px-gutter grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div className="space-y-1">
                            <p className="text-3xl md:text-4xl font-black text-white">50,000+</p>
                            <p className="text-xs uppercase font-bold text-slate-200 tracking-wider">Lượt Bệnh Nhân Phục Vụ</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl md:text-4xl font-black text-white">100+</p>
                            <p className="text-xs uppercase font-bold text-slate-200 tracking-wider">Bác Sĩ & Chuyên Gia</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl md:text-4xl font-black text-white">15+</p>
                            <p className="text-xs uppercase font-bold text-slate-200 tracking-wider">Năm Kinh Nghiệm Vận Hành</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl md:text-4xl font-black text-white">98%</p>
                            <p className="text-xs uppercase font-bold text-slate-200 tracking-wider">Tỷ Lệ Hài Lòng</p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-white dark:bg-slate-900" id="hoi-dap">
                    <div className="container mx-auto px-gutter max-w-4xl">
                        <div className="text-center mb-12 space-y-3">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Giải Đáp Câu Hỏi Thường Gặp</h2>
                            <div className="w-20 h-1 bg-[#6CD1FD] mx-auto rounded-full"></div>
                        </div>
                        
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                    <button 
                                        className="w-full flex justify-between items-center p-5 font-bold text-left text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        onClick={() => toggleFaq(idx)}
                                    >
                                        <span>{faq.q}</span>
                                        <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: faqOpen[idx] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                            expand_more
                                        </span>
                                    </button>
                                    {faqOpen[idx] && (
                                        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Booking Form Section */}
                <section className="py-20 bg-surface-container-low" id="dat-lich">
                    <div className="container mx-auto px-gutter max-w-5xl">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl soft-elevation overflow-hidden grid lg:grid-cols-2 border border-slate-100 dark:border-slate-800">
                            <div className="p-10 bg-[#005eb8] text-white flex flex-col justify-between space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-extrabold text-white">Đăng Ký Đặt Lịch Hẹn</h2>
                                    <p className="opacity-90 text-sm text-slate-100 leading-relaxed">
                                        Quý khách vui lòng cung cấp thông tin liên hệ và chuyên khoa cần đăng ký khám. Chúng tôi sẽ gọi lại ngay để xác nhận chính xác khung giờ ưu tiên mong muốn.
                                    </p>
                                </div>
                                <div className="space-y-4 border-t border-white/20 pt-6">
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="material-symbols-outlined text-white">call</span>
                                        <span>Hotline Tổng Đài: 1900 1234</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="material-symbols-outlined text-white">mail</span>
                                        <span>contact@tamanclinic.vn</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="material-symbols-outlined text-white">schedule</span>
                                        <span>Giờ làm việc: 7:00 - 20:00 hàng ngày</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10">
                                <form className="space-y-4" onSubmit={handleFormSubmit}>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Họ và tên bệnh nhân *</label>
                                        <input 
                                            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#6CD1FD] focus:border-[#6CD1FD] bg-white text-gray-900 outline-none" 
                                            placeholder="Nhập họ và tên đầy đủ" 
                                            required 
                                            type="text"
                                            value={bookingForm.name}
                                            onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Số điện thoại *</label>
                                            <input 
                                                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#6CD1FD] focus:border-[#6CD1FD] bg-white text-gray-900 outline-none" 
                                                placeholder="Nhập số điện thoại" 
                                                required 
                                                type="tel"
                                                value={bookingForm.phone}
                                                onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email liên hệ *</label>
                                            <input 
                                                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#6CD1FD] focus:border-[#6CD1FD] bg-white text-gray-900 outline-none" 
                                                placeholder="Nhập địa chỉ email" 
                                                required 
                                                type="email"
                                                value={bookingForm.email}
                                                onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Chuyên khoa khám *</label>
                                            <select 
                                                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#6CD1FD] focus:border-[#6CD1FD] bg-white text-gray-900 outline-none"
                                                value={bookingForm.department}
                                                onChange={e => setBookingForm({ ...bookingForm, department: e.target.value })}
                                            >
                                                <option>Khám Tổng Quát</option>
                                                <option>Nội Tổng Quát</option>
                                                <option>Nhi Khoa</option>
                                                <option>Da Liễu</option>
                                                <option>Tim Mạch</option>
                                                <option>Xét Nghiệm</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Ngày hẹn mong muốn *</label>
                                            <input 
                                                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#6CD1FD] focus:border-[#6CD1FD] bg-white text-gray-900 outline-none" 
                                                required 
                                                type="date"
                                                value={bookingForm.date}
                                                onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Tin nhắn / Mô tả triệu chứng</label>
                                        <textarea 
                                            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#6CD1FD] focus:border-[#6CD1FD] bg-white text-gray-900 outline-none h-20 resize-none" 
                                            placeholder="Ghi chú thêm triệu chứng sức khỏe hoặc nhu cầu đặc biệt"
                                            value={bookingForm.message}
                                            onChange={e => setBookingForm({ ...bookingForm, message: e.target.value })}
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <button 
                                            className="w-full bg-[#6CD1FD] text-slate-950 py-3.5 rounded-lg font-bold text-sm hover:shadow-lg hover:bg-[#5bc0ec] active:scale-[0.98] transition-all disabled:opacity-50"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Đang xử lý đăng ký...' : 'Xác Nhận Đặt Lịch Hẹn'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-20 bg-white dark:bg-slate-900" id="lien-he">
                    <div className="container mx-auto px-gutter grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="text-xs font-bold text-[#008fcc] uppercase tracking-wider">Thông Tin Liên Hệ</span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Hệ Thống Phòng Khám Tâm An</h2>
                            
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#6CD1FD]/10 flex items-center justify-center text-[#008fcc] flex-shrink-0">
                                        <span className="material-symbols-outlined">pin_drop</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Địa Chỉ Trụ Sở</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">123 Đường Sức Khỏe, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#6CD1FD]/10 flex items-center justify-center text-[#008fcc] flex-shrink-0">
                                        <span className="material-symbols-outlined">phone_in_talk</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Hotline Đặt Khám & Cấp Cứu</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">1900 1234 (Đặt hẹn) - 028 3456 7890 (Khẩn cấp 24/7)</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#6CD1FD]/10 flex items-center justify-center text-[#008fcc] flex-shrink-0">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Hộp Thư Điện Tử</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">contact@tamanclinic.vn - cskh@tamanclinic.vn</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Interactive map placeholder with medical aesthetic */}
                        <div className="h-[300px] bg-slate-100 dark:bg-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#008fcc_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
                            <div className="relative text-center space-y-3 p-6 z-10">
                                <span className="material-symbols-outlined text-5xl text-[#008fcc] animate-bounce-slow">location_on</span>
                                <h4 className="font-bold text-slate-900 dark:text-white">Bản Đồ Chỉ Dẫn Đường Đi</h4>
                                <p className="text-xs text-slate-500 max-w-xs mx-auto">Vui lòng nhấp vào đây để điều hướng bản đồ Google Maps chỉ dẫn trực tiếp tới phòng khám Tâm An.</p>
                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#005eb8] text-white text-xs px-4 py-2 rounded font-bold hover:bg-[#00478d]">
                                    Mở Bản Đồ Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full pt-16 pb-8 px-gutter flex flex-col md:flex-row justify-between items-center gap-base bg-inverse-surface border-t border-outline-variant text-on-surface">
                <div className="space-y-4 text-center md:text-left">
                    <div className="font-headline-sm text-headline-sm font-bold text-inverse-on-surface text-white">Phòng Khám Đa Khoa Tâm An</div>
                    <p className="text-on-tertiary-container text-sm max-w-xs text-slate-300">Hệ thống dịch vụ y tế và giải pháp quản lý sức khỏe bệnh nhân hàng đầu.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-8 mt-6 md:mt-0">
                    <a className="text-on-tertiary-container hover:text-secondary-fixed transition-colors font-label-sm text-label-sm text-slate-300" href="#">Chính sách bảo mật</a>
                    <a className="text-on-tertiary-container hover:text-secondary-fixed transition-colors font-label-sm text-label-sm text-slate-300" href="#">Điều khoản dịch vụ</a>
                    <a className="text-on-tertiary-container hover:text-secondary-fixed transition-colors font-label-sm text-label-sm text-slate-300" href="#">Bản đồ chỉ dẫn</a>
                </div>
                <div className="text-on-tertiary-container font-label-sm text-label-sm mt-6 md:mt-0 text-slate-300">
                    © 2026 Phòng Khám Đa Khoa Tâm An. Tất cả các quyền được bảo hộ.
                </div>
            </footer>

            {/* Mobile Appointment Bar (Sticky) */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] z-40 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold">Hotline Đặt Hẹn</span>
                    <span className="text-primary font-bold">1900 1234</span>
                </div>
                <a href="#dat-lich" className="bg-[#6CD1FD] text-slate-950 px-6 py-2 rounded-lg font-bold active:scale-95 transition-transform">Đặt lịch ngay</a>
            </div>
        </div>
    );
};

export default VelorahLandingPage;
