const fs = require('fs');

function traverseDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(traverseDir(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = traverseDir('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    let original = content;
    
    // Zap color amber -> blue
    content = content.replace(/text-amber-400([^>]*<Zap )/g, 'text-sky-400$1'); // reverse? wait, it's <Zap className="... text-amber-400" />
    content = content.replace(/<Zap([^>]*?)text-amber-400([^>]*?)>/g, '<Zap$1text-blue-400$2>');
    
    // Also "Coins" -> "EXP" in UI texts if any left
    // The previous regex might have missed 'Coins' text because of word boundary?
    // Let's verify that manually if needed.
    
    if (original !== content) {
        fs.writeFileSync(file, content);
    }
});
console.log('Color renaming done');
