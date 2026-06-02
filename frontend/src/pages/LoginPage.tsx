import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../api/auth';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const responseData = await authApi.login({ email, password });
            const data = responseData.data || responseData; // Fallback if backend stops wrapping

            // Store auth data
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('userRole', data.role?.replace('ROLE_', '') || '');
            localStorage.setItem('role', data.role?.replace('ROLE_', '') || '');
            localStorage.setItem('userId', String(data.id || ''));
            localStorage.setItem('fullName', data.fullName || '');
            if (data.clinicId) {
                localStorage.setItem('clinicId', String(data.clinicId));
            }

            // Navigate based on role
            const role = (data.role || '').replace('ROLE_', '');
            const redirectMap: Record<string, string> = {
                'ADMIN': '/admin',
                'CLINIC_MANAGER': '/clinic',
                'DOCTOR': '/doctor',
                'PATIENT': '/patient',
            };
            navigate(redirectMap[role] || '/patient');
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.response?.data?.error || 'Email hoặc mật khẩu không chính xác';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-display">
            {/* Left Panel — Branding & Illustration */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden" style={{
                background: 'linear-gradient(145deg, #005eb8 0%, #008fcc 50%, #6CD1FD 100%)'
            }}>
                {/* Decorative circles */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
                <div className="absolute bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
                <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-white/5 rounded-full" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-16 w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-4">
                        <img src="/logo.png?v=3" alt="DamDiep Logo" className="w-64 h-auto sm:w-80 object-contain" />
                    </Link>

                    {/* Center content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.15] tracking-tight">
                                Nền Tảng Quản Lý<br />
                                <span className="text-white/80">Bệnh Nhân Trực Tuyến</span>
                            </h1>
                            <p className="text-white/60 text-lg max-w-md leading-relaxed font-medium">
                                Giải pháp số hóa quy trình chăm sóc sức khỏe toàn diện cho các phòng khám và bệnh viện trên toàn quốc.
                            </p>
                        </div>

                        {/* Feature highlights */}
                        <div className="space-y-4">
                            {[
                                { icon: 'verified_user', text: 'Bảo mật chuẩn ISO 27001 & HIPAA' },
                                { icon: 'monitoring', text: 'Theo dõi chỉ số sinh tồn thời gian thực' },
                                { icon: 'devices', text: 'Hoạt động đa nền tảng, mọi thiết bị' },
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.15 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                                        <span className="material-symbols-outlined text-white/90 text-xl">{feature.icon}</span>
                                    </div>
                                    <span className="text-white/80 font-semibold text-[15px]">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom stats */}
                    <div className="flex items-center gap-10">
                        <div>
                            <p className="text-3xl font-black text-white">100+</p>
                            <p className="text-xs text-white/50 font-bold uppercase tracking-wider mt-1">Phòng khám</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div>
                            <p className="text-3xl font-black text-white">50K+</p>
                            <p className="text-xs text-white/50 font-bold uppercase tracking-wider mt-1">Bệnh nhân</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div>
                            <p className="text-3xl font-black text-white">99.9%</p>
                            <p className="text-xs text-white/50 font-bold uppercase tracking-wider mt-1">Uptime</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel — Login Form */}
            <div className="w-full lg:w-[45%] flex items-center justify-center bg-white dark:bg-slate-950 px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[420px] space-y-8"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-4 justify-center mb-8">
                        <img src="/logo.png?v=3" alt="DamDiep Logo" className="w-48 h-auto object-contain" />
                    </div>

                    {/* Header */}
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Đăng nhập
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px]">
                            Chào mừng trở lại! Vui lòng nhập thông tin tài khoản.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-2xl"
                        >
                            <span className="material-symbols-outlined text-rose-500 text-xl">error</span>
                            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</span>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                Email / Tên đăng nhập
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008fcc] transition-colors text-xl">
                                    mail
                                </span>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@phongkham.vn"
                                    autoComplete="email"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:border-[#008fcc] focus:bg-white dark:focus:bg-slate-950 outline-none font-semibold text-slate-900 dark:text-white transition-all placeholder:text-slate-400 text-[15px]"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Mật khẩu
                                </label>
                                <button type="button" className="text-xs font-bold text-[#008fcc] hover:underline">
                                    Quên mật khẩu?
                                </button>
                            </div>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008fcc] transition-colors text-xl">
                                    lock
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:border-[#008fcc] focus:bg-white dark:focus:bg-slate-950 outline-none font-semibold text-slate-900 dark:text-white transition-all placeholder:text-slate-400 text-[15px]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-2xl font-black text-[16px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group text-white shadow-xl shadow-[#008fcc]/25 hover:shadow-[#008fcc]/40"
                                style={{
                                    background: 'linear-gradient(135deg, #005eb8 0%, #008fcc 100%)'
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                        Đang xác thực...
                                    </>
                                ) : (
                                    <>
                                        Đăng nhập
                                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-4">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">hoặc</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                    </div>

                    {/* Back to landing */}
                    <div className="text-center space-y-4">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#008fcc] hover:text-[#005eb8] transition-colors group"
                        >
                            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            Quay về trang chủ DamDiep
                        </Link>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                            Bằng việc đăng nhập, bạn đồng ý với
                            <a href="#" className="text-[#008fcc] hover:underline mx-1">Điều khoản dịch vụ</a>
                            và
                            <a href="#" className="text-[#008fcc] hover:underline ml-1">Chính sách bảo mật</a>
                            của DamDiep.
                        </p>
                    </div>


                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
