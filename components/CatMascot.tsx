import React, { useState, useEffect, useCallback } from 'react';
import { CatPattern, CatAccessory } from '../types';
import { CAT_STYLES } from '../constants';

interface CatMascotProps {
  pattern: CatPattern;
  accessory: CatAccessory;
  mood: 'happy' | 'neutral' | 'angry';
  onClick: () => void;
}

const CatMascot: React.FC<CatMascotProps> = ({ pattern, accessory, mood, onClick }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPurring, setIsPurring] = useState(false);
  
  const colors = CAT_STYLES[pattern].colors;
  const isHoodie = ['carrot_hoodie', 'dino_hoodie', 'rabbit_hoodie'].includes(accessory);

  // Blink logic
  useEffect(() => {
    const blinkLoop = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
      const nextBlink = Math.random() * 3000 + 2000; // 2-5 seconds
      setTimeout(blinkLoop, nextBlink);
    };
    const timer = setTimeout(blinkLoop, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = useCallback(() => {
    setIsPurring(true);
    onClick();
    setTimeout(() => setIsPurring(false), 1000);
  }, [onClick]);

  // SVG Parts
  const renderTail = () => {
    const isFluffy = pattern === 'ragdoll' || pattern === 'oddeye';
    const tailColor = pattern === 'ragdoll' ? colors.patch1 : colors.base;
    const strokeColor = (pattern === 'ragdoll' || colors.patch1 !== colors.base) ? tailColor : '#DDD';

    if (isFluffy) {
        return (
            <g className="origin-bottom animate-[sway_4s_ease-in-out_infinite]" style={{ transformOrigin: '110px 160px' }}>
                <path 
                    d="M110,165 Q160,160 170,110 Q185,110 180,90 Q160,80 150,110 Q140,150 110,165" 
                    fill={tailColor} 
                    stroke={strokeColor} 
                    strokeWidth="1"
                />
            </g>
        );
    }

    return (
        <g className="origin-bottom animate-[sway_3s_ease-in-out_infinite]" style={{ transformOrigin: '110px 160px' }}>
             <path 
                d="M110,160 Q160,160 160,110" 
                fill="none" 
                stroke={tailColor} 
                strokeWidth="12" 
                strokeLinecap="round"
             />
             {tailColor === '#FFFFFF' && (
                <path 
                    d="M110,160 Q160,160 160,110" 
                    fill="none" 
                    stroke="#EEE" 
                    strokeWidth="14" 
                    strokeLinecap="round"
                    style={{ opacity: 0.5 }}
                 />
             )}
        </g>
    );
  };

  const renderEyes = () => {
    const eyeY = 95;
    const eyeRx = 11;
    const eyeRy = 13;
    const leftEyeCx = 85;
    const rightEyeCx = 135;

    if (isBlinking) {
      return (
        <g>
          <path d={`M${leftEyeCx-10},${eyeY} Q${leftEyeCx},${eyeY+5} ${leftEyeCx+10},${eyeY}`} fill="none" stroke="#4A3B32" strokeWidth="3" strokeLinecap="round" />
          <path d={`M${rightEyeCx-10},${eyeY} Q${rightEyeCx},${eyeY+5} ${rightEyeCx+10},${eyeY}`} fill="none" stroke="#4A3B32" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    }
    
    if (mood === 'angry') {
       return (
        <g>
          <path d={`M${leftEyeCx-10},${eyeY-5} L${leftEyeCx+10},${eyeY+3}`} fill="none" stroke="#4A3B32" strokeWidth="3" strokeLinecap="round" />
          <circle cx={leftEyeCx} cy={eyeY+3} r="4" fill="#000" />
          
          <path d={`M${rightEyeCx+10},${eyeY-5} L${rightEyeCx-10},${eyeY+3}`} fill="none" stroke="#4A3B32" strokeWidth="3" strokeLinecap="round" />
          <circle cx={rightEyeCx} cy={eyeY+3} r="4" fill="#000" />
        </g>
       )
    }

    let leftEyeColor = '#8BC34A'; 
    let rightEyeColor = '#8BC34A';

    if (pattern === 'oddeye') {
      leftEyeColor = '#42A5F5'; // Blue
      rightEyeColor = '#66BB6A'; // Green
    } else if (pattern === 'ragdoll') {
      leftEyeColor = '#8BC34A'; // Light Green
      rightEyeColor = '#8BC34A';
    } else if (pattern === 'calico') {
        leftEyeColor = '#AED581'; 
        rightEyeColor = '#AED581';
    }

    const eyeHappyMod = mood === 'happy' ? -2 : 0;

    return (
      <g>
        {pattern === 'calico' && (
            <g stroke="#4A3B32" strokeWidth="2" fill="none" strokeLinecap="round">
                <path d={`M${leftEyeCx-10},${eyeY-5} Q${leftEyeCx-14},${eyeY-10} ${leftEyeCx-16},${eyeY-12}`} />
                <path d={`M${leftEyeCx-6},${eyeY-8} Q${leftEyeCx-10},${eyeY-14} ${leftEyeCx-12},${eyeY-16}`} />
                <path d={`M${rightEyeCx+10},${eyeY-5} Q${rightEyeCx+14},${eyeY-10} ${rightEyeCx+16},${eyeY-12}`} />
                <path d={`M${rightEyeCx+6},${eyeY-8} Q${rightEyeCx+10},${eyeY-14} ${rightEyeCx+12},${eyeY-16}`} />
            </g>
        )}

        <ellipse cx={leftEyeCx} cy={eyeY} rx={eyeRx} ry={eyeRy + eyeHappyMod} fill={leftEyeColor} />
        <circle cx={leftEyeCx} cy={eyeY} r="5" fill="#000" />
        <circle cx={leftEyeCx + 3} cy={eyeY - 4} r="4" fill="white" opacity="0.9" />
        <circle cx={leftEyeCx - 3} cy={eyeY + 5} r="2" fill="white" opacity="0.6" />

        <ellipse cx={rightEyeCx} cy={eyeY} rx={eyeRx} ry={eyeRy + eyeHappyMod} fill={rightEyeColor} />
        <circle cx={rightEyeCx} cy={eyeY} r="5" fill="#000" />
        <circle cx={rightEyeCx + 3} cy={eyeY - 4} r="4" fill="white" opacity="0.9" />
        <circle cx={rightEyeCx - 3} cy={eyeY + 5} r="2" fill="white" opacity="0.6" />
        
        {mood === 'happy' && (
           <>
             <ellipse cx={leftEyeCx - 10} cy={eyeY + 15} rx="6" ry="3" fill="#FF8A80" opacity="0.5" />
             <ellipse cx={rightEyeCx + 10} cy={eyeY + 15} rx="6" ry="3" fill="#FF8A80" opacity="0.5" />
           </>
        )}
      </g>
    );
  };

  const renderMouth = () => {
    if (mood === 'angry') {
       return <path d="M105,115 Q110,110 115,115" fill="none" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />;
    }
    if (mood === 'happy') {
      return <path d="M102,112 Q110,120 118,112" fill="none" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />;
    }
    return (
      <g>
        <path d="M110,112 L105,115" fill="none" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />
        <path d="M110,112 L115,115" fill="none" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  };

  const renderHoodie = () => {
    if (!isHoodie) return null;

    let hoodColor = '#FFCC80'; // Default Orange
    let detail = null;
    let ears = null;

    if (accessory === 'carrot_hoodie') {
        hoodColor = '#FFCC80'; // Pastel Orange
        detail = (
             <g>
                <path d="M110,38 L105,20 L110,25 L115,20 Z" fill="#A5D6A7" /> {/* Stem */}
                <path d="M110,38 L115,20 L118,25" fill="#81C784" />
             </g>
        );
    } else if (accessory === 'dino_hoodie') {
        hoodColor = '#A5D6A7'; // Pastel Green
        detail = (
            <g>
                {/* Spikes */}
                <path d="M110,35 L100,20 L120,20 Z" fill="#FFF59D" transform="translate(0,5)" />
                <path d="M70,55 L60,40 L80,40 Z" fill="#FFF59D" transform="rotate(-30 70 55)" />
                <path d="M150,55 L140,40 L160,40 Z" fill="#FFF59D" transform="rotate(30 150 55)" />
            </g>
        );
    } else if (accessory === 'rabbit_hoodie') {
        hoodColor = '#F8BBD0'; // Pastel Pink
        ears = (
            <g>
                 {/* Left Ear */}
                 <path d="M80,50 Q60,0 90,40" fill={hoodColor} stroke="#F48FB1" strokeWidth="1"/>
                 <ellipse cx="78" cy="30" rx="4" ry="12" fill="#FFF" transform="rotate(-15 78 30)" opacity="0.8"/>
                 
                 {/* Right Ear */}
                 <path d="M140,50 Q160,0 130,40" fill={hoodColor} stroke="#F48FB1" strokeWidth="1"/>
                 <ellipse cx="142" cy="30" rx="4" ry="12" fill="#FFF" transform="rotate(15 142 30)" opacity="0.8"/>
            </g>
        );
    }

    // Hood shape: Frame the face. Outer r=60, Inner r=45 (Face hole)
    return (
        <g>
            {ears}
            {detail}
            {/* The Hood Ring */}
            <path 
                d="M110,35 A60,60 0 1,1 110,155 A60,60 0 1,1 110,35 Z M110,50 A45,45 0 1,0 110,140 A45,45 0 1,0 110,50 Z" 
                fill={hoodColor} 
                fillRule="evenodd"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="1"
            />
        </g>
    );
  };

  const renderAccessory = () => {
    // Ribbons
    if (accessory.startsWith('ribbon_') || accessory === 'bow') {
        let ribbonColor = '#E91E63';
        switch(accessory) {
            case 'ribbon_pink': ribbonColor = '#F48FB1'; break;
            case 'ribbon_blue': ribbonColor = '#90CAF9'; break;
            case 'ribbon_red': ribbonColor = '#EF9A9A'; break;
            case 'ribbon_white': ribbonColor = '#F5F5F5'; break;
            case 'ribbon_black': ribbonColor = '#78909C'; break; // Pastel Blue-Grey/Black
            default: ribbonColor = '#F48FB1';
        }

        const stroke = accessory === 'ribbon_white' ? '#E0E0E0' : 'none';

        return (
             <g transform="translate(-7, 0)">
                <path d="M110,140 L100,132 L100,148 Z M125,140 L135,132 L135,148 Z" fill={ribbonColor} stroke={stroke} strokeWidth="1" />
                <circle cx="117.5" cy="140" r="4" fill={ribbonColor} stroke={stroke} strokeWidth="1" />
             </g>
        );
    }

    switch (accessory) {
        case 'scarf':
            return (
                <g>
                    <path d="M85,135 Q110,155 135,135" fill="none" stroke="#FF7043" strokeWidth="10" strokeLinecap="round" />
                    <path d="M125,140 L130,160" fill="none" stroke="#FF7043" strokeWidth="10" strokeLinecap="round" />
                </g>
            );
        case 'glasses':
            return (
                <g opacity="0.8">
                    <circle cx="85" cy="95" r="16" fill="none" stroke="#333" strokeWidth="2" />
                    <circle cx="135" cy="95" r="16" fill="none" stroke="#333" strokeWidth="2" />
                    <line x1="101" y1="95" x2="119" y2="95" stroke="#333" strokeWidth="2" />
                </g>
            );
        case 'hat':
            return (
                <g transform="translate(0, -15)">
                    <path d="M85,50 L135,50 L110,10 Z" fill="#FFC107" />
                    <ellipse cx="110" cy="50" rx="30" ry="8" fill="#FFB300" />
                </g>
            );
        default: return null;
    }
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center cursor-pointer select-none" onClick={handleClick}>
      {isPurring && (
        <div className="absolute inset-0 rounded-full border-4 border-pink-200 animate-ping opacity-50"></div>
      )}
      
      {mood === 'angry' && <div className="absolute top-0 right-10 text-2xl animate-bounce">⛈️</div>}
      {mood === 'happy' && <div className="absolute top-0 right-10 text-2xl animate-bounce">✨</div>}

      <svg viewBox="0 0 220 200" className="w-full h-full drop-shadow-lg transition-transform duration-300 transform hover:scale-105">
        
        {renderTail()}

        {/* Body */}
        <ellipse cx="110" cy="150" rx="45" ry="38" fill={colors.base} />
        
        {pattern === 'calico' && (
            <path d="M130,140 Q155,145 150,170 Q130,175 125,150" fill={colors.patch2} opacity="0.9" />
        )}

        {/* Feet */}
        <ellipse cx="90" cy="180" rx="9" ry="7" fill="#FFF" stroke="#EEE" />
        <ellipse cx="130" cy="180" rx="9" ry="7" fill="#FFF" stroke="#EEE" />

        {/* Ears - Hidden if Hoodie is active */}
        {!isHoodie && (
            <>
                <path d="M68,65 L55,25 L100,55" fill={pattern === 'ragdoll' ? colors.patch1 : colors.base} stroke="#E0E0E0" strokeWidth="1" />
                <path d="M72,60 L65,35 L85,55" fill="#FFCCBC" /> 
                <path d="M152,65 L165,25 L120,55" fill={pattern === 'ragdoll' ? colors.patch1 : colors.base} stroke="#E0E0E0" strokeWidth="1" />
                <path d="M148,60 L155,35 L135,55" fill="#FFCCBC" />
            </>
        )}

        {/* Head */}
        <circle cx="110" cy="95" r="55" fill={colors.base} />

        {/* Calico Head Patches - Render before hoodie overlay so they appear under it but on face */}
        {pattern === 'calico' && (
           <g opacity="0.9">
               <path d="M56,75 Q80,55 90,80 L55,95 Z" fill={colors.patch1} />
               <path d="M164,75 Q140,55 130,80 L165,95 Z" fill={colors.patch2} />
           </g>
        )}

        {/* Li Hua Stripes */}
        {pattern === 'lihua' && (
            <g opacity="0.6" stroke={colors.patch1} strokeWidth="3" fill="none" strokeLinecap="round">
                <path d="M110,50 L110,65" />
                <path d="M95,52 L100,65" />
                <path d="M125,52 L120,65" />
                <path d="M60,100 L75,100" />
                <path d="M160,100 L145,100" />
            </g>
        )}
        
        {/* Hoodie Overlay (Frames face) */}
        {renderHoodie()}

        {renderEyes()}
        
        <path d="M107,106 L113,106 L110,110 Z" fill="#FFA07A" />

        <g stroke="#DDD" strokeWidth="2" opacity="0.8">
           <line x1="60" y1="108" x2="75" y2="110" />
           <line x1="60" y1="116" x2="75" y2="114" />
           <line x1="160" y1="108" x2="145" y2="110" />
           <line x1="160" y1="116" x2="145" y2="114" />
        </g>

        {renderMouth()}
        {renderAccessory()}
        
        <ellipse cx="98" cy="150" rx="10" ry="12" fill="#FFF" stroke="#EEE" />
        <ellipse cx="122" cy="150" rx="10" ry="12" fill="#FFF" stroke="#EEE" />

      </svg>
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default CatMascot;