import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dropdown from '../components/ui/Dropdown';
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
        department: 'Quy mô Dưới 10 Bác Sĩ',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitSuccess, setSubmitSuccess] = useState(false);

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

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!bookingForm.name.trim()) errors.name = "Vui lòng nhập tên của bạn hoặc tên phòng khám.";
        
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!bookingForm.phone.trim()) {
            errors.phone = "Vui lòng nhập số điện thoại.";
        } else if (!phoneRegex.test(bookingForm.phone)) {
            errors.phone = "Số điện thoại không hợp lệ (VD: 0912345678).";
        }
        
        if (bookingForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email)) {
            errors.email = "Địa chỉ email không hợp lệ.";
        }
        
        if (!bookingForm.date) errors.date = "Vui lòng chọn ngày hẹn demo.";
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8080/v1/consultations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingForm)
            });
            
            if (response.ok) {
                setSubmitSuccess(true);
                setBookingForm({
                    name: '', phone: '', email: '', date: '', department: 'Quy mô Dưới 10 Bác Sĩ', message: ''
                });
                setTimeout(() => setSubmitSuccess(false), 5000);
            } else {
                alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const services = [
        { id: 1, name: 'Hồ Sơ Bệnh Án Điện Tử', icon: 'stethoscope', desc: 'Số hóa toàn bộ lịch sử khám, đơn thuốc và hồ sơ bệnh án mãn tính trực quan.' },
        { id: 2, name: 'Theo Dõi Chỉ Số Sinh Tồn', icon: 'medical_services', desc: 'Bệnh nhân cập nhật huyết áp, đường huyết từ xa, hệ thống cảnh báo bác sĩ tức thì.' },
        { id: 3, name: 'Nhắc Lịch Tái Khám Tự Động', icon: 'child_care', desc: 'Tự động gửi thông báo lịch hẹn khám qua SMS/Zalo để nâng cao tỷ lệ tái khám.' },
        { id: 4, name: 'Tương Tác Bác Sĩ & Bệnh Nhân', icon: 'dermatology', desc: 'Kênh chat nội bộ bảo mật cao, hỗ trợ bác sĩ tư vấn sức khỏe trực tuyến nhanh chóng.' },
        { id: 5, name: 'Quản Lý Chỉ Số Tim Mạch', icon: 'cardiology', desc: 'Biểu đồ trực quan theo dõi huyết áp tâm thu/tâm trương và nhịp tim người bệnh.' },
        { id: 6, name: 'Tích Hợp Dữ Liệu Xét Nghiệm', icon: 'biotech', desc: 'Đồng bộ kết quả xét nghiệm máu, sinh hóa trực tiếp từ phòng lab lên hồ sơ số.' },
        { id: 7, name: 'Quản Lý Gói Khám Cá Nhân', icon: 'health_and_safety', desc: 'Thiết kế, theo dõi và nhắc nhở tiến độ các gói tầm soát sức khỏe chuyên biệt.' },
        { id: 8, name: 'Hỗ Trợ Kỹ Thuật 24/7', icon: 'e911_emergency', desc: 'Đội ngũ chuyên viên túc trực hỗ trợ phòng khám vận hành hệ thống thông suốt.' },
    ];

    const faqs = [
        { q: 'Hệ thống quản lý bệnh nhân trực tuyến DamDiep hỗ trợ những chuyên khoa nào?', a: 'Phần mềm DamDiep được thiết kế linh hoạt hỗ trợ tất cả các phòng khám đa khoa và chuyên khoa sâu như Nội tiết (tiểu đường), Tim mạch, Nhi khoa, Da liễu, Nha khoa và các gói tầm soát sức khỏe tổng quát.' },
        { q: 'Quy trình triển khai phần mềm cho phòng khám mất bao lâu?', a: 'Thời gian thiết lập hệ thống, nhập dữ liệu ban đầu và hướng dẫn vận hành cho đội ngũ y bác sĩ chỉ mất từ 3-5 ngày làm việc. Hệ thống hoạt động hoàn toàn trên nền tảng đám mây không cần cài đặt phức tạp.' },
        { q: 'Chi phí sử dụng phần mềm được tính như thế nào?', a: 'Chúng tôi cung cấp các gói thuê bao linh hoạt theo tháng hoặc theo năm dựa trên số lượng tài khoản bác sĩ và quy mô phòng khám của bạn. Bảng giá cam kết minh bạch và không phát sinh chi phí ẩn.' },
        { q: 'Dữ liệu y tế và hồ sơ bệnh án của bệnh nhân được bảo mật ra sao?', a: 'DamDiep tuân thủ nghiêm ngặt tiêu chuẩn bảo mật ISO 27001 và quy định về bảo vệ dữ liệu y tế cá nhân. Toàn bộ thông tin hồ sơ bệnh án đều được mã hóa đầu cuối và sao lưu tự động hàng ngày.' }
    ];

    return (
        <div className="bg-background text-on-background font-body-md overflow-x-hidden min-h-screen">
            {/* Header: TopNavBar */}
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface/95 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <a href="/" className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 select-none cursor-pointer">
                        <img src="/logo.png?v=3" alt="DamDiep Logo" className="w-36 h-auto object-contain" />
                    </a>
                </div>
                <nav className="hidden lg:flex items-center gap-8">
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#dich-vu">Tính năng hệ thống</a>
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#ve-chung-toi">Về giải pháp</a>
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#bac-si">Hội đồng y khoa</a>
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#uu-diem">Tại sao chọn chúng tôi</a>
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#y-kien">Ý kiến đối tác</a>
                    <a className="text-on-surface-variant hover:text-[#008fcc] transition-colors duration-200 text-sm font-semibold" href="#hoi-dap">Giải đáp</a>
                </nav>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/login')} className="bg-[#6CD1FD] text-white px-5 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform duration-150 shadow-sm hover:bg-[#5bc0ec]">
                        Đăng nhập
                    </button>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative py-[170px] medical-gradient overflow-hidden">
                    <div className="container mx-auto px-gutter grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6CD1FD]/10 text-secondary text-xs uppercase tracking-wider font-bold">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6CD1FD] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6CD1FD]"></span>
                                </span>
                                GIẢI PHÁP ĐỒNG HÀNH & THEO DÕI BỆNH NHÂN TRỰC TUYẾN
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white leading-tight">
                                Số Hóa Quy Trình <br />
                                <span className="text-[#008fcc]">Chăm Sóc & Quản Lý</span> Cho Các Phòng Khám
                            </h1>
                            <p className="text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                                DamDiep cung cấp nền tảng quản lý bệnh án điện tử, theo dõi chỉ số sinh tồn và tương tác với bệnh nhân từ xa thời gian thực, giúp các phòng khám tối ưu vận hành và nâng cao uy tín chuyên môn.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <a className="bg-[#6CD1FD] text-slate-950 px-6 py-3 rounded-lg text-sm font-bold text-center shadow-md hover:bg-[#5bc0ec] transition-all" href="#dat-lich">
                                    Đăng Ký Tư Vấn & Dùng Thử
                                </a>
                                <a className="border border-[#008fcc] text-[#008fcc] px-6 py-3 rounded-lg text-sm font-bold text-center hover:bg-[#6CD1FD]/10 transition-all" href="#lien-he">
                                    Tìm Hiểu Cơ Chế Hợp Tác
                                </a>
                            </div>

                            {/* Short rating / trust numbers in Hero */}
                            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-8">
                                <div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">4.9<span className="text-[#008fcc] text-lg">★</span></p>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Hài lòng từ các đối tác</p>
                                </div>
                                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">100+</p>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Phòng khám đã triển khai</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden md:block">
                            <div className="rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 hover:-translate-y-2">
                                <img className="w-full h-auto object-cover" alt="DamDiep Medical System" src="/hero-image.png" />
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
                        <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Tiêu chuẩn an toàn bảo mật & Chứng nhận y khoa</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
                            <span className="font-bold text-slate-500 text-sm tracking-widest border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded">BẢO MẬT ISO 27001</span>
                            <span className="font-bold text-slate-500 text-sm tracking-widest border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded">MÃ HÓA ĐẦU CUỐI HL7</span>
                            <span className="font-bold text-slate-500 text-sm tracking-widest border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded">TIÊU CHUẨN BỘ Y TẾ</span>
                            <span className="font-bold text-slate-500 text-sm tracking-widest border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded">ĐỒNG BỘ DỮ LIỆU THỜI GIAN THỰC</span>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-20 bg-surface" id="dich-vu">
                    <div className="container mx-auto px-gutter">
                        <div className="text-center mb-12 space-y-3">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Tính Năng Quản Lý Chuyên Sâu</h2>
                            <div className="w-20 h-1 bg-[#6CD1FD] mx-auto rounded-full"></div>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
                                DamDiep mang đến bộ công cụ phần mềm quản lý phòng khám toàn diện, được chuẩn hóa theo nghiệp vụ y khoa thực tế.
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
                                            Xem Demo Tính Năng <span className="material-symbols-outlined text-xs">arrow_forward</span>
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
                            <span className="text-xs font-bold text-[#008fcc] uppercase tracking-wider">Hệ Sinh Thái Công Nghệ Y Tế DamDiep</span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">Giải Pháp B2B Số Hóa Trải Nghiệm Bệnh Nhân</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                Chúng tôi xây dựng hệ thống phần mềm nhằm giúp các phòng khám quản lý hồ sơ, tối ưu hóa quá trình tương tác và theo dõi các bệnh nhân mãn tính. Nền tảng được phát triển dựa trên sự phối hợp chặt chẽ giữa các chuyên gia công nghệ và các bác sĩ đầu ngành để bảo đảm tính chuẩn hóa y khoa cao nhất.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <h4 className="font-bold text-[#008fcc] text-lg mb-1">Mục Tiêu</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Đồng hành cùng 1.000+ phòng khám trên toàn quốc số hóa quy trình quản trị bệnh nhân trực tuyến.</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <h4 className="font-bold text-[#008fcc] text-lg mb-1">Giải Pháp</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Hệ thống SaaS chạy ổn định trên mọi thiết bị di động, bảng điều khiển thông minh cho nhà quản lý.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <img className="rounded-xl shadow-lg w-full h-[320px] object-cover" alt="DamDiep B2B Solutions" src="/giai-phap.png" />
                            <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white p-6 rounded-lg hidden md:block max-w-[200px]">
                                <p className="text-3xl font-black text-[#6CD1FD]">100%</p>
                                <p className="text-xs text-slate-300 font-medium">Bảo mật thông tin dữ liệu phòng khám theo tiêu chuẩn HIPAA.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Doctors Section */}
                <section className="py-20 bg-surface" id="bac-si">
                    <div className="container mx-auto px-gutter">
                        <div className="text-center mb-12 space-y-3">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Chức Năng Nổi Trội Của Hệ Thống</h2>
                            <div className="w-20 h-1 bg-[#6CD1FD] mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Feature 1 */}
                            <div className="bg-surface-container-lowest rounded-xl overflow-hidden soft-elevation group hover-elevation transition-all border border-slate-100 dark:border-slate-800 flex flex-col">
                                <div className="aspect-[4/3] overflow-hidden relative bg-slate-50 dark:bg-slate-800 group/image cursor-pointer" onClick={() => setPreviewImage('/benh-an-dien-tu.png')}>
                                    <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Bệnh Án Điện Tử" src="/benh-an-dien-tu.png" />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/95 text-[#008fcc] px-5 py-2 rounded-lg font-bold flex items-center gap-2 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-300 shadow-lg">
                                            <span className="material-symbols-outlined">visibility</span> Xem
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 text-center flex-1 flex flex-col justify-center">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Bệnh Án Điện Tử (EMR)</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Quản lý hồ sơ, phác đồ điều trị và lịch sử y khoa của bệnh nhân một cách hệ thống, không cần giấy tờ.</p>
                                </div>
                            </div>
                            {/* Feature 2 */}
                            <div className="bg-surface-container-lowest rounded-xl overflow-hidden soft-elevation group hover-elevation transition-all border border-slate-100 dark:border-slate-800 flex flex-col">
                                <div className="aspect-[4/3] overflow-hidden relative bg-slate-50 dark:bg-slate-800 group/image cursor-pointer" onClick={() => setPreviewImage('/quan-tri-van-hanh.png')}>
                                    <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Quản Trị Vận Hành" src="/quan-tri-van-hanh.png" />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/95 text-[#008fcc] px-5 py-2 rounded-lg font-bold flex items-center gap-2 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-300 shadow-lg">
                                            <span className="material-symbols-outlined">visibility</span> Xem
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 text-center flex-1 flex flex-col justify-center">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Quản Trị Vận Hành</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Theo dõi doanh thu, lượt khám và hiệu suất làm việc của nhân sự qua hệ thống Dashboard thông minh.</p>
                                </div>
                            </div>
                            {/* Feature 3 */}
                            <div className="bg-surface-container-lowest rounded-xl overflow-hidden soft-elevation group hover-elevation transition-all border border-slate-100 dark:border-slate-800 flex flex-col">
                                <div className="aspect-[4/3] overflow-hidden relative bg-slate-50 dark:bg-slate-800 group/image cursor-pointer" onClick={() => setPreviewImage('/lich-hen-kham.png')}>
                                    <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="CRM Chăm Sóc Y Tế" src="/lich-hen-kham.png" />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/95 text-[#008fcc] px-5 py-2 rounded-lg font-bold flex items-center gap-2 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-300 shadow-lg">
                                            <span className="material-symbols-outlined">visibility</span> Xem
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 text-center flex-1 flex flex-col justify-center">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">CRM Chăm Sóc Y Tế</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Tự động nhắc lịch tái khám, tương tác từ xa và chăm sóc bệnh nhân mãn tính liên tục sau khi rời phòng khám.</p>
                                </div>
                            </div>
                            {/* Feature 4 */}
                            <div className="bg-surface-container-lowest rounded-xl overflow-hidden soft-elevation group hover-elevation transition-all border border-slate-100 dark:border-slate-800 flex flex-col">
                                <div className="aspect-[4/3] overflow-hidden relative bg-slate-50 dark:bg-slate-800 group/image cursor-pointer" onClick={() => setPreviewImage('/quan-ly-suc-khoe.png')}>
                                    <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Theo Dõi Sức Khỏe" src="/quan-ly-suc-khoe.png" />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/95 text-[#008fcc] px-5 py-2 rounded-lg font-bold flex items-center gap-2 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-300 shadow-lg">
                                            <span className="material-symbols-outlined">visibility</span> Xem
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 text-center flex-1 flex flex-col justify-center">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Theo Dõi Sức Khỏe</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Cập nhật và theo dõi liên tục các chỉ số sinh tồn của bệnh nhân mãn tính, hệ thống tự động cảnh báo bất thường.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-20 bg-white dark:bg-slate-900" id="uu-diem">
                    <div className="container mx-auto px-gutter">
                        <div className="text-center mb-12 space-y-3">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Tại Sao Nên Chọn Hệ Thống DamDiep?</h2>
                            <div className="w-20 h-1 bg-[#6CD1FD] mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">local_hospital</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chuẩn Hóa Quy Trình Y Khoa</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Các form nhập liệu bệnh án điện tử được thiết kế chuẩn xác theo hướng dẫn điều trị của Bộ Y Tế.</p>
                            </div>
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">precision_manufacturing</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bảo Mật Điện Toán Đám Mây</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Vận hành an toàn trên hệ thống máy chủ đám mây tốc độ cao, hỗ trợ truy cập đa nền tảng.</p>
                            </div>
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">payments</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tối Ưu Hóa Chi Phí</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Mô hình thuê bao SaaS linh hoạt theo nhu cầu phòng khám, không mất chi phí mua phần cứng máy chủ ban đầu.</p>
                            </div>
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">patient_list</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cá Nhân Hóa Trải Nghiệm</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Giao diện riêng biệt cho Bác sĩ, Nhân viên tiếp đón và ứng dụng theo dõi dành riêng cho bệnh nhân.</p>
                            </div>
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">speed</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Triển Khai Nhanh Chóng</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Đội ngũ kỹ thuật hỗ trợ khởi tạo dữ liệu phòng khám, kết nối API và đào tạo bác sĩ chỉ trong vòng 3 ngày.</p>
                            </div>
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:shadow-lg transition-shadow">
                                <span className="material-symbols-outlined text-4xl text-[#008fcc]">support_agent</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hỗ Trợ Kỹ Thuật 24/7</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Đảm bảo hệ thống vận hành liên tục 99.9%, hỗ trợ khắc phục sự cố khẩn cấp tức thời.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Patient Testimonials Section */}
                <section className="py-20 bg-surface-container-low" id="y-kien">
                    <div className="container mx-auto px-gutter">
                        <div className="text-center mb-12 space-y-3">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Ý Kiến Đánh Giá Từ Đối Tác Phòng Khám</h2>
                            <div className="w-20 h-1 bg-[#6CD1FD] mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Testimonial 1 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl soft-elevation border border-slate-100 dark:border-slate-800 space-y-4">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                    "Từ ngày áp dụng hệ thống quản lý bệnh nhân DamDiep, phòng khám của chúng tôi đã giảm 50% thời gian xử lý thủ tục giấy tờ, tỷ lệ bệnh nhân mãn tính tái khám đúng lịch hẹn tăng lên rõ rệt."
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700">
                                        AN
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">BS. Nguyễn Hoài An</h4>
                                        <p className="text-[11px] text-slate-400">Giám Đốc Phòng Khám Đa Khoa An Khang</p>
                                    </div>
                                </div>
                            </div>
                            {/* Testimonial 2 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl soft-elevation border border-slate-100 dark:border-slate-800 space-y-4">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                    "Tính năng theo dõi huyết áp và chỉ số đường huyết từ xa qua app bệnh nhân của DamDiep giúp các bác sĩ tim mạch của chúng tôi kiểm soát tối ưu phác đồ điều trị cho hàng ngàn bệnh nhân."
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700">
                                        KT
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">ThS.BS. Kiều Trang</h4>
                                        <p className="text-[11px] text-slate-400">Trưởng Khoa Tim Mạch Phòng Khám Tâm Đức</p>
                                    </div>
                                </div>
                            </div>
                            {/* Testimonial 3 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl soft-elevation border border-slate-100 dark:border-slate-800 space-y-4">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                    "Hệ thống vận hành ổn định trên cả máy tính và thiết bị di động, giao diện tiếng Việt cực kỳ thân thiện với các nhân viên tiếp tiếp nhận và điều dưỡng y tế."
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700">
                                        QH
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Anh Quốc Huy</h4>
                                        <p className="text-[11px] text-slate-400">Quản Lý Vận Hành Phòng Khám Quốc Tế Elite</p>
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
                            <p className="text-xs uppercase font-bold text-slate-200 tracking-wider">Bệnh Nhân Được Quản Lý Số</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl md:text-4xl font-black text-white">100+</p>
                            <p className="text-xs uppercase font-bold text-slate-200 tracking-wider">Phòng Khám & Trung Tâm Tin Dùng</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl md:text-4xl font-black text-white">15+</p>
                            <p className="text-xs uppercase font-bold text-slate-200 tracking-wider">Năm Kinh Nghiệm Công Nghệ Y Tế</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl md:text-4xl font-black text-white">98%</p>
                            <p className="text-xs uppercase font-bold text-slate-200 tracking-wider">Tỷ Lệ Đối Tác Hài Lòng</p>
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
                                    <AnimatePresence initial={false}>
                                        {faqOpen[idx] && (
                                            <motion.div
                                                initial="collapsed"
                                                animate="open"
                                                exit="collapsed"
                                                variants={{
                                                    open: { opacity: 1, height: "auto" },
                                                    collapsed: { opacity: 0, height: 0 }
                                                }}
                                                transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                                            >
                                                <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
                                    <h2 className="text-3xl font-extrabold text-white">Đăng Ký Tư Vấn & Dùng Thử Hệ Thống</h2>
                                    <p className="opacity-90 text-sm text-slate-100 leading-relaxed">
                                        Quý phòng khám, bệnh viện hoặc bác sĩ có nhu cầu tìm hiểu và dùng thử giải pháp quản lý bệnh nhân trực tuyến DamDiep, vui lòng điền thông tin biểu mẫu. Kỹ sư tư vấn của chúng tôi sẽ liên hệ hỗ trợ demo trực tiếp trong ngày.
                                    </p>
                                </div>
                                <div className="space-y-4 border-t border-white/20 pt-6">
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="material-symbols-outlined text-white">call</span>
                                        <span>Hotline Giải Pháp: 1900 1234</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="material-symbols-outlined text-white">mail</span>
                                        <span>contact@damdiep.vn</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="material-symbols-outlined text-white">schedule</span>
                                        <span>Giờ tư vấn doanh nghiệp: 8:00 - 18:00 hàng ngày</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10">
                                <form className="space-y-4" onSubmit={handleFormSubmit} noValidate>
                                    {submitSuccess && (
                                        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                                            <span className="material-symbols-outlined">check_circle</span>
                                            Đăng ký thành công! Đội ngũ tư vấn sẽ liên hệ sớm nhất.
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Tên Người Đăng Ký / Tên Cơ Sở Y Tế *</label>
                                        <input
                                            className={`w-full border ${formErrors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-[#6CD1FD] focus:border-[#6CD1FD]'} rounded-lg p-3 text-sm focus:ring-2 bg-white text-gray-900 outline-none transition-colors`}
                                            placeholder="Nhập tên của bạn hoặc tên phòng khám"
                                            type="text"
                                            value={bookingForm.name}
                                            onChange={e => {
                                                setBookingForm({ ...bookingForm, name: e.target.value });
                                                if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                                            }}
                                        />
                                        {formErrors.name && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.name}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Số điện thoại liên hệ *</label>
                                            <input
                                                className={`w-full border ${formErrors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-[#6CD1FD] focus:border-[#6CD1FD]'} rounded-lg p-3 text-sm focus:ring-2 bg-white text-gray-900 outline-none transition-colors`}
                                                placeholder="Nhập số điện thoại"
                                                type="tel"
                                                value={bookingForm.phone}
                                                onChange={e => {
                                                    setBookingForm({ ...bookingForm, phone: e.target.value });
                                                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                                                }}
                                            />
                                            {formErrors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email liên hệ</label>
                                            <input
                                                className={`w-full border ${formErrors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-[#6CD1FD] focus:border-[#6CD1FD]'} rounded-lg p-3 text-sm focus:ring-2 bg-white text-gray-900 outline-none transition-colors`}
                                                placeholder="Nhập địa chỉ email (tuỳ chọn)"
                                                type="email"
                                                value={bookingForm.email}
                                                onChange={e => {
                                                    setBookingForm({ ...bookingForm, email: e.target.value });
                                                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                                                }}
                                            />
                                            {formErrors.email && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.email}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Quy mô phòng khám *</label>
                                            <Dropdown
                                                options={[
                                                    'Quy mô Dưới 10 Bác Sĩ',
                                                    'Quy mô 10 - 30 Bác Sĩ',
                                                    'Quy mô Trên 30 Bác Sĩ',
                                                    'Bác sĩ gia đình / Khám cá nhân'
                                                ]}
                                                value={bookingForm.department}
                                                onChange={val => setBookingForm({ ...bookingForm, department: val })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Ngày hẹn Demo trực tuyến *</label>
                                            <input
                                                className={`w-full border ${formErrors.date ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-[#6CD1FD] focus:border-[#6CD1FD]'} rounded-lg p-3 text-sm focus:ring-2 bg-white text-gray-900 outline-none transition-colors`}
                                                type="date"
                                                value={bookingForm.date}
                                                onChange={e => {
                                                    setBookingForm({ ...bookingForm, date: e.target.value });
                                                    if (formErrors.date) setFormErrors({ ...formErrors, date: '' });
                                                }}
                                            />
                                            {formErrors.date && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.date}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nhu cầu cụ thể cần tư vấn</label>
                                        <textarea
                                            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#6CD1FD] focus:border-[#6CD1FD] bg-white text-gray-900 outline-none h-20 resize-none transition-colors"
                                            placeholder="Ví dụ: Cần kết nối với máy đo huyết áp Bluetooth của bệnh nhân, xuất dữ liệu báo cáo..."
                                            value={bookingForm.message}
                                            onChange={e => setBookingForm({ ...bookingForm, message: e.target.value })}
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <button
                                            className="w-full bg-[#6CD1FD] text-white py-3.5 rounded-lg font-bold text-sm hover:shadow-lg hover:bg-[#5bc0ec] active:scale-[0.98] transition-all disabled:opacity-50"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Đang xử lý đăng ký...' : 'Xác Nhận Đăng Ký Trải Nghiệm'}
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
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Trung Tâm Giải Pháp Công Nghệ Y Tế DamDiep</h2>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#6CD1FD]/10 flex items-center justify-center text-[#008fcc] flex-shrink-0">
                                        <span className="material-symbols-outlined">pin_drop</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Địa Chỉ Trụ Sở Công Nghệ</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">123 Đường Sức Khỏe, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#6CD1FD]/10 flex items-center justify-center text-[#008fcc] flex-shrink-0">
                                        <span className="material-symbols-outlined">phone_in_talk</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Hotline Doanh Nghiệp & Hợp Tác</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">1900 1234 (Tư vấn demo) - 028 3456 7890 (Hỗ trợ kỹ thuật 24/7)</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#6CD1FD]/10 flex items-center justify-center text-[#008fcc] flex-shrink-0">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Hộp Thư Doanh Nghiệp</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">contact@damdiep.vn - cskh@damdiep.vn</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Interactive map placeholder with medical aesthetic */}
                        <div className="h-[300px] bg-slate-100 dark:bg-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#008fcc_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
                            <div className="relative text-center space-y-3 p-6 z-10">
                                <span className="material-symbols-outlined text-5xl text-[#008fcc] animate-bounce-slow">location_on</span>
                                <h4 className="font-bold text-slate-900 dark:text-white">Bản Đồ Chỉ Dẫn Trụ Sở</h4>
                                <p className="text-xs text-slate-500 max-w-xs mx-auto">Vui lòng nhấp vào đây để điều hướng bản đồ Google Maps chỉ dẫn trực tiếp tới văn phòng hỗ trợ DamDiep.</p>
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
                    <div className="font-headline-sm text-headline-sm font-bold text-inverse-on-surface text-white">Công Nghệ Quản Lý Y Khoa DamDiep</div>
                    <p className="text-on-tertiary-container text-sm max-w-xs text-slate-300">Hệ thống dịch vụ y tế trực tuyến và giải pháp quản lý sức khỏe bệnh nhân hàng đầu.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-8 mt-6 md:mt-0">
                    <a className="text-on-tertiary-container hover:text-secondary-fixed transition-colors font-label-sm text-label-sm text-slate-300" href="#">Chính sách bảo mật</a>
                    <a className="text-on-tertiary-container hover:text-secondary-fixed transition-colors font-label-sm text-label-sm text-slate-300" href="#">Điều khoản dịch vụ</a>
                    <a className="text-on-tertiary-container hover:text-secondary-fixed transition-colors font-label-sm text-label-sm text-slate-300" href="#">Bản đồ chỉ dẫn</a>
                </div>
                <div className="text-on-tertiary-container font-label-sm text-label-sm mt-6 md:mt-0 text-slate-300">
                    © 2026 DamDiep. Tất cả các quyền được bảo hộ.
                </div>
            </footer>

            {/* Mobile Appointment Bar (Sticky) */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] z-40 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold">Hotline Doanh Nghiệp</span>
                    <span className="text-primary font-bold">1900 1234</span>
                </div>
                <a href="#dat-lich" className="bg-[#6CD1FD] text-slate-950 px-6 py-2 rounded-lg font-bold active:scale-95 transition-transform">Dùng thử ngay</a>
            </div>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
                        onClick={() => setPreviewImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative max-w-5xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute -top-12 right-0 text-white hover:text-red-400 bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                                onClick={() => setPreviewImage(null)}
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            <img src={previewImage} alt="Preview" className="w-full h-auto rounded-xl shadow-2xl" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default VelorahLandingPage;
