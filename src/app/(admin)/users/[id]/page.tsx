'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Ban, CheckCircle, Shield, Calendar, Mail, User } from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      api.getUser(params.id as string)
        .then(setUser)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  const handleBan = async () => {
    if (!confirm('Tem certeza que deseja banir este usuário?')) return;
    try {
      await api.banUser(user.id, 'Violação dos termos');
      setUser({ ...user, is_banned: true });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUnban = async () => {
    try {
      await api.unbanUser(user.id);
      setUser({ ...user, is_banned: false });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRoleChange = async (role: string) => {
    try {
      await api.setRole(user.id, role);
      setUser({ ...user, role });
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="text-gray-400">Carregando...</div>;
  }

  if (!user) {
    return <div className="text-gray-500">Usuário não encontrado</div>;
  }

  const interests = user.user_interests?.map((ui: any) => ui.interests?.name).filter(Boolean) || [];

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#4A7C6F] to-[#1A535C] p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <User className="text-white" size={32} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name || 'Sem nome'}</h2>
              <p className="text-white/70">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {user.is_banned && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-100">
                    <Ban size={12} /> Banido
                  </span>
                )}
                {user.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-100">
                    <CheckCircle size={12} /> Verificado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Informações</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-900">
                    Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {user.personality && (
                  <div className="flex items-center gap-3 text-sm">
                    <Shield size={16} className="text-gray-400" />
                    <span className="text-gray-900">{user.personality}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Role</h3>
              <select
                value={user.role || 'user'}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A7C6F] outline-none"
              >
                <option value="user">user</option>
                <option value="moderator">moderator</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>

          {interests.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Interesses</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#4A7C6F]/10 text-[#4A7C6F] rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
            {user.is_banned ? (
              <button
                onClick={handleUnban}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
              >
                Desbanir usuário
              </button>
            ) : (
              <button
                onClick={handleBan}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
              >
                Banir usuário
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
