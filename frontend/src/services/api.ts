import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  ticketPrice: number;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  date: string;
  location: string;
  ticketPrice: number;
}

export const eventApi = {
  createEvent: async (payload: CreateEventPayload): Promise<Event> => {
    const { data } = await api.post<Event>('/events', payload);
    return data;
  },

  getAllEvents: async (): Promise<Event[]> => {
    const { data } = await api.get<Event[]>('/events');
    return data;
  },

  getEventById: async (id: string): Promise<Event> => {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};
