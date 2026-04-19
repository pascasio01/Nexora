import api from "./api";
import { createCrudService } from "./crudFactory";

export const tasksService = createCrudService("/tasks");
export const goalsService = createCrudService("/goals");
export const notesService = createCrudService("/notes");
export const projectsService = createCrudService("/projects");

export const systemService = {
  dashboardSummary: async () => (await api.get("/system/dashboard-summary")).data,
  dailyFocus: async () => (await api.get("/system/daily-focus")).data,
};

export const portfolioService = {
  get: async () => (await api.get("/users/portfolio")).data,
  update: async (payload) => (await api.put("/users/portfolio", payload)).data,
};
