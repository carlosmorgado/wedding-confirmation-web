import { GuestInformation } from "./GuestInformation";

export interface SavedGuestInformation {
  [id: number]: GuestInformation | null;
}
