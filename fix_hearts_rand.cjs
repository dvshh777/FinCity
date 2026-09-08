const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

const values = [100, 90, 80, 100, 70, 100, 60, 50, 100, 90, 80, 100];
let i = 0;

content = content.replace(/hearts:\s*\d+/g, (match) => {
    const v = values[i++];
    return `hearts: ${v}`;
});

fs.writeFileSync('src/data/mockData.ts', content);
console.log('Fixed hearts randomly');
