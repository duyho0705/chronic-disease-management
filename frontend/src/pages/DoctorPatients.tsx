import { useState } from 'react';
import PrescriptionModal from '../features/prescription/components/PrescriptionModal';
import AdviceModal from '../features/patient/components/AdviceModal';
import RescheduleModal from '../features/patient/components/RescheduleModal';
import Toast from '../components/ui/Toast';
import TopBar from '../components/common/TopBar';
import FilterDropdown from '../components/ui/FilterDropdown';
import PatientDetailModal from '../features/patient/components/PatientDetailModal';
import AddPatientModal from '../features/patient/components/AddPatientModal';

export default function DoctorPatients() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Cảnh báo chỉ số', message: 'Bệnh nhân Nguyễn Văn An có chỉ số đường huyết cao bất thường.', time: '5 phút trước', type: 'warning' },
    { id: 2, title: 'Lịch hẹn mới', message: 'Bạn có một yêu cầu đặt lịch hẹn mới từ Lê Thị Bình.', time: '2 giờ trước', type: 'info' }
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [diseaseFilter, setDiseaseFilter] = useState('Tất cả bệnh lý');
  const [riskFilter, setRiskFilter] = useState('Mọi mức độ');
  const [isPatientDetailModalOpen, setIsPatientDetailModalOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Date & Time states for RescheduleModal
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Toast state
  const [toast, setToast] = useState({ show: false, title: '', type: 'success' as 'success' | 'warning' | 'error' });

  // Prescription states
  const [medications, setMedications] = useState([
    { id: 1, name: 'Metformin', dosage: '500mg', frequency: '2 lần/ngày', duration: '30 ngày', intakeType: 'Sau ăn' }
  ]);
  const [isAddingNewMedicine, setIsAddingNewMedicine] = useState(false);
  const [newMedForm, setNewMedForm] = useState({
    name: '',
    dosage: '',
    frequency: '1 lần/ngày',
    duration: '',
    intakeType: 'Sau ăn'
  });

  // Advice states
  const [adviceCategory, setAdviceCategory] = useState('Dinh dưỡng');
  const [adviceContent, setAdviceContent] = useState('');

  const [formErrors, setFormErrors] = useState({
    name: false,
    dosage: false,
    duration: false,
    frequency: false,
    intakeType: false
  });

  const removeMedication = (id: number) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const addMedicationToPrescription = () => {
    const errors = {
      name: !newMedForm.name,
      dosage: !newMedForm.dosage,
      duration: !newMedForm.duration,
      frequency: !newMedForm.frequency,
      intakeType: !newMedForm.intakeType
    };
    setFormErrors(errors);

    if (!errors.name && !errors.dosage && !errors.duration && !errors.frequency && !errors.intakeType) {
      setMedications([...medications, { ...newMedForm, id: Date.now() }]);
      setNewMedForm({ name: '', dosage: '', frequency: '1 lần/ngày', duration: '', intakeType: 'Sau ăn' });
      setIsAddingNewMedicine(false);
    }
  };
  return (
    <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
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
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" href="/doctor">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Bảng điều khiển</span>
          </a>

          <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-2xl font-medium shadow-lg shadow-primary/10 transition-all" href="/doctor/patients">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            <span>Danh sách bệnh nhân</span>
          </a>

          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" href="/doctor/analytics">
            <span className="material-symbols-outlined">analytics</span>
            <span>Phân tích nguy cơ</span>
          </a>

          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" href="/doctor/prescriptions">
            <span className="material-symbols-outlined">prescriptions</span>
            <span>Đơn thuốc điện tử</span>
          </a>

          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" href="/doctor/appointments">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Lịch hẹn khám</span>
          </a>

          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" href="/doctor/messages">
            <span className="material-symbols-outlined">chat</span>
            <span>Tin nhắn</span>
            <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
          </a>
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

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <TopBar
          setIsSidebarOpen={setIsSidebarOpen}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        <div className="p-8 space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900 mb-2">Danh sách bệnh nhân</h2>
              <p className="text-slate-500 text-[15px] font-medium">Quản lý và theo dõi lộ trình chăm sóc sức khỏe của 128 bệnh nhân đang điều trị trực tiếp.</p>
            </div>
            <button
              onClick={() => setIsAddPatientModalOpen(true)}
              className="bg-primary text-slate-900 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/10 transition-all">
              <span className="material-symbols-outlined">person_add</span>
              Thêm bệnh nhân mới
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FilterDropdown
              label="Loại bệnh"
              icon="filter_list"
              iconBgColor="bg-primary/10"
              iconTextColor="text-primary"
              options={['Tất cả bệnh lý', 'Tiểu đường Type 2', 'Tăng huyết áp', 'Tim mạch']}
              value={diseaseFilter}
              onChange={setDiseaseFilter}
            />

            <FilterDropdown
              label="Mức độ nguy cơ"
              icon="error"
              iconBgColor="bg-orange-50"
              iconTextColor="text-orange-500"
              options={['Mọi mức độ', 'Nguy cơ cao', 'Cần theo dõi', 'Bình thường']}
              value={riskFilter}
              onChange={setRiskFilter}
              optionColors={{
                'Mọi mức độ': 'text-primary',
                'Nguy cơ cao': 'text-red-500 hover:bg-red-50',
                'Cần theo dõi': 'text-orange-500 hover:bg-orange-50',
                'Bình thường': 'text-green-500 hover:bg-green-50'
              }}
            />

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4 border border-slate-100">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-500 mb-1">Tổng bệnh nhân</p>
                <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight truncate">1,284</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4 border border-slate-100">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
                <span className="material-symbols-outlined">notification_important</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-500 mb-1">Cần can thiệp</p>
                <p className="text-3xl font-black text-red-500 mt-1 tracking-tight truncate">12</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 pb-32">
            <div className="">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Bệnh nhân</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Mã Bệnh nhân</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Tuổi</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Chỉ số</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Cập nhật</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide">Nguy cơ</th>
                    <th className="px-6 py-5 text-[14px] font-extrabold text-slate-400 tracking-wide text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: "Nguyễn Văn An", disease: "Tiểu đường Type 2", id: "BN-001", age: 54, glucose: "8.2", bp: "125/80", update: "10:30 Hôm nay", risk: "Nguy cơ cao", riskColor: "red" },
                    { name: "Lê Thị Bình", disease: "Tăng huyết áp", id: "BN-042", age: 62, glucose: "5.6", bp: "145/95", update: "08:15 Hôm nay", risk: "Cần theo dõi", riskColor: "orange" },
                    { name: "Trần Văn Cường", disease: "Tim mạch mãn tính", id: "BN-998", age: 45, glucose: "4.8", bp: "118/75", update: "17:40 Hôm qua", risk: "Bình thường", riskColor: "emerald" },
                    { name: "Phạm Thị Dung", disease: "Tiểu đường thai kỳ", id: "BN-115", age: 29, glucose: "7.1", bp: "110/70", update: "23/10", risk: "Cần theo dõi", riskColor: "orange" }
                  ].map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                          <div>
                            <p className="text-[16px] font-bold text-slate-900 group-hover:text-primary transition-colors tracking-tight">{p.name}</p>
                            <p className="text-[13px] text-slate-500 font-medium tracking-tight">{p.disease}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[15px] font-bold text-slate-600">{p.id}</td>
                      <td className="px-6 py-5 text-[15px] font-bold text-slate-600">{p.age}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[13px] font-bold rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">{p.glucose} <span className="text-[11px] font-medium text-slate-400">mmol/L</span></span>
                          <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[13px] font-bold rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">{p.bp} <span className="text-[11px] font-medium text-slate-400">mmHg</span></span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[14px] text-slate-500 font-medium">{p.update}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-1.5 text-[13px] font-bold rounded-full text-white shadow-sm whitespace-nowrap inline-flex ${
                            p.riskColor === 'red' ? 'bg-red-500 shadow-red-500/10' :
                            p.riskColor === 'orange' ? 'bg-amber-500 shadow-amber-500/10' :
                            'bg-emerald-500 shadow-emerald-500/10'
                          }`}
                        >
                          {p.risk}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right relative">
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
                                onClick={() => { setIsAdviceModalOpen(true); setActiveMenu(null); }}
                                className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">send</span>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Gửi lời khuyên</span>
                              </button>
                              <button
                                onClick={() => { setIsPrescriptionModalOpen(true); setActiveMenu(null); }}
                                className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">description</span>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Kê đơn thuốc</span>
                              </button>
                              <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                              <button
                                onClick={() => { setIsModalOpen(true); setActiveMenu(null); }}
                                className="w-full px-4 py-3 text-left hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors flex items-center gap-3 group">
                                <span className="material-symbols-outlined text-primary text-xl">event</span>
                                <span className="text-sm font-bold text-primary">Đặt lịch tái khám</span>
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Redesigned */}
            <div className="px-8 py-6 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <p className="text-[14px] font-medium text-slate-500">
                Hiển thị <span className="font-bold text-slate-900 dark:text-white">1</span> đến <span className="font-bold text-slate-900 dark:text-white">10</span> trong số <span className="font-bold text-slate-900 dark:text-white">128</span> bệnh nhân
              </p>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <button className="w-10 h-10 rounded-xl bg-primary text-slate-900 text-sm font-black shadow-lg shadow-primary/20">1</button>
                  <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold text-slate-500 transition-all">2</button>
                  <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold text-slate-500 transition-all">3</button>
                  <span className="text-slate-300 mx-1">...</span>
                  <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold text-slate-500 transition-all">13</button>
                </div>
                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals & Feedback */}
        <PrescriptionModal
          isOpen={isPrescriptionModalOpen}
          onClose={() => setIsPrescriptionModalOpen(false)}
          isAddingNewMedicine={isAddingNewMedicine}
          setIsAddingNewMedicine={setIsAddingNewMedicine}
          medications={medications}
          removeMedication={removeMedication}
          newMedForm={newMedForm}
          setNewMedForm={setNewMedForm}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          addMedicationToPrescription={addMedicationToPrescription}
          isSaving={isSaving}
          onSave={async () => {
            setIsSaving(true);
            await new Promise(r => setTimeout(r, 1000));
            setIsSaving(false);
            setIsPrescriptionModalOpen(false);
            setToast({ show: true, title: "Đã gửi đơn thuốc thành công!", type: "success" });
          }}
          patientName="Nguyễn Văn An"
        />

        <AdviceModal
          isOpen={isAdviceModalOpen}
          onClose={() => setIsAdviceModalOpen(false)}
          adviceCategory={adviceCategory}
          setAdviceCategory={setAdviceCategory}
          adviceContent={adviceContent}
          setAdviceContent={setAdviceContent}
          isSaving={isSaving}
          onSave={async () => {
            setIsSaving(true);
            await new Promise(r => setTimeout(r, 1000));
            setIsSaving(false);
            setIsAdviceModalOpen(false);
            setToast({ show: true, title: "Đã gửi lời khuyên thành công!", type: "success" });
          }}
          patientName="Nguyễn Văn An"
        />

        <RescheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isSaving={isSaving}
          onSave={async () => {
            setIsSaving(true);
            await new Promise(r => setTimeout(r, 1000));
            setIsSaving(false);
            setIsModalOpen(false);
            setToast({ show: true, title: "Đã đặt lịch tái khám thành công!", type: "success" });
          }}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
        />

        <PatientDetailModal 
          isOpen={isPatientDetailModalOpen}
          onClose={() => setIsPatientDetailModalOpen(false)}
          patient={selectedPatient}
        />

        <AddPatientModal
          isOpen={isAddPatientModalOpen}
          onClose={() => setIsAddPatientModalOpen(false)}
          isSaving={isSaving}
          onAdd={async (data) => {
            setIsSaving(true);
            console.log('Adding patient:', data);
            await new Promise(r => setTimeout(r, 1500));
            setIsSaving(false);
            setIsAddPatientModalOpen(false);
            setToast({ show: true, title: `Đã cấp tài khoản cho bệnh nhân ${data.fullName} thành công!`, type: "success" });
          }}
        />

        <Toast
          show={toast.show}
          title={toast.title}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </main>
    </div>
  );
}