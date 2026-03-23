import React from 'react';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  intakeType: string;
}

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAddingNewMedicine: boolean;
  setIsAddingNewMedicine: React.Dispatch<React.SetStateAction<boolean>>;
  medications: Medication[];
  removeMedication: (id: number) => void;
  newMedForm: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    intakeType: string;
  };
  setNewMedForm: React.Dispatch<React.SetStateAction<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    intakeType: string;
  }>>;
  formErrors: {
    name: boolean;
    dosage: boolean;
    frequency: boolean;
    duration: boolean;
    intakeType: boolean;
  };
  setFormErrors: React.Dispatch<React.SetStateAction<{
    name: boolean;
    dosage: boolean;
    frequency: boolean;
    duration: boolean;
    intakeType: boolean;
  }>>;
  addMedicationToPrescription: () => void;
  isSaving: boolean;
  onSave: () => Promise<void>;
  patientName: string;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  isAddingNewMedicine,
  setIsAddingNewMedicine,
  medications,
  removeMedication,
  newMedForm,
  setNewMedForm,
  formErrors,
  setFormErrors,
  addMedicationToPrescription,
  isSaving,
  onSave,
  patientName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={() => {
          onClose();
          setIsAddingNewMedicine(false);
        }}
      ></div>

      <div className={`relative flex flex-col lg:flex-row h-fit max-h-[92vh] md:max-h-[85vh] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isAddingNewMedicine ? 'max-w-7xl w-full' : 'max-w-4xl w-full'} mx-2 md:mx-4`}>
        {/* Left Panel: Original Prescription UI */}
        <div className={`bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl shadow-2xl flex flex-col flex-shrink-0 transition-all duration-700 overflow-hidden ${isAddingNewMedicine ? 'w-full lg:w-[65%]' : 'w-full'}`}>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary">description</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Kê đơn thuốc mới</h2>
            </div>
            {!isAddingNewMedicine && (
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="material-symbols-outlined font-bold">close</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left custom-scrollbar bg-white dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bệnh nhân</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none bg-none text-slate-900 dark:text-white font-medium">
                    <option>{patientName}</option>
                    <option>Trần Thị B</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chẩn đoán hiện tại</label>
                <input className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium" defaultValue="Viêm họng cấp / Theo dõi đái tháo đường" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-primary">pill</span>
                  Danh sách loại thuốc
                </h3>
                <button
                  onClick={() => setIsAddingNewMedicine(true)}
                  className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Thêm thuốc
                </button>
              </div>
              <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm bg-white dark:bg-slate-900/50">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                    <tr>
                      <th className="px-4 py-3">Tên thuốc & Hàm lượng</th>
                      <th className="px-4 py-3">Liều dùng</th>
                      <th className="px-4 py-3">Tần suất</th>
                      <th className="px-4 py-3">Thời gian</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {medications.length > 0 ? medications.map((med) => (
                      <tr key={med.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-4 py-4 text-left">
                          <div className="font-medium text-slate-900 dark:text-white">{med.name}</div>
                          <p className="text-xs text-slate-400">{med.intakeType}</p>
                        </td>
                        <td className="px-4 py-4 text-slate-900 dark:text-white">{med.dosage}</td>
                        <td className="px-4 py-4 text-slate-900 dark:text-white">{med.frequency}</td>
                        <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{med.duration}</td>
                        <td className="px-4 py-4 text-right">
                          <button onClick={() => removeMedication(med.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors active:scale-90">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                            <span className="material-symbols-outlined text-3xl opacity-30">pending_actions</span>
                            <p className="text-sm font-medium italic">Chưa có thuốc nào được thêm</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-3 text-left">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-sm">edit_note</span>
                  Ghi chú dược sĩ/bệnh nhân
                </label>
                <textarea rows={3} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-slate-900 dark:text-white text-sm" placeholder="Nhập hướng dẫn sử dụng thuốc chi tiết..." />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">event_repeat</span>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Hẹn tái khám</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Tự động nhắc lịch cho bệnh nhân</p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-primary text-primary focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide">Ngày tái khám dự kiến</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
                    <input type="date" defaultValue="2023-12-25" className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-end gap-3 z-10">
            <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Hủy</button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-8 py-2.5 rounded-lg font-bold bg-primary text-slate-900 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-wait"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">send</span>
                  Lưu &amp; Gửi
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel: Add Medicine */}
        {isAddingNewMedicine && (
          <div className="flex-1 mt-6 lg:mt-0 lg:ml-6 bg-white dark:bg-slate-900 rounded-md shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-10 md:slide-in-from-bottom-10 lg:slide-in-from-right-10 duration-700 relative w-full">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined">pill</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Thêm thuốc mới</h3>
                </div>
              </div>
              <button onClick={() => setIsAddingNewMedicine(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="material-symbols-outlined font-bold">close</span>
              </button>
            </div>

            <div className="p-8 space-y-6 flex-1 overflow-y-auto text-left custom-scrollbar bg-white dark:bg-slate-900">
              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên thuốc & Hàm lượng</label>
                <input type="text" placeholder="VD: Augmentin 1g" className={`w-full px-4 py-3 rounded-lg border ${formErrors.name ? 'border-red-500 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm`} value={newMedForm.name} onChange={(e) => { setNewMedForm({ ...newMedForm, name: e.target.value }); setFormErrors({ ...formErrors, name: false }); }} />
                {formErrors.name && <p className="text-[10px] text-red-500 font-bold tracking-wider pl-1">Vui lòng nhập tên thuốc</p>}
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hướng dẫn uống thuốc</label>
                <input type="text" placeholder="VD: Uống sau khi ăn sáng 30p" className={`w-full px-4 py-3 rounded-lg border ${formErrors.intakeType ? 'border-red-500 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm`} value={newMedForm.intakeType} onChange={(e) => { setNewMedForm({ ...newMedForm, intakeType: e.target.value }); setFormErrors({ ...formErrors, intakeType: false }); }} />
                {formErrors.intakeType && <p className="text-[10px] text-red-500 font-bold tracking-wider pl-1">Vui lòng nhập hướng dẫn</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Liều dùng</label>
                  <input type="text" placeholder="1 viên" className={`w-full px-4 py-3 rounded-lg border ${formErrors.dosage ? 'border-red-500 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm`} value={newMedForm.dosage} onChange={(e) => { setNewMedForm({ ...newMedForm, dosage: e.target.value }); setFormErrors({ ...formErrors, dosage: false }); }} />
                  {formErrors.dosage && <p className="text-[10px] text-red-500 font-bold tracking-wider pl-1">Trống</p>}
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Thời gian</label>
                  <input type="text" placeholder="7 ngày" className={`w-full px-4 py-3 rounded-lg border ${formErrors.duration ? 'border-red-500 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm`} value={newMedForm.duration} onChange={(e) => { setNewMedForm({ ...newMedForm, duration: e.target.value }); setFormErrors({ ...formErrors, duration: false }); }} />
                  {formErrors.duration && <p className="text-[10px] text-red-500 font-bold tracking-wider pl-1">Trống</p>}
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tần suất dùng</label>
                <input type="text" placeholder="VD: Sáng 1, Trưa 1, Tối 1" className={`w-full px-4 py-3 rounded-lg border ${formErrors.frequency ? 'border-red-500 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm`} value={newMedForm.frequency} onChange={(e) => { setNewMedForm({ ...newMedForm, frequency: e.target.value }); setFormErrors({ ...formErrors, frequency: false }); }} />
                {formErrors.frequency && <p className="text-[10px] text-red-500 font-bold tracking-wider pl-1">Vui lòng nhập tần suất</p>}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-end z-10">
              <button onClick={addMedicationToPrescription} className="w-full py-3.5 bg-primary text-slate-900 rounded-lg font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md">
                <span className="material-symbols-outlined text-lg">library_add</span>
                Lưu vào đơn thuốc
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionModal;
