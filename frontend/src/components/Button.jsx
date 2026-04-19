export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-nexora-gold text-black hover:bg-nexora-goldSoft",
    ghost: "border border-nexora-panelSoft bg-transparent text-nexora-text hover:bg-nexora-panelSoft",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
