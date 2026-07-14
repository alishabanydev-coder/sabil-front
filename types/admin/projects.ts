export type AdminProjectCharacter = {
  name?: string;
  image?: string;
};

export type AdminProjectRecord = {
  _id?: string;
  id?: string;
  name?: string;
  thumbnail?: string;
  description?: string;
  characters?: AdminProjectCharacter[];
};

export type AdminProjectCharacterFormRecord = {
  key: string;
  name: string;
  image: string;
  imageFile: File | null;
};
