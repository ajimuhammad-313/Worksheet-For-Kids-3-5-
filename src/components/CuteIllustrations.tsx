import React, { useState } from 'react';
import { UNLOCKABLE_CHARACTERS } from '../data/gamesRegistry';

export type IllustrationKey =
  // Animals
  | 'cat' | 'dog' | 'cow' | 'duck' | 'frog' | 'lion' | 'sheep' | 'rooster'
  | 'elephant' | 'mouse' | 'penguin' | 'monkey' | 'rabbit' | 'bear' | 'owl' | 'fox' | 'panda' | 'koala'
  // Ocean
  | 'octopus' | 'whale' | 'crab' | 'seahorse' | 'starfish' | 'fish' | 'turtle' | 'shark'
  // Foods & Objects
  | 'apple' | 'banana' | 'strawberry' | 'carrot' | 'broccoli' | 'milk' | 'candy' | 'donut' | 'chips' | 'soda'
  | 'ball' | 'sun' | 'moon' | 'star' | 'tree' | 'flower' | 'house' | 'rocket' | 'clock' | 'window'
  | 'kite' | 'hat' | 'umbrella' | 'book' | 'butterfly' | 'cupcake' | 'grapes' | 'pineapple' | 'shoe' | 'airplane' | 'torch' | 'pizza'
  // Emotions
  | 'happy' | 'sad' | 'angry' | 'surprised' | 'sleepy' | 'silly';

export type ShapeKey = 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond' | 'rectangle' | 'oval';

export const BuddyAvatar: React.FC<{
  buddyId: string;
  size?: number;
  className?: string;
}> = ({ buddyId, size = 64, className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const char = UNLOCKABLE_CHARACTERS.find((c) => c.id === buddyId) || UNLOCKABLE_CHARACTERS[0];

  if (char.imageUrl && !imgFailed) {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: char.bgHex }}
        className={`rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 ${className}`}
      >
        <img
          src={char.imageUrl}
          alt={char.name.en}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const svgMap: Record<string, IllustrationKey> = {
    bunny: 'rabbit',
    bear: 'bear',
    owl: 'owl',
    duck: 'duck',
    fox: 'fox',
    panda: 'panda',
    elephant: 'elephant',
    koala: 'koala',
  };

  return (
    <div
      style={{ width: size, height: size, backgroundColor: char.bgHex }}
      className={`rounded-full flex items-center justify-center border-2 border-white shadow-sm shrink-0 p-1.5 ${className}`}
    >
      <CuteIllustration name={svgMap[char.svgType] || 'rabbit'} size={size * 0.78} />
    </div>
  );
};

