import { DietRestriction } from "./DietRestrictions";

export interface GuestInformation {
  name: string;
  isAgeZeroToThree: boolean;
  isAgeFourToNine: boolean;
  isAdult: boolean;
  restrictions?: DietRestriction[];
}
