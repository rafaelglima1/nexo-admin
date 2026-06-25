'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Users, UsersRound, MessageSquare, Calendar, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse text-gray-400">Carregando...</div>;
  }

  const cards = [
    { label: 'Usuários', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Comunidades', value: stats?.totalCommunities || 0, icon: UsersRound, color: 'bg-purple-500' },
    { label: 'Salas', value: stats?.totalRooms || 0, icon: MessageSquare, color: 'bg-green-500' },
    { label: 'Eventos', value: stats?.totalEvents || 0, icon: Calendar, color: 'bg-orange-500' },
    { label: 'Denúncias pendentes', value: stats?.pendingReports || 0, icon: AlertTriangle, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
