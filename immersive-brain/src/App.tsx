import React, { useState } from 'react';
import AudioLayer from './components/AudioLayer';
import Intro from './components/Intro';
import SpaceStationScene from './components/SpaceStationScene';

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {!introComplete && <Intro onComplete={() => setIntroComplete(true)} />}
      
      <div className={`w-screen h-screen relative select-none transition-opacity duration-1000 ${introComplete ? 'opacity-100' : 'opacity-0'}`}>
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-black to-black animate-pulse-slow pointer-events-none" />
        
        {/* Overlay UI */}
        <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-30 pointer-events-none">
          <h1 className="text-xs md:text-sm font-light tracking-[0.3em] opacity-70 uppercase">
            USINE-IA · Immersive Space Station
          </h1>
        </div>

        {/* Instructions overlay */}
        <div className="absolute top-20 left-0 w-full text-center z-30 pointer-events-none">
          <p className="text-[10px] md:text-xs opacity-40 tracking-widest">
            DRAG TO ROTATE · SCROLL TO ZOOM · EXPLORE THE STATION
          </p>
        </div>

        {/* 3D Space Station Scene */}
        {introComplete && <SpaceStationScene />}

        <AudioLayer />
      </div>
    </>
  );
}
