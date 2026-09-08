const fs = require('fs');
let content = fs.readFileSync('src/components/MobileSimulator.tsx', 'utf8');

// Inside FirstSavePromptScreen
content = content.replace(
  /onChangeStep\(12\);/g,
  "onChangeStep(10);"
);

fs.writeFileSync('src/components/MobileSimulator.tsx', content);
console.log('Fixed simulator flow');
