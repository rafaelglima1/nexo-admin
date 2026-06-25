'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { MessageSquare, Users, Clock, StopCircle } from 'lucide-react';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [liveFilter, setLiveFilter] = useState<boolean | undefined>(undefined);

  const loadRooms = async (p = 1, live?: boolean) => {
    setLoading(true);
    try {
      const res = await api.getRooms(p, live);
      setRooms(res.rooms);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRooms(page, liveFilter); }, [page, liveFilter]);

  const handleEndRoom = async (id: string) => {
    if (!confirm('Tem certeza que deseja encerrar esta sala?')) return;
    try {
      await api.endRoom(id);
      loadRooms(page, liveFilter);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Salas</h2>
        <div className="flex gap-2">
          {[undefined, true, false].map((live) => (
            <button
              key={String(live)}
              onClick={() => { setLiveFilter(live); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                liveFilter === live ? 'bg-[#4A7C6F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {live === undefined ? 'Todas' : live ? 'Ao vivo' : 'Encerradas'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400">Carregando...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="mx-auto mb-4 text-gray-300" size={48} />
          <p>Nenhuma sala encontrada</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Sala</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Participantes</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Criada em</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{room.title}</p>
                      {room.description && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">{room.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#4A7C6F]/10 text-[#4A7C6F] rounded-full text-xs font-medium">
                      {room.category || 'Sem categoria'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users size={14} />
                      {room.participant_count || room.current_participants || 0}/{room.max_participants || '∞'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {room.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Ao vivo
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Encerrada</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(room.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {room.is_active && (
                      <button
                        onClick={() => handleEndRoom(room.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                      >
                        <StopCircle size={14} />
                        Encerrar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
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
        </div>
      )}
    </div>
  );
}
