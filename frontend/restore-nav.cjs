const fs = require('fs');

const files = {
  'DoctorDashboard': 'src/pages/DoctorDashboard.tsx',
  'DoctorAppointments': 'src/pages/DoctorAppointments.tsx',
  'DoctorMessages': 'src/pages/DoctorMessages.tsx'
};

const getNavHTML = (activePage) => {
  const isDashboard = activePage === 'DoctorDashboard';
  const isAppointments = activePage === 'DoctorAppointments';
  const isMessages = activePage === 'DoctorMessages';

  return `<nav className="flex-1 px-4 py-4 space-y-1">
          <a className="flex items-center gap-3 px-4 py-3 ${isDashboard ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'} rounded-xl font-medium transition-colors" href="/doctor">
            <span className="material-symbols-outlined"${isDashboard ? ' style={{ fontVariationSettings: "\\'FILL\\' 1" }}' : ''}>dashboard</span>
            <span>Bảng điều khiển</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">groups</span>
            <span>Danh sách bệnh nhân</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">analytics</span>
            <span>Phân tích nguy cơ</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">prescriptions</span>
            <span>Đơn thuốc điện tử</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 ${isAppointments ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'} rounded-xl font-medium transition-colors" href="/doctor/appointments">
            <span className="material-symbols-outlined"${isAppointments ? ' style={{ fontVariationSettings: "\\'FILL\\' 1" }}' : ''}>calendar_today</span>
            <span>Lịch hẹn khám</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 ${isMessages ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'} rounded-xl font-medium transition-colors" href="/doctor/messages">
            <span className="material-symbols-outlined"${isMessages ? ' style={{ fontVariationSettings: "\\'FILL\\' 1" }}' : ''}>chat</span>
            <span>Tin nhắn</span>
            <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
          </a>
        </nav>`;
}

for (const [key, path] of Object.entries(files)) {
  let content = fs.readFileSync(path, 'utf8');
  // Match current <nav>...</nav>
  // Because 'Tin nhắn' block is inside a <nav> that we accidentally pruned.
  // We can just replace <nav className="flex-1 px-4 py-4 space-y-1"> ... </nav>
  const navStart = '<nav className="flex-1 px-4 py-4 space-y-1">';
  const navEnd = '</nav>';

  let startIdx = content.indexOf(navStart);
  let endIdx = content.indexOf(navEnd, startIdx) + navEnd.length;

  if (startIdx !== -1 && endIdx !== -1) {
    let top = content.substring(0, startIdx);
    let bottom = content.substring(endIdx);
    fs.writeFileSync(path, top + getNavHTML(key) + bottom);
  } else {
    console.error("Could not find nav in " + path);
  }
}
