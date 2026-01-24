const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'o-nas.html',
    'proces-spoluprace.html',
    'produkty.html',
    'montaz.html',
    'inspiracie.html'
];

const rootDir = '/Users/jakub/Documents/ArtStone_stranka';

// HTML content to replace the existing logo block
// Existing: 
// <div class="flex items-center gap-3">
//    <div class="size-10 bg-primary flex items-center justify-center rounded">
//        <span class="material-symbols-outlined text-white text-2xl">architecture</span>
//    </div>
//    <h2 class="text-white text-xl font-black uppercase tracking-tighter font-display">Artstone®</h2>
// </div>

const newLogoHtml = `<a href="index.html" class="flex items-center gap-3 group">
    <img src="/logo-white.png" alt="Artstone Logo" class="h-10 w-auto object-contain transition-transform group-hover:scale-105">
</a>`;

// Regex to capture the logo block. 
// It starts with <div class="flex items-center gap-3"> and captures the icon div + h2
// We need to be careful with regex. The structure is consistently:
// <div class="flex items-center gap-3"> [whitespace] <div...>...</div> [whitespace] <h2...>...</h2> [whitespace] </div>

const logoRegex = /<div class="flex items-center gap-3">\s*<div class="size-10 bg-primary[\s\S]*?<\/div>\s*<h2[\s\S]*?<\/h2>\s*<\/div>/;

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (logoRegex.test(content)) {
            const newContent = content.replace(logoRegex, newLogoHtml);
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated logo in ${file}`);
        } else {
            console.log(`Logo block not found in ${file}`);
            // Fallback: try simpler regex if the first one implies strict whitespace
            // Or maybe check if already updated
            if (content.includes('logo-white.png')) {
                console.log(`Logo already looks updated in ${file}`);
            }
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
