const fs = require('fs');
let content = fs.readFileSync('src/components/screens/Screens9to13.tsx', 'utf8');

const replacement = `
  const [selectedPlot, setSelectedPlot] = useState<any>(null);

  const handleUpgrade = (cost: number) => {
    if (selectedPlot && onUpgradePlot) {
      onUpgradePlot(selectedPlot.id, cost);
      setSelectedPlot(null); // Deselect after upgrade
    }
  };

  return (
    <div className="relative flex flex-col justify-between h-full w-full bg-stone-950 overflow-hidden">
      {/* Top Status Bar */}
      <MobileStatusBar
        name={user.name}
        tag={user.tag}
        level={1}
        exp={user.exp || 10}
        hearts={0}
        user={user}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Main gamified canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <IsometricCity 
          mode="interactive" 
          buildings={user.buildings}
          selectedPlotId={selectedPlot?.id}
          onSelectPlot={(plot) => setSelectedPlot(plot)}
        />

        <div className="absolute top-4 right-4 bg-stone-900/80 p-3 rounded-2xl border border-stone-700 shadow-xl backdrop-blur-sm z-10 flex flex-col items-center">
           <span className="text-xs text-stone-400 font-bold tracking-wider mb-1">BUILD FUNDS</span>
           <span className="text-xl text-emerald-400 font-extrabold tracking-tight">₹{user.availableBuildFunds}</span>
        </div>

        {/* Build Options Modal */}
        <AnimatePresence>
          {selectedPlot && selectedPlot.stage < 3 && (
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="absolute bottom-6 left-6 right-6 z-20"
            >
              <div className="p-5 rounded-3xl bg-white text-stone-900 shadow-2xl border border-stone-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">{selectedPlot.name || 'Empty Plot'}</h3>
                  <button onClick={() => setSelectedPlot(null)} className="text-stone-400 hover:text-stone-600">
                     <span className="text-xl">&times;</span>
                  </button>
                </div>
                
                <p className="text-xs text-stone-500 mb-4">
                  {selectedPlot.stage === 0 ? "Ready to lay the foundation! A solid base for your saving habits." : 
                   selectedPlot.stage === 1 ? "Time to put up the framing. You're building momentum!" :
                   "Finish the construction! The roof goes on today."}
                </p>

                <button
                  onClick={() => handleUpgrade(selectedPlot.stage === 0 ? 100 : 50)}
                  disabled={user.availableBuildFunds < (selectedPlot.stage === 0 ? 100 : 50)}
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl flex items-center justify-between disabled:opacity-50 transition-all"
                >
                  <span>
                    {selectedPlot.stage === 0 ? 'Build Base Pillars' : 
                     selectedPlot.stage === 1 ? 'Build Framework' : 'Complete Construction'}
                  </span>
                  <span className="bg-emerald-800 text-white px-2 py-1 rounded text-xs">
                    ₹{selectedPlot.stage === 0 ? 100 : 50}
                  </span>
                </button>
                {user.availableBuildFunds < (selectedPlot.stage === 0 ? 100 : 50) && (
                  <p className="text-[10px] text-rose-500 text-center mt-2 font-semibold">Not enough build funds. Try depositing more savings!</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Default message if no plot selected */}
        {!selectedPlot && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 left-6 right-6 z-10 cursor-pointer"
          >
            <div className="p-4 rounded-2xl bg-white/95 text-stone-900 shadow-xl border border-stone-200 text-center" onClick={onPromptFirstSave}>
              <p className="text-xs font-bold text-stone-800 leading-snug">
                Drag to explore! <br />
                <span className="text-emerald-600 font-semibold">
                  Tap 'Add Savings' below or tap a plot to build.
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </div>
`;

content = content.replace(
  /return \(\s*<div className="relative flex flex-col justify-between h-full w-full bg-stone-950 overflow-hidden">[\s\S]*?(?=      {\/\* Bottom Navigation \*\/)/,
  replacement
);

fs.writeFileSync('src/components/screens/Screens9to13.tsx', content);
console.log('Fixed empty city UI');
