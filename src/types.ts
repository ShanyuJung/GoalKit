import { Timestamp } from "firebase/firestore";

export interface MemberInterface {
  uid: string;
  email: string;
  displayName: string;
  last_changed?: Timestamp;
  state?: string;
  photoURL?: string;
}

export interface WorkspaceInterface {
  id: string;
  owner: string;
  title: string;
  projects: { id: string; title: string }[];
  members: string[];
}

export interface ProjectInterface {
  id: string;
  title: string;
  lists: ListInterface[];
  tags?: { id: string; colorCode: string; title: string }[];
  draggingLists?: { listID: string; displayName: string }[];
  draggingCards?: { cardID: string; displayName: string }[];
}

export interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline?: number };
  description?: string;
  owner?: string[];
  tagsIDs?: string[];
  complete?: boolean;
  todo?: { title: string; isDone: boolean; id: string }[];
}

export interface ListInterface {
  id: string;
  title: string;
  cards: CardInterface[];
}
