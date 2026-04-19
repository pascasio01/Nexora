import { useState } from "react";

import { Button } from "./Button";
import { Field, Input } from "./Field";

export const CrudPanel = ({
  title,
  fields,
  items,
  loading,
  error,
  onCreate,
  onUpdate,
  onDelete,
  renderItem,
  defaultValues,
}) => {
  const [form, setForm] = useState(defaultValues);
  const [editingId, setEditingId] = useState(null);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setForm(defaultValues);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await onUpdate(editingId, form);
    } else {
      await onCreate(form);
    }
    reset();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm(fields.reduce((acc, field) => ({ ...acc, [field.key]: item[field.key] ?? "" }), {}));
  };

  return (
    <section className="space-y-4 rounded-xl border border-nexora-panelSoft bg-nexora-panel p-5 shadow-premium">
      <h2 className="text-lg font-semibold text-nexora-gold">{title}</h2>

      <form onSubmit={submit} className="grid gap-2 md:grid-cols-2">
        {fields.map((field) => (
          <Field key={field.key} label={field.label}>
            {field.type === "textarea" ? (
              <textarea
                value={form[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                required={field.required}
                className="min-h-24 w-full rounded-lg border border-nexora-panelSoft bg-black/30 px-3 py-2 text-nexora-text outline-none transition focus:border-nexora-gold"
              />
            ) : field.type === "select" ? (
              <select
                value={form[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full rounded-lg border border-nexora-panelSoft bg-black/30 px-3 py-2 text-nexora-text outline-none transition focus:border-nexora-gold"
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                type={field.type || "text"}
                value={form[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                required={field.required}
              />
            )}
          </Field>
        ))}

        <div className="flex items-end gap-2 md:col-span-2">
          <Button type="submit">{editingId ? "Guardar cambios" : "Crear"}</Button>
          {editingId ? (
            <Button type="button" variant="ghost" onClick={reset}>
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {loading ? <p className="text-sm text-nexora-muted">Cargando...</p> : null}

      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-nexora-panelSoft bg-nexora-panelSoft/30 p-3">
            {renderItem(item)}
            <div className="mt-3 flex gap-2">
              <Button type="button" variant="ghost" onClick={() => startEdit(item)}>
                Editar
              </Button>
              <Button type="button" variant="danger" onClick={() => onDelete(item.id)}>
                Eliminar
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
