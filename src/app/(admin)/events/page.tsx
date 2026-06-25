'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Calendar, Trash2, Clock, Star } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadEvents = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.getEvents(p);
      setEvents(res.events);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(page); }, [page]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o evento "${title}"?`)) return;
    try {
      await api.deleteEvent(id);
      loadEvents(page);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.toLocaleDateString('pt-BR', { day: '2-digit' }),
      month: date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Eventos</h2>
      </div>

      {loading ? (
        <div className="text-gray-400">Carregando...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
          <p>Nenhum evento encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const dateInfo = formatDate(event.event_date);
            return (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {event.image_url ? (
                  <img src={event.image_url} alt="" className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-r from-[#C4795B] to-[#A85D3F] flex items-center justify-center">
                    <Calendar className="text-white/50" size={48} />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{event.title}</h3>
                      {event.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                    <div className="ml-3 flex-shrink-0 text-center bg-[#C4795B]/10 rounded-lg px-3 py-2">
                      <p className="text-lg font-bold text-[#C4795B]">{dateInfo.day}</p>
                      <p className="text-[10px] font-medium text-[#C4795B]/70">{dateInfo.month}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      {dateInfo.time}
                      {event.is_seasonal && (
                        <span className="ml-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px]">
                          <Star size={10} /> Sazonal
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(event.id, event.title)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm text-gray-600 hover:underline disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-sm text-gray-600 hover:underline disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
