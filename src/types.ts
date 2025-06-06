export type Person = {
  id: string; // uuid
  name: string;
  image?: string;
  description?: string;
};

export type Tag = {
  id: string;
  name: string;
  color?: string;
};

export type Connection = {
  id: string;
  person1Id: string;
  person2Id: string;
  bondStrength: number; // 0-100
  tagIds: string[];
};