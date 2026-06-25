'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { UsersRound, Search, Trash2, Hash } from 'lucide-react';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadCommunities = async (p = 1, q = '') => {
    setLoading(true);
    try {
      const res = await api.getCommunities(p, q || undefined);
      setCommunities(res.communities);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCommunities(page, search); }, [page]);

  const handleSearch = () => { setPage(1); loadCommunities(1, search); };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir a comunidade "${name}"?`)) return;
    try {
      await api.deleteCommunity(id);
      loadCommunities(page, search);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Comunidades</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar comunidade..."
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A7C6F] outline-none w-64"
          />
          <button onClick={handleSearch} className="p-2 bg-[#4A7C6F] text-white rounded-lg hover:bg-[#3d6b5e]">
            <Search size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400">Carregando...</div>
      ) : communities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <UsersRound className="mx-auto mb-4 text-gray-300" size={48} />
          <p>Nenhuma comunidade encontrada</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Comunidade</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Membros</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Interesses</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Criada em</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {communities.map((community) => {
                const memberCount = community.community_members?.[0]?.count ?? community.member_count ?? 0;
                const interests = community.community_interests?.map((ci: any) => ci.interests?.name).filter(Boolean) || [];
                return (
                  <tr key={community.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {community.image_url ? (
                          <img src={community.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-[#4A7C6F]/10 rounded-lg flex items-center justify-center">
                            <UsersRound className="text-[#4A7C6F]" size={20} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{community.name}</p>
                          {community.description && (
                            <p className="text-xs text-gray-500 truncate max-w-xs">{community.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{memberCount}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {interests.slice(0, 3).map((interest: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {interest}
                          </span>
                        ))}
                        {interests.length > 3 && (
                          <span className="text-xs text-gray-400">+{interests.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(community.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(community.id, community.name)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
