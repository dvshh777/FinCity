import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BuildingPlot } from '../types';
import { INITIAL_BUILDINGS } from '../data/mockData';

interface IsometricCityProps {
  mode?: 'empty' | 'constructing' | 'built-single' | 'full-city' | 'interactive';
  constructionProgress?: number;
  buildings?: BuildingPlot[];
  selectedPlotId?: string;
  onSelectPlot?: (plot: BuildingPlot) => void;
  className?: string;
  interactive?: boolean;
}

interface ClashOfClansBuilderProps {
  x: number;
  y: number;
  stage: number;
  scale?: number;
}

export const ClashOfClansBuilder: React.FC<ClashOfClansBuilderProps> = ({
  x,
  y,
  stage,
  scale = 1,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Dynamic Ground Shadow */}
      <ellipse cx="0" cy="22" rx="18" ry="8" fill="#020617" opacity="0.65" />

      {/* Wooden Artisan Tool Crate & Blueprint Scroll */}
      <g transform="translate(-30, 8)">
        {/* Crate Base */}
        <polygon points="-10,-5 0,-10 10,-5 0,1" fill="#92400e" stroke="#451a03" strokeWidth="0.8" />
        <polygon points="-10,-5 0,1 0,12 -10,6" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
        <polygon points="0,1 10,-5 10,6 0,12" fill="#b45309" stroke="#451a03" strokeWidth="0.8" />
        {/* Steel Saw blade */}
        <path d="M -8,-6 L -14,-18 L -9,-17 L -7,-12 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.6" />
        <rect x="-16" y="-21" width="5" height="4" rx="1" fill="#ea580c" />
        {/* Chrome Monkey Wrench */}
        <line x1="3" y1="-7" x2="8" y2="-17" stroke="#cbd5e1" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="8" cy="-17" r="2.8" fill="none" stroke="#cbd5e1" strokeWidth="1.8" />
        {/* Rolled Cyan Blueprints */}
        <ellipse cx="6" cy="-4" rx="2" ry="5" fill="#38bdf8" transform="rotate(-30 6 -4)" />
        <circle cx="8" cy="-8" r="1.5" fill="#ffffff" />
      </g>

      {/* Hammer Strike Point with Animated Flying Sparks & Expanding Dust Wave */}
      <g transform="translate(18, 4)">
        {/* Shockwave Dust Ring */}
        <motion.ellipse
          cx="0"
          cy="0"
          animate={{ rx: [2, 18], ry: [1, 9], opacity: [0.9, 0] }}
          transition={{ repeat: Infinity, duration: 0.75, ease: 'easeOut' }}
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.5"
        />

        {/* Flying Spark Particles popping on impact */}
        <motion.g
          animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.75, times: [0, 0.5, 1], ease: 'easeOut' }}
        >
          {/* Gold Spark Stars */}
          <path d="M -8,-14 L -6,-7 L 0,-9 L -5,-5 L -4,2 L -8,-2 L -12,2 L -11,-5 L -16,-9 L -10,-7 Z" fill="#fde047" />
          <path d="M 8,-18 L 10,-12 L 16,-14 L 12,-9 L 14,-3 L 9,-7 L 4,-3 L 6,-9 L 1,-14 L 7,-12 Z" fill="#fbbf24" />
          {/* Spark dots */}
          <circle cx="14" cy="-12" r="1.8" fill="#f59e0b" />
          <circle cx="-16" cy="-8" r="1.8" fill="#ffffff" />
          <circle cx="4" cy="-24" r="1.4" fill="#fde047" />
        </motion.g>
      </g>

      {/* Human Builder Character Body (Clash of Clans Style) */}
      <g transform="translate(0, 2)">
        {/* Work Boots */}
        <ellipse cx="-6" cy="18" rx="5" ry="3" fill="#451a03" />
        <ellipse cx="6" cy="18" rx="5" ry="3" fill="#451a03" />
        <rect x="-9" y="16" width="6" height="3" rx="1" fill="#78350f" />
        <rect x="3" y="16" width="6" height="3" rx="1" fill="#78350f" />

        {/* Denim Work Dungarees & Pants */}
        <rect x="-9" y="2" width="18" height="16" rx="4" fill="#1e3a8a" />
        <rect x="-7" y="2" width="14" height="7" rx="2" fill="#2563eb" />
        {/* Tool Belt with Golden Buckle */}
        <rect x="-9" y="6" width="18" height="3.5" rx="1" fill="#78350f" />
        <rect x="-3" y="5.5" width="6" height="4.5" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />

        {/* Orange Worker T-Shirt Shoulders */}
        <rect x="-11" y="-5" width="22" height="10" rx="4" fill="#ea580c" />
        {/* Overalls Suspenders with Brass Rivets */}
        <line x1="-6" y1="-4" x2="-6" y2="4" stroke="#1d4ed8" strokeWidth="2.5" />
        <circle cx="-6" cy="4" r="1.2" fill="#fbbf24" />
        <line x1="6" y1="-4" x2="6" y2="4" stroke="#1d4ed8" strokeWidth="2.5" />
        <circle cx="6" cy="4" r="1.2" fill="#fbbf24" />

        {/* Left Arm Rested on Workpiece */}
        <g>
          <path d="M -9,-3 Q -17,3 -17,11" fill="none" stroke="#ea580c" strokeWidth="4.5" strokeLinecap="round" />
          {/* Work Glove */}
          <circle cx="-17" cy="11" r="3" fill="#d97706" />
        </g>

        {/* Builder Head & Facial Features */}
        <g transform="translate(0, -11)">
          {/* Neck */}
          <rect x="-3.5" y="1" width="7" height="4.5" fill="#fed7aa" />
          {/* Round Head */}
          <circle cx="0" cy="-4" r="8.5" fill="#fed7aa" />
          {/* Ears */}
          <circle cx="-8.5" cy="-4" r="2.5" fill="#fcd34d" />
          <circle cx="8.5" cy="-4" r="2.5" fill="#fcd34d" />
          {/* Expressive Cartoon Eyes */}
          <ellipse cx="-3" cy="-5" rx="1.5" ry="2" fill="#0f172a" />
          <circle cx="-2.5" cy="-5.5" r="0.6" fill="#ffffff" />
          <ellipse cx="3" cy="-5" rx="1.5" ry="2" fill="#0f172a" />
          <circle cx="3.5" cy="-5.5" r="0.6" fill="#ffffff" />
          {/* Determined Eyebrows */}
          <path d="M -5.5,-8 Q -3,-9.5 -1,-8" fill="none" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 1,-8 Q 3,-9.5 5.5,-8" fill="none" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
          {/* Classic Builder Mustache & Big Smile */}
          <path d="M -5,-1.5 Q 0,-4 5,-1.5 Q 2.5,2.5 -5,-1.5 Z" fill="#78350f" />
          <path d="M -2,0 Q 0,2.5 2,0" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />

          {/* Yellow Hardhat / Builder Helmet */}
          <path d="M -10,-6 Q 0,-18 10,-6 L 11,-4 Q 0,-5.5 -11,-4 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
          {/* Curved Helmet Brim */}
          <ellipse cx="0" cy="-4" rx="11" ry="2.8" fill="#facc15" />
          {/* Helmet Crest / Front Badge */}
          <rect x="-2.5" y="-14" width="5" height="5" rx="1.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        </g>

        {/* Right Arm Holding Heavy Mallet / Sledgehammer */}
        <g transform="translate(9, -5)">
          {/* Looping Clash-of-Clans Hammer Strike Animation */}
          <motion.g
            animate={{
              rotate: [0, -70, 26, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.75,
              times: [0, 0.45, 0.65, 0.82, 1],
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '0px 0px' }}
          >
            {/* Muscular Orange Sleeve */}
            <line x1="0" y1="0" x2="7" y2="9" stroke="#ea580c" strokeWidth="4.5" strokeLinecap="round" />
            {/* Leather Work Glove */}
            <circle cx="7" cy="9" r="3.2" fill="#d97706" />

            {/* Heavy Cast Steel Hammer */}
            <g transform="translate(7, 9)">
              {/* Ash Wood Handle */}
              <line x1="0" y1="0" x2="12" y2="-15" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
              {/* Double-Sided Heavy Steel Head */}
              <g transform="translate(12, -15) rotate(40)">
                <rect x="-5" y="-10" width="10" height="20" rx="2.5" fill="#334155" stroke="#1e293b" strokeWidth="1.2" />
                <rect x="-6.5" y="-11.5" width="13" height="4" rx="1" fill="#64748b" />
                <rect x="-6.5" y="7.5" width="13" height="4" rx="1" fill="#64748b" />
                {/* Steel Edge Specular Highlight */}
                <line x1="-2.5" y1="-8" x2="-2.5" y2="8" stroke="#94a3b8" strokeWidth="1.2" />
              </g>
            </g>
          </motion.g>
        </g>
      </g>

      {/* Floating Clash of Clans Style Builder Speech / Status Bubble */}
      <motion.g
        animate={{ y: [-48, -53, -48] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        transform="translate(0, -48)"
      >
        <rect
          x="-44"
          y="-16"
          width="88"
          height="23"
          rx="11.5"
          fill="#0f172a"
          stroke="#f59e0b"
          strokeWidth="1.8"
          filter="url(#cityShadow)"
        />
        {/* Animated Bouncing Mini Tool */}
        <motion.g
          animate={{ rotate: [-25, 25, -25] }}
          transition={{ repeat: Infinity, duration: 0.55, ease: 'easeInOut' }}
          transform="translate(-28, -5)"
        >
          <text x="0" y="0" fontSize="11" textAnchor="middle">🔨</text>
        </motion.g>
        <text
          x="8"
          y="-1"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="900"
          fill="#fde047"
          fontFamily="sans-serif"
          letterSpacing="0.5"
        >
          {stage === 1 ? 'BASEWORK' : 'FRAMING'}
        </text>
        {/* Animated Progress Bar Fill */}
        <rect x="-35" y="3" width="70" height="2.5" rx="1.25" fill="#334155" />
        <motion.rect
          x="-35"
          y="3"
          height="2.5"
          rx="1.25"
          fill="#10b981"
          animate={{ width: stage === 1 ? [20, 38, 20] : [42, 66, 42] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        />
      </motion.g>
    </g>
  );
};

export const IsometricCity: React.FC<IsometricCityProps> = ({
  mode = 'interactive',
  constructionProgress = 60,
  buildings,
  selectedPlotId,
  onSelectPlot,
  className = '',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lockedCloudMessage, setLockedCloudMessage] = useState<string | null>(null);

  // Resolve buildings list depending on mode if not explicitly passed or empty
  let displayBuildings: BuildingPlot[] = buildings && buildings.length > 0 ? buildings : INITIAL_BUILDINGS;

  if (mode === 'constructing') {
    displayBuildings = displayBuildings.map((b) =>
      b.id === 'plot-1' ? { ...b, stage: 2, status: 'built' as const, buildingStyle: 'cottage' } : b
    );
  } else if (mode === 'built-single') {
    displayBuildings = displayBuildings.map((b) =>
      b.id === 'plot-1' ? { ...b, stage: 3, status: 'built' as const, name: 'Cozy Twilight Cottage', buildingStyle: 'cottage' } : b
    );
  } else if (mode === 'empty') {
    displayBuildings = displayBuildings.map((b) => ({ ...b, stage: 0 }));
  }

  // Zone unlock calculation:
  // Zone 1: Always unlocked
  // Zone 2: Unlocked when all Zone 1 plots (plot-1, plot-2, plot-3) are stage 3
  // Zone 3: Unlocked when all Zone 2 plots (plot-4, plot-5, plot-6) are stage 3
  // Zone 4: Unlocked when all Zone 3 plots (plot-7, plot-8, plot-9) are stage 3
  const isZone1Complete = displayBuildings
    .filter((b) => (b.zoneId ?? 1) === 1)
    .every((b) => (b.stage ?? 0) === 3);

  const isZone2Complete = displayBuildings
    .filter((b) => (b.zoneId ?? 1) === 2)
    .every((b) => (b.stage ?? 0) === 3);

  const isZone3Complete = displayBuildings
    .filter((b) => (b.zoneId ?? 1) === 3)
    .every((b) => (b.stage ?? 0) === 3);

  const isZoneUnlocked = (zoneId: number = 1): boolean => {
    if (zoneId === 1) return true;
    if (zoneId === 2) return isZone1Complete;
    if (zoneId === 3) return isZone1Complete && isZone2Complete;
    if (zoneId === 4) return isZone1Complete && isZone2Complete && isZone3Complete;
    return true;
  };

  const getZoneStats = (zoneId: number) => {
    const zonePlots = displayBuildings.filter((b) => (b.zoneId ?? 1) === zoneId);
    const completedCount = zonePlots.filter((b) => (b.stage ?? 0) === 3).length;
    const total = zonePlots.length || 3;
    return { completedCount, total, isComplete: completedCount === total && total > 0 };
  };

  const zone1Stats = getZoneStats(1);
  const zone2Stats = getZoneStats(2);
  const zone3Stats = getZoneStats(3);
  const zone4Stats = getZoneStats(4);

  // Conversion for grid coordinates (gx, gy) to isometric coords on expanded canvas
  const getIsoCoords = (gx: number, gy: number) => {
    return {
      x: 700 + (gx - gy) * 165,
      y: 280 + (gx + gy) * 85,
    };
  };

  const handlePlotClick = (b: BuildingPlot, e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();

    const zId = b.zoneId ?? 1;
    if (!isZoneUnlocked(zId)) {
      const prevZoneName =
        zId === 2 ? 'Green Valley' : zId === 3 ? 'Riverside Marketplace' : 'Solar Highlands';
      const prevStats = zId === 2 ? zone1Stats : zId === 3 ? zone2Stats : zone3Stats;
      setLockedCloudMessage(
        `☁️ ${b.zoneName || `Zone ${zId}`} is hidden in the clouds! Complete all buildings in ${prevZoneName} (${prevStats.completedCount}/${prevStats.total} built) to clear the cloud.`
      );
      setTimeout(() => setLockedCloudMessage(null), 4500);
      return;
    }

    onSelectPlot?.(b);
  };

  return (
    <div
      className={`relative w-full h-full min-h-[360px] overflow-hidden select-none touch-none ${className}`}
      ref={containerRef}
    >
      {/* Background Sky & Twilight Lighting Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#111827] to-[#0a101d] pointer-events-none" />

      {/* Starry Twinkles */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Floating Cloud Alert Notification */}
      <AnimatePresence>
        {lockedCloudMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-40 max-w-md w-[90%] bg-stone-900/95 backdrop-blur-md border border-amber-500/40 text-amber-200 text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2"
          >
            <span className="text-lg">☁️</span>
            <div className="flex-1 font-medium leading-relaxed">{lockedCloudMessage}</div>
            <button
              onClick={() => setLockedCloudMessage(null)}
              className="text-stone-400 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* District Zone Progress Badge (Top Overlay) */}
      <div className="absolute top-3 left-3 z-30 flex flex-wrap gap-1.5 pointer-events-none max-w-[95%]">
        {[
          { id: 1, name: 'Green Valley', stats: zone1Stats, unlocked: true },
          { id: 2, name: 'Riverside Market', stats: zone2Stats, unlocked: isZoneUnlocked(2) },
          { id: 3, name: 'Solar Highlands', stats: zone3Stats, unlocked: isZoneUnlocked(3) },
          { id: 4, name: 'Cyber Metropolis', stats: zone4Stats, unlocked: isZoneUnlocked(4) },
        ].map((zn) => (
          <div
            key={zn.id}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight border backdrop-blur-md flex items-center gap-1.5 ${
              zn.stats.isComplete
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : zn.unlocked
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-200'
                : 'bg-stone-900/80 border-stone-800 text-stone-500'
            }`}
          >
            <span>{zn.stats.isComplete ? '⭐' : zn.unlocked ? '🏗️' : '☁️'}</span>
            <span>{zn.name}</span>
            <span className="font-mono opacity-80">
              ({zn.stats.completedCount}/{zn.stats.total})
            </span>
          </div>
        ))}
      </div>

      <motion.div
        drag={interactive}
        dragConstraints={containerRef}
        dragElastic={0.15}
        whileTap={interactive ? { cursor: 'grabbing' } : {}}
        className="w-[200%] h-[200%] absolute origin-center cursor-grab"
        style={{ left: '-50%', top: '-50%' }}
      >
        {/* Isometric SVG Canvas */}
        <svg
          viewBox="0 0 1400 960"
          className="w-full h-full object-cover transition-transform duration-700"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Terrain Gradients */}
            <linearGradient id="grassTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a2f" />
              <stop offset="50%" stopColor="#14532d" />
              <stop offset="100%" stopColor="#0f3d24" />
            </linearGradient>
            <linearGradient id="grassHighland" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#164e63" />
              <stop offset="50%" stopColor="#0e7490" />
              <stop offset="100%" stopColor="#155e75" />
            </linearGradient>
            <linearGradient id="grassCyber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="grassDark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f291e" />
              <stop offset="100%" stopColor="#091812" />
            </linearGradient>
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>
            <linearGradient id="asphaltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Cloud & Mist Gradients */}
            <linearGradient id="cloudGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#e2e8f0" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="cloudGradPuffy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.92" />
              <stop offset="50%" stopColor="#e0e7ff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.7" />
            </linearGradient>
            <radialGradient id="cloudCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#e2e8f0" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
            </radialGradient>

            {/* Cottage Reference Gradients */}
            <linearGradient id="cottageRoof" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#292524" />
              <stop offset="50%" stopColor="#1c1917" />
              <stop offset="100%" stopColor="#0c0a09" />
            </linearGradient>
            <linearGradient id="cottageRidge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a16207" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="cottageWallFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdfbf7" />
              <stop offset="100%" stopColor="#f3eee3" />
            </linearGradient>
            <linearGradient id="cottageWallSide" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e7dfd5" />
              <stop offset="100%" stopColor="#d6ccc2" />
            </linearGradient>
            <linearGradient id="cottageBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>
            <linearGradient id="warmWindowLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <radialGradient id="lampGroundSplash" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cyberGroundSplash" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#818cf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>

            {/* Architecture & Reference Gradients */}
            <linearGradient id="modernGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="60%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <linearGradient id="modernWhite" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="solarTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="60%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#115e59" />
            </linearGradient>
            <linearGradient id="brickTerracotta" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>
            <linearGradient id="cyberNeon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>

            {/* Bank Gradients (from Bank Png.jpg) */}
            <linearGradient id="bankMarble" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="bankColumn" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="40%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="bankGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="bankGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Gas Station Gradients (from download (8).jpg) */}
            <linearGradient id="gasCanopyYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="gasMartGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.75" />
            </linearGradient>

            {/* Police HQ Gradients (from download (7).jpg) */}
            <linearGradient id="policeNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="policeBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            {/* Bookstore & Cafe Gradients (from TechPotato.jpg) */}
            <linearGradient id="bookstoreCharcoal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="bookstoreAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Cyber Ramen Gradients (from download (6).jpg) */}
            <linearGradient id="ramenWood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <linearGradient id="vendingRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>

            {/* Burger Bistro Gradients (from download (5).jpg) */}
            <linearGradient id="burgerWoodSlats" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="burgerArchGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Nordic Studio Loft (from _Urban Architecture Presentation Templates_.jpg) */}
            <linearGradient id="loftPitchRoof" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Infinity Pool Villa (from 3D house from a blender.jpg & Home with swimming pool) */}
            <linearGradient id="villaPoolWater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <linearGradient id="villaTeak" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Shadows and Glows */}
            <filter id="cityShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="-8" dy="14" stdDeviation="6" floodColor="#020617" floodOpacity="0.75" />
            </filter>
            <filter id="warmGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="lampGlowFilter" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="cloudSoftShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* ============================================================= */}
          {/* 1. BACKGROUND MOUNTAINS & HORIZON SILHOUETTE                  */}
          {/* ============================================================= */}
          <path d="M0 320 Q300 160 700 280 T1400 260 L1400 960 L0 960 Z" fill="#0f172a" opacity="0.65" />
          <path d="M0 380 Q450 240 850 340 T1400 320 L1400 960 L0 960 Z" fill="#091e17" opacity="0.85" />

          {/* ============================================================= */}
          {/* 2. ANIMATED FLYING BIRDS IN TWILIGHT SKY                      */}
          {/* ============================================================= */}
          {/* Flock 1: High soaring gliders traversing sky */}
          <motion.g
            animate={{
              x: [-120, 1500],
              y: [120, 190],
            }}
            transition={{
              repeat: Infinity,
              duration: 26,
              ease: 'linear',
            }}
          >
            {/* Bird 1 */}
            <g transform="translate(0, 0) scale(0.8)">
              <motion.path
                d="M -15,-6 Q -7,-18 0,-4 Q 7,-18 15,-6 Q 8,-12 0,-3 Q -8,-12 -15,-6 Z"
                fill="#f8fafc"
                opacity="0.85"
                animate={{ scaleY: [1, 0.35, 1] }}
                transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
              />
            </g>
            {/* Bird 2 */}
            <g transform="translate(32, -18) scale(0.65)">
              <motion.path
                d="M -15,-6 Q -7,-18 0,-4 Q 7,-18 15,-6 Q 8,-12 0,-3 Q -8,-12 -15,-6 Z"
                fill="#f8fafc"
                opacity="0.8"
                animate={{ scaleY: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.65, delay: 0.15, ease: 'easeInOut' }}
              />
            </g>
            {/* Bird 3 */}
            <g transform="translate(24, 22) scale(0.7)">
              <motion.path
                d="M -15,-6 Q -7,-18 0,-4 Q 7,-18 15,-6 Q 8,-12 0,-3 Q -8,-12 -15,-6 Z"
                fill="#f8fafc"
                opacity="0.75"
                animate={{ scaleY: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.75, delay: 0.3, ease: 'easeInOut' }}
              />
            </g>
          </motion.g>

          {/* Flock 2: River swoop birds */}
          <motion.g
            animate={{
              x: [1500, -150],
              y: [280, 240],
            }}
            transition={{
              repeat: Infinity,
              duration: 32,
              delay: 8,
              ease: 'linear',
            }}
          >
            <g transform="translate(0, 0) scale(0.75)">
              <motion.path
                d="M -15,-6 Q -7,-18 0,-4 Q 7,-18 15,-6 Q 8,-12 0,-3 Q -8,-12 -15,-6 Z"
                fill="#e2e8f0"
                opacity="0.8"
                animate={{ scaleY: [1, 0.35, 1] }}
                transition={{ repeat: Infinity, duration: 0.68, ease: 'easeInOut' }}
              />
            </g>
            <g transform="translate(-28, 14) scale(0.6)">
              <motion.path
                d="M -15,-6 Q -7,-18 0,-4 Q 7,-18 15,-6 Q 8,-12 0,-3 Q -8,-12 -15,-6 Z"
                fill="#cbd5e1"
                opacity="0.7"
                animate={{ scaleY: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.62, delay: 0.2, ease: 'easeInOut' }}
              />
            </g>
          </motion.g>

          {/* ============================================================= */}
          {/* 3. EXPANDED ISOMETRIC TERRAIN ISLANDS                         */}
          {/* ============================================================= */}
          {/* Main Giant Green Landmass */}
          <polygon points="700,160 1320,480 700,800 80,480" fill="url(#grassTop)" />

          {/* Island Rock Cliffface Depth */}
          <polygon points="80,480 700,800 700,850 80,530" fill="url(#grassDark)" />
          <polygon points="700,800 1320,480 1320,530 700,850" fill="#05100b" />

          {/* Zone 3 & 4 Mountain Ridge Elevated Terrace */}
          <polygon points="370,440 680,600 370,760 60,600" fill="url(#grassHighland)" opacity="0.45" />

          {/* ============================================================= */}
          {/* 4. EXPANDED WINDING BLUE RIVER & WATER SHIMMERS               */}
          {/* ============================================================= */}
          <path
            d="M 80,480 C 260,420, 360,540, 520,560 C 640,575, 680,720, 700,800 L 650,800 C 620,720, 590,580, 480,550 C 320,510, 220,430, 80,480 Z"
            fill="url(#riverGrad)"
            opacity="0.88"
          />

          {/* Secondary River Branch towards coastal market */}
          <path
            d="M 520,560 C 680,540, 840,620, 1020,590 L 1050,610 C 860,650, 690,560, 520,560 Z"
            fill="url(#riverGrad)"
            opacity="0.8"
          />

          {/* Water Ripples / Shimmer Reflections */}
          <path d="M 220,465 Q 280,485 340,490" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
          <path d="M 420,545 Q 480,575 540,620" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <path d="M 720,580 Q 790,610 860,605" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

          {/* ============================================================= */}
          {/* 5. ARTERIAL ASPHALT ROADS, COBBLESTONE PATHS & BRIDGES        */}
          {/* ============================================================= */}
          {/* Grand Central Ring Highway */}
          <g>
            {/* Road Bed */}
            <path
              d="M 700,280 L 1030,450 L 700,620 L 370,450 Z"
              stroke="#1e293b"
              strokeWidth="28"
              fill="none"
              strokeLinejoin="round"
              opacity="0.8"
            />
            <path
              d="M 700,280 L 1030,450 L 700,620 L 370,450 Z"
              stroke="url(#asphaltGrad)"
              strokeWidth="24"
              fill="none"
              strokeLinejoin="round"
            />
            {/* Yellow Center Dashed Line */}
            <path
              d="M 700,280 L 1030,450 L 700,620 L 370,450 Z"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="10,12"
              fill="none"
              strokeLinejoin="round"
              opacity="0.8"
            />
          </g>

          {/* Secondary Arterials to Zone 3 and Zone 4 */}
          <g>
            <path
              d="M 370,450 L 205,535 L 535,705 L 700,620"
              stroke="url(#asphaltGrad)"
              strokeWidth="22"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M 370,450 L 205,535 L 535,705 L 700,620"
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="8,10"
              fill="none"
              strokeLinejoin="round"
              opacity="0.75"
            />
          </g>

          {/* Crosswalk Zebra Stripes */}
          <g stroke="#ffffff" strokeWidth="3" opacity="0.8" strokeLinecap="round">
            <line x1="685" y1="280" x2="695" y2="285" />
            <line x1="695" y1="275" x2="705" y2="280" />
            <line x1="705" y1="270" x2="715" y2="275" />

            <line x1="1015" y1="445" x2="1025" y2="450" />
            <line x1="1025" y1="440" x2="1035" y2="445" />

            <line x1="685" y1="620" x2="695" y2="625" />
            <line x1="695" y1="615" x2="705" y2="620" />
          </g>

          {/* Cobblestone paths to plots */}
          <path d="M 700,280 L 865,365 L 700,450 L 535,365 Z" stroke="#475569" strokeWidth="12" fill="none" opacity="0.7" />
          <path d="M 865,365 L 1030,450 L 865,535 L 700,450 Z" stroke="#475569" strokeWidth="12" fill="none" opacity="0.7" />
          <path d="M 535,365 L 700,450 L 535,535 L 370,450 Z" stroke="#475569" strokeWidth="12" fill="none" opacity="0.7" />

          {/* Ornate Stone Bridge Crossing River */}
          <g id="main-bridge" transform="translate(480, 520)">
            <polygon points="-30,-12 30,18 45,10 -15,-20" fill="#64748b" />
            <polygon points="-30,-12 30,18 30,28 -30,-2" fill="#475569" />
            <polygon points="30,18 45,10 45,20 30,28" fill="#334155" />
            {/* Bridge Stone Railing Posts */}
            <rect x="-28" y="-22" width="6" height="12" fill="#94a3b8" rx="1" />
            <rect x="0" y="-8" width="6" height="12" fill="#94a3b8" rx="1" />
            <rect x="28" y="6" width="6" height="12" fill="#94a3b8" rx="1" />
            <line x1="-25" y1="-18" x2="31" y2="10" stroke="#cbd5e1" strokeWidth="2.5" />
          </g>

          {/* ============================================================= */}
          {/* 6. STREET LAMPS / LIGHTS WITH GLOWING HALOS                   */}
          {/* ============================================================= */}
          {[
            { x: 670, y: 260 },
            { x: 890, y: 350 },
            { x: 510, y: 350 },
            { x: 1050, y: 430 },
            { x: 885, y: 520 },
            { x: 680, y: 600 },
            { x: 350, y: 430 },
            { x: 515, y: 520 },
            { x: 185, y: 520 },
            { x: 515, y: 690 },
            { x: 350, y: 615 },
          ].map((lamp, idx) => (
            <g key={`lamp-${idx}`} transform={`translate(${lamp.x}, ${lamp.y})`}>
              {/* Ground Splash Light */}
              <ellipse cx="0" cy="10" rx="34" ry="18" fill="url(#lampGroundSplash)" opacity="0.85" />
              {/* Lamp Post Pillar */}
              <line x1="0" y1="10" x2="0" y2="-22" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
              {/* Curved Bracket Head */}
              <path d="M 0,-20 Q 6,-26 8,-20" stroke="#1c1917" strokeWidth="2" fill="none" />
              {/* Glowing Warm Lantern Head */}
              <circle cx="8" cy="-18" r="4.5" fill="#fef08a" filter="url(#lampGlowFilter)" />
              <circle cx="8" cy="-18" r="2.5" fill="#ffffff" />
            </g>
          ))}

          {/* ============================================================= */}
          {/* 7. VEGETATION: TREES & BUSHES SCATTERED ACROSS MAP            */}
          {/* ============================================================= */}
          {/* Lush Green Oak Trees */}
          {[
            { x: 630, y: 240, scale: 1 },
            { x: 770, y: 240, scale: 1.1 },
            { x: 940, y: 320, scale: 0.9 },
            { x: 460, y: 320, scale: 1.05 },
            { x: 810, y: 410, scale: 0.95 },
            { x: 590, y: 410, scale: 1 },
            { x: 1110, y: 410, scale: 1.15 },
            { x: 290, y: 410, scale: 1 },
            { x: 760, y: 660, scale: 1.2 },
            { x: 260, y: 630, scale: 0.95 },
          ].map((tree, idx) => (
            <motion.g
              key={`oak-tree-${idx}`}
              transform={`translate(${tree.x}, ${tree.y}) scale(${tree.scale})`}
              animate={{ rotate: [-0.8, 0.8, -0.8] }}
              transition={{ repeat: Infinity, duration: 4 + (idx % 3), ease: 'easeInOut' }}
              style={{ transformOrigin: '0px 10px' }}
            >
              {/* Tree Base Shadow */}
              <ellipse cx="0" cy="8" rx="14" ry="7" fill="#022c22" opacity="0.6" />
              {/* Trunk */}
              <rect x="-3" y="-5" width="6" height="14" fill="#78350f" rx="1" />
              {/* Foliage Layers */}
              <ellipse cx="0" cy="-18" rx="18" ry="16" fill="#14532d" />
              <ellipse cx="-4" cy="-22" rx="15" ry="13" fill="#15803d" />
              <ellipse cx="3" cy="-25" rx="12" ry="10" fill="#22c55e" />
              <ellipse cx="0" cy="-29" rx="8" ry="7" fill="#4ade80" opacity="0.8" />
            </motion.g>
          ))}

          {/* Tall Pine / Evergreen Trees */}
          {[
            { x: 390, y: 280, scale: 1 },
            { x: 1010, y: 280, scale: 1.1 },
            { x: 1210, y: 460, scale: 1.2 },
            { x: 180, y: 460, scale: 1.1 },
            { x: 440, y: 720, scale: 1.15 },
            { x: 620, y: 730, scale: 1.2 },
          ].map((pine, idx) => (
            <g key={`pine-${idx}`} transform={`translate(${pine.x}, ${pine.y}) scale(${pine.scale})`}>
              <ellipse cx="0" cy="6" rx="12" ry="6" fill="#022c22" opacity="0.5" />
              <rect x="-2.5" y="-4" width="5" height="10" fill="#451a03" rx="1" />
              <polygon points="0,-42 -14,-14 14,-14" fill="#064e3b" />
              <polygon points="0,-32 -16,-6 16,-6" fill="#047857" />
              <polygon points="0,-22 -18,2 18,2" fill="#059669" />
            </g>
          ))}

          {/* Flowering Cherry Blossom Trees */}
          {[
            { x: 570, y: 270, scale: 0.95 },
            { x: 830, y: 270, scale: 1 },
          ].map((sakura, idx) => (
            <g key={`sakura-${idx}`} transform={`translate(${sakura.x}, ${sakura.y}) scale(${sakura.scale})`}>
              <ellipse cx="0" cy="6" rx="12" ry="6" fill="#500724" opacity="0.4" />
              <rect x="-2.5" y="-5" width="5" height="12" fill="#581c87" rx="1" />
              <ellipse cx="0" cy="-16" rx="16" ry="14" fill="#db2777" />
              <ellipse cx="-3" cy="-20" rx="14" ry="12" fill="#ec4899" />
              <ellipse cx="2" cy="-23" rx="11" ry="9" fill="#f472b6" />
              <ellipse cx="0" cy="-26" rx="7" ry="6" fill="#fbcfe8" />
            </g>
          ))}

          {/* Flowering Bushes along paths */}
          {[
            { x: 645, y: 310, flower: '#f43f5e' },
            { x: 755, y: 310, flower: '#eab308' },
            { x: 815, y: 395, flower: '#a855f7' },
            { x: 585, y: 395, flower: '#38bdf8' },
            { x: 975, y: 480, flower: '#ec4899' },
            { x: 425, y: 480, flower: '#f97316' },
            { x: 755, y: 570, flower: '#eab308' },
            { x: 645, y: 570, flower: '#f43f5e' },
          ].map((bush, idx) => (
            <g key={`bush-${idx}`} transform={`translate(${bush.x}, ${bush.y})`}>
              <ellipse cx="0" cy="0" rx="10" ry="7" fill="#14532d" />
              <ellipse cx="-2" cy="-3" rx="8" ry="6" fill="#16a34a" />
              <ellipse cx="2" cy="-4" rx="7" ry="5" fill="#22c55e" />
              {/* Little Blossom Specks */}
              <circle cx="-3" cy="-3" r="1.5" fill={bush.flower} />
              <circle cx="3" cy="-5" r="1.5" fill={bush.flower} />
              <circle cx="1" cy="-2" r="1.5" fill={bush.flower} />
            </g>
          ))}

          {/* ============================================================= */}
          {/* 8. DYNAMIC PLOTS & BUILDINGS                                  */}
          {/* ============================================================= */}
          {displayBuildings.map((b, index) => {
            const { x, y } = getIsoCoords(b.x, b.y);
            const isSelected = selectedPlotId === b.id;
            const stage = b.stage ?? 0;
            const style =
              b.buildingStyle ||
              (b.id === 'plot-1'
                ? 'cottage'
                : b.id === 'plot-2'
                ? 'bakery'
                : b.id === 'plot-3'
                ? 'cottage'
                : b.id === 'plot-4'
                ? 'modern'
                : b.id === 'plot-5'
                ? 'bakery'
                : b.id === 'plot-6'
                ? 'modern'
                : b.id === 'plot-7'
                ? 'solar'
                : b.id === 'plot-8'
                ? 'solar'
                : b.id === 'plot-9'
                ? 'townhall'
                : b.id === 'plot-10'
                ? 'cyber'
                : b.id === 'plot-11'
                ? 'cyber'
                : 'townhall');

            const zId = b.zoneId ?? 1;
            const zoneUnlocked = isZoneUnlocked(zId);

            return (
              <g
                key={b.id}
                transform={`translate(${x}, ${y})`}
                onClick={(e) => handlePlotClick(b, e)}
                className={interactive ? 'cursor-pointer' : ''}
              >
                <motion.g
                  key={`${b.id}-${stage}-${style}`}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', bounce: 0.45, duration: 0.55 }}
                >
                  {/* ========================================================== */}
                  {/* STAGE 0: AVAILABLE PLOT (Signpost & Boundary Lines)        */}
                  {/* ========================================================== */}
                  {stage === 0 && (
                    <g>
                      <polygon
                        points="0,-45 80,-5 0,35 -80,-5"
                        fill={isSelected ? '#10b981' : zoneUnlocked ? '#fde047' : '#94a3b8'}
                        fillOpacity={isSelected ? 0.25 : 0.08}
                        stroke={isSelected ? '#10b981' : zoneUnlocked ? '#eab308' : '#64748b'}
                        strokeWidth={isSelected ? 3 : 2}
                        strokeDasharray={isSelected ? 'none' : '5,4'}
                      />

                      {/* Corner Wooden Stakes */}
                      <g fill="#92400e">
                        <rect x="-76" y="-12" width="5" height="14" rx="1" />
                        <rect x="71" y="-12" width="5" height="14" rx="1" />
                        <rect x="-2.5" y="-52" width="5" height="14" rx="1" />
                        <rect x="-2.5" y="28" width="5" height="14" rx="1" />
                      </g>

                      {/* Wooden Signpost: Clearly reading Available Plot */}
                      <g transform="translate(0, -6)">
                        <rect x="-2" y="0" width="4" height="24" fill="#78350f" />
                        <rect
                          x="-46"
                          y="-20"
                          width="92"
                          height="20"
                          rx="5"
                          fill={zoneUnlocked ? '#fef3c7' : '#e2e8f0'}
                          stroke={zoneUnlocked ? '#b45309' : '#64748b'}
                          strokeWidth="1.5"
                          filter="url(#cityShadow)"
                        />
                        <text
                          x="0"
                          y="-7"
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill={zoneUnlocked ? '#78350f' : '#475569'}
                          fontFamily="sans-serif"
                        >
                          {zoneUnlocked ? 'Plot Available' : '🔒 Locked Zone'}
                        </text>
                      </g>

                      {/* Floating 'Tap to Build' hint on selected */}
                      {isSelected && (
                        <g transform="translate(0, -42)">
                          <rect x="-38" y="-14" width="76" height="18" rx="9" fill="#10b981" filter="url(#glowGreen)" />
                          <text x="0" y="-2" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">
                            🔨 Tap to Build
                          </text>
                        </g>
                      )}
                    </g>
                  )}

                  {/* ========================================================== */}
                  {/* STAGE 1: FOUNDATION & BASEWORK (WITH CLASH BUILDER)        */}
                  {/* ========================================================== */}
                  {stage === 1 && (
                    <g filter="url(#cityShadow)">
                      <polygon points="0,-45 80,-5 0,35 -80,-5" fill="#475569" />
                      <polygon points="-80,-5 0,35 0,45 -80,5" fill="#334155" />
                      <polygon points="0,35 80,-5 80,5 0,45" fill="#1e293b" />
                      {/* Concrete Foundation Grid & Markings */}
                      <line x1="-50" y1="-20" x2="30" y2="20" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5,4" />
                      <line x1="-30" y1="20" x2="50" y2="-20" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5,4" />
                      
                      {/* Corner Concrete Pillars & Rebar Ties */}
                      <rect x="-42" y="-30" width="8" height="26" fill="#d97706" rx="1.5" />
                      <rect x="32" y="-30" width="8" height="26" fill="#d97706" rx="1.5" />
                      <rect x="-4" y="8" width="8" height="26" fill="#d97706" rx="1.5" />
                      <rect x="-4" y="-60" width="8" height="26" fill="#d97706" rx="1.5" />
                      
                      {/* Material Pallets on site */}
                      <rect x="22" y="4" width="18" height="14" fill="#ea580c" rx="2" />
                      <line x1="22" y1="11" x2="40" y2="11" stroke="#fed7aa" strokeWidth="1.5" />
                      <line x1="31" y1="4" x2="31" y2="18" stroke="#fed7aa" strokeWidth="1.5" />

                      {/* Animated Clash of Clans Builder */}
                      <ClashOfClansBuilder x={-10} y={-10} stage={1} scale={0.92} />
                    </g>
                  )}

                  {/* ========================================================== */}
                  {/* STAGE 2: TIMBER FRAMEWORK & CLASH OF CLANS BUILDER        */}
                  {/* ========================================================== */}
                  {stage === 2 && (
                    <g filter="url(#cityShadow)">
                      <polygon points="0,-45 80,-5 0,35 -80,-5" fill="#64748b" stroke="#475569" strokeWidth="1.5" />
                      <polygon points="-80,-5 0,35 0,45 -80,5" fill="#475569" />
                      <polygon points="0,35 80,-5 80,5 0,45" fill="#334155" />

                      {/* Scaffolding Beams & Framework */}
                      <g stroke="#d97706" strokeWidth="3.5" strokeLinecap="round">
                        <line x1="-48" y1="10" x2="-48" y2="-68" />
                        <line x1="0" y1="30" x2="0" y2="-48" />
                        <line x1="48" y1="10" x2="48" y2="-68" />
                        <line x1="0" y1="-25" x2="0" y2="-98" />
                        <line x1="-48" y1="-25" x2="0" y2="-5" stroke="#b45309" strokeWidth="2.5" />
                        <line x1="0" y1="-5" x2="48" y2="-25" stroke="#b45309" strokeWidth="2.5" />
                        <line x1="-48" y1="-55" x2="0" y2="-35" stroke="#b45309" strokeWidth="2.5" />
                        <line x1="0" y1="-35" x2="48" y2="-55" stroke="#b45309" strokeWidth="2.5" />
                      </g>

                      {/* Animated Clash of Clans Builder */}
                      <ClashOfClansBuilder x={0} y={-5} stage={2} scale={1.05} />
                    </g>
                  )}

                  {/* ========================================================== */}
                  {/* STAGE 3: FULLY COMPLETED ARCHITECTURAL MASTERPIECE         */}
                  {/* ========================================================== */}
                  {stage === 3 && (
                    <g filter="url(#cityShadow)">
                      {/* STYLE 1: COZY TWILIGHT COTTAGE */}
                      {style === 'cottage' && (
                        <g>
                          <polygon points="-75,-15 5,-50 85,-15 5,20" fill="#1e1b2e" />
                          <polygon points="-75,-15 -25,5 30,-15 -20,-35" fill="url(#asphaltGrad)" />
                          <line x1="-50" y1="-5" x2="5" y2="-25" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,4" />
                          <ellipse cx="-52" cy="-6" rx="22" ry="12" fill="url(#lampGroundSplash)" opacity="0.85" />

                          {/* Wooden Fence Rails */}
                          <g stroke="#92400e" strokeWidth="3" strokeLinecap="round">
                            <line x1="28" y1="-4" x2="72" y2="-22" />
                            <line x1="28" y1="4" x2="72" y2="-14" />
                            <line x1="32" y1="10" x2="32" y2="-8" strokeWidth="4" stroke="#78350f" />
                            <line x1="52" y1="1" x2="52" y2="-17" strokeWidth="4" stroke="#78350f" />
                            <line x1="70" y1="-8" x2="70" y2="-26" strokeWidth="4" stroke="#78350f" />
                          </g>

                          {/* Green Bush */}
                          <g transform="translate(42, -5)">
                            <ellipse cx="0" cy="0" rx="8" ry="6" fill="#14532d" />
                            <ellipse cx="-3" cy="-3" rx="7" ry="6" fill="#15803d" />
                            <ellipse cx="2" cy="-4" rx="6" ry="5" fill="#22c55e" />
                          </g>

                          {/* House Foundation */}
                          <polygon points="-42,-22 8,-2 48,-18 -2,-38" fill="url(#cottageBase)" />
                          <polygon points="-42,-22 8,-2 8,6 -42,-14" fill="#09090b" />
                          <polygon points="8,-2 48,-18 48,-10 8,6" fill="#18181b" />

                          {/* House Walls */}
                          <polygon points="-42,-22 8,-2 8,-48 -42,-68" fill="url(#cottageWallSide)" />
                          <polygon points="8,-2 48,-18 48,-64 8,-48" fill="url(#cottageWallFront)" />
                          <polygon points="8,-48 48,-64 28,-90" fill="url(#cottageWallFront)" />

                          {/* Glowing Windows */}
                          <g filter="url(#warmGlow)">
                            <polygon points="-32,-38 -18,-32 -18,-52 -32,-58" fill="url(#warmWindowLight)" />
                            <polygon points="-32,-38 -18,-32 -18,-52 -32,-58" stroke="#78350f" strokeWidth="1.5" fill="none" />
                            <polygon points="-12,-30 2,-24 2,-44 -12,-50" fill="url(#warmWindowLight)" />
                            <polygon points="-12,-30 2,-24 2,-44 -12,-50" stroke="#78350f" strokeWidth="1.5" fill="none" />
                          </g>

                          {/* Front Door */}
                          <polygon points="18,-15 32,-21 32,-45 18,-39" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
                          <circle cx="21" cy="-28" r="1.5" fill="#fde047" />

                          {/* Attic Window */}
                          <circle cx="28" cy="-68" r="8" fill="url(#warmWindowLight)" stroke="#78350f" strokeWidth="1.5" filter="url(#warmGlow)" />
                          <line x1="20" y1="-68" x2="36" y2="-68" stroke="#78350f" strokeWidth="1" />
                          <line x1="28" y1="-76" x2="28" y2="-60" stroke="#78350f" strokeWidth="1" />

                          {/* Cottage Roof */}
                          <polygon points="-48,-68 8,-46 28,-92 -28,-114" fill="url(#cottageRoof)" />
                          <polygon points="8,-46 54,-64 28,-92" fill="#18181b" />
                          <polygon points="-30,-114 28,-92 28,-88 -30,-110" fill="url(#cottageRidge)" />

                          {/* Chimney */}
                          <polygon points="-22,-95 -12,-90 -12,-115 -22,-120" fill="#78350f" />
                          <polygon points="-12,-90 -4,-94 -4,-119 -12,-115" fill="#451a03" />
                          <polygon points="-22,-120 -12,-115 -4,-119 -14,-124" fill="#292524" />
                        </g>
                      )}

                      {/* STYLE 2: GRAND RESERVE BANK (from Bank Png.jpg) */}
                      {style === 'bank' && (
                        <g>
                          {/* Base Plaza & Paving */}
                          <polygon points="-75,-15 5,-50 85,-15 5,20" fill="#0f172a" />
                          <polygon points="-58,-12 5,14 68,-12 5,-38" fill="url(#bankMarble)" />

                          {/* Grand Tiered Marble Entrance Steps */}
                          <polygon points="-45,-4 5,18 55,-4 5,-26" fill="url(#bankMarble)" />
                          <polygon points="-45,-4 5,18 5,22 -45,0" fill="#94a3b8" />
                          <polygon points="5,18 55,-4 55,0 5,22" fill="#64748b" />
                          <polygon points="-38,-8 5,12 48,-8 5,-28" fill="#ffffff" />

                          {/* Main Bank Structure */}
                          <polygon points="-45,-25 5,-4 5,-65 -45,-86" fill="url(#bankMarble)" />
                          <polygon points="5,-4 55,-25 55,-86 5,-65" fill="#cbd5e1" />

                          {/* Fluted Neoclassical Columns (4 Columns) */}
                          <g fill="url(#bankColumn)" stroke="#64748b" strokeWidth="0.8">
                            {/* Col 1 */}
                            <polygon points="-38,-20 -33,-18 -33,-68 -38,-70" />
                            {/* Col 2 */}
                            <polygon points="-22,-13 -17,-11 -17,-61 -22,-63" />
                            {/* Col 3 */}
                            <polygon points="-6,-6 -1,-4 -1,-54 -6,-56" />
                            {/* Col 4 */}
                            <polygon points="10,0 15,2 15,-48 10,-50" />
                          </g>

                          {/* Grand Entrance Bronze Doors */}
                          <polygon points="-16,-10 -6,-6 -6,-38 -16,-42" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
                          <polygon points="-6,-6 4,-10 4,-42 -6,-38" fill="#92400e" stroke="#451a03" strokeWidth="1.2" />
                          <circle cx="-11" cy="-24" r="1.5" fill="#fde047" />
                          <circle cx="-1" cy="-24" r="1.5" fill="#fde047" />

                          {/* Classical Arch Pediment (Triangle Roof) */}
                          <polygon points="-52,-86 5,-62 5,-108" fill="url(#bankMarble)" stroke="#cbd5e1" strokeWidth="1" />
                          <polygon points="5,-62 62,-86 5,-108" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

                          {/* Golden $ BANK Marquee Plaque */}
                          <g transform="translate(-18, -80) rotate(14)">
                            <rect x="-8" y="-6" width="46" height="13" rx="2" fill="#0f172a" stroke="#ca8a04" strokeWidth="1.5" />
                            <text x="15" y="3.5" textAnchor="middle" fontSize="8" fontWeight="900" fill="url(#bankGold)" fontFamily="sans-serif">
                              $ BANK
                            </text>
                          </g>

                          {/* Twin Victorian Brass Street Lamps on Steps */}
                          <g transform="translate(-40, 2)">
                            <line x1="0" y1="0" x2="0" y2="-22" stroke="#475569" strokeWidth="2.5" />
                            <circle cx="0" cy="-22" r="4.5" fill="#fde047" filter="url(#warmGlow)" />
                          </g>
                          <g transform="translate(48, -2)">
                            <line x1="0" y1="0" x2="0" y2="-22" stroke="#475569" strokeWidth="2.5" />
                            <circle cx="0" cy="-22" r="4.5" fill="#fde047" filter="url(#warmGlow)" />
                          </g>
                        </g>
                      )}

                      {/* STYLE 3: SOLAR EV & FUEL PLAZA (from download (8).jpg) */}
                      {style === 'gas_station' && (
                        <g>
                          {/* Asphalt forecourt */}
                          <polygon points="-75,-15 5,-50 85,-15 5,20" fill="#1e293b" />
                          <line x1="-50" y1="-8" x2="10" y2="-34" stroke="#facc15" strokeWidth="2" strokeDasharray="6,4" />

                          {/* Convenience Mart Kiosk Building */}
                          <polygon points="10,-5 58,-25 58,-75 10,-55" fill="url(#brickTerracotta)" />
                          <polygon points="-10,-14 10,-5 10,-55 -10,-64" fill="#78350f" />
                          <polygon points="-12,-64 10,-53 60,-74 38,-85" fill="#0f172a" />
                          {/* Mart Glass Window with Orange Glowing Header */}
                          <polygon points="15,-18 52,-34 52,-60 15,-44" fill="url(#gasMartGlass)" stroke="#f59e0b" strokeWidth="1.2" />
                          <rect x="18" y="-62" width="30" height="6" fill="#f97316" rx="1" />
                          <text x="33" y="-58" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#ffffff">MART 24/7</text>

                          {/* Forecourt Fuel / EV Dispensers */}
                          <g transform="translate(-32, 2)">
                            {/* Pump Island Curb */}
                            <polygon points="-16,-6 0,1 16,-6 0,-13" fill="#cbd5e1" />
                            {/* EV Fast Charger Station */}
                            <rect x="-8" y="-28" width="16" height="22" rx="3" fill="#0f172a" stroke="#22c55e" strokeWidth="1.5" />
                            <circle cx="0" cy="-20" r="3.5" fill="#22c55e" filter="url(#glowGreen)" />
                            <text x="0" y="-19" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#ffffff">⚡</text>
                            {/* Cable Nozzle */}
                            <path d="M 6,-18 Q 12,-12 8,-7" fill="none" stroke="#22c55e" strokeWidth="1.8" />
                          </g>

                          {/* Massive Cantilevered Yellow Canopy Roof */}
                          <polygon points="-62,-48 8,-20 8,-26 -62,-54" fill="#ca8a04" />
                          <polygon points="8,-20 68,-44 68,-50 8,-26" fill="#a16207" />
                          <polygon points="-62,-54 8,-26 68,-50 -2,-78" fill="url(#gasCanopyYellow)" stroke="#ffffff" strokeWidth="1.5" />

                          {/* Canopy Support Steel Pillar */}
                          <line x1="4" y1="-2" x2="4" y2="-32" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
                          <line x1="-30" y1="-15" x2="-30" y2="-45" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                        </g>
                      )}

                      {/* STYLE 4: METRO POLICE & CIVIC HQ (from download (7).jpg) */}
                      {style === 'police' && (
                        <g>
                          <polygon points="-75,-15 5,-50 85,-15 5,20" fill="#090d16" />
                          {/* Main Civic Base */}
                          <polygon points="-48,-20 5,2 58,-20 5,-42" fill="#334155" />
                          
                          {/* Tier 1 Navy Building */}
                          <polygon points="-45,-20 5,2 5,-52 -45,-74" fill="url(#policeNavy)" />
                          <polygon points="5,2 55,-20 55,-74 5,-52" fill="#0f172a" />
                          <polygon points="-48,-74 5,-48 58,-74 5,-100" fill="#1e293b" />

                          {/* Blue Police Canopy & Illuminated Marquee */}
                          <polygon points="-28,-14 5,0 5,-10 -28,-24" fill="url(#policeBlueGrad)" />
                          <polygon points="5,0 38,-14 38,-24 5,-10" fill="#1e40af" />
                          <g transform="translate(5, -6)">
                            <text x="0" y="0" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#ffffff" letterSpacing="1.5">
                              POLICE
                            </text>
                          </g>

                          {/* Windows Grid */}
                          <g stroke="#38bdf8" strokeWidth="1" fill="#0284c7" opacity="0.85">
                            <polygon points="-38,-35 -18,-27 -18,-42 -38,-50" />
                            <polygon points="-12,-24 2,-18 2,-33 -12,-39" />
                            <polygon points="12,-18 32,-26 32,-41 12,-33" />
                            <polygon points="36,-28 50,-34 50,-49 36,-43" />
                          </g>

                          {/* Rooftop Watchtower with Flashing Blue & Red Siren */}
                          <g transform="translate(5, -78)">
                            <polygon points="-18,-8 0,0 18,-8 0,-16" fill="#475569" />
                            <rect x="-6" y="-18" width="12" height="12" fill="#1e293b" />
                            
                            {/* Flashing Siren Beacons */}
                            <motion.circle
                              cx="-4"
                              cy="-20"
                              r="3"
                              fill="#ef4444"
                              animate={{ opacity: [1, 0.2, 1], scale: [1, 1.3, 1] }}
                              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
                              filter="url(#warmGlow)"
                            />
                            <motion.circle
                              cx="4"
                              cy="-20"
                              r="3"
                              fill="#3b82f6"
                              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.3, 1] }}
                              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
                              filter="url(#warmGlow)"
                            />
                            {/* Radio Antenna Mast */}
                            <line x1="0" y1="-20" x2="0" y2="-38" stroke="#cbd5e1" strokeWidth="2" />
                            <circle cx="0" cy="-38" r="1.5" fill="#ef4444" />
                          </g>
                        </g>
                      )}

                      {/* STYLE 5: CORNER BOOKS & CAFE (from TechPotato.jpg) */}
                      {style === 'bookstore' && (
                        <g>
                          <polygon points="-75,-15 5,-50 85,-15 5,20" fill="#18181b" />

                          {/* Picket Garden Fence & Terrace Ground */}
                          <g stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
                            <line x1="-60" y1="-8" x2="-35" y2="2" />
                            <line x1="-60" y1="-14" x2="-35" y2="-4" />
                            <line x1="-58" y1="-5" x2="-58" y2="-18" />
                            <line x1="-48" y1="-1" x2="-48" y2="-14" />
                            <line x1="-38" y1="3" x2="-38" y2="-10" />
                          </g>

                          {/* Charcoal Store Building */}
                          <polygon points="-42,-18 5,3 5,-58 -42,-79" fill="url(#bookstoreCharcoal)" />
                          <polygon points="5,3 55,-18 55,-79 5,-58" fill="#0f172a" />
                          <polygon points="-45,-79 5,-55 58,-79 8,-103" fill="#334155" />

                          {/* Large Floor-to-Ceiling Bookshelf Window */}
                          <polygon points="-36,-26 -2,-10 -2,-48 -36,-64" fill="url(#warmWindowLight)" stroke="#451a03" strokeWidth="1.5" filter="url(#warmGlow)" />
                          {/* Bookshelf Racks Inside */}
                          <line x1="-30" y1="-44" x2="-8" y2="-34" stroke="#78350f" strokeWidth="2" />
                          <line x1="-30" y1="-32" x2="-8" y2="-22" stroke="#78350f" strokeWidth="2" />
                          <rect x="-24" y="-42" width="4" height="7" fill="#ef4444" />
                          <rect x="-18" y="-40" width="3" height="7" fill="#3b82f6" />
                          <rect x="-13" y="-38" width="4" height="7" fill="#10b981" />

                          {/* Warm Glowing "books store" Neon Script Marquee */}
                          <g transform="translate(10, -32) rotate(-14)">
                            <rect x="-4" y="-7" width="42" height="14" rx="3" fill="#020617" stroke="#f59e0b" strokeWidth="1.2" />
                            <text x="17" y="3" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="url(#bookstoreAmber)" fontFamily="sans-serif">
                              books store
                            </text>
                          </g>

                          {/* Rooftop Utility Terrace: Twin Water Tanks & HVAC */}
                          <g transform="translate(20, -78)">
                            {/* Water Tank 1 */}
                            <ellipse cx="-8" cy="-6" rx="6" ry="3" fill="#94a3b8" />
                            <rect x="-14" y="-18" width="12" height="12" fill="#cbd5e1" />
                            <ellipse cx="-8" cy="-18" rx="6" ry="3" fill="#f8fafc" />
                            {/* Water Tank 2 */}
                            <ellipse cx="6" cy="-12" rx="6" ry="3" fill="#94a3b8" />
                            <rect x="0" y="-24" width="12" height="12" fill="#cbd5e1" />
                            <ellipse cx="6" cy="-24" rx="6" ry="3" fill="#f8fafc" />
                          </g>
                        </g>
                      )}

                      {/* STYLE 6: CYBER RAMEN & VENDING STALL (from download (6).jpg) */}
                      {style === 'ramen_kiosk' && (
                        <g>
                          <polygon points="-75,-15 5,-50 85,-15 5,20" fill="#0f172a" />
                          <ellipse cx="0" cy="0" rx="35" ry="18" fill="#1e1b4b" opacity="0.8" />

                          {/* Main Wooden Ramen Booth */}
                          <polygon points="-42,-15 5,8 5,-48 -42,-71" fill="url(#ramenWood)" />
                          <polygon points="5,8 48,-12 48,-68 5,-48" fill="#451a03" />
                          <polygon points="-46,-71 5,-45 52,-68 1,-94" fill="#1c1917" stroke="#78350f" strokeWidth="1.5" />

                          {/* Steaming Ramen Counter Window */}
                          <polygon points="-35,-24 -3,-7 -3,-38 -35,-55" fill="url(#warmWindowLight)" stroke="#ca8a04" strokeWidth="1.2" filter="url(#warmGlow)" />
                          <text x="-19" y="-28" fontSize="11" textAnchor="middle">🍜</text>

                          {/* Hanging Glowing Paper Lantern with Japanese Character */}
                          <motion.g
                            animate={{ rotate: [-4, 4, -4] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                            transform="translate(-38, -48)"
                          >
                            <line x1="0" y1="0" x2="0" y2="8" stroke="#f8fafc" strokeWidth="1.2" />
                            <ellipse cx="0" cy="14" rx="5" ry="7" fill="#ef4444" filter="url(#warmGlow)" />
                            <text x="0" y="17" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#ffffff">拉</text>
                          </motion.g>

                          {/* Glowing Neon Kanji Banners over stall */}
                          <g transform="translate(-18, -65) rotate(14)">
                            <rect x="-4" y="-6" width="28" height="12" rx="2" fill="#020617" stroke="#06b6d4" strokeWidth="1.5" />
                            <text x="10" y="2.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#67e8f9">
                              RAMEN
                            </text>
                          </g>

                          {/* Side Red Beverage Vending Machine (from reference photo) */}
                          <g transform="translate(24, 0)">
                            <polygon points="-8,-4 8,-12 8,-42 -8,-34" fill="url(#vendingRed)" stroke="#7f1d1d" strokeWidth="1" />
                            {/* Illuminated Beverage Display */}
                            <polygon points="-6,-18 6,-24 6,-38 -6,-32" fill="#ffffff" />
                            <circle cx="-2" cy="-28" r="1.5" fill="#ef4444" />
                            <circle cx="3" cy="-30" r="1.5" fill="#3b82f6" />
                            <rect x="-5" y="-12" width="9" height="3" fill="#1e293b" />
                          </g>
                        </g>
                      )}

                      {/* STYLE 7: GOLDEN BURGER BISTRO (from download (5).jpg) */}
                      {style === 'fastfood' && (
                        <g>
                          <polygon points="-75,-15 5,-50 85,-15 5,20" fill="#0f172a" />

                          {/* Charcoal & Wood Slat Building */}
                          <polygon points="-45,-20 5,3 5,-56 -45,-79" fill="#1e293b" />
                          <polygon points="5,3 55,-20 55,-79 5,-56" fill="url(#burgerWoodSlats)" />
                          <polygon points="-48,-79 5,-54 58,-79 5,-104" fill="#0f172a" />

                          {/* Wood Slat Horizontal Lines Accent */}
                          <line x1="8" y1="-8" x2="52" y2="-28" stroke="#b45309" strokeWidth="2" />
                          <line x1="8" y1="-20" x2="52" y2="-40" stroke="#b45309" strokeWidth="2" />
                          <line x1="8" y1="-32" x2="52" y2="-52" stroke="#b45309" strokeWidth="2" />

                          {/* Glass Panoramic Front Dining Area */}
                          <polygon points="-38,-28 -2,-12 -2,-48 -38,-64" fill="url(#warmWindowLight)" stroke="#334155" strokeWidth="1.2" filter="url(#warmGlow)" />

                          {/* Golden Burger Neon Arch Sign on Roof */}
                          <g transform="translate(5, -78)">
                            <ellipse cx="0" cy="0" rx="14" ry="10" fill="#0f172a" stroke="#ca8a04" strokeWidth="1.5" />
                            <text x="0" y="4" textAnchor="middle" fontSize="11">🍔</text>
                            <circle cx="0" cy="-14" r="3" fill="#facc15" filter="url(#warmGlow)" />
                          </g>

                          {/* Outdoor Dining Patio with Striped Sun Umbrella */}
                          <g transform="translate(38, 12)">
                            {/* Picnic Table */}
                            <ellipse cx="0" cy="0" rx="8" ry="4" fill="#78350f" />
                            {/* Umbrella Pole & Canopy */}
                            <line x1="0" y1="0" x2="0" y2="-24" stroke="#ffffff" strokeWidth="1.8" />
                            <path d="M -14,-24 Q 0,-34 14,-24 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                            <path d="M -5,-24 Q 0,-34 5,-24 Z" fill="#ffffff" />
                          </g>
                        </g>
                      )}

                      {/* STYLE 8: NORDIC SKYLIGHT STUDIO (from _Urban Architecture Presentation Templates_.jpg) */}
                      {style === 'modern_loft' && (
                        <g>
                          <polygon points="-75,-15 5,-50 85,-15 5,20" fill="#1e293b" />
                          
                          {/* Crisp Modernist White Base */}
                          <polygon points="-46,-20 5,4 5,-58 -46,-82" fill="url(#modernWhite)" />
                          <polygon points="5,4 56,-20 56,-82 5,-58" fill="#cbd5e1" />

                          {/* Pitch Roof with Twin Skylight Windows */}
                          <polygon points="-48,-82 5,-56 28,-98 -25,-124" fill="url(#loftPitchRoof)" stroke="#94a3b8" strokeWidth="1.2" />
                          <polygon points="5,-56 58,-82 28,-98" fill="#64748b" />

                          {/* Inset Roof Skylights glowing */}
                          <polygon points="-32,-90 -6,-76 -1,-86 -27,-100" fill="url(#warmWindowLight)" stroke="#0284c7" strokeWidth="1.2" filter="url(#warmGlow)" />

                          {/* 2-Story Corner Glass Studio */}
                          <polygon points="-38,-28 -5,-12 -5,-52 -38,-68" fill="url(#modernGlass)" stroke="#38bdf8" strokeWidth="1.5" opacity="0.9" />

                          {/* Roll-up Garage Bay Door */}
                          <polygon points="12,-6 48,-24 48,-50 12,-32" fill="#334155" stroke="#1e293b" strokeWidth="1.2" />
                          <line x1="12" y1="-14" x2="48" y2="-32" stroke="#64748b" strokeWidth="1.5" />
                          <line x1="12" y1="-22" x2="48" y2="-40" stroke="#64748b" strokeWidth="1.5" />
                        </g>
                      )}

                      {/* STYLE 9: LUXURY INFINITY POOL VILLA (from 3D house from a blender & Home with swimming pool) */}
                      {style === 'villa' && (
                        <g>
                          <polygon points="-75,-15 5,-50 85,-15 5,20" fill="#0f172a" />

                          {/* Sparkling Turquoise Swimming Pool with Ripple Reflections */}
                          <g transform="translate(-25, 4)">
                            <polygon points="-32,-12 0,4 32,-12 0,-28" fill="url(#villaPoolWater)" stroke="#a5f3fc" strokeWidth="1.5" />
                            {/* Water Shimmer Highlight Lines */}
                            <line x1="-18" y1="-10" x2="8" y2="-22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                            <line x1="-6" y1="-4" x2="16" y2="-14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                            {/* Red Swim Donut Inflatable Floating in Pool */}
                            <circle cx="-5" cy="-12" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                            <circle cx="-5" cy="-12" r="2" fill="url(#villaPoolWater)" />
                          </g>

                          {/* Teak Wood Lounger Deck */}
                          <polygon points="8,4 58,-18 58,-28 8,-6" fill="url(#villaTeak)" />
                          {/* Sun Lounger Chair */}
                          <g transform="translate(32, -8)">
                            <rect x="-8" y="-4" width="16" height="5" rx="1.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
                            <rect x="-8" y="-7" width="6" height="4" rx="1" fill="#f87171" />
                          </g>

                          {/* Cantilevered Floating Master Suite Box */}
                          <polygon points="-28,-28 15,-8 15,-65 -28,-85" fill="url(#modernWhite)" />
                          <polygon points="15,-8 62,-28 62,-85 15,-65" fill="#cbd5e1" />
                          <polygon points="-30,-85 15,-63 64,-85 19,-107" fill="#1e293b" />

                          {/* Master Suite Floor-to-Ceiling Glass Wall */}
                          <polygon points="-22,-36 8,-22 8,-58 -22,-72" fill="url(#modernGlass)" stroke="#38bdf8" strokeWidth="1.5" opacity="0.9" />

                          {/* Rooftop Garden Lawn with Parasol */}
                          <polygon points="-24,-85 15,-66 56,-85 17,-104" fill="#15803d" />
                          <g transform="translate(18, -85)">
                            <line x1="0" y1="0" x2="0" y2="-18" stroke="#ffffff" strokeWidth="1.5" />
                            <path d="M -10,-18 Q 0,-26 10,-18 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                          </g>
                        </g>
                      )}

                      {/* STYLE 10: ARTISAN BAKERY & CAFE */}
                      {style === 'bakery' && (
                        <g>
                          <polygon points="-45,-15 5,10 5,-50 -45,-75" fill="#78350f" />
                          <polygon points="5,10 55,-15 55,-75 5,-50" fill="#92400e" />
                          <polygon points="-50,-75 5,-48 60,-75 5,-102" fill="#b45309" />

                          {/* Red/White Striped Awning */}
                          <polygon points="-40,-20 10,5 10,-8 -40,-33" fill="#dc2626" />
                          <polygon points="-30,-15 -10,-5 -10,-18 -30,-28" fill="#f8fafc" />
                          <polygon points="0,0 10,5 10,-8 0,-13" fill="#f8fafc" />

                          {/* Warm Glass Display Window */}
                          <polygon points="-35,-25 0,-8 0,-40 -35,-57" fill="url(#warmWindowLight)" stroke="#451a03" strokeWidth="1.5" filter="url(#warmGlow)" />
                          <text x="-16" y="-30" fontSize="11" textAnchor="middle">🥐</text>
                        </g>
                      )}

                      {/* STYLE 11: MODERN GLASS VILLA */}
                      {style === 'modern' && (
                        <g>
                          <polygon points="-45,-15 5,10 5,-60 -45,-85" fill="url(#modernWhite)" />
                          <polygon points="5,10 55,-15 55,-85 5,-60" fill="#94a3b8" />
                          <polygon points="-48,-85 5,-58 58,-85 5,-112" fill="#1e293b" />

                          {/* Glass Balcony */}
                          <polygon points="-38,-35 0,-16 0,-52 -38,-71" fill="url(#modernGlass)" opacity="0.9" stroke="#38bdf8" strokeWidth="1.5" />
                          <polygon points="8,-12 48,-32 48,-68 8,-48" fill="url(#modernGlass)" opacity="0.9" stroke="#38bdf8" strokeWidth="1.5" />
                        </g>
                      )}

                      {/* STYLE 12: SOLAR ECO SANCTUARY */}
                      {style === 'solar' && (
                        <g>
                          <polygon points="-55,-15 5,15 65,-15 5,-45" fill="#15803d" />
                          <polygon points="-40,-15 10,10 10,-45 -40,-70" fill="#78350f" />
                          <polygon points="10,10 55,-12 55,-67 10,-45" fill="#92400e" />

                          {/* Photovoltaic Solar Shingle Roof */}
                          <polygon points="-45,-70 10,-42 60,-67 5,-95" fill="url(#solarTeal)" stroke="#38bdf8" strokeWidth="1.5" />
                          <line x1="-15" y1="-56" x2="35" y2="-81" stroke="#7dd3fc" strokeWidth="1.5" strokeDasharray="3,3" />

                          {/* Animated Wind Turbine */}
                          <g transform="translate(35, -85)">
                            <line x1="0" y1="0" x2="0" y2="-28" stroke="#ffffff" strokeWidth="2.5" />
                            <circle cx="0" cy="-28" r="3" fill="#0284c7" />
                            <motion.g
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                              style={{ transformOrigin: '0px -28px' }}
                            >
                              <line x1="0" y1="-28" x2="0" y2="-44" stroke="#ffffff" strokeWidth="2" />
                              <line x1="0" y1="-28" x2="14" y2="-20" stroke="#ffffff" strokeWidth="2" />
                              <line x1="0" y1="-28" x2="-14" y2="-20" stroke="#ffffff" strokeWidth="2" />
                            </motion.g>
                          </g>
                        </g>
                      )}

                      {/* STYLE 13: CLASSIC BRICK MANOR */}
                      {style === 'townhall' && (
                        <g>
                          <polygon points="-45,-15 5,10 5,-50 -45,-75" fill="#991b1b" />
                          <polygon points="5,10 55,-15 55,-75 5,-50" fill="#7f1d1d" />
                          <line x1="5" y1="10" x2="5" y2="-50" stroke="#fecaca" strokeWidth="2" strokeDasharray="4,4" />
                          <polygon points="-50,-75 5,-48 60,-75 5,-102" fill="url(#brickTerracotta)" />
                          <path d="M-15,-2 M-15,-25 Q5,-40 25,-25 L25,-2 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                        </g>
                      )}

                      {/* STYLE 14: CYBERPUNK NEON HUB */}
                      {style === 'cyber' && (
                        <g>
                          <polygon points="-45,-15 5,10 5,-50 -45,-75" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                          <polygon points="5,10 55,-15 55,-75 5,-50" fill="#020617" stroke="#ec4899" strokeWidth="1.5" />
                          <polygon points="-50,-75 5,-48 60,-75 5,-102" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />

                          {/* Floating Holographic Rupee */}
                          <motion.g
                            animate={{ y: [-112, -122, -112], rotateY: [0, 180, 360] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                          >
                            <circle cx="5" cy="-115" r="8" fill="#10b981" filter="url(#glowGreen)" />
                            <text x="5" y="-111" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ffffff">₹</text>
                          </motion.g>
                        </g>
                      )}

                      {/* Building Name Plaque on Apex */}
                      <g transform="translate(0, -98)">
                        <rect x="-42" y="-12" width="84" height="18" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" filter="url(#cityShadow)" />
                        <text x="0" y="0" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#f8fafc" fontFamily="sans-serif">
                          {b.name}
                        </text>
                      </g>
                    </g>
                  )}

                  {/* Selection Indicator Glow */}
                  {isSelected && (
                    <polygon
                      points="0,-55 90,-10 0,45 -90,-10"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeDasharray="6,4"
                      filter="url(#glowGreen)"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                </motion.g>
              </g>
            );
          })}

          {/* ============================================================= */}
          {/* 9. FOG OF WAR: VOLUMETRIC CLOUDS COVERING LOCKED DISTRICTS    */}
          {/* ============================================================= */}
          {/* ZONE 2 CLOUD (Riverside Marketplace) */}
          <AnimatePresence>
            {!isZoneUnlocked(2) && (
              <motion.g
                key="cloud-zone-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.15, transition: { duration: 1.2 } }}
                transform="translate(865, 480)"
                className="cursor-pointer"
                onClick={() => {
                  setLockedCloudMessage(
                    `☁️ Riverside Marketplace is shrouded in clouds! Build all 3 structures in Green Valley (${zone1Stats.completedCount}/3 complete) to reveal this district.`
                  );
                  setTimeout(() => setLockedCloudMessage(null), 4500);
                }}
              >
                {/* Rolling Puffy Clouds */}
                <g filter="url(#cloudSoftShadow)">
                  <motion.g
                    animate={{ x: [-12, 12, -12], y: [-6, 6, -6] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  >
                    <ellipse cx="-70" cy="-20" rx="90" ry="50" fill="url(#cloudGradPuffy)" />
                    <ellipse cx="60" cy="-30" rx="95" ry="55" fill="url(#cloudGradLight)" />
                    <ellipse cx="0" cy="20" rx="110" ry="60" fill="url(#cloudGradPuffy)" />
                    <circle cx="-30" cy="-45" r="55" fill="url(#cloudGradLight)" />
                    <circle cx="35" cy="-45" r="50" fill="url(#cloudGradPuffy)" />
                  </motion.g>
                </g>

                {/* District Lock Badge */}
                <g transform="translate(0, -10)">
                  <rect x="-105" y="-22" width="210" height="44" rx="22" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" filter="url(#cityShadow)" />
                  <text x="0" y="-4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fde047" fontFamily="sans-serif">
                    🔒 Riverside Marketplace
                  </text>
                  <text x="0" y="12" textAnchor="middle" fontSize="9" fontWeight="semibold" fill="#cbd5e1" fontFamily="sans-serif">
                    Complete Green Valley ({zone1Stats.completedCount}/3)
                  </text>
                </g>
              </motion.g>
            )}
          </AnimatePresence>

          {/* ZONE 3 CLOUD (Solar Highlands) */}
          <AnimatePresence>
            {!isZoneUnlocked(3) && (
              <motion.g
                key="cloud-zone-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.15, transition: { duration: 1.2 } }}
                transform="translate(370, 520)"
                className="cursor-pointer"
                onClick={() => {
                  setLockedCloudMessage(
                    `☁️ Solar Highlands is locked in the clouds! Complete all buildings in Riverside Marketplace to reveal.`
                  );
                  setTimeout(() => setLockedCloudMessage(null), 4500);
                }}
              >
                <g filter="url(#cloudSoftShadow)">
                  <motion.g
                    animate={{ x: [10, -10, 10], y: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
                  >
                    <ellipse cx="-60" cy="-25" rx="95" ry="55" fill="url(#cloudGradLight)" />
                    <ellipse cx="65" cy="-20" rx="90" ry="50" fill="url(#cloudGradPuffy)" />
                    <ellipse cx="0" cy="25" rx="115" ry="65" fill="url(#cloudGradPuffy)" />
                    <circle cx="-25" cy="-45" r="52" fill="url(#cloudGradPuffy)" />
                    <circle cx="30" cy="-45" r="48" fill="url(#cloudGradLight)" />
                  </motion.g>
                </g>

                <g transform="translate(0, -10)">
                  <rect x="-95" y="-22" width="190" height="44" rx="22" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" filter="url(#cityShadow)" />
                  <text x="0" y="-4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#67e8f9" fontFamily="sans-serif">
                    🔒 Solar Highlands
                  </text>
                  <text x="0" y="12" textAnchor="middle" fontSize="9" fontWeight="semibold" fill="#cbd5e1" fontFamily="sans-serif">
                    Complete Zone 2 ({zone2Stats.completedCount}/3)
                  </text>
                </g>
              </motion.g>
            )}
          </AnimatePresence>

          {/* ZONE 4 CLOUD (Cyber Metropolis Skyline) */}
          <AnimatePresence>
            {!isZoneUnlocked(4) && (
              <motion.g
                key="cloud-zone-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.15, transition: { duration: 1.2 } }}
                transform="translate(535, 680)"
                className="cursor-pointer"
                onClick={() => {
                  setLockedCloudMessage(
                    `☁️ Cyber Metropolis is covered in high-altitude clouds! Complete Solar Highlands to reveal the skyline.`
                  );
                  setTimeout(() => setLockedCloudMessage(null), 4500);
                }}
              >
                <g filter="url(#cloudSoftShadow)">
                  <motion.g
                    animate={{ x: [-8, 8, -8], y: [6, -6, 6] }}
                    transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut' }}
                  >
                    <ellipse cx="-75" cy="-20" rx="100" ry="60" fill="url(#cloudGradPuffy)" />
                    <ellipse cx="70" cy="-25" rx="95" ry="55" fill="url(#cloudGradLight)" />
                    <ellipse cx="0" cy="20" rx="120" ry="70" fill="url(#cloudGradPuffy)" />
                    <circle cx="-35" cy="-50" r="58" fill="url(#cloudGradLight)" />
                    <circle cx="35" cy="-50" r="54" fill="url(#cloudGradPuffy)" />
                  </motion.g>
                </g>

                <g transform="translate(0, -10)">
                  <rect x="-105" y="-22" width="210" height="44" rx="22" fill="#0f172a" stroke="#a855f7" strokeWidth="2" filter="url(#cityShadow)" />
                  <text x="0" y="-4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#d8b4fe" fontFamily="sans-serif">
                    🔒 Cyber Metropolis
                  </text>
                  <text x="0" y="12" textAnchor="middle" fontSize="9" fontWeight="semibold" fill="#cbd5e1" fontFamily="sans-serif">
                    Complete Zone 3 ({zone3Stats.completedCount}/3)
                  </text>
                </g>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </motion.div>
    </div>
  );
};
