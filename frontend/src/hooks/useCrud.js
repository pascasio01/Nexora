import { useCallback, useEffect, useState } from "react";

export const useCrud = (service) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await service.list();
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo cargar");
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, refresh, setItems };
};
