import { useEffect, useState } from "react";

import { Button } from "../components/Button";
import { Field, Input } from "../components/Field";
import { portfolioService } from "../services/modules";

export const AdminPage = () => {
  const [form, setForm] = useState({
    about_me: "",
    contact_email: "",
    contact_linkedin: "",
    contact_github: "",
  });
  const [featuredText, setFeaturedText] = useState("[]");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    portfolioService
      .get()
      .then((data) => {
        setForm({
          about_me: data.about_me || "",
          contact_email: data.contact_email || "",
          contact_linkedin: data.contact_linkedin || "",
          contact_github: data.contact_github || "",
        });
        setFeaturedText(JSON.stringify(data.featured_projects || [], null, 2));
      })
      .catch((err) => setError(err.response?.data?.detail || "No se pudo cargar portfolio"));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const featured_projects = JSON.parse(featuredText);
      await portfolioService.update({ ...form, featured_projects });
      setMessage("Portfolio actualizado correctamente");
    } catch (err) {
      setError(err.response?.data?.detail || "Datos inválidos para portfolio");
    }
  };

  return (
    <section className="space-y-4 rounded-xl border border-nexora-panelSoft bg-nexora-panel p-5 shadow-premium">
      <h2 className="text-lg font-semibold text-nexora-gold">Owner/Admin Panel</h2>
      <p className="text-sm text-nexora-muted">Edita sección Sobre mí, proyectos destacados y contacto del portfolio.</p>

      <form onSubmit={submit} className="grid gap-3">
        <Field label="Sobre mí">
          <textarea
            className="min-h-28 w-full rounded-lg border border-nexora-panelSoft bg-black/30 px-3 py-2 text-nexora-text outline-none focus:border-nexora-gold"
            value={form.about_me}
            onChange={(e) => setForm((prev) => ({ ...prev, about_me: e.target.value }))}
          />
        </Field>

        <Field label="Contacto email">
          <Input
            type="email"
            value={form.contact_email}
            onChange={(e) => setForm((prev) => ({ ...prev, contact_email: e.target.value }))}
          />
        </Field>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="LinkedIn URL">
            <Input
              type="url"
              value={form.contact_linkedin}
              onChange={(e) => setForm((prev) => ({ ...prev, contact_linkedin: e.target.value }))}
            />
          </Field>
          <Field label="GitHub URL">
            <Input
              type="url"
              value={form.contact_github}
              onChange={(e) => setForm((prev) => ({ ...prev, contact_github: e.target.value }))}
            />
          </Field>
        </div>

        <Field label="Proyectos destacados (JSON)">
          <textarea
            className="min-h-36 w-full rounded-lg border border-nexora-panelSoft bg-black/30 px-3 py-2 font-mono text-xs text-nexora-text outline-none focus:border-nexora-gold"
            value={featuredText}
            onChange={(e) => setFeaturedText(e.target.value)}
          />
        </Field>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-green-400">{message}</p> : null}
        <Button type="submit" className="w-fit">Guardar portfolio</Button>
      </form>
    </section>
  );
};
