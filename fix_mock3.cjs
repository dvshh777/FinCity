const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

content = content.replace(/stage: 0,\n    stage: 0,/g, 'stage: 0,');

fs.writeFileSync('src/data/mockData.ts', content);
console.log('Fixed multiple stage props');
