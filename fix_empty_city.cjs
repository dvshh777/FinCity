const fs = require('fs');
let content = fs.readFileSync('src/components/screens/Screens9to13.tsx', 'utf8');

content = content.replace(
  /onUpdateProfile\?: \([^)]+\) => void;\n}/g,
  "onUpdateProfile?: (updates: { name: string; tag: string; monthlyIncome: number; budgetNeeds: number; budgetWants: number; budgetSavings: number; }) => void;\n  onUpgradePlot?: (plotId: string, cost: number) => void;\n}"
);

content = content.replace(
  /onUpdateProfile,\n}\) => {/g,
  "onUpdateProfile,\n  onUpgradePlot,\n}) => {"
);

fs.writeFileSync('src/components/screens/Screens9to13.tsx', content);
console.log('Fixed empty city props');
