import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setSearchQuery('');
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !doctorData) return null;

    // Fake Assigned Patients for demonstration
    const assignedPatients = [
        { id: 'BN-1029', name: 'Trần Văn Bảo', age: 65, condition: 'Tiểu đường Type 2', risk: 'Nguy cơ cao', riskColor: 'red', nextAppt: '2 ngày tới' },
        { id: 'BN-3921', name: 'Lê Thị Thu', age: 54, condition: 'Huyết áp cao', risk: 'Theo dõi', riskColor: 'amber', nextAppt: 'Ngày mai' },
        { id: 'BN-0482', name: 'Nguyễn Hải Tùng', age: 42, condition: 'Rối loạn nhịp tim', risk: 'Ổn định', riskColor: 'emerald', nextAppt: 'Tuần sau' },
        { id: 'BN-9321', name: 'Phạm Ngọc Trâm', age: 58, condition: 'Tiểu đường Type 1', risk: 'Theo dõi', riskColor: 'amber', nextAppt: 'Ngày mai' },
        { id: 'BN-1102', name: 'Hoàng Quốc Tuấn', age: 71, condition: 'Suy tim độ 2', risk: 'Nguy cơ cao', riskColor: 'red', nextAppt: 'Hôm nay' },
        { id: 'BN-8472', name: 'Đỗ Hà Anh', age: 39, condition: 'Rối loạn chuyển hóa', risk: 'Ổn định', riskColor: 'emerald', nextAppt: 'Tuần sau' },
    ];

    const filteredPatients = assignedPatients.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Mock calculations
    const MAX_PATIENTS = 150;
    const currentLoad = doctorData.load || 85;
    const loadPercentage = Math.round((currentLoad / MAX_PATIENTS) * 100);
    
    let loadColor = 'emerald';
    if (loadPercentage > 90) loadColor = 'red';
    else if (loadPercentage > 75) loadColor = 'amber';

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-display text-left">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
                onClick={onClose}
            ></div>

            <div className="relative bg-[#f8fafc] dark:bg-slate-950 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-800 transition-all max-h-[92vh]">
                {/* Header */}
                <div className="px-6 md:px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img alt={doctorData.name} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-tertiary/10" src={doctorData.img} />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-0.5">
                                <h2 className="text-[20px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">{doctorData.name}</h2>
                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-md">
                                    {doctorData.specialty}
                                </span>
                            </div>
                            <p className="text-[13px] font-medium text-slate-500 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">mail</span> {doctorData.email}
                                <span className="mx-1 text-slate-300">•</span>
                                <span className="material-symbols-outlined text-[16px]">call</span> {doctorData.phone}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 dark:bg-slate-900/50 text-left relative">
                    {/* Top Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        {/* Workload Card */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <h4 className="text-[13px] font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">speed</span>
                                Mức tải công việc
                            </h4>
                            <div className="flex items-end justify-between mb-3">
                                <div className="text-3xl font-black text-slate-900 dark:text-white">
                                    {currentLoad} <span className="text-[14px] font-medium text-slate-400">/ {MAX_PATIENTS}</span>
                                </div>
                                <div className={`text-[13px] font-bold text-${loadColor}-500 bg-${loadColor}-50 dark:bg-${loadColor}-500/10 px-2 py-1 rounded-lg`}>
                                    {loadPercentage}%
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className={`bg-${loadColor}-500 h-full rounded-full transition-all duration-1000`} style={{ width: `${loadPercentage}%` }}></div>
                            </div>
                        </div>

                        {/* High Risk Patients Card */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h4 className="text-[13px] font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px] text-red-400">warning</span>
                                Bệnh nhân rủi ro cao
                            </h4>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-black text-slate-900 dark:text-white">
                                    {assignedPatients.filter(p => p.riskColor === 'red').length}
                                </div>
                                <p className="text-[12px] font-medium text-slate-500 leading-tight">
                                    Cần theo dõi sát sao <br/>trong tuần này
                                </p>
                            </div>
                        </div>

                        {/* Add/Transfer Action Card */}
                        <div className="bg-gradient-to-br from-tertiary/10 to-primary/5 dark:from-tertiary/20 dark:to-primary/10 p-5 rounded-2xl border border-tertiary/20 shadow-sm flex flex-col justify-center items-center text-center">
                            <button className="bg-white dark:bg-slate-800 text-tertiary dark:text-tertiary w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center mb-3 hover:scale-110 transition-transform hover:shadow-md">
                                <span className="material-symbols-outlined">person_add</span>
                            </button>
                            <h4 className="text-[14px] font-bold text-slate-900 dark:text-white">Chỉ định thêm bệnh nhân</h4>
                        </div>
                    </div>

                    {/* Patient List */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mt-6">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-[16px] flex items-center gap-2">
                                Danh sách bệnh nhân phụ trách
                                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] px-2 py-0.5 rounded-full">{assignedPatients.length}</span>
                            </h3>
                            <div className="relative w-full md:w-64">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
                                <input 
                                    type="text" 
                                    placeholder="Tìm tên hoặc mã BN..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 transition-all font-medium text-slate-700 dark:text-slate-200"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/50 font-display">
                                        <th className="px-6 py-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Bệnh nhân</th>
                                        <th className="px-6 py-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Chẩn đoán</th>
                                        <th className="px-6 py-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Mức độ</th>
                                        <th className="px-6 py-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider">Lịch hẹn tiếp</th>
                                        <th className="px-6 py-4 text-[13px] font-bold text-slate-500 text-right uppercase tracking-wider">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredPatients.length > 0 ? filteredPatients.map((patient, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <p className="text-[14px] font-bold text-slate-900 dark:text-white group-hover:text-tertiary transition-colors">{patient.name}</p>
                                                <p className="text-[12px] font-medium text-slate-400 mt-0.5">{patient.id} • {patient.age} tuổi</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{patient.condition}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold bg-${patient.riskColor}-50 text-${patient.riskColor}-700 dark:bg-${patient.riskColor}-500/10 dark:text-${patient.riskColor}-400`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-${patient.riskColor}-500`}></div>
                                                    {patient.risk}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                                                    <span className="material-symbols-outlined text-[16px] text-slate-400">event</span>
                                                    {patient.nextAppt}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button title="Xem hồ sơ" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-tertiary hover:bg-tertiary/10 flex items-center justify-center transition-all">
                                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                    </button>
                                                    <button title="Chuyển bác sĩ" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 flex items-center justify-center transition-all">
                                                        <span className="material-symbols-outlined text-[18px]">move_up</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-[14px] font-medium">
                                                Không tìm thấy bệnh nhân nào khớp với tìm kiếm.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
