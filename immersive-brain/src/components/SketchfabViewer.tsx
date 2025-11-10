import React, { useEffect, useRef, useState } from 'react';

// Minimal typings for Sketchfab API
declare global {
  interface Window {
    Sketchfab: any;
  }
}

interface SketchfabViewerProps {
  uid: string; // Sketchfab model UID
  transparent?: boolean;
  autostart?: boolean;
}

export default function SketchfabViewer({ uid, transparent = true, autostart = true }: SketchfabViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = document.querySelector('#sketchfab-api') as HTMLScriptElement;
    const ensureInit = () => {
      if (!containerRef.current || !window.Sketchfab) return;
      const client = new window.Sketchfab('1.12.1', containerRef.current);

      client.init(uid, {
        autostart: autostart ? 1 : 0,
        transparent: transparent ? 1 : 0,
        ui_infos: 0,
        ui_controls: 1,
        ui_watermark: 0,
        scrollwheel: 1,
        camera: 0,
        success: (api: any) => {
          api.start();
          // Optional: tweak background and camera
          try {
            api.addEventListener('viewerready', function () {
              api.setBackground({ color: [0, 0, 0, 0] });
            });
          } catch {}
        },
        error: () => setError('Impossible de charger le viewer Sketchfab. Vérifie ta connexion ou réessaie.')
      });
    };

    if (!script) {
      script = document.createElement('script');
      script.id = 'sketchfab-api';
      script.async = true;
      script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
      script.onload = ensureInit;
      script.onerror = () => setError('Chargement de l\'API Sketchfab échoué.');
      document.body.appendChild(script);
    } else {
      ensureInit();
    }

    return () => {
      // The Sketchfab API doesn't expose a destroy method for the injected iframe.
      // We clear the container to avoid duplicates when unmounting.
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [uid, autostart, transparent]);

  return (
    <div className="w-full h-full">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm z-10">
          {error}
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
