const fs = require('fs');
let dash = fs.readFileSync('src/pages/DoctorDashboard.tsx', 'utf8');
let appt = fs.readFileSync('src/pages/DoctorAppointments.tsx', 'utf8');

let m1 = appt.match(/<div className="max-w-7xl mx-auto space-y-8">([\s\S]*?)<\/div>\s*<\/div>\s*<\/main>/);
if (!m1) throw new Error("Match 1 fail");
let content = '<div className="max-w-7xl mx-auto space-y-8">' + m1[1];

let m2 = dash.match(/([\s\S]*?)<div className="p-8 space-y-8">[\s\S]*?<\/main>/);
if (!m2) throw new Error("Match 2 fail");

let dashTop = m2[1];

let newFile = dashTop + '<div className="p-8 space-y-8">\n' + content + '\n</div>\n</main>\n</div>\n);\n}';
newFile = newFile.replace("export default function DoctorDashboard", "export default function DoctorAppointments");

// Swap active menu class
newFile = newFile.replace(/className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium"([ \n]*?)href="\/doctor"/g, 'className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors"$1href="/doctor"');

newFile = newFile.replace(/className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary\/10 hover:text-primary rounded-xl font-medium transition-colors"([ \n]*?)href="\/doctor\/appointments"/g, 'className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium"$1href="/doctor/appointments"');

fs.writeFileSync('src/pages/DoctorAppointments.tsx', newFile);
