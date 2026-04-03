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
            console.log('Attempting login with:', identifier);
            const response = await authApi.login({ email: identifier, password });
            console.log('Login response:', response);
            
            if (!response.success) {
                setError(response.message || 'Đăng nhập không thành công');
                return;
            }

            const { accessToken, role, clinicId } = response.data;
            console.log('Role from backend:', role);
            
            localStorage.setItem('token', accessToken);
            localStorage.setItem('userRole', role);
            if (clinicId) localStorage.setItem('clinicId', clinicId.toString());
            
            // Navigate based on real role from backend
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
            console.error('Login error details:', err);
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark font-display transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 transform transition-all">
                {/* Branding */}
                <div className="flex flex-col items-center gap-5 mb-10">
                    <div className="bg-primary rounded-2xl p-4 flex items-center justify-center shadow-xl shadow-primary/20 animate-bounce-slow">
                        <span className="material-symbols-outlined text-white text-4xl filled">health_and_safety</span>
                    </div>
                    <div className="text-center">
                        <h1 className="font-black text-3xl tracking-tight text-slate-900 dark:text-white">Sống Khỏe</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Hệ thống quản lý sức khỏe thông minh</p>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake border border-rose-100 dark:border-rose-900/30">
                            <span className="material-symbols-outlined text-rose-500">error</span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="identifier">Số điện thoại / Email</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-xl">mail</span>
                            <input 
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400" 
                                id="identifier" 
                                placeholder="example@gmail.com" 
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" htmlFor="password">Mật khẩu</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-xl">lock</span>
                            <input 
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400" 
                                id="password" 
                                placeholder="••••••••" 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none" 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input 
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 dark:border-slate-700 transition-all checked:bg-primary checked:border-primary focus:ring-4 focus:ring-primary/10" 
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs opacity-0 peer-checked:opacity-100 transition-opacity font-bold">check</span>
                            </div>
                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Ghi nhớ đăng nhập</span>
                        </label>
                        <Link className="text-sm font-black text-primary hover:text-primary/80 transition-colors" to="#">Quên mật khẩu?</Link>
                    </div>

                    <button 
                        className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="w-6 h-6 border-4 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
                        ) : (
                            <>
                                Đăng nhập
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Social Login */}
                <div className="mt-10">
                    <div className="relative flex items-center mb-8">
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                        <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Hoặc đăng nhập bằng</span>
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 py-3.5 border-2 border-slate-50 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-100 dark:hover:border-slate-700 transition-all font-bold text-slate-700 dark:text-slate-300 group">
                            <img alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIePWdT-Sk1KU1gq0Ga0igRwKtjXj6wbdsdiHdsQfQyDCr7MNRVNgE5y_OPTZjD1AUj0BLZ3XukFBSaIcgI7yROvPD6EQ1_uWQjmjDxtuo3pQVucoGiiGxaSAllQ4a7v6qhCQVdgm7Q49hcmm50vDD_MeNYBcz-k3jV9xBlb2V9-N_iwHIJEBDpymlAerq9zpWZNiUctljj_abFDwF1Kfsz38dhLwCRw5C2pWMPehz-tJPS2jmHQd7RxWXTmCN0VyV7tACujXvGbM"/>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-3 py-3.5 border-2 border-slate-50 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-100 dark:hover:border-slate-700 transition-all font-bold text-blue-600 group">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                            Facebook
                        </button>
                    </div>
                </div>

                {/* Register Link */}
                <p className="mt-10 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                    Chưa có tài khoản? 
                    <Link className="text-primary font-black hover:underline ml-1.5" to={ROUTES.HOME}>Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
