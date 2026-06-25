'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Search, Ban, CheckCircle, Shield } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = async (p = 1, q = '') => {
    setLoading(true);
    try {
      const res = await api.getUsers(p, q || undefined);
      setUsers(res.users);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(page, search); }, [page]);

  const handleSearch = () => { setPage(1); loadUsers(1, search); };

  const handleBan = async (id: string) => {
    if (!confirm('Tem certeza que deseja banir este usuário?')) return;
    try {
      await api.banUser(id, 'Violação dos termos');
      loadUsers(page, search);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUnban = async (id: string) => {
    try {
      await api.unbanUser(id);
      loadUsers(page, search);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Usuários</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar por email ou nome..."
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A7C6F] outline-none w-64"
          />
          <button onClick={handleSearch} className="p-2 bg-[#4A7C6F] text-white rounded-lg hover:bg-[#3d6b5e]">
            <Search size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400">Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Criado em</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name || 'Sem nome'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'moderator' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role === 'admin' && <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_banned ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <Ban size={12} /> Banido
                      </span>
                    ) : user.is_verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle size={12} /> Verificado
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Ativo</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.is_banned ? (
                      <button onClick={() => handleUnban(user.id)} className="text-sm text-green-600 hover:underline">
                        Desbanir
                      </button>
                    ) : (
                      <button onClick={() => handleBan(user.id)} className="text-sm text-red-600 hover:underline">
                        Banir
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
