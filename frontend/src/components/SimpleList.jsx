import { formatDate } from "../utils/format";

export const SimpleList = ({ title, items, emptyText = "Sin datos", renderSubtitle }) => (
  <div className="rounded-xl border border-nexora-panelSoft bg-nexora-panel p-4 shadow-premium">
    <h3 className="mb-3 text-sm font-semibold text-nexora-gold">{title}</h3>
    <div className="space-y-3">
      {items?.length ? (
        items.map((item) => (
          <div key={item.id} className="rounded-lg border border-nexora-panelSoft bg-nexora-panelSoft/40 p-3">
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-nexora-muted">
              {renderSubtitle ? renderSubtitle(item) : formatDate(item.updated_at || item.created_at)}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-nexora-muted">{emptyText}</p>
      )}
    </div>
  </div>
);
