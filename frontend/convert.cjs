const fs = require('fs');
let html = fs.readFileSync('src/test.html', 'utf8');

let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
let bodyContent = bodyMatch ? bodyMatch[1] : '';

bodyContent = bodyContent.replace(/class=/g, 'className=');
bodyContent = bodyContent.replace(/<!--(.*?)-->/g, '{/*$1*/}');

bodyContent = bodyContent.replace(/<input(.*?)>/g, (m, p1) => {
    if(p1.trim().endsWith('/')) return m;
    return `<input${p1} />`;
});
bodyContent = bodyContent.replace(/<img(.*?)>/g, (m, p1) => {
    if(p1.trim().endsWith('/')) return m;
    return `<img${p1} />`;
});

bodyContent = bodyContent.replace(/style="font-variation-settings:\s*'FILL'\s*1"/g, "style={{ fontVariationSettings: \"'FILL' 1\" }}");

let code = `import React from 'react';

export default function DoctorAppointments() {
  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
${bodyContent}
    </div>
  );
}
`;

fs.writeFileSync('src/pages/DoctorAppointments.tsx', code);
