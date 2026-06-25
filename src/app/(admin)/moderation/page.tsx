'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  dismissed: 'bg-gray-100 text-gray-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  reviewed: 'Revisado',
  resolved: 'Resolvido',
  dismissed: 'Descartado',
};

export default function ModerationPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadReports = async (p = 1, status = '') => {
    setLoading(true);
    try {
      const res = await api.getReports(p, status || undefined);
      setReports(res.reports);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReports(page, filter); }, [page, filter]);

  const handleStatus = async (id: string, status: string) => {
    try {
      await api.updateReportStatus(id, status);
      loadReports(page, filter);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Moderação</h2>
        <div className="flex gap-2">
          {['', 'pending', 'reviewed', 'resolved', 'dismissed'].map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filter === s ? 'bg-[#4A7C6F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s ? statusLabels[s] : 'Todos'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400">Carregando...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
          <p>Nenhum reporte encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
                        {statusLabels[report.status]}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {report.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">
                      Reportado por: {report.users?.name || report.users?.email || 'Desconhecido'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{report.description || 'Sem descrição'}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(report.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                {report.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(report.id, 'resolved')}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                    >
                      Resolver
                    </button>
                    <button
                      onClick={() => handleStatus(report.id, 'dismissed')}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                    >
                      Descartar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
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
