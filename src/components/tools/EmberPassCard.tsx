import React, { useRef, useEffect, useState } from 'react';
import { getMemberBySlug, getCurrentCampaign } from '../../utils/contentLoader';

type Props = {
  name: string;
  favoriteMemberId: string;
};

export const EmberPassCard: React.FC<Props> = ({ name, favoriteMemberId }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [memberNumber, setMemberNumber] = useState<string>('');
  const currentCampaign = getCurrentCampaign();

  const favMember = getMemberBySlug(favoriteMemberId);
  const accentHex = favMember?.colorHex || '#55A8FF';

  useEffect(() => {
    let savedNum = localStorage.getItem('ignite_ember_pass_number');
    if (!savedNum) {
      savedNum = Math.floor(10000000 + Math.random() * 90000000).toString();
      localStorage.setItem('ignite_ember_pass_number', savedNum);
    }
    setMemberNumber(savedNum);
  }, []);

  const exportAsPng = () => {
    if (!svgRef.current) return;
    const svgElement = svgRef.current;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 760;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(image, 0, 0, 1200, 760);
        const png = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = png;
        downloadLink.download = `ignite-ember-pass-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = blobURL;
  };

  const currentDateStr = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px', filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.8))' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 1200 760"
          width="100%"
          height="auto"
          xmlns="http://www.w3.org/2000/svg"
          style={{ borderRadius: '8px', overflow: 'hidden' }}
        >
          <defs>
            <linearGradient id="passBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#11151D" />
              <stop offset="100%" stopColor="#080A0F" />
            </linearGradient>
            <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentHex} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#55A8FF" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Background & Border */}
          <rect width="1200" height="760" fill="url(#passBg)" rx="16" />
          <rect x="2" y="2" width="1196" height="756" fill="none" stroke="#2A303C" strokeWidth="4" rx="14" />
          <rect x="20" y="20" width="1160" height="720" fill="none" stroke={accentHex} strokeWidth="2" strokeOpacity="0.4" rx="10" />

          {/* Top Bar Glow */}
          <rect x="20" y="20" width="1160" height="8" fill="url(#accentGlow)" />

          {/* IGNITE Header */}
          <text x="60" y="110" fill="#F6F3ED" fontFamily="'Bebas Neue', sans-serif" fontSize="64" letterSpacing="6">
            IGNITE OFFICIAL
          </text>
          <text x="60" y="150" fill={accentHex} fontFamily="'IBM Plex Mono', monospace" fontSize="24" letterSpacing="4">
            EMBER DIGITAL PASS // {currentCampaign.eyebrow.split('/')[0]} {currentCampaign.title.toUpperCase()} ERA
          </text>

          {/* Five Lights Motif */}
          <g transform="translate(1020, 70)">
            <rect x="0" y="0" width="6" height="40" fill="#D62839" rx="2" />
            <rect x="14" y="0" width="6" height="40" fill="#7B5CFF" rx="2" />
            <rect x="28" y="0" width="6" height="40" fill="#FF8A24" rx="2" />
            <rect x="42" y="0" width="6" height="40" fill="#D9B44A" rx="2" />
            <rect x="56" y="0" width="6" height="40" fill="#2450A4" rx="2" />
          </g>

          {/* Decorative Divider */}
          <line x1="60" y1="180" x2="1140" y2="180" stroke="#2A303C" strokeWidth="2" />

          {/* Display Name */}
          <text x="60" y="260" fill="#AEB6C4" fontFamily="'IBM Plex Mono', monospace" fontSize="22" letterSpacing="2">
            MEMBER NAME
          </text>
          <text x="60" y="330" fill="#F6F3ED" fontFamily="'Noto Sans JP', sans-serif" fontWeight="700" fontSize="56">
            {name || 'EMBER MEMBER'}
          </text>

          {/* Member Number & Join Date */}
          <g transform="translate(60, 420)">
            <text x="0" y="0" fill="#AEB6C4" fontFamily="'IBM Plex Mono', monospace" fontSize="20" letterSpacing="2">
              EMBER ID NUMBER
            </text>
            <text x="0" y="45" fill={accentHex} fontFamily="'IBM Plex Mono', monospace" fontWeight="600" fontSize="42" letterSpacing="4">
              #{memberNumber}
            </text>

            <text x="500" y="0" fill="#AEB6C4" fontFamily="'IBM Plex Mono', monospace" fontSize="20" letterSpacing="2">
              ISSUED DATE
            </text>
            <text x="500" y="45" fill="#F6F3ED" fontFamily="'IBM Plex Mono', monospace" fontSize="36">
              {currentDateStr}
            </text>
          </g>

          {/* Favorite Member Accent Tag */}
          <g transform="translate(60, 570)">
            <text x="0" y="0" fill="#AEB6C4" fontFamily="'IBM Plex Mono', monospace" fontSize="20" letterSpacing="2">
              SPOTLIGHT ACCENT
            </text>
            <rect x="0" y="15" width="300" height="50" fill={accentHex} fillOpacity="0.2" stroke={accentHex} strokeWidth="2" rx="4" />
            <text x="20" y="50" fill="#F6F3ED" fontFamily="'Bebas Neue', sans-serif" fontSize="32" letterSpacing="3">
              {favMember ? `${favMember.nameEn} (${favMember.colorName})` : 'FIVE MEMBERS'}
            </text>
          </g>

          {/* Footer Copy */}
          <text x="60" y="690" fill="#717D96" fontFamily="'IBM Plex Mono', monospace" fontSize="18">
            WE DON’T JUST PERFORM. WE BURN. — OFFICIAL FAN IDENTIFICATION
          </text>
        </svg>
      </div>

      <button onClick={exportAsPng} className="btn-primary">
        DOWNLOAD PASS PNG (1200×760) ⬇
      </button>
    </div>
  );
};
