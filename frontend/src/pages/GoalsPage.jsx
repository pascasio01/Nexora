import { CrudPanel } from "../components/CrudPanel";
import { useCrud } from "../hooks/useCrud";
import { goalsService } from "../services/modules";

const fields = [
  { key: "title", label: "Título", required: true },
  { key: "description", label: "Descripción", type: "textarea" },
];

const defaults = { title: "", description: "" };

export const GoalsPage = () => {
  const { items, loading, error, refresh } = useCrud(goalsService);

  const create = async (payload) => {
    await goalsService.create(payload);
    await refresh();
  };

  const update = async (id, payload) => {
    await goalsService.update(id, payload);
    await refresh();
  };

  const remove = async (id) => {
    await goalsService.remove(id);
    await refresh();
  };

  return (
    <CrudPanel
      title="Goals"
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
        </>
      )}
    />
  );
};
