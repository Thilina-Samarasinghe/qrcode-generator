'use client';

import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, ScanLine, X, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ScannedEvent {
  title: string;
  date: string;
  location: string;
  ticketPrice: number;
}

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanning(true);
        scanFrame();
      }
    } catch {
      setError('Camera access denied. Please allow camera permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const verifyTicket = async (data: any) => {
    setVerifying(true);
    stopCamera();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.isValid) {
        setScannedData(result.data);
      } else {
        setError(result.message || 'Invalid or tampered ticket detected!');
      }
    } catch (err) {
      setError('Failed to verify ticket with the server. Please check your connection.');
    } finally {
      setVerifying(false);
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || verifying) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });
    if (code) {
      try {
        const parsed = JSON.parse(code.data);
        if (parsed.title && parsed.signature) {
          verifyTicket(parsed);
          return;
        }
      } catch {
        // not a valid event QR
      }
    }
    animFrameRef.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => () => stopCamera(), []);

  const reset = () => {
    setScannedData(null);
    setError(null);
    setScanning(false);
  };

  return (
    <div className="page-container">
      <div className="form-card" style={{ maxWidth: '560px' }}>
        <Link href="/" className="back-link">
          ← Back to Events
        </Link>

        <div className="form-header">
          <div className="form-icon">
            <ScanLine size={28} />
          </div>
          <h1>Scan QR Ticket</h1>
          <p>Point your camera at an event QR code to verify it</p>
        </div>

        {!scannedData && !scanning && !error && (
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <button onClick={startCamera} className="submit-btn">
              <Camera size={18} /> Start Camera
            </button>
          </div>
        )}

        {error && (
          <div className="scan-error">
            <AlertCircle size={20} />
            <p>{error}</p>
            <button onClick={startCamera} className="submit-btn" style={{ marginTop: '16px' }}>
              Retry
            </button>
          </div>
        )}

        {scanning && (
          <div className="scan-viewport">
            <video ref={videoRef} className="scan-video" playsInline muted />
            <div className="scan-line" />
            <button onClick={stopCamera} className="scan-stop">
              <X size={18} /> Stop
            </button>
          </div>
        )}

        {verifying && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p>Verifying ticket integrity...</p>
          </div>
        )}

        {scannedData && (
          <div className="scan-result">
            <div className="scan-success-icon">
              <CheckCircle size={36} />
            </div>
            <h2 className="scan-result-title">Valid Ticket!</h2>
            <div className="scan-result-details">
              <div className="meta-item">
                <strong>Event:</strong> {scannedData.title}
              </div>
              <div className="meta-item">
                <strong>Date:</strong> {new Date(scannedData.date).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </div>
              <div className="meta-item">
                <strong>Location:</strong> {scannedData.location}
              </div>
              <div className="meta-item">
                <strong>Ticket Price:</strong>{' '}
                <span className="price-tag">${Number(scannedData.ticketPrice).toFixed(2)}</span>
              </div>
            </div>
            <button onClick={reset} className="submit-btn" style={{ marginTop: '20px' }}>
              Scan Another
            </button>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
