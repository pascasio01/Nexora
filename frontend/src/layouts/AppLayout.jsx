import { Link, Outlet, useLocation } from "react-router-dom";

import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tasks", label: "Tasks" },
  { to: "/goals", label: "Goals" },
  { to: "/notes", label: "Notes" },
  { to: "/projects", label: "Projects" },
  { to: "/admin", label: "Owner/Admin" },
];

export const AppLayout = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-nexora-bg px-4 py-6 text-nexora-text md:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-nexora-panelSoft bg-nexora-panel p-5 shadow-premium">
          <p className="text-2xl font-bold tracking-wide text-nexora-gold">NEXORA LITE</p>
          <p className="mt-1 text-xs text-nexora-muted">{user?.full_name}</p>
          <nav className="mt-6 flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  pathname.startsWith(link.to)
                    ? "bg-nexora-gold text-black"
                    : "bg-nexora-panelSoft/30 text-nexora-text hover:bg-nexora-panelSoft"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button className="mt-6 w-full" variant="ghost" onClick={logout}>
            Logout
          </Button>
        </aside>

        <main className="space-y-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
