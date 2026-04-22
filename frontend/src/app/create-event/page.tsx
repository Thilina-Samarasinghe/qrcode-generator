'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventApi, CreateEventPayload } from '@/services/api';
import { CalendarDays, MapPin, DollarSign, Tag, Sparkles, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateEventPayload>({
    title: '',
    date: '',
    location: '',
    ticketPrice: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'ticketPrice' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location || form.ticketPrice <= 0) {
      toast.error('Please fill in all fields correctly.');
      return;
    }
    setLoading(true);
    try {
      const event = await eventApi.createEvent(form);
      toast.success('Event created & QR generated! 🎉');
      router.push(`/events/${event.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to create event';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <Link href="/" className="back-link">
          <ArrowLeft size={18} /> Back to Events
        </Link>

        <div className="form-header">
          <div className="form-icon">
            <Sparkles size={28} />
          </div>
          <h1>Create New Event</h1>
          <p>Fill in the details to generate a unique QR ticket</p>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="field-group">
            <label htmlFor="title">
              <Tag size={16} /> Event Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Tech Summit 2025"
              value={form.title}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>

          <div className="field-group">
            <label htmlFor="date">
              <CalendarDays size={16} /> Date & Time
            </label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="location">
              <MapPin size={16} /> Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Convention Center, New York"
              value={form.location}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>

          <div className="field-group">
            <label htmlFor="ticketPrice">
              <DollarSign size={16} /> Ticket Price (USD)
            </label>
            <input
              id="ticketPrice"
              name="ticketPrice"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="e.g. 49.99"
              value={form.ticketPrice || ''}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" /> Generating QR…
              </span>
            ) : (
              <>
                <Sparkles size={18} /> Generate QR Ticket
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
