export const AuthCard = ({ title, subtitle, children }) => (
  <div className="w-full max-w-md rounded-2xl border border-nexora-panelSoft bg-nexora-panel p-8 shadow-premium">
    <h1 className="text-2xl font-semibold text-nexora-gold">{title}</h1>
    <p className="mb-6 mt-1 text-sm text-nexora-muted">{subtitle}</p>
    {children}
  </div>
);
