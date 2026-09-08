const fs = require('fs');
let content = fs.readFileSync('src/components/screens/Screens9to13.tsx', 'utf8');

content = content.replace(
  /import { MobileTab, UserState } from '\.\.\/\.\.\/types';/,
  "import { MobileTab, UserState, BuildingPlot } from '../../types';"
);

fs.writeFileSync('src/components/screens/Screens9to13.tsx', content);
console.log('Fixed import');
