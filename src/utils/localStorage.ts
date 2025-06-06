import type { Person, Connection, Tag } from "../types";

const PERSONS_KEY = "friendgraph_persons";
const CONNECTIONS_KEY = "friendgraph_connections";
const TAGS_KEY = "friendgraph_tags";

export function savePersons(persons: Person[]) {
  localStorage.setItem(PERSONS_KEY, JSON.stringify(persons));
}

export function loadPersons(): Person[] {
  const data = localStorage.getItem(PERSONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveConnections(connections: Connection[]) {
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
}

export function loadConnections(): Connection[] {
  const data = localStorage.getItem(CONNECTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTags(tags: Tag[]) {
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
}

export function loadTags(): Tag[] {
  const data = localStorage.getItem(TAGS_KEY);
  return data ? JSON.parse(data) : [];
}
