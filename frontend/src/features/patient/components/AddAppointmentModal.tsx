import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Dropdown from '../../../components/ui/Dropdown';

interface AddAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
    isSaving?: boolean;
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ isOpen, onClose, onSave, isSaving }) => {
    const [appointmentType, setAppointmentType] = useState('direct');
    const [selectedDate, setSelectedDate] = useState(25);
    const [selectedTime, setSelectedTime] = useState('08:30');
    const [specialty, setSpecialty] = useState('');

    const specialtyOptions = [
        { label: 'Chọn bác sĩ (Nội tiết, Tim mạch...)', value: '' },
        { label: 'BS. Nguyễn Văn Hùng - Tim mạch', value: 'dr-hung' },
        { label: 'BS. Trần Thị Lan - Nội tiết', value: 'dr-lan' },
        { label: 'BS. Lê Quang Minh - Thần kinh', value: 'dr-minh' },
    ];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-display">
            {/* Background Overlay (Skeleton/Simulated Background) */}
            <div className="fixed inset-0 z-0 overflow-hidden blur-sm opacity-40 pointer-events-none">
                <div className="p-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    </div>
                </div>
            </div>

            {/* Modal Backdrop (Matched with Health Metric Backdrop) */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 border border-primary/10 font-display">

                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 text-left bg-primary/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Đặt lịch khám mới</h2>
                            <p className="text-slate-500 text-sm mt-1 font-medium">Hoàn thành các bước dưới đây để đặt lịch hẹn</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                        >
                            <span className="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                </div>

                {/* Modal Content (Scrollable) */}
                <div className="p-8 overflow-y-auto custom-scrollbar text-left flex-1 space-y-8">
                    {/* Section: Form Progress (Visual Guide) */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <span className="size-6 rounded-full bg-primary text-slate-900 flex items-center justify-center text-xs font-bold">1</span>
                            <span className="text-sm font-bold text-primary">Thông tin khám</span>
                        </div>
                        <div className="h-px w-8 bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex items-center gap-2 opacity-50">
                            <span className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold font-display">2</span>
                            <span className="text-sm font-bold text-slate-400">Xác nhận</span>
                        </div>
                    </div>

                    {/* Section: Appointment Type */}
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Hình thức khám</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="relative cursor-pointer group">
                                <input 
                                    checked={appointmentType === 'direct'} 
                                    onChange={() => setAppointmentType('direct')}
                                    className="peer sr-only" name="appt_type" type="radio"
                                />
                                <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 transition-all group-hover:border-primary/30">
                                    <span className="material-symbols-outlined text-slate-400 peer-checked:text-primary">person_pin_circle</span>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">Khám trực tiếp</p>
                                        <p className="text-xs text-slate-500">Tại cơ sở y tế</p>
                                    </div>
                                </div>
                            </label>
                            <label className="relative cursor-pointer group">
                                <input 
                                    checked={appointmentType === 'online'} 
                                    onChange={() => setAppointmentType('online')}
                                    className="peer sr-only" name="appt_type" type="radio"
                                />
                                <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 transition-all group-hover:border-primary/30">
                                    <span className="material-symbols-outlined text-slate-400 peer-checked:text-primary">videocam</span>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">Tư vấn trực tuyến</p>
                                        <p className="text-xs text-slate-500">Qua Video Call</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Section: Doctor Selection */}
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Chọn bác sĩ chuyên khoa</h3>
                        <div className="mb-6">
                            <Dropdown 
                                options={specialtyOptions}
                                value={specialty}
                                onChange={setSpecialty}
                            />
                        </div>

                        {/* Doctor Avatars List (Quick Select) */}
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {[
                                { id: 'hung', name: 'BS. Hùng', dept: 'Tim mạch', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfKGVEdQrCnHzHpJyy5Pac3MHtFaiYEJY_cZRQdbwPHIYa7hFOTM28rBJwufdQmhcEnkExOaN0RcHNyG5WMl3nhhWo4gGNAHcRa9co6Yh2paj47PSRvIIcL8gHRyJJ_eCLFpdNKPeUs4_NTwzItZzNNVy0r6nDQGH7GFN3SWxbnFNffJBmZwgw9dTh_HPibRsKTggrtyCnO053FAJSY0dtWn1enBQm8rywNsxmCuMDMRrbVNB9AWKLjacWE7X9KD9DF5ZW-zbpcAA' },
                                { id: 'lan', name: 'BS. Lan', dept: 'Nội tiết', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaxhjz2ejCb2GLUrNwxvCoODCdj5Vc9QbnjAhJl3QuNCGqQbH7BKIu2Vm8mgN9VCrRoiBa8aSt6-n-4OpSZRwoEhCu3buzKqZ29hR4XY1i5jJvQfc9xRenRFMIeNZmMOnBslymoycT0H5CJRElTBA5jv2iC74DoNLEGSTNsecYbTBpziAi6qv9sZ_BrGmUy8-0C4KkdU48CiuqZ_VWmkmnYDWWK1Dwnw7LPZBjl1TSmxJiJ6sWf-ffxRtWmonpAs09L20q1XosSdw' },
                                { id: 'minh', name: 'BS. Minh', dept: 'Thần kinh', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdui4A5sTCx4SnKXhnBX8Qc6TUQM8HMh15S_pBVg5OaRGnkDryc6h08tJ50sju5wF9rjiprThsFiQByZ9EU7KT1QNlpFw6h7KZo-hVrqtWXIHBL_y0bynDaskeUaITGxsV3DzrCrtOqUj_qJt2cFsk7D6Do1yzpI_WM3ZdjeK2PnHOLIUdJ_livIH1XABN4krIewL_46m5y9D-ndusceY2yZCsTp4xUSMB_IH63ZEjkdJJ_rIHyzBGWFzWosrQT1QpO0Igs1zmhcs' }
                            ].map(dr => (
                                <div key={dr.id} className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className={`size-14 rounded-full border-2 ${dr.id === 'hung' ? 'border-primary' : 'border-transparent group-hover:border-slate-200'} p-0.5 transition-all`}>
                                        <img alt={dr.name} className="rounded-full bg-slate-100 size-full object-cover" src={dr.img} />
                                    </div>
                                    <span className="text-[10px] font-bold text-center leading-tight dark:text-slate-300">
                                        {dr.name}<br /><span className="text-slate-400 font-normal">{dr.dept}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section: Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Mini Calendar Placeholder */}
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Ngày khám</h3>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-bold text-sm dark:text-white">Tháng 10, 2023</span>
                                    <div className="flex gap-2">
                                        <button className="size-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button className="size-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                                    <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {[23, 24, 25, 26, 27, 28, 29].map(day => (
                                        <button 
                                            key={day}
                                            onClick={() => setSelectedDate(day)}
                                            className={`h-8 rounded-lg text-xs transition-all font-bold ${
                                                selectedDate === day 
                                                ? 'bg-primary text-slate-900' 
                                                : day > 27 ? 'text-slate-300 pointer-events-none' : 'hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Khung giờ</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['08:00', '08:30', '09:00', '09:30', '10:00', '14:00', '14:30', '15:00', '15:30'].map(slot => (
                                    <button 
                                        key={slot}
                                        onClick={() => setSelectedTime(slot)}
                                        className={`py-2.5 rounded-lg border-2 text-xs font-bold transition-all ${
                                            selectedTime === slot 
                                            ? 'border-primary bg-primary/5 text-primary' 
                                            : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-primary/30 dark:text-slate-400 hover:text-primary'
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section: Reason for visit */}
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Lý do khám / Triệu chứng</h3>
                        <textarea 
                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-bold text-sm min-h-[120px] resize-none outline-none shadow-sm transition-all" 
                            placeholder="Mô tả tình trạng sức khỏe của bạn hoặc các triệu chứng đang gặp phải..."
                        ></textarea>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-4 items-center justify-end z-10">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-10 py-3 rounded-full text-[16px] font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className={`w-full sm:w-auto px-10 py-3 rounded-full text-[16px] font-bold bg-primary text-slate-900 shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? (
                             <div className="flex items-center gap-2">
                                 <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 <span>Đang xử lý...</span>
                             </div>
                        ) : (
                            'Xác nhận đặt lịch'
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default AddAppointmentModal;
