'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { eventApi, Event } from '@/services/api';
import QRDisplay from '@/app/components/QRDisplay';
import {
  CalendarDays,
  MapPin,
  DollarSign,
  Clock,
  ArrowLeft,
  Trash2,
  QrCode,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventApi.getEventById(id);
        setEvent(data);
      } catch {
        toast.error('Event not found');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await eventApi.deleteEvent(id);
      toast.success('Event deleted');
      router.push('/');
    } catch {
      toast.error('Failed to delete event');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-lg" />
        <p>Loading event…</p>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="detail-page">
      <div className="detail-container">
        <Link href="/" className="back-link">
          <ArrowLeft size={18} /> All Events
        </Link>

        <div className="detail-grid">
          {/* Left: Event Info */}
          <div className="detail-info-card">
            <div className="event-badge">
              <QrCode size={16} /> QR Ticket
            </div>
            <h1 className="detail-title">{event.title}</h1>

            <div className="detail-meta">
              <div className="meta-item">
                <CalendarDays size={18} />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="meta-item">
                <Clock size={18} />
                <span>{formatTime(event.date)}</span>
              </div>
              <div className="meta-item">
                <MapPin size={18} />
                <span>{event.location}</span>
              </div>
              <div className="meta-item price-item">
                <DollarSign size={18} />
                <span className="price-tag">${event.ticketPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="detail-footer">
              <p className="created-at">
                Created {new Date(event.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={handleDelete}
                className="delete-btn"
                disabled={deleting}
              >
                {deleting ? (
                  <><span className="spinner" /> Deleting…</>
                ) : (
                  <><Trash2 size={16} /> Delete Event</>
                )}
              </button>
            </div>
          </div>

          {/* Right: QR Code */}
          <div className="detail-qr-card">
            <h2 className="qr-card-title">Event QR Code</h2>
            <p className="qr-card-subtitle">
              Scan this code at the venue to verify your ticket
            </p>
            <QRDisplay qrCode={event.qrCode} title={event.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
