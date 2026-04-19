import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { AuthCard } from "../components/AuthCard";
import { Button } from "../components/Button";
import { Field, Input } from "../components/Field";
import { useAuth } from "../context/AuthContext";

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "No fue posible crear la cuenta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-nexora-bg px-4">
      <AuthCard title="Crear cuenta" subtitle="Configura tu espacio en NEXORA LITE">
        <form onSubmit={submit}>
          <Field label="Nombre completo">
            <Input
              required
              value={form.full_name}
              onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </Field>
          {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
          <Button disabled={submitting} className="w-full" type="submit">
            {submitting ? "Creando..." : "Registrarse"}
          </Button>
          <p className="mt-4 text-sm text-nexora-muted">
            ¿Ya tienes cuenta? <Link className="text-nexora-gold" to="/login">Inicia sesión</Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
};
