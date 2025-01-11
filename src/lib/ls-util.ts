import { PresentationInformation } from "@/app/app/recent/recent";

export function saveProject(info: PresentationInformation) {
  const array = JSON.parse(localStorage.getItem("presentations") || "[]") as PresentationInformation[];
  array.push(info);
  localStorage.setItem("presentations", JSON.stringify(array));
}

export function getProjects() {
  return JSON.parse(localStorage.getItem("presentations") || "[]") as PresentationInformation[];
}

export function getById(id: string) {
  return getProjects().find((project) => project.path === id);
}

export function replaceProject(info: PresentationInformation) {
  const array = getProjects();
  const index = array.findIndex((project) => project.path === info.path);
  array[index] = info;
  localStorage.setItem("presentations", JSON.stringify(array));
}