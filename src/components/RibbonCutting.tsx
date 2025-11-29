import { useState, useEffect } from 'react';
import { Scissors } from 'lucide-react';
import goldBowImage from '@/assets/gold_bow.png';

interface RibbonCuttingProps {
  onCut: () => void;
}

const RibbonCutting = ({ onCut }: RibbonCuttingProps) => {
  const [isCut, setIsCut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cutPosition, setCutPosition] = useState(50); // Percentage where cut happens

  const handleCut = () => {
    if (!isCut) {
      setIsCut(true);
      setShowConfetti(true);
      onCut();
      
      // Restore default cursor after cut animation
      setTimeout(() => {
        document.body.classList.remove('ribbon-mode');
      }, 500); // After ribbon cut animation completes
      
      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  };

  // Beautiful SVG Ribbon
  const RibbonSVG = () => (
    <svg 
      width="100%" 
      height="120" 
      viewBox="0 0 1200 120" 
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="goldTrim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="1" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="1" />
        </linearGradient>
        <filter id="shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="0" dy="4" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main Ribbon Band */}
      <rect 
        x="0" 
        y="40" 
        width="1200" 
        height="40" 
        fill="url(#ribbonGradient)"
        filter="url(#shadow)"
        className={isCut ? 'ribbon-cut' : ''}
      />
      
      {/* Top Gold Trim */}
      <rect x="0" y="40" width="1200" height="3" fill="url(#goldTrim)" />
      
      {/* Bottom Gold Trim */}
      <rect x="0" y="77" width="1200" height="3" fill="url(#goldTrim)" />
      
      {/* Black Center Stripe */}
      <rect x="0" y="58" width="1200" height="4" fill="#1a1a1a" />
      
      {/* Thin Gold Lines around Black Stripe */}
      <rect x="0" y="56" width="1200" height="1" fill="url(#goldTrim)" />
      <rect x="0" y="63" width="1200" height="1" fill="url(#goldTrim)" />
      
      {/* Center Cutting Point Indicator */}
      <line 
        x1="600" 
        y1="40" 
        x2="600" 
        y2="80" 
        stroke="#fbbf24" 
        strokeWidth="2" 
        strokeDasharray="4,4"
        opacity="0.6"
      />
    </svg>
  );

  // Beautiful Gold Bow Image
  const BowImage = () => (
    <div className={`relative transition-all duration-700 ${
      isCut ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
    }`} style={{ transform: 'scale(2)' }}>
      <img 
        src={goldBowImage} 
        alt="Golden Bow" 
        className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
        }}
      />
    </div>
  );

  return (
    <>
      {/* Scissor Cursor Overlay */}
      <style>{`
        body.ribbon-mode {
          cursor: none !important;
        }
        body.ribbon-mode * {
          cursor: none !important;
        }
        .scissor-cursor {
          position: fixed;
          pointer-events: none;
          z-index: 100000 !important;
          transform: translate(-50%, -50%);
          width: clamp(50px, 6vw, 100px);
          height: clamp(50px, 6vw, 100px);
          transition: transform 0.05s ease-out;
        }
        .scissor-cursor svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.6));
          color: #dc2626;
          stroke-width: 2.5;
        }
        .ribbon-cut {
          clip-path: polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%);
          animation: cut-left 0.5s ease-out forwards;
        }
        @keyframes cut-left {
          to {
            transform: translateX(-20px) rotate(-5deg);
            opacity: 0.7;
          }
        }
      `}</style>

      {/* Beautiful Ribbon with Image */}
      <div 
        data-ribbon
        className={`fixed top-1/2 left-0 right-0 transform -translate-y-1/2 z-[9999] transition-all duration-700 ${
          isCut ? 'opacity-0 scale-y-0' : 'opacity-100 scale-y-100'
        }`}
        onClick={handleCut}
        style={{ cursor: 'none' }}
      >
        <div className="relative w-full flex flex-col items-center">
          {/* Beautiful Ribbon Band - SVG Image */}
          <div className="relative w-full h-24 md:h-28 lg:h-40">
            <RibbonSVG />
            
            {/* Gold Bow at Center of Ribbon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[40%] z-10">
              <BowImage />
            </div>
          </div>
        </div>
      </div>

      {/* Confetti Celebration */}
      {showConfetti && (
        <div className="fixed inset-0 z-[10001] pointer-events-none overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => {
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const randomDelay = Math.random() * 2;
            const randomDuration = 2 + Math.random() * 3;
            const randomX = Math.random() * 100;
            const randomRotation = Math.random() * 720;
            
            return (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full animate-confetti"
                style={{
                  left: `${randomX}%`,
                  top: '-10px',
                  backgroundColor: randomColor,
                  animationDelay: `${randomDelay}s`,
                  animationDuration: `${randomDuration}s`,
                  transform: `rotate(${randomRotation}deg)`,
                }}
              />
            );
          })}
          
          {/* Tada Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-7xl md:text-9xl font-bold text-yellow-400 animate-bounce drop-shadow-2xl mb-4">
              🎉
            </div>
            <div className="text-5xl md:text-7xl font-bold text-white mt-4 animate-pulse drop-shadow-2xl" style={{
              textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,215,0,0.6)',
            }}>
              
            </div>
            
            <div className="text-xl md:text-2xl font-medium text-white/90 mt-6 animate-fade-in">
              Welcome to EcoCenter Portal!
            </div>
          </div>
        </div>
      )}

      {/* Scissor Cursor Follower */}
      {!isCut && <ScissorCursor isCut={isCut} />}
    </>
  );
};

// Professional Scissor Cursor Component
const ScissorCursor = ({ isCut }: { isCut: boolean }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Don't show scissor cursor if ribbon is cut
    if (isCut) {
      document.body.classList.remove('ribbon-mode');
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.body.classList.add('ribbon-mode');
    window.addEventListener('mousemove', handleMouseMove);
    
    // Check if hovering over ribbon
    const ribbonElement = document.querySelector('[data-ribbon]');
    if (ribbonElement) {
      ribbonElement.addEventListener('mouseenter', handleMouseEnter);
      ribbonElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.body.classList.remove('ribbon-mode');
      window.removeEventListener('mousemove', handleMouseMove);
      if (ribbonElement) {
        ribbonElement.removeEventListener('mouseenter', handleMouseEnter);
        ribbonElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isCut]);

  return (
    <div
      className="scissor-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) ${isHovering ? 'scale(1.2)' : 'scale(1)'}`,
        transition: 'transform 0.2s ease-out',
      }}
    >
      <div className="relative">
        <Scissors 
          className="text-red-600" 
          strokeWidth={2.5}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        />
        {/* Metallic shine effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-red-200/60 via-transparent to-transparent rounded-full"
          style={{
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default RibbonCutting;

