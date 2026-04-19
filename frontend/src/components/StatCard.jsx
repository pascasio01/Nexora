export const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-nexora-panelSoft bg-nexora-panel p-4 shadow-premium">
    <p className="text-xs uppercase tracking-wider text-nexora-muted">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-nexora-gold">{value}</p>
  </div>
);
