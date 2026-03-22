const fs = require('fs');
let html = fs.readFileSync('src/test.html', 'utf8');

let match = html.match(/<div class="flex flex-1 overflow-hidden">([\s\S]*?)<\/main>/);
if (!match) throw new Error("Could not find container in test.html");

let content = '<div className="flex flex-1 overflow-hidden w-full">' + match[1].replace(/<\/div>\s*$/, '');

// convert to TSX
content = content.replace(/class=/g, 'className=');
content = content.replace(/<!--(.*?)-->/g, '{/*$1*/}');

content = content.replace(/<input(.*?)>/g, (m, p1) => {
    if(p1.trim().endsWith('/')) return m;
    return `<input${p1} />`;
});
content = content.replace(/<img(.*?)>/g, (m, p1) => {
    if(p1.trim().endsWith('/')) return m;
    return `<img${p1} />`;
});
// The only inline style is missing but just in case:
content = content.replace(/style="([^"]*)"/g, (m, p1) => {
    if (p1.includes("font-variation-settings: 'FILL' 1")) return "style={{ fontVariationSettings: \"'FILL' 1\" }}";
    return m;
});


let dash = fs.readFileSync('src/pages/DoctorDashboard.tsx', 'utf8');

// Dashboard layout
let dashTopMatch = dash.match(/([\s\S]*?)<div className="p-8 space-y-8">/);
if (!dashTopMatch) throw new Error("Cannot find dash top");

let dashTop = dashTopMatch[1];
// Change to h-screen for messages
dashTop = dashTop.replace('<div className="flex min-h-screen font-display', '<div className="flex h-screen overflow-hidden font-display');
dashTop = dashTop.replace('<main className="flex-1 ml-72">', '<main className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">');

let newFile = dashTop + '\n' + content + '\n</main>\n</div>\n);\n}';

newFile = newFile.replace("export default function DoctorDashboard", "export default function DoctorMessages");

// Highlight chat
newFile = newFile.replace(/className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium"(.*?)href="\/doctor"/g, 'className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-colors"$1href="/doctor"');

newFile = newFile.replace(/className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary\/10 hover:text-primary rounded-xl font-medium transition-colors"(.*?)href="\/doctor\/messages"/g, 'className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium transition-colors"$1href="/doctor/messages"');

// Fix text inside Chat menu item to have fill
newFile = newFile.replace(/<span className="material-symbols-outlined">chat<\/span>/g, '<span className="material-symbols-outlined" style={{ fontVariationSettings: "\'FILL\' 1" }}>chat</span>');


fs.writeFileSync('src/pages/DoctorMessages.tsx', newFile);
