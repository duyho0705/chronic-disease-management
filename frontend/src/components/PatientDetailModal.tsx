import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export default function PatientDetailModal({ isOpen, onClose, patient }: PatientDetailModalProps) {
  const reportRef = useRef<HTMLDivElement>(null);

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

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 1,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const mainModal = clonedDoc.querySelector('.modal-main-container');
          const scrollContent = clonedDoc.querySelector('.modal-scroll-area');
          if (mainModal && scrollContent) {
            // Remove constraints to capture full height
            (mainModal as HTMLElement).style.maxHeight = 'none';
            (mainModal as HTMLElement).style.height = 'auto';
            (scrollContent as HTMLElement).style.maxHeight = 'none';
            (scrollContent as HTMLElement).style.overflow = 'visible';
            (scrollContent as HTMLElement).style.height = 'auto';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      const fileName = `Bao_cao_${patient?.name || 'benh_nhan'}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/\s+/g, '_');
        
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div ref={reportRef} className="relative w-full max-w-6xl max-h-[90vh] bg-background-light dark:bg-background-dark rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 modal-main-container">

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar modal-scroll-area">
          <div className="space-y-8">
          {/* Breadcrumb & Actions (Simplified for Modal) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Chi tiết hồ sơ bệnh án</h2>
            </div>
            <div className="flex flex-wrap gap-2" data-html2canvas-ignore="true">
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 text-sm font-semibold transition-all"
              >
                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                Xuất báo cáo PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 text-sm font-semibold shadow-lg shadow-primary/20 transition-all">
                <span className="material-symbols-outlined text-lg">medical_services</span>
                Kê đơn thuốc
              </button>
            </div>
          </div>

          {/* Patient Summary Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6">
              <div className="relative shrink-0">
                <img 
                  className="size-32 rounded-2xl object-cover"
                  src={patient?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBQIVC5UVVnYFrHotJWRdOzSC_E3FBCQEoE184wQ53tVIU99mCmsnvpRBP8AxOgPqY4ybn9yh-ls0TdYzrW84tXyVp1chICLHuqh24SPAwmF-JJMZOAY5b6sWBcWHx0HE2pfkknQ3kbNOCOHncZou8wv9681_qfeqqF6ei7-c2tYKJiOih9gpWegaVqMzBBcsL__BBf1ERBs4ya9r4R9MusSrAo8G1F6a0xU-jwmEaQav_vPqmUpMzOJYXGCugRCcfNmQ_TNYls7KQ"} 
                  alt={patient?.name}
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{patient?.name || 'Nguyễn Văn A'}</h2>
                    <span 
                      style={patient?.risk === 'Nguy cơ cao' ? { backgroundColor: 'rgb(255, 197, 197)', borderColor: 'rgb(237, 152, 152)' } : {}}
                      className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border ${
                      patient?.risk === 'Nguy cơ cao' ? 'text-red-500' : 
                      patient?.risk === 'Cần theo dõi' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                      'bg-green-50 text-green-500 border-green-100'
                    }`}>
                      {patient?.risk || 'Nguy cơ cao'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">{patient?.gender || 'Nam'}, {patient?.age || '65'} tuổi • ID: {patient?.id || 'BN0892'} • Đã tham gia 2 năm</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 uppercase font-bold">Bệnh lý nền</p>
                    <p className="text-sm font-semibold">{patient?.disease || 'Cao huyết áp'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 uppercase font-bold">Dị ứng</p>
                    <p className="text-sm font-semibold text-red-500">Penicillin</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 uppercase font-bold">Nhóm máu</p>
                    <p className="text-sm font-semibold">O+</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/20 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">Thao tác nhanh</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">Kết nối trực tiếp với bệnh nhân</p>
                </div>
                <div className="size-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:shadow-md transition-all group">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">event_available</span>
                    Đặt lịch khám mới
                  </span>
                  <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:shadow-md transition-all group">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">forum</span>
                    Gửi tin nhắn tư vấn
                  </span>
                  <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Vitals Dashboard */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined text-red-500">blood_pressure</span>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">NGUY HIỂM</span>
              </div>
              <p className="text-slate-400 text-[13px] font-medium">Huyết áp</p>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="text-[22px] font-bold text-slate-900 dark:text-white">{patient?.bp || '165/105'}</h4>
                <span className="text-[12px] text-slate-400 font-medium ml-1">mmHg</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined text-amber-500">bloodtype</span>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">CẢNH BÁO</span>
              </div>
              <p className="text-slate-400 text-[13px] font-medium">Đường huyết</p>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="text-[22px] font-bold text-slate-900 dark:text-white">{patient?.glucose || '5.8'}</h4>
                <span className="text-[12px] text-slate-400 font-medium ml-1">mmol/L</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined text-primary">favorite</span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">BÌNH THƯỜNG</span>
              </div>
              <p className="text-slate-400 text-[13px] font-medium">Nhịp tim</p>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="text-[22px] font-bold text-slate-900 dark:text-white">82</h4>
                <span className="text-[12px] text-slate-400 font-medium ml-1">bpm</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined text-blue-500">air</span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">BÌNH THƯỜNG</span>
              </div>
              <p className="text-slate-400 text-[13px] font-medium">SpO2</p>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="text-[22px] font-bold text-slate-900 dark:text-white">98</h4>
                <span className="text-[12px] text-slate-400 font-medium ml-1">%</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined text-purple-500">body_fat</span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">BÌNH THƯỜNG</span>
              </div>
              <p className="text-slate-400 text-[13px] font-medium">Chỉ số BMI</p>
              <div className="flex items-baseline gap-1 mt-1">
                <h4 className="text-[22px] font-bold text-slate-900 dark:text-white">24.5</h4>
                <span className="text-[12px] text-slate-400 font-medium ml-1">kg/m²</span>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
            {/* Left: Charts & History */}
            <div className="xl:col-span-2 space-y-8">
              {/* Chart Section */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Xu hướng chỉ số (30 ngày)</h3>
                    <p className="text-sm text-slate-500">Biểu đồ so sánh Huyết áp & Đường huyết</p>
                  </div>
                  <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-semibold focus:ring-primary/50">
                    <option>30 ngày qua</option>
                    <option>90 ngày qua</option>
                  </select>
                </div>
                <div className="h-64 relative w-full overflow-hidden">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                    <path d="M0,150 Q50,140 100,160 T200,130 T300,140 T400,110 T500,120 T600,80 T700,90 T800,60" fill="none" stroke="#4ade80" strokeWidth="3" />
                    <path className="fill-primary/5" d="M0,150 Q50,140 100,160 T200,130 T300,140 T400,110 T500,120 T600,80 T700,90 T800,60 V200 H0 Z" />
                    <path d="M0,100 Q50,90 100,110 T200,80 T300,90 T400,60 T500,70 T600,30 T700,40 T800,10" fill="none" stroke="#ef4444" strokeDasharray="5,5" strokeWidth="2" />
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-400 font-bold uppercase pt-4">
                    <span>01/10</span><span>07/10</span><span>14/10</span><span>21/10</span><span>28/10</span>
                  </div>
                </div>
                <div className="flex gap-6 mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-red-500"></span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Huyết áp tâm thu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-primary"></span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Đường huyết</span>
                  </div>
                </div>
              </div>

              {/* Medical History Timeline */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Lịch sử khám bệnh</h3>
                <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 size-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="size-2.5 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-400 uppercase">20 Tháng 10, 2023</p>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] rounded uppercase font-bold">Khám định kỳ</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mt-1">Kiểm tra huyết áp & Tư vấn dinh dưỡng</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">Bệnh nhân có dấu hiệu mệt mỏi, huyết áp tăng nhẹ. Khuyến nghị giảm muối trong khẩu phần ăn và tập thể dục nhẹ 15 phút mỗi ngày.</p>
                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs italic text-slate-500">Chẩn đoán: Tăng huyết áp độ 2</p>
                    </div>
                  </div>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 size-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <div className="size-2.5 bg-slate-400 rounded-full"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-400 uppercase">05 Tháng 09, 2023</p>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] rounded uppercase font-bold">Xét nghiệm</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mt-1">Xét nghiệm máu tổng quát</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">Chỉ số mỡ máu hơi cao (Cholesterol: 6.2 mmol/L). Các chỉ số khác trong ngưỡng bình thường.</p>
                  </div>
                </div>
                <button className="w-full mt-8 py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors border border-dashed border-primary/30">Xem tất cả lịch sử</button>
              </div>
            </div>

            {/* Right: Medications & Notes */}
            <div className="space-y-8">
              {/* Current Medications */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Đơn thuốc hiện tại</h3>
                  <span className="size-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-xl">pill</span>
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-[17px] text-slate-900 dark:text-white leading-tight">Amlodipine 5mg</h4>
                      <span className="text-[11px] font-bold text-sky-500 uppercase">ĐANG DÙNG</span>
                    </div>
                    <p className="text-[14px] text-slate-500 mt-2 font-medium">Uống 1 viên vào buổi sáng sau ăn</p>
                    <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      CÒN 12 NGÀY THUỐC
                    </div>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-[17px] text-slate-900 dark:text-white leading-tight">Metformin 500mg</h4>
                      <span className="text-[11px] font-bold text-sky-500 uppercase">ĐANG DÙNG</span>
                    </div>
                    <p className="text-[14px] text-slate-500 mt-2 font-medium">Uống 2 viên chia 2 lần (Sáng/Chiều)</p>
                    <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      CÒN 5 NGÀY THUỐC
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes/Alerts Section */}
              <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/30">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-red-500">warning</span>
                  <h3 className="font-bold text-red-900 dark:text-red-400">Ghi chú quan trọng</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-red-700 dark:text-red-300">
                    <span className="material-symbols-outlined text-sm mt-1">circle</span>
                    Bệnh nhân có tiền sử sốc phản vệ với kháng sinh nhóm Penicillin.
                  </li>
                  <li className="flex gap-3 text-sm text-red-700 dark:text-red-300">
                    <span className="material-symbols-outlined text-sm mt-1">circle</span>
                    Cần theo dõi sát chỉ số huyết áp tại nhà vào buổi sáng.
                  </li>
                </ul>
              </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
