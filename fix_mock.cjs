const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

content = content.replace(/totalSavings: 0,/g, 'totalSavings: 0,\n  availableBuildFunds: 0,');
content = content.replace(/status: 'built'/g, "status: 'built',\n    stage: 3");

fs.writeFileSync('src/data/mockData.ts', content);
console.log('Fixed mock data');
