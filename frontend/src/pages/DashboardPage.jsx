import { useEffect, useState } from "react";

import { SimpleList } from "../components/SimpleList";
import { StatCard } from "../components/StatCard";
import { systemService } from "../services/modules";

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    systemService
      .dashboardSummary()
      .then(setData)
      .catch((err) => setError(err.response?.data?.detail || "No se pudo cargar el dashboard"));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return <p className="text-nexora-muted">Cargando dashboard...</p>;

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-nexora-panelSoft bg-nexora-panel p-5 shadow-premium">
        <p className="text-xs uppercase tracking-wider text-nexora-muted">Daily Focus</p>
        <h1 className="mt-2 text-2xl font-semibold text-nexora-gold">
          {data.daily_focus?.title || "Sin tarea prioritaria para hoy"}
        </h1>
        <p className="mt-1 text-sm text-nexora-muted">{data.daily_focus?.description || "Agrega tareas para activar enfoque"}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-5">
        <StatCard label="Tasks" value={data.stats.total_tasks} />
        <StatCard label="Completadas" value={data.stats.completed_tasks} />
        <StatCard label="Pendientes" value={data.stats.pending_tasks} />
        <StatCard label="Goals" value={data.stats.total_goals} />
        <StatCard label="Notes" value={data.stats.total_notes} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <SimpleList title="Tareas recientes" items={data.recent_tasks} />
        <SimpleList title="Metas" items={data.goals} />
        <SimpleList title="Notas rápidas" items={data.quick_notes} />
      </section>
    </div>
  );
};
