/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import type { Person, Connection, Tag } from "../types";
import {
  loadPersons,
  savePersons,
  loadConnections,
  saveConnections,
  loadTags,
  saveTags,
} from "../utils/localStorage";
import { v4 as uuidv4 } from "uuid";
import type { ReactNode } from "react";

interface DataContextType {
  persons: Person[];
  connections: Connection[];
  tags: Tag[];
  addPerson: (person: Omit<Person, "id">) => void;
  addConnection: (connection: Omit<Connection, "id">) => boolean;
  addTag: (tag: Omit<Tag, "id">) => void;
  updatePerson: (id: string, person: Partial<Person>) => void;
  updateConnection: (id: string, connection: Partial<Connection>) => void;
  updateTag: (id: string, tag: Partial<Tag>) => void;
  deletePerson: (id: string) => void;
  deleteConnection: (id: string) => void;
  deleteTag: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Load initial data
  useEffect(() => {
    setPersons(loadPersons());
    setConnections(loadConnections());
    setTags(loadTags());
  }, []);

  // Person operations
  const addPerson = (personData: Omit<Person, "id">) => {
    const newPerson: Person = {
      ...personData,
      id: uuidv4(),
    };

    const updatedPersons = [...persons, newPerson];
    setPersons(updatedPersons);
    savePersons(updatedPersons);
  };

  const updatePerson = (id: string, personData: Partial<Person>) => {
    const updatedPersons = persons.map((person) =>
      person.id === id ? { ...person, ...personData } : person
    );
    setPersons(updatedPersons);
    savePersons(updatedPersons);
  };

  const deletePerson = (id: string) => {
    // Also delete all connections involving this person
    const updatedConnections = connections.filter(
      (conn) => conn.person1Id !== id && conn.person2Id !== id
    );
    const updatedPersons = persons.filter((person) => person.id !== id);

    setConnections(updatedConnections);
    setPersons(updatedPersons);
    saveConnections(updatedConnections);
    savePersons(updatedPersons);
  };

  // Connection operations
  const addConnection = (connectionData: Omit<Connection, "id">): boolean => {
    // Check if connection already exists (in both directions)
    const connectionExists = connections.some(
      (connection) =>
        (connection.person1Id === connectionData.person1Id &&
          connection.person2Id === connectionData.person2Id) ||
        (connection.person1Id === connectionData.person2Id &&
          connection.person2Id === connectionData.person1Id)
    );

    if (connectionExists) {
      return false; // Connection already exists
    }

    const newConnection: Connection = {
      ...connectionData,
      id: uuidv4(),
    };

    const updatedConnections = [...connections, newConnection];
    setConnections(updatedConnections);
    saveConnections(updatedConnections);
    return true; // Successfully added
  };

  const updateConnection = (
    id: string,
    connectionData: Partial<Connection>
  ) => {
    const updatedConnections = connections.map((connection) =>
      connection.id === id ? { ...connection, ...connectionData } : connection
    );
    setConnections(updatedConnections);
    saveConnections(updatedConnections);
  };

  const deleteConnection = (id: string) => {
    const updatedConnections = connections.filter(
      (connection) => connection.id !== id
    );
    setConnections(updatedConnections);
    saveConnections(updatedConnections);
  };

  // Tag operations
  const addTag = (tagData: Omit<Tag, "id">) => {
    const newTag: Tag = {
      ...tagData,
      id: uuidv4(),
    };

    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    saveTags(updatedTags);
  };

  const updateTag = (id: string, tagData: Partial<Tag>) => {
    const updatedTags = tags.map((tag) =>
      tag.id === id ? { ...tag, ...tagData } : tag
    );
    setTags(updatedTags);
    saveTags(updatedTags);
  };

  const deleteTag = (id: string) => {
    // Remove tag from all connections
    const updatedConnections = connections.map((connection) => ({
      ...connection,
      tagIds: connection.tagIds.filter((tagId) => tagId !== id),
    }));
    const updatedTags = tags.filter((tag) => tag.id !== id);

    setConnections(updatedConnections);
    setTags(updatedTags);
    saveConnections(updatedConnections);
    saveTags(updatedTags);
  };

  const value: DataContextType = {
    persons,
    connections,
    tags,
    addPerson,
    addConnection,
    addTag,
    updatePerson,
    updateConnection,
    updateTag,
    deletePerson,
    deleteConnection,
    deleteTag,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
