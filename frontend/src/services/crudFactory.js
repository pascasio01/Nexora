import api from "./api";

export const createCrudService = (basePath) => ({
  list: async () => (await api.get(`${basePath}/`)).data,
  create: async (payload) => (await api.post(`${basePath}/`, payload)).data,
  update: async (id, payload) => (await api.put(`${basePath}/${id}`, payload)).data,
  remove: async (id) => api.delete(`${basePath}/${id}`),
});
