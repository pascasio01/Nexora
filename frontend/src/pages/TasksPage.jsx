import { CrudPanel } from "../components/CrudPanel";
import { useCrud } from "../hooks/useCrud";
import { tasksService } from "../services/modules";

const fields = [
  { key: "title", label: "Título", required: true },
  { key: "description", label: "Descripción", type: "textarea" },
  {
    key: "priority",
    label: "Prioridad",
    type: "select",
    options: [
      { value: "high", label: "Alta" },
      { value: "medium", label: "Media" },
      { value: "low", label: "Baja" },
    ],
  },
  {
    key: "status",
    label: "Estado",
    type: "select",
    options: [
      { value: "pending", label: "Pendiente" },
      { value: "in_progress", label: "En progreso" },
      { value: "completed", label: "Completada" },
    ],
  },
  { key: "due_date", label: "Fecha límite", type: "date" },
];

const defaults = { title: "", description: "", priority: "medium", status: "pending", due_date: "" };

export const TasksPage = () => {
  const { items, loading, error, refresh } = useCrud(tasksService);

  const create = async (payload) => {
    await tasksService.create({ ...payload, due_date: payload.due_date || null });
    await refresh();
  };

  const update = async (id, payload) => {
    await tasksService.update(id, { ...payload, due_date: payload.due_date || null });
    await refresh();
  };

  const remove = async (id) => {
    await tasksService.remove(id);
    await refresh();
  };

  return (
    <CrudPanel
      title="Tasks"
      fields={fields}
      items={items}
      loading={loading}
      error={error}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      defaultValues={defaults}
      renderItem={(item) => (
        <>
          <h3 className="font-semibold text-nexora-gold">{item.title}</h3>
          <p className="text-sm text-nexora-muted">{item.description || "Sin descripción"}</p>
          <p className="mt-2 text-xs text-nexora-muted">
            Prioridad: {item.priority} · Estado: {item.status} · Fecha límite: {item.due_date || "-"}
          </p>
        </>
      )}
    />
  );
};
