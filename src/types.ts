import { Timestamp } from "firebase/firestore";

export interface Member {
  uid: string;
  email: string;
  displayName: string;
  last_changed?: Timestamp;
  state?: string;
  photoURL?: string;
}
