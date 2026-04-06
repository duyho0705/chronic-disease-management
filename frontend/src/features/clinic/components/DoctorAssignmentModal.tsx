import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { clinicApi } from '../../../api/clinic';
import Toast from '../../../components/ui/Toast';

interface DoctorAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorData: any;
}

export default function DoctorAssignmentModal({
    isOpen,
    onClose,
    doctorData
}: DoctorAssignmentModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [assignedPatients, setAssignedPatients] = useState<any[]>([]);
    const [unassignedPatients, setUnassignedPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAssigning, setIsAssigning] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [activeTab, setActiveTab] = useState<'assigned' | 'new'>('assigned');

    const currentClinicId = localStorage.getItem('clinicId') || '1';
    const doctorId = doctorData?.dbId || doctorData?.id;

    useEffect(() => {
        if (isOpen && doctorId) {
            document.body.style.overflow = 'hidden';
            fetchData();
        } else {
            document.body.style.overflow = 'unset';
            setAssignedPatients([]);
            setUnassignedPatients([]);
            setActiveTab('assigned');
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, doctorId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch all patients for this clinic
            const res = await clinicApi.getPatients(currentClinicId, { size: 100 });
            if (res.success) {
                const allPatients = res.data.content || [];
                // Filter patients assigned to this doctor
                // In real app, we might have a specific endpoint, but here we can filter by doctorId in the patient object
                setAssignedPatients(allPatients.filter((p: any) => p.assignedDoctorId === doctorId || p.doctorId === doctorId));
                // Filter patients who don't have a doctor yet
                setUnassignedPatients(allPatients.filter((p: any) => !p.assignedDoctorId && !p.doctorId));
            }
        } catch (error) {
            console.error('Failed to fetch patients for assignment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssign = async (patient: any) => {
        setIsAssigning(true);
        try {
            // Update patient to set the doctorId
            const updateRes = await clinicApi.updatePatient(currentClinicId, patient.dbId || patient.id, {
                ...patient,
                doctorId: doctorId
            });

            if (updateRes.success) {
                setToastMsg(`Đã gán bệnh nhân ${patient.name} cho bác sĩ ${doctorData.name}`);
                setShowToast(true);
                fetchData(); // Refresh lists
            }
        } catch (error) {
            console.error('Failed to assign patient:', error);
            setToastMsg('Lỗi khi gán bệnh nhân');
            setShowToast(true);
        } finally {
            setIsAssigning(false);
        }
    };

    if (!isOpen || !doctorData) return null;

    const filteredPatients = (activeTab === 'assigned' ? assignedPatients : unassignedPatients).filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.id)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.primaryCondition || '')?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Mock calculations based on real lists
    const MAX_PATIENTS = doctorData.maxPatients || 150;
    const currentLoad = assignedPatients.length;
    const loadPercentage = Math.round((currentLoad / MAX_PATIENTS) * 100);

    let loadColor = 'emerald';
    if (loadPercentage > 90) loadColor = 'red';
    else if (loadPercentage > 75) loadColor = 'amber';

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-display text-left">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300" onClick={onClose}></div>

            <div className="relative bg-[#f8fafc] dark:bg-slate-950 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-800 transition-all max-h-[92vh]">
                <div className="px-6 md:px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <img alt={doctorData.name} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-primary/10" src={doctorData.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorData.name)}&background=random`} />
                        <div>
                            <h2 className="text-[20px] font-black text-slate-900 dark:text-white tracking-tight">{doctorData.name}</h2>
                            <p className="text-[13px] font-medium text-slate-500">{doctorData.specialty} • {doctorData.email}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 dark:bg-slate-900/50 text-left relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <h4 className="text-[13px] font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">speed</span> Tải trọng bác sĩ
                            </h4>
                            <div className="flex items-end justify-between mb-3">
                                <div className="text-3xl font-black text-slate-900 dark:text-white">
                                    {currentLoad} <span className="text-[14px] font-medium text-slate-400">/ {MAX_PATIENTS} ca</span>
                                </div>
                                <div className={`text-[13px] font-bold text-${loadColor}-500 bg-${loadColor}-50 dark:bg-${loadColor}-500/10 px-2 py-1 rounded-lg`}>
                                    {loadPercentage}%
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className={`bg-${loadColor}-500 h-full rounded-full transition-all duration-1000`} style={{ width: `${Math.min(loadPercentage, 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                            <div>
                                <h4 className="text-[13px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">group</span> Đang quản lý
                                </h4>
                                <div className="text-3xl font-black text-slate-900 dark:text-white">{assignedPatients.length} BN</div>
                            </div>
                            <button
                                onClick={() => setActiveTab('new')}
                                className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined">person_add</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mt-6">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                            <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('assigned')}
                                    className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === 'assigned' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Bệnh nhân đang trực
                                </button>
                                <button
                                    onClick={() => setActiveTab('new')}
                                    className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === 'new' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Chỉ định Bệnh Nhân mới
                                </button>
                            </div>
                            <div className="relative w-full md:w-64">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
                                <input
                                    type="text" placeholder="Tìm tên, mã BN..." value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto min-h-[300px]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                    <p className="text-sm font-bold text-slate-400">Đang tải danh sách...</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/80 dark:bg-slate-800/50">
                                            <th className="px-6 py-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Họ tên & Thông tin Bệnh Nhân</th>
                                            <th className="px-6 py-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Chẩn đoán Chính</th>
                                            <th className="px-6 py-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Bảo hiểm</th>
                                            <th className="px-6 py-4 text-[13px] font-bold text-slate-500 text-right uppercase tracking-wider">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredPatients.length > 0 ? filteredPatients.map((patient, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <p className="text-[14px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{patient.name}</p>
                                                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">{patient.id} • {patient.gender === 'MALE' ? 'Nam' : 'Nữ'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{patient.primaryCondition || 'Chưa cập nhật'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[12px] font-bold ${patient.insuranceNumber ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {patient.insuranceNumber ? 'Có bảo hiểm' : 'Không có bảo hiểm'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {activeTab === 'assigned' ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button title="Xem chi tiết" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                            </button>
                                                            <button title="Gỡ gán" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-[18px]">person_remove</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAssign(patient)}
                                                            disabled={isAssigning}
                                                            className="px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-[12px] font-bold transition-all disabled:opacity-50"
                                                        >
                                                            {isAssigning ? 'Đang gán...' : 'Gán bệnh nhân'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-20 text-center text-slate-400 text-[14px] font-medium italic">
                                                    Không có bệnh nhân nào phù hợp.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
                <Toast show={showToast} title={toastMsg} onClose={() => setShowToast(false)} />
            </div>
        </div>,
        document.body
    );
}
