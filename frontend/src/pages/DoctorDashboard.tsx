import { useState, useEffect } from 'react';
import TopBar from '../components/common/TopBar';
import PatientDetailModal from '../features/patient/components/PatientDetailModal';
import AdviceModal from '../features/patient/components/AdviceModal';
import Toast from '../components/ui/Toast';
import PrescriptionModal from '../features/prescription/components/PrescriptionModal';
import RescheduleModal from '../features/patient/components/RescheduleModal';
import Dropdown from '../components/ui/Dropdown';

import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { doctorApi } from '../api/doctor';

export default function DoctorDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashData, setDashData] = useState<any>(null);
  const [myPatients, setMyPatients] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [dRes, pRes] = await Promise.all([
        doctorApi.getDashboard(),
        doctorApi.getMyPatients({ size: 100 })
      ]);
      if (dRes.success) {
        setDashData(dRes.data);
      }
      if (pRes.success) {
        setMyPatients(pRes.data.content || []);
      }
    } catch (e) {
      console.error('Failed to fetch dashboard data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isAddingNewMedicine, setIsAddingNewMedicine] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isPatientDetailModalOpen, setIsPatientDetailModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Advice Modal State
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
  const [adviceCategory, setAdviceCategory] = useState('Theo dõi');
  const [adviceContent, setAdviceContent] = useState('');
  const [isAdviceSaving, setIsAdviceSaving] = useState(false);
  const [advicePatientName, setAdvicePatientName] = useState('');

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');

  const handleSaveAdvice = async () => {
    setIsAdviceSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAdviceSaving(false);
    setIsAdviceModalOpen(false);
    setAdviceContent('');
    setToastTitle(`Đã gửi lời khuyên đến ${advicePatientName} thành công!`);
    setShowToast(true);
  };
  const [medications, setMedications] = useState([
    { id: 1, name: 'Metformin 500mg', intakeType: 'Uống sau khi ăn', dosage: '1 viên', frequency: 'Sáng 1, Tối 1', duration: '30 ngày' },
    { id: 2, name: 'Paracetamol 500mg', intakeType: 'Khi sốt trên 38.5 độ', dosage: '1 viên', frequency: 'Cách 4-6 giờ', duration: '5 ngày' }
  ]);

  const [newMedForm, setNewMedForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    intakeType: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedDay, setSelectedDay] = useState(5);
  // const [adviceCategory, setAdviceCategory] = useState('Dinh dưỡng'); // Duplicate, removed
  // const [adviceContent, setAdviceContent] = useState(''); // Duplicate, removed
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Cảnh báo chỉ số', message: 'Bệnh nhân Nguyễn Văn An có chỉ số đường huyết cao bất thường.', time: '5 phút trước', type: 'warning' },
    { id: 2, title: 'Lịch hẹn mới', message: 'Bạn có một yêu cầu đặt lịch hẹn mới từ Lê Thị Bình.', time: '2 giờ trước', type: 'info' }
  ]);
  const [dashboardTimeRange, setDashboardTimeRange] = useState('7 ngày qua');

  const removeMedication = (id: number) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const addMedicationToPrescription = () => {
    const errors: Record<string, boolean> = {};
    if (!newMedForm.name) errors.name = true;
    if (!newMedForm.dosage) errors.dosage = true;
    if (!newMedForm.frequency) errors.frequency = true;
    if (!newMedForm.duration) errors.duration = true;
    if (!newMedForm.intakeType) errors.intakeType = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setMedications([...medications, { ...newMedForm, id: Date.now() }]);
    setNewMedForm({ name: '', dosage: '', frequency: '', duration: '', intakeType: '' });
    setIsAddingNewMedicine(false);
  };

  const handleSaveReschedule = async () => {
    setIsSaving(true);
    // Simulate API call processing
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    setIsModalOpen(false);
    setToastTitle('Đặt lịch thành công');
    setShowToast(true);
  };

  // const handleSaveAdvice = async () => { // Duplicate, removed
  //   setIsSaving(true);
  //   // Process Advice Sending
  //   await new Promise(r => setTimeout(r, 1000));
  //   setIsSaving(false);
  //   setIsAdviceModalOpen(false);
  //   setToastTitle('Gửi lời khuyên thành công');
  //   setShowToast(true);
  // };

  const handleSavePrescription = async (prescriptionData: any) => {
    setIsSaving(true);
    try {
      const res = await doctorApi.createPrescription(prescriptionData);
      if (res.success) {
        setIsPrescriptionModalOpen(false);
        setMedications([]);
        setToastTitle('Kê đơn thành công!');
        setShowToast(true);
        fetchDashboardData(); // Refresh list
      }
    } catch (e) {
      console.error('Failed to save prescription', e);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <>
      <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
        {/* Sidebar Navigation - Responsive Collapsible */}
        <aside className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col z-[150] transition-transform duration-300 w-72 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none shadow-primary/10`}>
          <div className="p-6 flex items-center gap-3 border-b border-primary/5">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined fill-1">health_metrics</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">DamDiep</h1>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            <Link className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-2xl font-medium shadow-lg shadow-primary/10 transition-all" to={ROUTES.DOCTOR.DASHBOARD}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              <span>Bảng điều khiển</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" to={ROUTES.DOCTOR.PATIENTS}>
              <span className="material-symbols-outlined">groups</span>
              <span>Danh sách bệnh nhân</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" to={ROUTES.DOCTOR.ANALYTICS}>
              <span className="material-symbols-outlined">analytics</span>
              <span>Phân tích nguy cơ</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" to={ROUTES.DOCTOR.PRESCRIPTIONS}>
              <span className="material-symbols-outlined">prescriptions</span>
              <span>Đơn thuốc điện tử</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" to={ROUTES.DOCTOR.APPOINTMENTS}>
              <span className="material-symbols-outlined">calendar_today</span>
              <span>Lịch hẹn khám</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" to={ROUTES.DOCTOR.MESSAGES}>
              <span className="material-symbols-outlined">chat</span>
              <span>Tin nhắn</span>
              <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
            </Link>
          </nav>
          <div className="p-4 mt-auto">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
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

        {/* Main Content Area - Responsive Flex */}
        <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}
          {/* Top Bar - Responsive Header */}
          <TopBar
            setIsSidebarOpen={setIsSidebarOpen}
            notifications={notifications}
            setNotifications={setNotifications}
          />

          <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg"></div>
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-12"></div>
                    </div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-32"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-20"></div>
                  </div>
                ))
              ) : (
                <>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined size-6">person</span>
                      </div>
                      <span className="text-xs font-bold text-green-500 flex items-center">+2.4% <span className="material-symbols-outlined text-xs">trending_up</span></span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Tổng bệnh nhân</h3>
                    <p className="text-3xl font-extrabold mt-1">{dashData?.stats?.totalPatients || 0}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-500">
                        <span className="material-symbols-outlined size-6">emergency</span>
                      </div>
                      <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">Cảnh báo</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Nguy cơ cao</h3>
                    <p className="text-3xl font-extrabold mt-1 text-red-500">{dashData?.stats?.highRiskCount || 0}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-500">
                        <span className="material-symbols-outlined size-6">event_upcoming</span>
                      </div>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Lịch hẹn chờ</h3>
                    <p className="text-3xl font-extrabold mt-1">{dashData?.upcomingAppointments?.length || 0}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-500">
                        <span className="material-symbols-outlined size-6">mail</span>
                      </div>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Tin nhắn mới</h3>
                    <p className="text-3xl font-extrabold mt-1">{dashData?.stats?.unreadMessagesCount || 0}</p>
                  </div>
                </>
              )}
            </section>

            {/* High Risk Patients Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500">warning</span>
                  Phân tích nguy cơ cao
                </h2>
                <Link className="text-primary text-sm font-bold hover:underline cursor-pointer" to={ROUTES.DOCTOR.ANALYTICS}>Xem tất cả</Link>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  [...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-lg border-l-4 border-l-slate-200 dark:border-l-slate-800 border border-primary/5 flex items-center justify-between animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                        <div className="space-y-2">
                            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
                            <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="hidden sm:block space-y-2">
                          <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-16 mx-auto"></div>
                          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                      </div>
                      <div className="w-24 h-8 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                    </div>
                  ))
                ) : (
                  <>
                    {dashData?.highRiskPatients?.length > 0 ? (
                      dashData.highRiskPatients.map((p: any) => (
                        <div key={p.id} className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-lg border-l-4 border-l-red-500 border border-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 overflow-hidden flex-shrink-0 flex items-center justify-center text-primary font-bold">
                              {p.fullName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-base md:text-lg text-slate-900 dark:text-white">{p.fullName}</p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span>{p.age} tuổi</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="truncate max-w-[150px]">{p.chronicCondition}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center sm:flex-col justify-between w-full sm:w-auto sm:text-center px-0 sm:px-6 py-3 sm:py-0 border-y sm:border-y-0 border-slate-50 dark:border-slate-800">
                            <p className="text-[14px] font-bold text-slate-400">Xu hướng HA</p>
                            <div className="flex items-center gap-2">
                              <p className="text-red-500 font-extrabold text-base md:text-lg">{p.latestBp || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                            <span className="flex-1 sm:flex-none bg-red-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-full text-center shadow-sm shadow-red-500/20 uppercase tracking-wider whitespace-nowrap">Nguy cấp</span>
                            <div className="flex gap-2">
                              <Link to={ROUTES.DOCTOR.MESSAGES} className="flex-1 sm:flex-none bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">chat</span>
                              </Link>
                              <button
                                onClick={() => { setIsAdviceModalOpen(true); setAdvicePatientName(p.fullName); }}
                                className="flex-1 sm:flex-none bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">campaign</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-primary/5 text-slate-400 italic">
                        Không có bệnh nhân nguy cơ cao nào hiện tại
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Dynamic Chart Section */}
              <section className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm text-left relative overflow-hidden group">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 px-2">
                  <div className="space-y-1">
                    {isLoading ? (
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48 mb-2"></div>
                    ) : (
                      <h2 className="text-[19px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">Biểu đồ rủi ro bệnh nhân</h2>
                    )}
                    {isLoading ? (
                      <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-64"></div>
                    ) : (
                      <p className="text-[14px] text-slate-500 font-medium tracking-tight">Thống kê ca nguy cơ cao theo thời gian</p>
                    )}
                  </div>
                  {isLoading ? (
                    <div className="w-40 h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl shadow-sm"></div>
                  ) : (
                    <Dropdown
                      options={['7 ngày qua', '30 ngày qua']}
                      value={dashboardTimeRange}
                      onChange={setDashboardTimeRange}
                      className="min-w-[140px]"
                    />
                  )}
                </div>
                <div className="h-48 flex items-end justify-between gap-2 px-2">
                  {isLoading ? (
                    [...Array(7)].map((_, i) => (
                      <div key={i} className="w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-t-lg" style={{ height: `${30 + Math.random() * 50}%` }}></div>
                    ))
                  ) : (
                    <>
                      <div className="w-full bg-primary/20 rounded-t-lg relative group h-[40%]">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">42</div>
                      </div>
                      <div className="w-full bg-primary/30 rounded-t-lg relative group h-[60%]"></div>
                      <div className="w-full bg-primary/40 rounded-t-lg relative group h-[55%]"></div>
                      <div className="w-full bg-primary/60 rounded-t-lg relative group h-[75%]"></div>
                      <div className="w-full bg-primary rounded-t-lg relative group h-[90%]"></div>
                      <div className="w-full bg-primary/80 rounded-t-lg relative group h-[85%]"></div>
                      <div className="w-full bg-primary/70 rounded-t-lg relative group h-[70%]"></div>
                    </>
                  )}
                </div>
                <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 tracking-wide">
                  <span>Th2</span><span>Th3</span><span>Th4</span><span>Th5</span><span>Th6</span><span>Th7</span><span>CN</span>
                </div>
              </section>

              {/* Sidebar Content */}
              <aside className="col-span-12 lg:col-span-4 space-y-8">
                {/* Quick Actions */}
                <section>
                  <h2 className="text-xl font-extrabold mb-4">Thao tác nhanh</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {isLoading ? (
                      [...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-primary/10 shadow-sm animate-pulse">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                          <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-32"></div>
                        </div>
                      ))
                    ) : (
                      <>
                        <button
                          onClick={() => setIsPrescriptionModalOpen(true)}
                          className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-lg border border-primary/10 shadow-sm text-left group">
                          <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined">description</span>
                          </div>
                          <span className="font-bold text-[14px]">Kê đơn thuốc mới</span>
                        </button>
                        <button
                          onClick={() => setIsAdviceModalOpen(true)}
                          className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-lg border border-primary/10 shadow-sm text-left group">
                          <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined">send</span>
                          </div>
                          <span className="font-bold text-[14px]">Gửi lời khuyên</span>
                        </button>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-lg border border-primary/10 shadow-sm text-left group">
                          <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined">event</span>
                          </div>
                          <span className="font-bold text-[14px]">Đặt lịch tái khám</span>
                        </button>
                      </>
                    )}
                  </div>
                </section>

                {/* Recent Appointments */}
                <section className="mt-8">
                  <h2 className="text-[18px] font-extrabold mb-6 tracking-tight">Lịch hẹn sắp tới</h2>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm divide-y divide-primary/5 overflow-hidden">
                    {isLoading ? (
                      [...Array(3)].map((_, i) => (
                        <div key={i} className="p-5 flex items-center gap-5 animate-pulse">
                          <div className="min-w-[70px] space-y-1">
                             <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-10"></div>
                             <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-14"></div>
                          </div>
                          <div className="flex-1 space-y-2">
                             <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                             <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-full"></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                      {dashData?.upcomingAppointments?.length > 0 ? (
                        dashData.upcomingAppointments.slice(0, 3).map((appt: any) => (
                          <div key={appt.id} className="p-5 flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex-shrink-0 text-left min-w-[70px]">
                              <p className="text-[12px] font-bold text-slate-400 mb-1">
                                {new Date(appt.appointmentTime).toLocaleDateString('vi-VN') === new Date().toLocaleDateString('vi-VN') ? 'Hôm nay' : 'Sắp tới'}
                              </p>
                              <p className="text-xl font-black text-primary leading-tight">
                                {new Date(appt.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-bold truncate text-[15px] text-slate-900 dark:text-white mb-0.5">{appt.patientName}</p>
                              <p className="text-[13px] text-slate-500 font-medium">{appt.reason}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all text-xl">chevron_right</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-400 text-sm italic">Không có lịch hẹn sắp tới</div>
                      )}
                      </>
                    )}
                  </div>
                  <Link
                    to={ROUTES.DOCTOR.APPOINTMENTS}
                    className="w-full mt-4 py-3 border border-dashed border-primary/30 text-primary font-bold text-[14px] rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center"
                  >
                    Xem toàn bộ lịch trình
                  </Link>
                </section>
              </aside>
            </div>

            {/* Patient Management Table */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold">Quản lý bệnh nhân gần đây</h2>
                <div className="flex gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-32 h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md"></div>
                      <div className="w-32 h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md"></div>
                    </>
                  ) : (
                    <>
                      <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-md text-[14px] font-bold">Lọc theo khoa</button>
                      <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-md text-[14px] font-bold">Xuất báo cáo</button>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm pb-10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-primary/5 border-b border-primary/5">
                        <tr>
                          <th className="px-6 py-4 text-[14px] font-bold text-slate-500">Bệnh nhân</th>
                          <th className="px-6 py-4 text-[14px] font-bold text-slate-500">Chỉ số gần nhất</th>
                          <th className="px-6 py-4 text-[14px] font-bold text-slate-500">Tình trạng</th>
                          <th className="px-6 py-4 text-[14px] font-bold text-slate-500">Cập nhật lần cuối</th>
                          <th className="px-6 py-4 text-[14px] font-bold text-slate-500 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/5">
                        {isLoading ? (
                          [...Array(5)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-100/80 dark:bg-slate-800 shrink-0"></div>
                                  <div className="space-y-2">
                                     <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                                     <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-32"></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-4">
                                   <div className="h-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl w-16"></div>
                                   <div className="h-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl w-16"></div>
                                </div>
                              </td>
                              <td className="px-6 py-4"><div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div></td>
                              <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-24"></div></td>
                              <td className="px-6 py-4 text-right relative">
                                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full ml-auto"></div>
                              </td>
                            </tr>
                          ))
                        ) : dashData?.recentPatients?.length > 0 ? (
                          dashData.recentPatients.map((p: any) => (
                            <tr key={p.id} className="hover:bg-primary/5 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    {p.fullName?.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-[16px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{p.fullName}</p>
                                    <p className="text-[13px] text-slate-400 dark:text-slate-500 font-medium tracking-tight">Mã hồ sơ: {p.patientCode}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-4">
                                  <div className="text-[13px]">
                                    <p className="text-slate-400 font-medium">Glucose</p>
                                    <p className="font-bold text-[14px] text-slate-700 dark:text-slate-200">{p.latestGlucose || 'N/A'}</p>
                                  </div>
                                  <div className="text-[13px]">
                                    <p className="text-slate-400 font-medium">Huyết áp</p>
                                    <p className="font-bold text-[14px] text-slate-700 dark:text-slate-200">{p.latestBp || 'N/A'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-4 py-1.5 text-white text-[13px] font-bold rounded-full shadow-sm whitespace-nowrap inline-flex ${
                                  p.riskLevel === 'HIGH_RISK' ? 'bg-red-500' : p.riskLevel === 'MONITORING' ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}>
                                  {p.riskLevel === 'HIGH_RISK' ? 'Nguy cấp' : p.riskLevel === 'MONITORING' ? 'Cần theo dõi' : 'Ổn định'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-[14px] text-slate-500 font-medium">{p.lastUpdate || 'Vừa xong'}</td>
                              <td className="px-6 py-4 text-right relative">
                                <button
                                  onClick={() => setActiveMenu(activeMenu === p.id ? null : p.id)}
                                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all ml-auto">
                                  <span className="material-symbols-outlined text-[22px]">more_vert</span>
                                </button>
                                {activeMenu === p.id && (
                                  <>
                                    <div className="fixed inset-0 z-[100]" onClick={() => setActiveMenu(null)}></div>
                                    <div className="absolute right-6 top-12 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2.5 z-[110] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 overflow-hidden text-left">
                                      <button
                                        onClick={() => { setSelectedPatient(p); setIsPatientDetailModalOpen(true); setActiveMenu(null); }}
                                        className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">visibility</span>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Xem chi tiết hồ sơ</span>
                                      </button>
                                      <button
                                        onClick={() => { setIsAdviceModalOpen(true); setAdvicePatientName(p.fullName); setActiveMenu(null); }}
                                        className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">send</span>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Gửi lời khuyên</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">Chưa có bệnh nhân gần đây</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
              </div>
            </section>
          </div>
        </main>

        <RescheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          isSaving={isSaving}
          onSave={handleSaveReschedule}
        />

        <PrescriptionModal
          isOpen={isPrescriptionModalOpen}
          onClose={() => setIsPrescriptionModalOpen(false)}
          isAddingNewMedicine={isAddingNewMedicine}
          setIsAddingNewMedicine={setIsAddingNewMedicine}
          medications={medications}
          removeMedication={removeMedication}
          newMedForm={newMedForm}
          setNewMedForm={setNewMedForm}
          formErrors={formErrors as any}
          setFormErrors={setFormErrors as any}
          addMedicationToPrescription={addMedicationToPrescription}
          isSaving={isSaving}
          onSave={handleSavePrescription}
          patients={myPatients}
        />

        {selectedPatient && (
          <PatientDetailModal
            isOpen={isPatientDetailModalOpen}
            onClose={() => setIsPatientDetailModalOpen(false)}
            patient={selectedPatient}
          />
        )}

        <AdviceModal
          isOpen={isAdviceModalOpen}
          onClose={() => setIsAdviceModalOpen(false)}
          adviceCategory={adviceCategory}
          setAdviceCategory={setAdviceCategory}
          adviceContent={adviceContent}
          setAdviceContent={setAdviceContent}
          isSaving={isAdviceSaving}
          onSave={handleSaveAdvice}
          patientName={advicePatientName}
        />

        <Toast
          show={showToast}
          title={toastTitle}
          onClose={() => setShowToast(false)}
        />
        {/* MODAL REMOVED - Redirecting to appointments instead */}
      </div>

      <style>{`
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </>
  );
}
