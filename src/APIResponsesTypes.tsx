export type Status = "alive" | "dead" | "any";

export interface Character {
  id: number;
  name: string;
  status: Status;
  species: string;
  gender: string;
  image: string;
}

export interface Info {
  count: number;
  pages: number;
  next: string;
  prev: string;
}

export interface APIResponse {
  info: Info;
  results: Character[];
}
