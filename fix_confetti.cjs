const fs = require('fs');
let content = fs.readFileSync('src/components/screens/Screens9to13.tsx', 'utf8');

const replacement = `
  const handleUpgrade = (cost: number) => {
    if (selectedPlot && onUpgradePlot) {
      onUpgradePlot(selectedPlot.id, cost);
      
      // Cooler animation for construction
      const isFinished = selectedPlot.stage === 2;
      confetti({
        particleCount: isFinished ? 150 : 50,
        spread: isFinished ? 100 : 60,
        origin: { y: 0.6 },
        colors: isFinished ? ['#10b981', '#34d399', '#fcd34d', '#3b82f6'] : ['#f59e0b', '#d97706', '#fbbf24']
      });

      setSelectedPlot(null); // Deselect after upgrade
    }
  };
`;

content = content.replace(
  /const handleUpgrade = \(cost: number\) => {[\s\S]*?};/,
  replacement.trim()
);

fs.writeFileSync('src/components/screens/Screens9to13.tsx', content);
console.log('Added confetti');
