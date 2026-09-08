const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

content = content.replace(/status: 'empty' as any/g, "status: 'locked',\n    stage: 0");

fs.writeFileSync('src/data/mockData.ts', content);
console.log('Fixed initial buildings');