export const ShapeSvg: React.FC<{
  shape: ShapeKey;
  color?: string;
  strokeColor?: string;
  size?: number;
  outlineOnly?: boolean;
  className?: string;
}> = ({
  shape,
  color = '#FFB7C5',
  strokeColor = '#334155',
  size = 80,
  outlineOnly = false,
  className = '',
}) => {
  const fill = outlineOnly ? '#F1F5F9' : color;
  const stroke = outlineOnly ? '#94A3B8' : strokeColor;
  const dash = outlineOnly ? '6 5' : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      {shape === 'circle' && (
        <circle cx="50" cy="50" r="38" fill={fill} stroke={stroke} strokeWidth="4" strokeDasharray={dash} />
      )}
      {shape === 'square' && (
        <rect x="16" y="16" width="68" height="68" rx="12" fill={fill} stroke={stroke} strokeWidth="4" strokeDasharray={dash} />
      )}
      {shape === 'rectangle' && (
        <rect x="10" y="24" width="80" height="52" rx="10" fill={fill} stroke={stroke} strokeWidth="4" strokeDasharray={dash} />
      )}
      {shape === 'oval' && (
        <ellipse cx="50" cy="50" rx="40" ry="27" fill={fill} stroke={stroke} strokeWidth="4" strokeDasharray={dash} />
      )}
      {shape === 'triangle' && (
        <polygon points="50,14 88,82 12,82" fill={fill} stroke={stroke} strokeWidth="4" strokeLinejoin="round" strokeDasharray={dash} />
      )}
      {shape === 'diamond' && (
        <polygon points="50,10 86,50 50,90 14,50" fill={fill} stroke={stroke} strokeWidth="4" strokeLinejoin="round" strokeDasharray={dash} />
      )}
      {shape === 'star' && (
        <polygon
          points="50,10 61,36 89,39 68,58 74,86 50,72 26,86 32,58 11,39 39,36"
          fill={fill}
          stroke={stroke}
          strokeWidth="4"
          strokeLinejoin="round"
          strokeDasharray={dash}
        />
      )}
      {shape === 'heart' && (
        <path
          d="M50 84 C20 64 12 46 12 33 C12 20 22 14 33 14 C41 14 47 19 50 25 C53 19 59 14 67 14 C78 14 88 20 88 33 C88 46 80 64 50 84 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="4"
          strokeLinejoin="round"
          strokeDasharray={dash}
        />
      )}
      {!outlineOnly && (
        <>
          <circle cx="40" cy="48" r="3" fill="#1E293B" />
          <circle cx="60" cy="48" r="3" fill="#1E293B" />
          <path d="M44 56 Q50 61 56 56" fill="none" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

export const CuteIllustration: React.FC<{
  name: IllustrationKey;
  size?: number;
  silhouette?: boolean;
  className?: string;
}> = ({ name, size = 80, silhouette = false, className = '' }) => {
  const shadowStyle = silhouette
    ? { filter: 'brightness(0) opacity(0.82)' }
    : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={shadowStyle}
      className={`select-none ${className}`}
      aria-hidden="true"
    >
      {renderIllustrationPaths(name)}
    </svg>
  );
};

function renderIllustrationPaths(name: IllustrationKey) {
  switch (name) {
    case 'cat':
      return (
        <g>
          <polygon points="22,38 26,14 44,28" fill="#FDBA74" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="78,38 74,14 56,28" fill="#FDBA74" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="27,34 29,21 39,29" fill="#FFB7C5" />
          <polygon points="73,34 71,21 61,29" fill="#FFB7C5" />
          <circle cx="50" cy="54" r="32" fill="#FED7AA" stroke="#334155" strokeWidth="3.5" />
          <circle cx="38" cy="50" r="4" fill="#1E293B" />
          <circle cx="62" cy="50" r="4" fill="#1E293B" />
          <ellipse cx="30" cy="58" rx="5" ry="3" fill="#FFB7C5" />
          <ellipse cx="70" cy="58" rx="5" ry="3" fill="#FFB7C5" />
          <polygon points="46,56 54,56 50,61" fill="#FB7185" />
          <path d="M43 64 Q50 69 50 61 Q50 69 57 64" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="14" y1="53" x2="28" y2="55" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="14" y1="61" x2="28" y2="60" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="86" y1="53" x2="72" y2="55" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="86" y1="61" x2="72" y2="60" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'dog':
      return (
        <g>
          <ellipse cx="22" cy="48" rx="12" ry="22" transform="rotate(14 22 48)" fill="#B45309" stroke="#334155" strokeWidth="3.5" />
          <ellipse cx="78" cy="48" rx="12" ry="22" transform="rotate(-14 78 48)" fill="#B45309" stroke="#334155" strokeWidth="3.5" />
          <circle cx="50" cy="52" r="30" fill="#FDE68A" stroke="#334155" strokeWidth="3.5" />
          <circle cx="38" cy="46" r="6" fill="#D97706" opacity="0.45" />
          <circle cx="38" cy="46" r="4" fill="#1E293B" />
          <circle cx="62" cy="46" r="4" fill="#1E293B" />
          <ellipse cx="50" cy="60" rx="14" ry="11" fill="#FFFBEB" />
          <ellipse cx="50" cy="56" rx="6" ry="4.5" fill="#1E293B" />
          <path d="M44 64 Q50 70 56 64" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );
    case 'cow':
      return (
        <g>
          <ellipse cx="20" cy="36" rx="10" ry="6" transform="rotate(-20 20 36)" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <ellipse cx="80" cy="36" rx="10" ry="6" transform="rotate(20 80 36)" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <path d="M28 26 Q24 14 34 18" fill="#FDE68A" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <path d="M72 26 Q76 14 66 18" fill="#FDE68A" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="50" r="30" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />
          <path d="M32 28 Q45 34 38 45 Q28 44 26 35 Z" fill="#334155" />
          <circle cx="39" cy="45" r="3.8" fill="#1E293B" />
          <circle cx="61" cy="45" r="3.8" fill="#1E293B" />
          <ellipse cx="50" cy="66" rx="22" ry="14" fill="#FFB7C5" stroke="#334155" strokeWidth="3" />
          <circle cx="42" cy="64" r="2.5" fill="#334155" />
          <circle cx="58" cy="64" r="2.5" fill="#334155" />
          <path d="M44 71 Q50 75 56 71" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'duck':
      return (
        <g>
          <path d="M46 18 Q50 8 56 16" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="54" r="31" fill="#FFF1A8" stroke="#334155" strokeWidth="3.5" />
          <circle cx="38" cy="46" r="4" fill="#1E293B" />
          <circle cx="62" cy="46" r="4" fill="#1E293B" />
          <ellipse cx="29" cy="54" rx="5" ry="3" fill="#FFB7C5" />
          <ellipse cx="71" cy="54" rx="5" ry="3" fill="#FFB7C5" />
          <ellipse cx="50" cy="60" rx="15" ry="9" fill="#FB923C" stroke="#334155" strokeWidth="3" />
          <path d="M40 60 Q50 65 60 60" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'frog':
      return (
        <g>
          <circle cx="32" cy="30" r="12" fill="#A8E6CF" stroke="#334155" strokeWidth="3.5" />
          <circle cx="68" cy="30" r="12" fill="#A8E6CF" stroke="#334155" strokeWidth="3.5" />
          <ellipse cx="50" cy="58" rx="34" ry="26" fill="#A8E6CF" stroke="#334155" strokeWidth="3.5" />
          <circle cx="32" cy="30" r="6" fill="#FFFFFF" />
          <circle cx="68" cy="30" r="6" fill="#FFFFFF" />
          <circle cx="32" cy="30" r="3" fill="#1E293B" />
          <circle cx="68" cy="30" r="3" fill="#1E293B" />
          <ellipse cx="28" cy="58" rx="5" ry="3.5" fill="#FFB7C5" />
          <ellipse cx="72" cy="58" rx="5" ry="3.5" fill="#FFB7C5" />
          <path d="M35 60 Q50 72 65 60" fill="none" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
        </g>
      );
    case 'lion':
      return (
        <g>
          <circle cx="50" cy="52" r="38" fill="#F59E0B" stroke="#334155" strokeWidth="3.5" strokeDasharray="10 4" />
          <circle cx="28" cy="28" r="8" fill="#FDE68A" stroke="#334155" strokeWidth="3" />
          <circle cx="72" cy="28" r="8" fill="#FDE68A" stroke="#334155" strokeWidth="3" />
          <circle cx="50" cy="52" r="26" fill="#FDE68A" stroke="#334155" strokeWidth="3.5" />
          <circle cx="40" cy="48" r="3.5" fill="#1E293B" />
          <circle cx="60" cy="48" r="3.5" fill="#1E293B" />
          <polygon points="46,54 54,54 50,59" fill="#92400E" />
          <path d="M43 63 Q50 68 57 63" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );
    case 'sheep':
      return (
        <g>
          <circle cx="50" cy="26" r="14" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <circle cx="30" cy="38" r="14" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <circle cx="70" cy="38" r="14" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <circle cx="28" cy="60" r="14" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <circle cx="72" cy="60" r="14" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <circle cx="50" cy="72" r="14" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <ellipse cx="50" cy="54" rx="22" ry="20" fill="#FDE68A" stroke="#334155" strokeWidth="3.5" />
          <circle cx="42" cy="50" r="3.5" fill="#1E293B" />
          <circle cx="58" cy="50" r="3.5" fill="#1E293B" />
          <path d="M44 60 Q50 65 56 60" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );
    case 'rooster':
      return (
        <g>
          <path d="M42 20 Q50 8 58 20 Q66 12 66 26 L40 26 Z" fill="#FB7185" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="50" cy="52" r="28" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />
          <circle cx="40" cy="46" r="3.8" fill="#1E293B" />
          <circle cx="60" cy="46" r="3.8" fill="#1E293B" />
          <polygon points="44,53 56,53 50,62" fill="#F59E0B" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="50" cy="69" rx="7" ry="6" fill="#FB7185" stroke="#334155" strokeWidth="2.5" />
        </g>
      );
    case 'elephant':
      return (
        <g>
          <ellipse cx="20" cy="48" rx="14" ry="22" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" />
          <ellipse cx="80" cy="48" rx="14" ry="22" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" />
          <circle cx="50" cy="48" r="26" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" />
          <circle cx="39" cy="44" r="3.5" fill="#1E293B" />
          <circle cx="61" cy="44" r="3.5" fill="#1E293B" />
          <path d="M46 52 Q46 78 60 76 Q66 74 62 67" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
          <path d="M46 52 Q46 78 60 76 Q66 74 62 67" fill="none" stroke="#A8D8F0" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      );
    case 'mouse':
      return (
        <g>
          <circle cx="26" cy="30" r="14" fill="#CBD5E1" stroke="#334155" strokeWidth="3.5" />
          <circle cx="74" cy="30" r="14" fill="#CBD5E1" stroke="#334155" strokeWidth="3.5" />
          <circle cx="26" cy="30" r="8" fill="#FFB7C5" />
          <circle cx="74" cy="30" r="8" fill="#FFB7C5" />
          <ellipse cx="50" cy="58" rx="26" ry="22" fill="#E2E8F0" stroke="#334155" strokeWidth="3.5" />
          <circle cx="40" cy="52" r="3.5" fill="#1E293B" />
          <circle cx="60" cy="52" r="3.5" fill="#1E293B" />
          <circle cx="50" cy="61" r="4" fill="#FB7185" />
        </g>
      );
    case 'penguin':
      return (
        <g>
          <ellipse cx="50" cy="54" rx="30" ry="34" fill="#334155" stroke="#1E293B" strokeWidth="3.5" />
          <ellipse cx="50" cy="60" rx="21" ry="25" fill="#FFFFFF" />
          <circle cx="40" cy="44" r="4" fill="#1E293B" />
          <circle cx="60" cy="44" r="4" fill="#1E293B" />
          <polygon points="44,50 56,50 50,58" fill="#F59E0B" />
          <ellipse cx="36" cy="86" rx="9" ry="5" fill="#F59E0B" />
          <ellipse cx="64" cy="86" rx="9" ry="5" fill="#F59E0B" />
        </g>
      );
    case 'monkey':
      return (
        <g>
          <circle cx="20" cy="46" r="11" fill="#D97706" stroke="#334155" strokeWidth="3.5" />
          <circle cx="80" cy="46" r="11" fill="#D97706" stroke="#334155" strokeWidth="3.5" />
          <circle cx="50" cy="50" r="28" fill="#B45309" stroke="#334155" strokeWidth="3.5" />
          <ellipse cx="50" cy="58" rx="20" ry="15" fill="#FDE68A" />
          <circle cx="41" cy="45" r="3.5" fill="#1E293B" />
          <circle cx="59" cy="45" r="3.5" fill="#1E293B" />
          <path d="M42 60 Q50 67 58 60" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );
    case 'rabbit':
      return (
        <g>
          <ellipse cx="36" cy="26" rx="9" ry="20" fill="#FFF1F2" stroke="#334155" strokeWidth="3.5" />
          <ellipse cx="64" cy="26" rx="9" ry="20" fill="#FFF1F2" stroke="#334155" strokeWidth="3.5" />
          <ellipse cx="36" cy="26" rx="4.5" ry="13" fill="#FFB7C5" />
          <ellipse cx="64" cy="26" rx="4.5" ry="13" fill="#FFB7C5" />
          <circle cx="50" cy="60" r="27" fill="#FFF1F2" stroke="#334155" strokeWidth="3.5" />
          <circle cx="39" cy="55" r="3.5" fill="#1E293B" />
          <circle cx="61" cy="55" r="3.5" fill="#1E293B" />
          <ellipse cx="50" cy="62" rx="4" ry="3" fill="#FB7185" />
          <path d="M44 68 Q50 72 56 68" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'bear':
      return (
        <g>
          <circle cx="26" cy="28" r="11" fill="#D97706" stroke="#334155" strokeWidth="3.5" />
          <circle cx="74" cy="28" r="11" fill="#D97706" stroke="#334155" strokeWidth="3.5" />
          <circle cx="50" cy="54" r="30" fill="#F59E0B" stroke="#334155" strokeWidth="3.5" />
          <ellipse cx="50" cy="62" rx="14" ry="11" fill="#FEF3C7" />
          <circle cx="39" cy="48" r="3.8" fill="#1E293B" />
          <circle cx="61" cy="48" r="3.8" fill="#1E293B" />
          <ellipse cx="50" cy="57" rx="5" ry="3.5" fill="#1E293B" />
          <path d="M44 65 Q50 69 56 65" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );
    case 'owl':
      return (
        <g>
          <ellipse cx="50" cy="54" rx="29" ry="32" fill="#D7C4F5" stroke="#334155" strokeWidth="3.5" />
          <circle cx="39" cy="44" r="11" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <circle cx="61" cy="44" r="11" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <circle cx="39" cy="44" r="4.5" fill="#1E293B" />
          <circle cx="61" cy="44" r="4.5" fill="#1E293B" />
          <polygon points="46,52 54,52 50,60" fill="#F59E0B" />
          <ellipse cx="50" cy="72" rx="14" ry="10" fill="#EDE9FE" />
        </g>
      );
    case 'fox':
      return (
        <g>
          <polygon points="22,40 24,14 44,28" fill="#FB923C" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="78,40 76,14 56,28" fill="#FB923C" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <ellipse cx="50" cy="54" rx="31" ry="26" fill="#FB923C" stroke="#334155" strokeWidth="3.5" />
          <path d="M22 58 Q36 52 50 78 Q64 52 78 58 Q68 78 50 80 Q32 78 22 58 Z" fill="#FFFFFF" />
          <circle cx="39" cy="48" r="3.5" fill="#1E293B" />
          <circle cx="61" cy="48" r="3.5" fill="#1E293B" />
          <circle cx="50" cy="64" r="4" fill="#1E293B" />
        </g>
      );
    case 'panda':
      return (
        <g>
          <circle cx="25" cy="27" r="11" fill="#1E293B" />
          <circle cx="75" cy="27" r="11" fill="#1E293B" />
          <circle cx="50" cy="54" r="30" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />
          <ellipse cx="38" cy="48" rx="9" ry="7" transform="rotate(-18 38 48)" fill="#1E293B" />
          <ellipse cx="62" cy="48" rx="9" ry="7" transform="rotate(18 62 48)" fill="#1E293B" />
          <circle cx="38" cy="47" r="2.8" fill="#FFFFFF" />
          <circle cx="62" cy="47" r="2.8" fill="#FFFFFF" />
          <ellipse cx="50" cy="59" rx="5" ry="3.5" fill="#1E293B" />
          <path d="M44 66 Q50 71 56 66" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );
    case 'koala':
      return (
        <g>
          <circle cx="21" cy="44" r="14" fill="#CBD5E1" stroke="#334155" strokeWidth="3.5" />
          <circle cx="79" cy="44" r="14" fill="#CBD5E1" stroke="#334155" strokeWidth="3.5" />
          <circle cx="50" cy="54" r="28" fill="#E2E8F0" stroke="#334155" strokeWidth="3.5" />
          <circle cx="39" cy="48" r="3.5" fill="#1E293B" />
          <circle cx="61" cy="48" r="3.5" fill="#1E293B" />
          <ellipse cx="50" cy="56" rx="6" ry="9" fill="#334155" />
        </g>
      );
    // Ocean animals
    case 'octopus':
      return (
        <g>
          <path d="M26 62 Q20 84 28 84 Q34 84 36 66 Q42 86 48 86 Q52 86 52 66 Q58 86 64 86 Q70 86 68 66 Q76 84 82 80 Q84 72 74 60" fill="#FFB7C5" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx="50" cy="44" r="26" fill="#FFB7C5" stroke="#334155" strokeWidth="3.5" />
          <circle cx="40" cy="42" r="4" fill="#1E293B" />
          <circle cx="60" cy="42" r="4" fill="#1E293B" />
          <path d="M43 52 Q50 58 57 52" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );
    case 'whale':
      return (
        <g>
          <path d="M18 56 Q18 28 52 28 Q80 28 82 54 Q82 74 52 74 Q22 74 18 56 Z" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" />
          <path d="M78 52 L92 40 L90 54 L94 64 Z" fill="#A8D8F0" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <path d="M48 28 Q48 16 38 14 M48 28 Q50 14 60 14" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          <circle cx="36" cy="48" r="3.8" fill="#1E293B" />
          <path d="M26 58 Q36 64 46 58" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );
    case 'crab':
      return (
        <g>
          <circle cx="22" cy="30" r="9" fill="#FB7185" stroke="#334155" strokeWidth="3" />
          <circle cx="78" cy="30" r="9" fill="#FB7185" stroke="#334155" strokeWidth="3" />
          <ellipse cx="50" cy="58" rx="28" ry="20" fill="#FB7185" stroke="#334155" strokeWidth="3.5" />
          <circle cx="40" cy="52" r="3.5" fill="#1E293B" />
          <circle cx="60" cy="52" r="3.5" fill="#1E293B" />
          <path d="M42 62 Q50 67 58 62" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="24" y1="64" x2="14" y2="74" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="76" y1="64" x2="86" y2="74" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    case 'seahorse':
      return (
        <g>
          <path d="M54 18 C72 18 72 40 58 48 C68 56 64 78 48 82 C38 84 36 74 44 72 C52 70 50 56 44 50 C34 42 36 18 54 18 Z" fill="#FFF1A8" stroke="#334155" strokeWidth="3.5" />
          <path d="M38 30 L24 32 L36 37" fill="#FFF1A8" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="48" cy="29" r="3" fill="#1E293B" />
        </g>
      );
    case 'starfish':
      return (
        <g>
          <polygon
            points="50,12 61,36 88,39 68,58 73,85 50,71 27,85 32,58 12,39 39,36"
            fill="#FDBA74"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="42" cy="48" r="3" fill="#1E293B" />
          <circle cx="58" cy="48" r="3" fill="#1E293B" />
          <path d="M44 57 Q50 62 56 57" fill="none" stroke="#334155" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );
    case 'fish':
      return (
        <g>
          <polygon points="72,50 90,34 90,66" fill="#FDBA74" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <ellipse cx="46" cy="50" rx="30" ry="22" fill="#FB923C" stroke="#334155" strokeWidth="3.5" />
          <path d="M44 29 Q48 50 44 71" fill="none" stroke="#FFFFFF" strokeWidth="6" />
          <circle cx="30" cy="46" r="3.8" fill="#1E293B" />
          <path d="M22 55 Q28 59 34 55" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'turtle':
      return (
        <g>
          <ellipse cx="50" cy="56" rx="28" ry="22" fill="#A8E6CF" stroke="#334155" strokeWidth="3.5" />
          <circle cx="80" cy="52" r="11" fill="#6EE7B7" stroke="#334155" strokeWidth="3.5" />
          <circle cx="83" cy="49" r="2.5" fill="#1E293B" />
          <ellipse cx="34" cy="78" rx="8" ry="5" fill="#6EE7B7" stroke="#334155" strokeWidth="3" />
          <ellipse cx="64" cy="78" rx="8" ry="5" fill="#6EE7B7" stroke="#334155" strokeWidth="3" />
          <path d="M36 52 L50 42 L64 52 L58 66 L42 66 Z" fill="#34D399" stroke="#334155" strokeWidth="2.5" />
        </g>
      );
    case 'shark':
      return (
        <g>
          <polygon points="48,14 58,34 38,34" fill="#94A3B8" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="48" cy="54" rx="34" ry="20" fill="#CBD5E1" stroke="#334155" strokeWidth="3.5" />
          <polygon points="78,54 94,40 90,54 94,68" fill="#94A3B8" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="28" cy="49" r="3.5" fill="#1E293B" />
          <path d="M20 58 Q30 63 38 58" fill="none" stroke="#334155" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );
    // Foods & Objects
    case 'apple':
      return (
        <g>
          <path d="M50 24 Q50 12 60 12" fill="none" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="59" cy="18" rx="9" ry="5" transform="rotate(-25 59 18)" fill="#A8E6CF" stroke="#334155" strokeWidth="2.5" />
          <path d="M50 28 C30 22 18 38 22 60 C26 80 42 86 50 80 C58 86 74 80 78 60 C82 38 70 22 50 28 Z" fill="#FB7185" stroke="#334155" strokeWidth="3.5" />
          <circle cx="36" cy="44" r="4" fill="#FFE4E6" opacity="0.7" />
        </g>
      );
    case 'banana':
      return (
        <g>
          <path d="M26 68 C42 82 72 72 80 34 C82 24 76 18 72 22 C64 48 44 58 24 56 C18 56 18 62 26 68 Z" fill="#FFF1A8" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
        </g>
      );
    case 'strawberry':
      return (
        <g>
          <path d="M34 26 L50 16 L66 26 L58 32 L42 32 Z" fill="#6EE7B7" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <path d="M24 38 C24 26 76 26 76 38 C76 62 58 84 50 84 C42 84 24 62 24 38 Z" fill="#FB7185" stroke="#334155" strokeWidth="3.5" />
          <circle cx="40" cy="46" r="2.2" fill="#FFF1A8" />
          <circle cx="56" cy="44" r="2.2" fill="#FFF1A8" />
          <circle cx="48" cy="58" r="2.2" fill="#FFF1A8" />
          <circle cx="38" cy="62" r="2.2" fill="#FFF1A8" />
          <circle cx="60" cy="60" r="2.2" fill="#FFF1A8" />
        </g>
      );
    case 'carrot':
      return (
        <g>
          <path d="M44 26 Q38 10 46 14 Q50 8 54 14 Q62 10 56 26" fill="none" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round" />
          <polygon points="32,30 68,30 50,86" fill="#FB923C" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <line x1="40" y1="44" x2="54" y2="44" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="44" y1="58" x2="56" y2="58" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'broccoli':
      return (
        <g>
          <rect x="42" y="54" width="16" height="28" rx="6" fill="#A8E6CF" stroke="#334155" strokeWidth="3.5" />
          <circle cx="34" cy="42" r="14" fill="#34D399" stroke="#334155" strokeWidth="3.5" />
          <circle cx="66" cy="42" r="14" fill="#34D399" stroke="#334155" strokeWidth="3.5" />
          <circle cx="50" cy="30" r="16" fill="#34D399" stroke="#334155" strokeWidth="3.5" />
        </g>
      );
    case 'milk':
      return (
        <g>
          <polygon points="30,34 50,18 70,34" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <rect x="30" y="34" width="40" height="50" rx="6" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />
          <rect x="30" y="50" width="40" height="16" fill="#A8D8F0" />
        </g>
      );
    case 'candy':
      return (
        <g>
          <polygon points="16,38 30,50 16,62" fill="#FFB7C5" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="84,38 70,50 84,62" fill="#FFB7C5" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="20" fill="#D7C4F5" stroke="#334155" strokeWidth="3.5" />
          <path d="M42 34 L58 66 M34 46 L66 54" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case 'donut':
      return (
        <g>
          <circle cx="50" cy="50" r="32" fill="#FDE68A" stroke="#334155" strokeWidth="3.5" />
          <path d="M22 46 C22 24 78 24 78 46 C72 52 64 46 58 52 C52 58 42 46 34 52 C28 56 22 50 22 46 Z" fill="#FFB7C5" stroke="#334155" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="10" fill="#FFFDF7" stroke="#334155" strokeWidth="3.5" />
        </g>
      );
    case 'chips':
      return (
        <g>
          <rect x="26" y="22" width="48" height="58" rx="10" fill="#FDE047" stroke="#334155" strokeWidth="3.5" />
          <circle cx="50" cy="50" r="12" fill="#FB7185" />
        </g>
      );
    case 'soda':
      return (
        <g>
          <path d="M46 14 L54 14 L52 28" fill="none" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" />
          <rect x="32" y="28" width="36" height="54" rx="8" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" />
          <rect x="30" y="24" width="40" height="8" rx="4" fill="#E2E8F0" stroke="#334155" strokeWidth="3" />
        </g>
      );
    case 'ball':
      return (
        <g>
          <circle cx="50" cy="50" r="34" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" />
          <path d="M50 16 Q66 50 50 84" fill="#FFF1A8" stroke="#334155" strokeWidth="3" />
          <path d="M50 16 Q34 50 50 84" fill="#FFB7C5" stroke="#334155" strokeWidth="3" />
          <circle cx="50" cy="18" r="5" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
        </g>
      );
    case 'sun':
      return (
        <g>
          <circle cx="50" cy="50" r="22" fill="#FFF1A8" stroke="#F59E0B" strokeWidth="3.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="14"
              x2="50"
              y2="22"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
          <circle cx="43" cy="48" r="2.5" fill="#1E293B" />
          <circle cx="57" cy="48" r="2.5" fill="#1E293B" />
          <path d="M44 55 Q50 60 56 55" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'moon':
      return (
        <g>
          <path d="M62 20 C40 20 26 36 26 52 C26 70 42 84 64 80 C48 74 44 58 46 44 C48 32 54 24 62 20 Z" fill="#FFF1A8" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
        </g>
      );
    case 'star':
      return (
        <g>
          <polygon points="50,12 61,36 88,39 68,58 73,85 50,71 27,85 32,58 12,39 39,36" fill="#FFF1A8" stroke="#F59E0B" strokeWidth="3.5" strokeLinejoin="round" />
        </g>
      );
    case 'tree':
      return (
        <g>
          <rect x="43" y="56" width="14" height="28" rx="4" fill="#B45309" stroke="#334155" strokeWidth="3" />
          <circle cx="50" cy="42" r="24" fill="#A8E6CF" stroke="#334155" strokeWidth="3.5" />
          <circle cx="34" cy="46" r="14" fill="#A8E6CF" stroke="#334155" strokeWidth="3.5" />
          <circle cx="66" cy="46" r="14" fill="#A8E6CF" stroke="#334155" strokeWidth="3.5" />
        </g>
      );
    case 'flower':
      return (
        <g>
          <line x1="50" y1="54" x2="50" y2="86" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <circle
              key={deg}
              cx="50"
              cy="26"
              r="11"
              fill="#FFB7C5"
              stroke="#334155"
              strokeWidth="2.8"
              transform={`rotate(${deg} 50 42)`}
            />
          ))}
          <circle cx="50" cy="42" r="11" fill="#FFF1A8" stroke="#334155" strokeWidth="3" />
        </g>
      );
    case 'house':
      return (
        <g>
          <rect x="24" y="46" width="52" height="38" rx="4" fill="#FFF1A8" stroke="#334155" strokeWidth="3.5" />
          <polygon points="16,48 50,18 84,48" fill="#FFB7C5" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <rect x="42" y="60" width="16" height="24" rx="3" fill="#A8D8F0" stroke="#334155" strokeWidth="3" />
        </g>
      );
    case 'rocket':
      return (
        <g>
          <polygon points="32,62 20,76 34,74" fill="#FFB7C5" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="68,62 80,76 66,74" fill="#FFB7C5" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <path d="M50 14 C66 28 68 54 64 72 L36 72 C32 54 34 28 50 14 Z" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx="50" cy="44" r="9" fill="#A8D8F0" stroke="#334155" strokeWidth="3" />
          <polygon points="44,72 56,72 50,86" fill="#F59E0B" />
        </g>
      );
    case 'clock':
      return (
        <g>
          <circle cx="50" cy="52" r="32" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" />
          <circle cx="50" cy="52" r="24" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
          <line x1="50" y1="52" x2="50" y2="34" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="52" x2="64" y2="52" stroke="#FB7185" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="50" cy="52" r="3" fill="#334155" />
        </g>
      );
    case 'window':
      return (
        <g>
          <rect x="20" y="20" width="60" height="60" rx="6" fill="#A8D8F0" stroke="#334155" strokeWidth="4" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="#334155" strokeWidth="3.5" />
          <line x1="20" y1="50" x2="80" y2="50" stroke="#334155" strokeWidth="3.5" />
        </g>
      );
    case 'kite':
      return (
        <g>
          <polygon points="50,14 78,44 50,74 22,44" fill="#D7C4F5" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <line x1="50" y1="14" x2="50" y2="74" stroke="#334155" strokeWidth="2.5" />
          <line x1="22" y1="44" x2="78" y2="44" stroke="#334155" strokeWidth="2.5" />
          <path d="M50 74 Q42 82 54 88" fill="none" stroke="#FB7185" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'hat':
      return (
        <g>
          <path d="M30 56 C30 30 70 30 70 56 Z" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" />
          <rect x="28" y="48" width="44" height="8" fill="#FFB7C5" stroke="#334155" strokeWidth="2.5" />
          <ellipse cx="50" cy="58" rx="36" ry="9" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" />
        </g>
      );
    case 'umbrella':
      return (
        <g>
          <path d="M50 48 L50 78 C50 84 40 84 40 78" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <path d="M16 50 C16 24 84 24 84 50 Z" fill="#D7C4F5" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
        </g>
      );
    case 'book':
      return (
        <g>
          <rect x="22" y="20" width="56" height="60" rx="6" fill="#A8E6CF" stroke="#334155" strokeWidth="3.5" />
          <line x1="34" y1="20" x2="34" y2="80" stroke="#334155" strokeWidth="3" />
          <rect x="44" y="34" width="24" height="12" rx="3" fill="#FFFDF7" />
        </g>
      );
    case 'butterfly':
      return (
        <g>
          <ellipse cx="32" cy="40" rx="18" ry="14" fill="#FFB7C5" stroke="#334155" strokeWidth="3.5" />
          <ellipse cx="68" cy="40" rx="18" ry="14" fill="#FFB7C5" stroke="#334155" strokeWidth="3.5" />
          <ellipse cx="35" cy="64" rx="14" ry="12" fill="#FFF1A8" stroke="#334155" strokeWidth="3.5" />
          <ellipse cx="65" cy="64" rx="14" ry="12" fill="#FFF1A8" stroke="#334155" strokeWidth="3.5" />
          <rect x="46" y="30" width="8" height="44" rx="4" fill="#334155" />
        </g>
      );
    case 'cupcake':
      return (
        <g>
          <polygon points="28,54 72,54 64,82 36,82" fill="#FDE68A" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M24 54 C24 34 76 34 76 54 Z" fill="#FFB7C5" stroke="#334155" strokeWidth="3.5" />
          <circle cx="50" cy="28" r="7" fill="#FB7185" stroke="#334155" strokeWidth="3" />
        </g>
      );
    case 'grapes':
      return (
        <g>
          <line x1="50" y1="16" x2="50" y2="28" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          {[
            [38, 36], [50, 36], [62, 36],
            [44, 50], [56, 50],
            [50, 64],
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="10" fill="#D7C4F5" stroke="#334155" strokeWidth="3" />
          ))}
        </g>
      );
    case 'pineapple':
      return (
        <g>
          <polygon points="50,12 40,30 60,30" fill="#34D399" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="50" cy="58" rx="22" ry="26" fill="#FFF1A8" stroke="#334155" strokeWidth="3.5" />
          <line x1="36" y1="46" x2="64" y2="68" stroke="#F59E0B" strokeWidth="2.5" />
          <line x1="64" y1="46" x2="36" y2="68" stroke="#F59E0B" strokeWidth="2.5" />
        </g>
      );
    case 'shoe':
      return (
        <g>
          <path d="M22 46 L46 46 L52 60 L78 64 C84 65 84 76 76 76 L22 76 Z" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <rect x="20" y="74" width="60" height="7" rx="3" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
        </g>
      );
    case 'airplane':
      return (
        <g>
          <polygon points="36,36 52,18 56,42" fill="#A8D8F0" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="50" cy="52" rx="34" ry="12" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />
          <polygon points="40,56 54,80 58,56" fill="#FFB7C5" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
        </g>
      );
    case 'torch':
      return (
        <g>
          <polygon points="40,48 60,48 54,84 46,84" fill="#FDBA74" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M50 14 C64 26 64 46 50 48 C36 46 36 26 50 14 Z" fill="#FB923C" stroke="#334155" strokeWidth="3" />
        </g>
      );
    case 'pizza':
      return (
        <g>
          <polygon points="50,14 82,78 18,78" fill="#FFF1A8" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M16 74 Q50 84 84 74" fill="none" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
          <circle cx="50" cy="48" r="6" fill="#FB7185" />
          <circle cx="40" cy="64" r="5" fill="#FB7185" />
          <circle cx="60" cy="64" r="5" fill="#FB7185" />
        </g>
      );
    // Emotions
    case 'happy':
      return (
        <g>
          <circle cx="50" cy="50" r="36" fill="#FFF1A8" stroke="#334155" strokeWidth="3.5" />
          <circle cx="37" cy="42" r="4.5" fill="#1E293B" />
          <circle cx="63" cy="42" r="4.5" fill="#1E293B" />
          <ellipse cx="28" cy="54" rx="6" ry="3.5" fill="#FFB7C5" />
          <ellipse cx="72" cy="54" rx="6" ry="3.5" fill="#FFB7C5" />
          <path d="M34 56 Q50 74 66 56 Z" fill="#FB7185" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
        </g>
      );
    case 'sad':
      return (
        <g>
          <circle cx="50" cy="50" r="36" fill="#A8D8F0" stroke="#334155" strokeWidth="3.5" />
          <circle cx="37" cy="44" r="4.5" fill="#1E293B" />
          <circle cx="63" cy="44" r="4.5" fill="#1E293B" />
          <path d="M36 66 Q50 54 64 66" fill="none" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M32 52 Q30 60 34 62 Q38 60 32 52 Z" fill="#60A5FA" />
        </g>
      );
    case 'angry':
      return (
        <g>
          <circle cx="50" cy="50" r="36" fill="#FFB7C5" stroke="#334155" strokeWidth="3.5" />
          <line x1="29" y1="35" x2="43" y2="41" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="71" y1="35" x2="57" y2="41" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="37" cy="46" r="4" fill="#1E293B" />
          <circle cx="63" cy="46" r="4" fill="#1E293B" />
          <path d="M38 66 Q50 58 62 66" fill="none" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    case 'surprised':
      return (
        <g>
          <circle cx="50" cy="50" r="36" fill="#D7C4F5" stroke="#334155" strokeWidth="3.5" />
          <path d="M31 34 Q37 29 43 34" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <path d="M57 34 Q63 29 69 34" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <circle cx="37" cy="45" r="4.5" fill="#1E293B" />
          <circle cx="63" cy="45" r="4.5" fill="#1E293B" />
          <ellipse cx="50" cy="64" rx="8" ry="10" fill="#FB7185" stroke="#334155" strokeWidth="3" />
        </g>
      );
    case 'sleepy':
      return (
        <g>
          <circle cx="50" cy="50" r="36" fill="#A8E6CF" stroke="#334155" strokeWidth="3.5" />
          <path d="M30 46 Q37 52 44 46" fill="none" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M56 46 Q63 52 70 46" fill="none" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="50" cy="63" r="5" fill="#FB7185" stroke="#334155" strokeWidth="2.8" />
        </g>
      );
    case 'silly':
      return (
        <g>
          <circle cx="50" cy="50" r="36" fill="#FED7AA" stroke="#334155" strokeWidth="3.5" />
          <circle cx="37" cy="43" r="4.5" fill="#1E293B" />
          <path d="M56 43 Q63 38 70 43" fill="none" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M35 58 Q50 68 65 58" fill="none" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M46 62 L46 72 C46 76 56 76 56 72 L56 62 Z" fill="#FB7185" stroke="#334155" strokeWidth="2.5" />
        </g>
      );
  }
}
