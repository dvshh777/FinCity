const fs = require('fs');
let content = fs.readFileSync('src/components/MobileSimulator.tsx', 'utf8');

content = content.replace(
  /<DashboardAfterScreen[\s\S]*?\/>/,
  `<EmptyCityScreen
                    user={user}
                    activeTab={mobileTab}
                    onChangeTab={onChangeMobileTab}
                    onPromptFirstSave={() => onChangeStep(11)}
                    onUpdateProfile={handleUpdateProfile}
                    onUpgradePlot={onUpgradePlot}
                  />`
);

fs.writeFileSync('src/components/MobileSimulator.tsx', content);
console.log('Fixed step 14 real');
