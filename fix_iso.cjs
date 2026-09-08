const fs = require('fs');
let content = fs.readFileSync('src/components/IsometricCity.tsx', 'utf8');

// replace <g key={b.id} with <motion.g key={`${b.id}-${b.stage}`} initial={{ scale: 0.8, y: -20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ type: "spring", bounce: 0.6 }}
content = content.replace(
  /<g \n\s*key={b\.id}/g,
  '<motion.g \n                key={`${b.id}-${b.stage}`}\n                initial={{ scale: 0.8, y: -20, opacity: 0 }}\n                animate={{ scale: 1, y: 0, opacity: 1 }}\n                transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}'
);

content = content.replace(
  /<\/g>\n\s*\);/g,
  '</motion.g>\n            );'
);

fs.writeFileSync('src/components/IsometricCity.tsx', content);
console.log('Fixed isometric animations');
