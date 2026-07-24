import { useState, useEffect, useCallback } from 'react';
import * as ExcelJS from 'exceljs';
import { AnimatePresence } from 'framer-motion';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';
import { auditApi } from '../api/audit';
import { useToast } from '../components/ui/ToastContext';

export default function AdminAuditLogs() {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedModule, setSelectedModule] = useState('Tất cả mô-đun');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [isIpModalOpen, setIsIpModalOpen] = useState(false);
  const [logList, setLogList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });
  const totalPages = Math.ceil(pagination.total / pagination.size) || 1;

  const [selectedLogIds, setSelectedLogIds] = useState<number[]>([]);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);
  const [isSingleDeleteModalOpen, setIsSingleDeleteModalOpen] = useState(false);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [deletingLogId, setDeletingLogId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast: showNotification } = useToast();

  const handleSelectAllLogs = (checked: boolean) => {
    if (checked) {
      setSelectedLogIds(logList.map((log: any) => log.id));
    } else {
      setSelectedLogIds([]);
    }
  };

  const handleToggleSelectLog = (id: number) => {
    setSelectedLogIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSingleDelete = async () => {
    if (!deletingLogId) return;
    setIsDeleting(true);
    try {
      await auditApi.deleteAuditLog(deletingLogId);
      showNotification('Đã xóa bản ghi nhật ký thành công!', 'success');
      setDeletingLogId(null);
      setIsSingleDeleteModalOpen(false);
      fetchLogs();
    } catch (error) {
      console.error('Failed to delete audit log:', error);
      showNotification('Không thể xóa nhật ký hệ thống', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedLogIds.length === 0) return;
    setIsDeleting(true);
    try {
      await auditApi.batchDeleteAuditLogs(selectedLogIds);
      showNotification(`Đã xóa thành công ${selectedLogIds.length} bản ghi nhật ký!`, 'success');
      setSelectedLogIds([]);
      setIsBatchDeleteModalOpen(false);
      fetchLogs();
    } catch (error) {
      console.error('Failed to batch delete audit logs:', error);
      showNotification('Lỗi khi xóa hàng loạt nhật ký', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAll = async () => {
    setIsDeleting(true);
    try {
      await auditApi.clearAllAuditLogs();
      showNotification('Đã xóa toàn bộ nhật ký hệ thống thành công!', 'success');
      setSelectedLogIds([]);
      setIsClearAllModalOpen(false);
      fetchLogs();
    } catch (error) {
      console.error('Failed to clear all audit logs:', error);
      showNotification('Lỗi khi dọn dẹp nhật ký hệ thống', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const moduleMap: Record<string, string> = {
        'Trung tâm hỗ trợ': 'SUPPORT',
      };
      const queryModule = selectedModule !== 'Tất cả mô-đun' ? (moduleMap[selectedModule] || selectedModule) : null;

      const params = {
        userName: selectedUser || null,
        module: queryModule,
        keyword: searchTerm || null,
        page: pagination.page,
        size: pagination.size
      };
      const res = await auditApi.getAuditLogs(params);
      if (res && res.data) {
        const processedList = (res.data.content || []).map((log: any) => ({
          ...log,
          ip: log.ip || '127.0.0.1'
        }));
        setLogList(processedList);
        setPagination(prev => ({ ...prev, total: res.data.totalElements || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser, selectedModule, searchTerm, pagination.page, pagination.size]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 0 }));
  }, [selectedUser, selectedModule, searchTerm]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const ipInfo: any = {
    '127.0.0.1': { location: 'Localhost Server', isp: 'Mạng nội bộ hệ thống', type: 'Máy chủ riêng (Private)', country: 'Việt Nam', flag: '💻', lat: '21.0285', lng: '105.8542', timezone: 'Asia/Ho_Chi_Minh (UTC+7)', zip: '10000', security: 'An toàn tuyệt đối (Safe)' },
    '192.168.1.45': { location: 'TP. Hồ Chí Minh', isp: 'Viettel Network', type: 'Cá nhân (Dynamic)', country: 'Việt Nam', flag: '🇻🇳', lat: '10.8231', lng: '106.6297', timezone: 'Asia/Ho_Chi_Minh (UTC+7)', zip: '70000', security: 'Sạch (Clean)' },
    '113.161.45.22': { location: 'Đà Nẵng', isp: 'FPT Telecom', type: 'Doanh nghiệp (Static)', country: 'Việt Nam', flag: '🇻🇳', lat: '16.0471', lng: '108.2062', timezone: 'Asia/Ho_Chi_Minh (UTC+7)', zip: '55000', security: 'Sạch (Clean)' },
    '27.72.105.88': { location: 'Hà Nội', isp: 'VNPT Corporation', type: 'Cá nhân (Dynamic)', country: 'Việt Nam', flag: '🇻🇳', lat: '21.0285', lng: '105.8542', timezone: 'Asia/Ho_Chi_Minh (UTC+7)', zip: '10000', security: 'Nghi vấn Proxy' },
    '14.161.22.99': { location: 'Hải Phòng', isp: 'CMC Telecom', type: 'Dự phòng', country: 'Việt Nam', flag: '🇻🇳', lat: '20.8449', lng: '106.6881', timezone: 'Asia/Ho_Chi_Min_h (UTC+7)', zip: '18000', security: 'Sạch (Clean)' },
  };

  const currentInfo = selectedIp ? (ipInfo[selectedIp] || { location: 'Không xác định', isp: 'Ẩn danh/VPN', type: 'N/A', country: 'Ẩn danh', flag: '🌐', lat: '0', lng: '0', timezone: 'N/A', zip: 'N/A', security: 'N/A' }) : null;

  const handleIpClick = (ip: string) => {
    setSelectedIp(ip);
    setIsIpModalOpen(true);
  };

  const translateAuditLog = (text: string, type: 'action' | 'module' | 'details' = 'details'): string => {
    if (!text) return '--';
    
    const mapping: Record<string, string> = {
      // Actions
      'UPDATE_PATIENT': 'Cập nhật Bệnh nhân',
      'CREATE_PATIENT': 'Đăng ký Bệnh nhân mới',
      'DELETE_PATIENT': 'Xóa hồ sơ Bệnh nhân',
      'UPDATE_DOCTOR': 'Cập nhật Bác sĩ',
      'CREATE_DOCTOR': 'Thêm Bác sĩ mới',
      'DELETE_DOCTOR': 'Xóa tài khoản Bác sĩ',
      'CREATE_CLINIC': 'Khởi tạo Phòng khám mới',
      'UPDATE_CLINIC': 'Cập nhật Phòng khám',
      'UPDATE_CLINIC_PROFILE': 'Cập nhật hồ sơ Phòng khám',
      'DELETE_CLINIC': 'Gỡ bỏ Phòng khám',
      'CREATE_APPOINTMENT': 'Đăng ký Lịch hẹn mới',
      'UPDATE_APPOINTMENT': 'Thay đổi trạng thái Lịch',
      'UPDATE_APPOINTMENT_STATUS': 'Cập nhật trạng thái Lịch hẹn',
      'CANCEL_APPOINTMENT': 'Hủy Lịch hẹn',
      'CREATE_USER': 'Tạo mới Người dùng',
      'UPDATE_USER': 'Cập nhật Người dùng',
      'DELETE_USER': 'Xóa Người dùng',
      'UPDATE_PROFILE': 'Cập nhật Hồ sơ',
      'CREATE_SERVICE': 'Tạo mới Dịch vụ',
      'UPDATE_SERVICE': 'Cập nhật Dịch vụ',
      'DELETE_SERVICE': 'Xóa Dịch vụ',
      'CREATE_PRESCRIPTION': 'Tạo Đơn thuốc',
      'UPDATE_PRESCRIPTION': 'Cập nhật Đơn thuốc',
      'LOGIN': 'Đăng nhập',
      'LOGOUT': 'Đăng xuất',
      'CREATE_TICKET': 'Gửi yêu cầu hỗ trợ',
      'UPDATE_TICKET_STATUS': 'Cập nhật trạng thái yêu cầu',
      'CHANGE_PASSWORD': 'Đổi mật khẩu',
      
      // Modules
      'PATIENT_MANAGEMENT': 'Quản lý Bệnh nhân',
      'DOCTOR_MANAGEMENT': 'Quản lý Bác sĩ',
      'CLINIC_MANAGEMENT': 'Quản lý Phòng khám',
      'USER_MANAGEMENT': 'Hồ sơ Người dùng',
      'APPOINTMENT_MANAGEMENT': 'Quản lý Lịch hẹn',
      'AUTH_MANAGEMENT': 'Bảo mật Hệ thống',
      'SYSTEM_MANAGEMENT': 'Cấu hình Chung',
      'SERVICE_MANAGEMENT': 'Quản lý Dịch vụ',
      'PRESCRIPTION_MANAGEMENT': 'Quản lý Đơn thuốc',
      'SUPPORT': 'Trung tâm hỗ trợ'
    };
    
    if (type === 'action' || type === 'module') {
      return mapping[text] || text;
    }
    
    let result = text
      .replace('Action completed successfully', 'Thao tác hoàn thành thành công')
      .replace('successful', 'thành công');

    return result
      .replace(/DOCTOR/g, 'Bác sĩ')
      .replace(/ADMIN/g, 'Quản trị viên')
      .replace(/PATIENT/g, 'Bệnh nhân')
      .replace(/CLINIC_MANAGER/g, 'Quản lý phòng khám')
      .replace(/\bINACTIVE\b/g, 'NGƯNG HOẠT ĐỘNG')
      .replace(/\bACTIVE\b/g, 'HOẠT ĐỘNG');
  };

  const handleExport = async () => {
    const today = new Date().toLocaleDateString('vi-VN');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Nhật Ký Hệ Thống');

    // Title Row
    worksheet.addRow([`NHẬT KÝ HOẠT ĐỘNG HỆ THỐNG - ${today}`]);
    worksheet.mergeCells('A1:F1');
    const titleRow = worksheet.getRow(1);
    titleRow.font = { name: 'Arial', family: 4, size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0284C7' } }; // sky-600
    titleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    titleRow.height = 30;

    // Header Row
    const headerRow = worksheet.addRow([
      'Thời Gian',
      'Người Dùng',
      'Hoạt Động / Hành Động',
      'Mô Đun',
      'Chi Tiết',
      'Địa Chỉ IP'
    ]);

    headerRow.font = { bold: true, color: { argb: 'FF1E293B' } }; // slate-800
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }; // slate-100
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // Define column widths for Autofit capability
    worksheet.columns = [
      { width: 25 }, // Time
      { width: 30 }, // User Default: 8
      { width: 35 }, // Action
      { width: 25 }, // Module
      { width: 60 }, // Details
      { width: 20 }  // IP
    ];

    // Data Rows
    logList.forEach(log => {
      const dateObj = new Date(log.time);
      const displayDateTime = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' - ' + dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : log.time;

      const detailsCleaned = log.details ? log.details
        .replace(/DOCTOR/g, 'Bác sĩ')
        .replace(/ADMIN/g, 'Quản trị viên')
        .replace(/PATIENT/g, 'Bệnh nhân')
        .replace(/CLINIC_MANAGER/g, 'Quản lý phòng khám')
        .replace(/\bINACTIVE\b/g, 'NGƯNG HOẠT ĐỘNG')
        .replace(/\bACTIVE\b/g, 'HOẠT ĐỘNG') : '--';

      const row = worksheet.addRow([
        displayDateTime,
        log.user?.name || '--',
        translateAuditLog(log.action, 'action'),
        translateAuditLog(log.module, 'module'),
        detailsCleaned,
        log.ip
      ]);
      row.alignment = { vertical: 'middle', wrapText: true };

      const actionCell = row.getCell(3);
      if (log.action.toLowerCase().includes('xóa') || log.action.toLowerCase().includes('khóa') || log.action.toLowerCase().includes('lỗi')) {
        actionCell.font = { color: { argb: 'FFEF4444' }, bold: true }; // red-500
      } else if (log.action.toLowerCase().includes('tạo mới') || log.action.toLowerCase().includes('đăng nhập')) {
        actionCell.font = { color: { argb: 'FF10B981' }, bold: true }; // emerald-500
      } else {
        actionCell.font = { color: { argb: 'FF3B82F6' }, bold: true }; // blue-500
      }
    });

    // Add professional borders
    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      if (rowNumber > 1) {
        row.eachCell({ includeEmpty: true }, (cell: ExcelJS.Cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
          };
        });
      }
    });

    // Convert to Binary Blob and Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Nhat_ky_he_thong_${today.replace(/\//g, '-')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700 font-display text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {isLoading ? (
              <div className="space-y-3 mb-2 text-left">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48 sm:w-64"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-64 sm:w-96"></div>
              </div>
            ) : (
              <>
                <h2 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                  Nhật ký hệ thống
                </h2>
                <p className="text-[13px] md:text-[16px] text-slate-500 mt-1 font-medium">Theo dõi và truy vết mọi hoạt động của người dùng trên toàn hệ thống.</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {selectedLogIds.length > 0 && (
              <button
                onClick={() => setIsBatchDeleteModalOpen(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rose-200 dark:shadow-none transition-all text-[13px] animate-in fade-in"
              >
                <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                Xóa ({selectedLogIds.length}) nhật ký
              </button>
            )}
            {logList.length > 0 && (
              <button
                onClick={() => setIsClearAllModalOpen(true)}
                className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all text-[13px] border border-rose-200 dark:border-rose-900/30"
              >
                <span className="material-symbols-outlined text-[18px]">auto_delete</span>
                Xóa tất cả
              </button>
            )}
            {isLoading ? (
              <div className="w-32 h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl shadow-sm"></div>
            ) : (
              <button
                onClick={handleExport}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all text-[13px] border border-primary/10 active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Xuất dữ liệu
              </button>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-2xl shadow-sm border border-primary/5 space-y-4 md:space-y-6 text-left italic-none">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="relative text-left">
              <label className="text-[14px] font-medium text-slate-500 dark:text-slate-400 mb-2 block px-1">
                {isLoading ? <div className="h-3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-32 mb-2"></div> : "Tìm kiếm sự kiện"}
              </label>
              {isLoading ? (
                <div className="h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl w-full"></div>
              ) : (
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] z-10 pointer-events-none">search</span>
                  <input
                    className="w-full h-[38px] md:h-[42px] bg-white dark:bg-slate-900 border border-slate-400 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-500 rounded-full pl-10 pr-4 text-[13px] md:text-[14px] font-medium placeholder:font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary shadow-sm outline-none text-slate-900 dark:text-white transition-all duration-300"
                    placeholder="Nội dung ví dụ: Khóa tài khoản..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="text-left">
              <label className="text-[14px] font-medium text-slate-500 dark:text-slate-400 mb-2 block px-1">
                {isLoading ? <div className="h-3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-32 mb-2"></div> : "Người thực hiện"}
              </label>
              {isLoading ? (
                <div className="h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl w-full"></div>
              ) : (
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">person</span>
                  <input
                    className="w-full h-[38px] md:h-[42px] bg-white dark:bg-slate-900 border border-slate-400 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-500 rounded-full pl-10 pr-4 text-[13px] md:text-[14px] font-medium placeholder:font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary shadow-sm outline-none text-slate-900 dark:text-white transition-all duration-300"
                    placeholder="Tên người thực hiện..."
                    type="text"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="text-left">
              <label className="text-[14px] font-medium text-slate-500 dark:text-slate-400 mb-2 block px-1">
                {isLoading ? <div className="h-3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-16 mb-2"></div> : "Mô-đun"}
              </label>
              {isLoading ? (
                <div className="h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl w-full"></div>
              ) : (
                <Dropdown
                  options={['Tất cả mô-đun', 'Quản lý người dùng', 'Quản lý phòng khám', 'Hồ sơ phòng khám', 'Báo cáo', 'Hệ thống', 'Auth', 'Trung tâm hỗ trợ']}
                  value={selectedModule}
                  onChange={setSelectedModule}
                  className="max-md:[&_button]:min-h-[38px] max-md:[&_span]:text-[12.5px]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Timeline-style Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-primary/5 relative">
          {/* Mobile Card View */}
          <div className="block md:hidden">
            {isLoading ? (
              [...Array(pagination.size)].map((_, i) => (
                <div key={`skeleton-m-${i}`} className="p-4 border-b border-slate-100 dark:border-slate-800 animate-pulse">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-full mt-2"></div>
                </div>
              ))
            ) : logList.length > 0 ? (
              logList.map((log: any) => {
                const dateObj = new Date(log.time);
                const displayTime = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  : log.time;
                const displayDate = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : '';
                return (
                  <div key={log.id} className="p-4 border-b border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-primary/10"
                        src={log.user.avatar || `https://i.pravatar.cc/150?u=${log.id}`}
                        alt={log.user.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{log.user.name}</p>
                        <p className="text-[11px] text-slate-400">{displayTime} - {displayDate}</p>
                      </div>
                      <code
                        onClick={() => handleIpClick(log.ip)}
                        className="text-[10px] font-mono font-bold text-white bg-emerald-500 px-2 py-1 rounded-lg cursor-pointer hover:bg-emerald-600 transition-all shrink-0"
                      >
                        {log.ip}
                      </code>
                    </div>
                    <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {translateAuditLog(log.action, 'action')}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {translateAuditLog(log.module, 'module')}
                      </span>
                      <p 
                        title={translateAuditLog(log.details, 'details')}
                        className="text-[11px] text-slate-400 truncate flex-1 cursor-help"
                      >
                        {translateAuditLog(log.details, 'details')}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <span className="material-symbols-outlined text-3xl">search_off</span>
                  <p className="font-medium text-[14px]">Không tìm thấy nhật ký</p>
                </div>
              </div>
            )}
          </div>
          {/* Desktop Table View */}
          <div className="overflow-x-auto overflow-y-hidden hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="pl-6 pr-2 py-5 w-10">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      checked={logList.length > 0 && selectedLogIds.length === logList.length}
                      onChange={(e) => handleSelectAllLogs(e.target.checked)}
                    />
                  </th>
                  <th className="px-6 py-5">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-20"></div> : <span className="text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none">Thời gian</span>}
                  </th>
                  <th className="px-6 py-5">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-24"></div> : <span className="text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none">Người dùng</span>}
                  </th>
                  <th className="px-6 py-5">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-24"></div> : <span className="text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none">Hành động</span>}
                  </th>
                  <th className="px-6 py-5">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-20"></div> : <span className="text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none">Mô-đun</span>}
                  </th>
                  <th className="px-6 py-5">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48"></div> : <span className="text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none">Chi tiết</span>}
                  </th>
                  <th className="px-6 py-5 text-right">
                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-24 ml-auto"></div> : <span className="text-[15px] font-medium text-slate-500 dark:text-slate-500 leading-none text-right">Thao tác</span>}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {isLoading ? (
                  // Skeleton Rows
                  [...Array(pagination.size)].map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="pl-6 pr-2 py-5">
                        <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
                          <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-16"></div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                          <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-24"></div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
                      </td>
                      <td className="px-6 py-5 text-right flex justify-end">
                        <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-xl w-24"></div>
                      </td>
                    </tr>
                  ))
                ) : logList.length > 0 ? (
                  logList.map((log: any) => {
                    const dateObj = new Date(log.time);
                    const displayTime = !isNaN(dateObj.getTime())
                      ? dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                      : log.time;
                    const displayDate = !isNaN(dateObj.getTime())
                      ? dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                      : '';

                    return (
                      <tr key={log.id} className={`hover:bg-primary/5 transition-colors group ${selectedLogIds.includes(log.id) ? 'bg-primary/5' : ''}`}>
                        <td className="pl-6 pr-2 py-5">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                            checked={selectedLogIds.includes(log.id)}
                            onChange={() => handleToggleSelectLog(log.id)}
                          />
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-[14px] font-medium text-slate-600 dark:text-white leading-tight">{displayTime}</span>
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-500 mt-0.5">{displayDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <img
                              className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-primary/10"
                              src={log.user.avatar || `https://i.pravatar.cc/150?u=${log.id}`}
                              alt={log.user.name}
                            />
                            <span className="text-[14px] font-medium text-slate-600 dark:text-slate-300">{log.user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[14px] font-medium tracking-tight text-slate-600 dark:text-slate-300">
                            {translateAuditLog(log.action, 'action')}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[14px] font-medium text-slate-600 dark:text-slate-400 italic-none">
                            {translateAuditLog(log.module, 'module')}
                          </span>
                        </td>
                        <td className="px-6 py-5 relative group/detail">
                          <p className="text-[14px] font-medium text-slate-600 dark:text-slate-400 line-clamp-1 max-w-sm italic-none cursor-help hover:text-primary transition-colors">
                            {translateAuditLog(log.details, 'details')}
                          </p>
                          <div className="absolute left-6 bottom-[80%] hidden group-hover/detail:block z-50 animate-in fade-in zoom-in duration-200 pointer-events-none">
                            <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white text-[13px] font-medium px-4 py-2.5 rounded-xl shadow-2xl border border-white/10 backdrop-blur-md w-max max-w-[320px] leading-relaxed text-left">
                              {translateAuditLog(log.details, 'details')}
                              <div className="absolute top-full left-4 border-8 border-transparent border-t-slate-900/95 dark:border-t-slate-800/95"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <code
                              onClick={() => handleIpClick(log.ip)}
                              className="text-[12px] font-mono font-bold text-white bg-emerald-500 px-3 py-1.5 rounded-xl shadow-sm cursor-pointer hover:bg-emerald-600 transition-all flex items-center gap-1.5 select-none"
                            >
                              <span className="material-symbols-outlined text-[16px]">info</span>
                              {log.ip}
                            </code>
                            <button
                              onClick={() => {
                                setDeletingLogId(log.id);
                                setIsSingleDeleteModalOpen(true);
                              }}
                              className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                              title="Xóa nhật ký này"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <span className="material-symbols-outlined text-3xl">search_off</span>
                        <p className="font-medium text-[14px]">Không tìm thấy nhật ký nào phù hợp</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Box */}
          <div className="bg-slate-50 border-t border-slate-100 py-4">
            <div className="px-8 flex flex-col md:flex-row items-center justify-end gap-4">
              {isLoading ? (
                <div className="flex gap-1">
                  <div className="w-8 h-8 rounded-md bg-slate-200 animate-pulse"></div>
                  <div className="w-8 h-8 rounded-md bg-slate-100 animate-pulse"></div>
                  <div className="w-8 h-8 rounded-md bg-slate-200 animate-pulse"></div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page === 0}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    className="p-2 rounded-md text-slate-400 hover:bg-white hover:text-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <span className="px-3 py-1.5 min-w-[90px] text-center rounded-full bg-primary text-white text-[13px] font-bold shadow-md tracking-tight whitespace-nowrap">
                    Trang {pagination.page + 1}/{totalPages}
                  </span>
                  <button
                    disabled={(pagination.page + 1) * pagination.size >= pagination.total}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="p-2 rounded-md text-slate-400 hover:bg-white hover:text-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* IP Detail Modal */}
      {isIpModalOpen && selectedIp && currentInfo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop like CreateClinicModal */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
            onClick={() => setIsIpModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-xl text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined font-bold">public</span>
                </div>
                <div>
                  <h2 className="text-[18px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Chi tiết địa chỉ IP</h2>
                  <p className="text-[13px] font-bold text-slate-400 font-mono tracking-tight lowercase">{selectedIp}</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900 text-left">
              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Khu vực / Tỉnh thành</label>
                  <div className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200">
                    {currentInfo.location}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Múi giờ</label>
                  <div className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200">
                    {currentInfo.timezone}
                  </div>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Nhà cung cấp dịch vụ (ISP)</label>
                  <div className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">router</span>
                    {currentInfo.isp}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Loại kết nối</label>
                  <div className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200">
                    {currentInfo.type}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Mã bưu chính (Zip)</label>
                  <div className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200">
                    {currentInfo.zip}
                  </div>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Trạng thái bảo mật</label>
                  <div className={`w-full px-4 py-3 rounded-xl border-2 flex items-center justify-between font-bold text-[14px] ${currentInfo.security.includes('Nghi vấn')
                    ? 'border-amber-500/20 bg-amber-500/5 text-amber-600'
                    : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
                    }`}>
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">
                        {currentInfo.security.includes('Nghi vấn') ? 'warning' : 'verified_user'}
                      </span>
                      {currentInfo.security}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider opacity-60">Verified Admin</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 z-20 transition-all">
              <button
                onClick={() => setIsIpModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Đóng
              </button>
              <button
                onClick={() => window.open(`https://www.google.com/maps?q=${currentInfo.lat},${currentInfo.lng}`, '_blank')}
                className="px-6 py-2.5 text-sm font-extrabold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                Xem bản đồ
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isSingleDeleteModalOpen && (
          <DeleteConfirmModal
            isOpen={isSingleDeleteModalOpen}
            onClose={() => {
              setIsSingleDeleteModalOpen(false);
              setDeletingLogId(null);
            }}
            onConfirm={handleSingleDelete}
            title="Xác nhận xóa nhật ký"
            description="Bạn có chắc chắn muốn xóa bản ghi nhật ký hệ thống này không? Thao tác này sẽ gỡ bỏ bản ghi khỏi hệ thống và không thể hoàn tác."
            isLoading={isDeleting}
          />
        )}

        {isBatchDeleteModalOpen && (
          <DeleteConfirmModal
            isOpen={isBatchDeleteModalOpen}
            onClose={() => setIsBatchDeleteModalOpen(false)}
            onConfirm={handleBatchDelete}
            title="Xác nhận xóa hàng loạt nhật ký"
            description={`Bạn có chắc chắn muốn xóa ${selectedLogIds.length} bản ghi nhật ký đã chọn? Thao tác này không thể hoàn tác.`}
            isLoading={isDeleting}
          />
        )}

        {isClearAllModalOpen && (
          <DeleteConfirmModal
            isOpen={isClearAllModalOpen}
            onClose={() => setIsClearAllModalOpen(false)}
            onConfirm={handleClearAll}
            title="Xác nhận xóa tất cả nhật ký"
            description="CẢNH BÁO: Thao tác này sẽ XÓA VĨNH VIỄN TOÀN BỘ nhật ký hệ thống! Bạn có chắc chắn muốn tiếp tục dọn dẹp không?"
            isLoading={isDeleting}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
