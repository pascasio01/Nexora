import { CrudPanel } from "../components/CrudPanel";
import { useCrud } from "../hooks/useCrud";
import { projectsService } from "../services/modules";

const fields = [
  { key: "title", label: "Título", required: true },
  { key: "description", label: "Descripción", type: "textarea" },
  { key: "image_url", label: "URL imagen", type: "url" },
  { key: "link_url", label: "URL proyecto", type: "url" },
  {
    key: "featured",
    label: "Destacado",
    type: "select",
    options: [
      { value: "false", label: "No" },
      { value: "true", label: "Sí" },
    ],
  },
];

const defaults = { title: "", description: "", image_url: "", link_url: "", featured: "false" };

const mapPayload = (payload) => ({
  ...payload,
  image_url: payload.image_url || null,
  link_url: payload.link_url || null,
  featured: payload.featured === true || payload.featured === "true",
});

export const ProjectsPage = () => {
  const { items, loading, error, refresh } = useCrud(projectsService);

  const create = async (payload) => {
    await projectsService.create(mapPayload(payload));
    await refresh();
  };

  const update = async (id, payload) => {
    await projectsService.update(id, mapPayload(payload));
    await refresh();
  };

  const remove = async (id) => {
    await projectsService.remove(id);
    await refresh();
  };

  return (
    <CrudPanel
      title="Projects"
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
          <p className="text-xs text-nexora-muted">Destacado: {item.featured ? "Sí" : "No"}</p>
          {item.link_url ? (
            <a className="text-xs text-nexora-gold underline" href={item.link_url} target="_blank" rel="noreferrer">
              Ver link
            </a>
          ) : null}
        </>
      )}
    />
  );
};
