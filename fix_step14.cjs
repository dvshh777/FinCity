const fs = require('fs');
let content = fs.readFileSync('src/components/MobileSimulator.tsx', 'utf8');

content = content.replace(
  /<DashboardAfterScreen\n\s*user={user}\n\s*activeTab={mobileTab}\n\s*onChangeTab={onChangeMobileTab}\n\s*onAddSavings={onAddSavings}\n\s*onCompleteQuest={onCompleteQuest}\n\s*onUpdateProfile={handleUpdateProfile}\n\s*onAddFriend={handleAddFriend}\n\s*\/>/g,
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
console.log('Fixed step 14');
