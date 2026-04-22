'use client';

import { useEffect, useState } from 'react';
import { eventApi, Event } from '@/services/api';
import Link from 'next/link';
import QRDisplay from '@/app/components/QRDisplay';
import {
  CalendarDays,
  MapPin,
  DollarSign,
  Plus,
  QrCode,
  Inbox,
  ScanLine,
} from 'lucide-react';
import toast from 'react-hot-toast';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi
      .getAllEvents()
      .then(setEvents)
      .catch(() => toast.error('Could not load events'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">
            <QrCode size={16} /> QR Event Platform
          </div>
          <h1 className="hero-title">
            Create Events,
            <br />
            <span className="gradient-text">Generate QR Tickets</span>
          </h1>
          <p className="hero-subtitle">
            Instantly generate scannable QR codes for your events. Share, scan, and verify — all in seconds.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/create-event" className="hero-cta">
              <Plus size={20} /> Create Event
            </Link>
            <Link href="/scan" className="hero-cta" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', color: 'var(--purple-light)', boxShadow: 'none' }}>
              <ScanLine size={20} /> Scan QR
            </Link>
          </div>
        </div>
      </header>

      {/* Events Grid */}
      <main className="events-section">
        <div className="events-section-header">
          <h2>All Events</h2>
          <Link href="/create-event" className="create-mini-btn">
            <Plus size={16} /> New Event
          </Link>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <Inbox size={48} />
            <h3>No events yet</h3>
            <p>Create your first event and get a QR ticket instantly.</p>
            <Link href="/create-event" className="hero-cta">
              <Plus size={18} /> Create First Event
            </Link>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <article key={event.id} className="event-card">
                <div className="event-card-body">
                  <div className="event-card-header">
                    <span className="event-price-badge">${event.ticketPrice.toFixed(2)}</span>
                    <h3 className="event-card-title">
                      <Link href={`/events/${event.id}`}>{event.title}</Link>
                    </h3>
                  </div>

                  <div className="event-card-meta">
                    <div className="meta-row">
                      <CalendarDays size={14} />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="meta-row">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="event-card-qr">
                  <QRDisplay qrCode={event.qrCode} title={event.title} compact />
                </div>

                <Link href={`/events/${event.id}`} className="event-card-link">
                  View Details →
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
