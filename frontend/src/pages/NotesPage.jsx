import { CrudPanel } from "../components/CrudPanel";
import { useCrud } from "../hooks/useCrud";
import { notesService } from "../services/modules";

const fields = [
  { key: "title", label: "Título", required: true },
  { key: "content", label: "Contenido", type: "textarea", required: true },
];

const defaults = { title: "", content: "" };

export const NotesPage = () => {
  const { items, loading, error, refresh } = useCrud(notesService);

  const create = async (payload) => {
    await notesService.create(payload);
    await refresh();
  };

  const update = async (id, payload) => {
    await notesService.update(id, payload);
    await refresh();
  };

  const remove = async (id) => {
    await notesService.remove(id);
    await refresh();
  };

  return (
    <CrudPanel
      title="Notes"
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
          <p className="text-sm text-nexora-muted whitespace-pre-wrap">{item.content}</p>
        </>
      )}
    />
  );
};
