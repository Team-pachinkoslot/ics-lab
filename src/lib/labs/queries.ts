import { labCatalog } from "./catalog";
import type { LabId } from "./types";

export function getLabs() {
  return labCatalog;
}

export function getLabBySlug(slug: string) {
  return labCatalog.find((lab) => lab.slug === slug);
}

export function getLabNumber(id: LabId) {
  return String(labCatalog.findIndex((lab) => lab.id === id) + 1).padStart(2, "0");
}
