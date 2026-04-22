'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, ZoomIn, CheckCircle } from 'lucide-react';

interface QRDisplayProps {
  qrCode: string;
  title: string;
  compact?: boolean;
}

export default function QRDisplay({ qrCode, title, compact = false }: QRDisplayProps) {
  const [showModal, setShowModal] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <>
      <div className="qr-wrapper">
        <div className="qr-image-container" onClick={() => setShowModal(true)}>
          <img src={qrCode} alt={`QR for ${title}`} className="qr-image" />
          <div className="qr-overlay">
            <ZoomIn size={22} />
            <span>Enlarge</span>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className={`qr-download-btn ${downloaded ? 'downloaded' : ''}`}
        >
          {downloaded ? (
            <>
              <CheckCircle size={16} /> Saved!
            </>
          ) : (
            <>
              <Download size={16} /> Download QR
            </>
          )}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{title}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-qr">
              <img src={qrCode} alt={`QR for ${title}`} className="modal-qr-image" />
            </div>
            <p className="modal-hint">Scan to view event details</p>
            <button onClick={handleDownload} className="qr-download-btn modal-download">
              <Download size={16} /> Download PNG
            </button>
          </div>
        </div>
      )}
    </>
  );
}
