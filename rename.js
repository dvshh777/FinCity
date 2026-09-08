const fs = require('fs');
const glob = require('glob'); // Not installed? I'll just use a find command or recursive read.

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
    
    // Replace state/variable names
    content = content.replace(/\bcoins\b/g, 'exp');
    content = content.replace(/\bCoins\b/g, 'EXP'); // For labels if any
    content = content.replace(/\brewardCoins\b/g, 'rewardExp');
    content = content.replace(/\bdailyCoins\b/g, 'dailyExp');
    
    // Icon replacements
    content = content.replace(/import \{([^}]*)\bCoins\b([^}]*)\} from 'lucide-react'/g, "import {$1Zap$2} from 'lucide-react'");
    content = content.replace(/<Coins /g, '<Zap ');
    
    // Also CircleDollarSign is used in FriendsView for Coins
    content = content.replace(/CircleDollarSign/g, 'Zap');
    
    fs.writeFileSync(file, content);
});
console.log('Renaming done');
