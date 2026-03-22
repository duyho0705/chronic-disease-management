const fs = require('fs');

let html = fs.readFileSync('src/test.html', 'utf8');
let base = fs.readFileSync('src/pages/DoctorDashboard.tsx', 'utf8');

const s1 = '<!-- Page Header -->';
const s2 = '<!-- Pagination -->';
let startIdx = html.indexOf(s1);
let endIdx = html.indexOf(s2);

if (startIdx === -1 || endIdx === -1) {
    console.log("fallback");
    startIdx = html.indexOf('Danh sách bệnh nhân');
}

let section = html.substring(startIdx, endIdx);
// find the next closing div for the pagination wrapper
let rest = html.substring(endIdx);
let m2 = rest.match(/<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/);
if (m2) {
    section += m2[0];
}

let content = '        <div className="p-8 space-y-8">\n' + section;

content = content.replace(/class=/g, 'className=');
content = content.replace(/<!--(.*?)-->/g, '{/*$1*/}');

content = content.replace(/<input(.*?)>/g, (match, p1) => {
    if (p1.trim().endsWith('/')) return match;
    return `<input${p1} />`;
});
content = content.replace(/<img(.*?)>/g, (match, p1) => {
    if (p1.trim().endsWith('/')) return match;
    return `<img${p1} />`;
});

// Primary mapping
content = content.replace(/bg-emerald-50/gi, 'bg-primary/5');
content = content.replace(/bg-emerald-100/gi, 'bg-primary/20');
content = content.replace(/bg-emerald-200/gi, 'bg-primary/30');
content = content.replace(/bg-emerald-500/gi, 'bg-primary');
content = content.replace(/bg-emerald-600/gi, 'bg-primary');
content = content.replace(/text-emerald-500/gi, 'text-primary');
content = content.replace(/text-emerald-600/gi, 'text-primary');
content = content.replace(/text-emerald-700/gi, 'text-primary');
content = content.replace(/ring-emerald-200/gi, 'ring-primary/20');
content = content.replace(/hover:text-emerald-500/gi, 'hover:text-primary');
content = content.replace(/hover:bg-emerald-100/gi, 'hover:bg-primary/10');
content = content.replace(/border-emerald-50\/50/gi, 'border-primary/10');

// style fixes
content = content.replace(/style="([^"]*)"/g, (match, p1) => {
    if (p1.includes("'FILL' 1")) {
        return `style={{ fontVariationSettings: "'FILL' 1" }}`;
    }
    return `style={{ fontVariationSettings: "${p1}" }}`; 
});

let dashTopMatch = base.match(/([\s\S]*?)<div className="p-8 space-y-8">/);
let newFile = dashTopMatch[1] + content + '\n        </div>\n      </main>\n    </div>\n  );\n}';
newFile = newFile.replace("export default function DoctorDashboard", "export default function DoctorPatients");

fs.writeFileSync('src/pages/DoctorPatients.tsx', newFile);
console.log("DoctorPatients created");
