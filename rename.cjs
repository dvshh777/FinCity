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
    
    // Replace state/variable names
    content = content.replace(/\bcoins\b/g, 'exp');
    content = content.replace(/\bCoins\b/g, 'EXP'); // For labels if any
    content = content.replace(/\brewardCoins\b/g, 'rewardExp');
    content = content.replace(/\bdailyCoins\b/g, 'dailyExp');
    
    // Icon replacements
    content = content.replace(/import \{([^}]*)\bEXP\b([^}]*)\} from 'lucide-react'/g, "import {$1Zap$2} from 'lucide-react'");
    content = content.replace(/<EXP /g, '<Zap ');
    
    // Also CircleDollarSign is used in FriendsView for Coins
    content = content.replace(/CircleDollarSign/g, 'Zap');
    
    if (original !== content) {
        fs.writeFileSync(file, content);
    }
});
console.log('Renaming done');
