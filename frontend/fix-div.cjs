const fs = require('fs');
let f = 'src/pages/DoctorMessages.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/<\/main>\s*<\/div>\s*\)\s*;\s*}/, '</div>\n</main>\n</div>\n);}');
fs.writeFileSync(f, c);
