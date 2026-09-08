const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

content = content.replace(/hearts:\s*\d+/g, (match) => {
    const val = parseInt(match.split(':')[1].trim());
    return `hearts: ${Math.min(val, 100)}`;
});

fs.writeFileSync('src/data/mockData.ts', content);
console.log('Fixed hearts');
