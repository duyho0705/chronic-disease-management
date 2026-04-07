import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { authApi } from '../api/auth';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const state = location.state as { roleId?: string };
        if (state?.roleId) {
            setIdentifier(state.roleId === 'admin' ? 'admin@care.com' : state.roleId === 'doctor' ? 'mai.le@care.com' : state.roleId === 'clinic' ? 'manager@care.com' : 'minhtam@gmail.com');
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await authApi.login({ email: identifier, password });
            
            if (!response.success) {
                setError(response.message || 'Đăng nhập không thành công');
                return;
            }

            const { accessToken, role, clinicId, id } = response.data;
            
            localStorage.setItem('token', accessToken);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userId', id.toString());
            if (clinicId) localStorage.setItem('clinicId', clinicId.toString());
            
            if (role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else if (role === 'ROLE_DOCTOR') {
                navigate('/doctor');
            } else if (role === 'ROLE_CLINIC_MANAGER') {
                navigate('/clinic');
            } else {
                navigate('/patient');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc] dark:bg-slate-950 font-sans relative overflow-hidden">
            {/* Soft decorative background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 p-10">
                    {/* Branding */}
                    <div className="flex flex-col items-center gap-4 mb-10">
                        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-3.5 shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-white text-3xl filled">health_and_safety</span>
                        </div>
                        <div className="text-center">
                            <h1 className="font-outfit font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white">Sống Khỏe</h1>
                            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1">Chăm sóc sức khỏe toàn diện</p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-100 dark:border-red-900/30 animate-in fade-in slide-in-from-top-2">
                                <span className="material-symbols-outlined text-[20px]">error_outline</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="identifier">Tài khoản</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                                </div>
                                <input 
                                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all sm:text-sm" 
                                    id="identifier" 
                                    placeholder="Email hoặc số điện thoại" 
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="password">Mật khẩu</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">lock_open</span>
                                </div>
                                <input 
                                    className="block w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all sm:text-sm" 
                                    id="password" 
                                    placeholder="••••••••" 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors" 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 dark:border-slate-700 transition-all checked:bg-primary checked:border-primary focus:ring-4 focus:ring-primary/10" 
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[14px] opacity-0 peer-checked:opacity-100 transition-opacity font-bold">check</span>
                                </div>
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Ghi nhớ đăng nhập</span>
                            </label>
                            <Link className="text-sm font-bold text-primary hover:text-blue-700 transition-colors" to="#">Quên mật khẩu?</Link>
                        </div>

                        <button 
                            className="w-full bg-slate-900 dark:bg-white py-4 rounded-2xl text-white dark:text-slate-900 font-bold shadow-xl shadow-slate-900/10 dark:shadow-white/5 hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group" 
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    Đăng nhập
                                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">east</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="mt-10">
                        <div className="relative flex items-center mb-8">
                            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                            <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Hoặc đăng nhập với</span>
                            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 group">
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-3 py-3 bg-[#1877F2] hover:bg-[#166fe5] border border-transparent rounded-2xl shadow-lg shadow-[#1877F2]/10 transition-all font-semibold text-white group">
                                <svg className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>

                    {/* Register Link */}
                    <p className="mt-10 text-center text-sm font-medium text-slate-500 dark:text-slate-500">
                        Chưa có tài khoản? 
                        <Link className="text-primary font-bold hover:underline ml-1" to={ROUTES.HOME}>Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
