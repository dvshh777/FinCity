const fs = require('fs');
let content = fs.readFileSync('src/components/screens/Screens9to13.tsx', 'utf8');

content = content.replace(
  /useState<any>\(null\);/g,
  'useState<BuildingPlot | null>(null);'
);

// We need AnimatePresence from motion/react
if (!content.includes('AnimatePresence')) {
  content = content.replace(
    /import { motion } from 'motion\/react';/,
    "import { motion, AnimatePresence } from 'motion/react';"
  );
}

fs.writeFileSync('src/components/screens/Screens9to13.tsx', content);
console.log('Fixed type');
