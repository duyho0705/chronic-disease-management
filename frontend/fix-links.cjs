const fs = require('fs');

const files = ['src/pages/DoctorDashboard.tsx', 'src/pages/DoctorAppointments.tsx', 'src/pages/DoctorMessages.tsx'];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');

  // Fix total replacement of Tin nhan link:
  // It looks like:
  // <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors" href="#">
  //   <span className="material-symbols-outlined">chat</span>
  //   <span>Tin nhắn</span>
  //   <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
  // </a>

  // Since it can be active or inactive, let's just use regex to find the "Tin nhắn" span and replace its surrounding a tag.
  let regex = /<a[^>]*className="[^"]*"[^>]*href="[^"]*"[^>]*>[\s\S]*?<span>Tin nhắn<\/span>[\s\S]*?<\/a>/;
  
  c = c.replace(regex, `<a className="flex items-center gap-3 px-4 py-3 ${f.includes('Messages') ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'} rounded-xl font-medium transition-colors" href="/doctor/messages">
            <span className="material-symbols-outlined"${f.includes('Messages') ? ' style={{ fontVariationSettings: "\'FILL\' 1" }}' : ''}>chat</span>
            <span>Tin nhắn</span>
            <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
          </a>`);

  fs.writeFileSync(f, c);
});
