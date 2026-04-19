export const Field = ({ label, children }) => (
  <label className="mb-4 block text-sm">
    <span className="mb-2 block text-nexora-muted">{label}</span>
    {children}
  </label>
);

export const Input = (props) => (
  <input
    {...props}
    className="w-full rounded-lg border border-nexora-panelSoft bg-black/30 px-3 py-2 text-nexora-text outline-none transition focus:border-nexora-gold"
  />
);
