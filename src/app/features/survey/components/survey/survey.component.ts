import { Component, inject } from '@angular/core';
import { SavedGuestInformation } from '../../../../core/SavedGuestInformation';
import { GuestInformationToSave } from '../../../../core/GuestInformationToSave';
import { SaveStatus } from '../../../../core/FormValidation';
import { GuestInformationSaveStaus as GuestInformationSaveStatus } from '../../../../core/GuestInformationError';
import { SurveysService } from '../../../../core/surveys.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss'
})
export class SurveyComponent {
  private _snackBar = inject(MatSnackBar);

  currentId: number = 0;
  savedInfrormations: SavedGuestInformation = {};
  informationSaveStatus: GuestInformationSaveStatus = {};
  extendedId?: number | null;
  canShowError: boolean = false;

  constructor(private surveyService: SurveysService) {
    this.addGuest();
  }

  addGuest(): void {
    this.extendedId = ++this.currentId;

    this.savedInfrormations[this.currentId] = null;
    this.informationSaveStatus[this.currentId] = false;
  }

  isExtended(id: number): boolean {
    return id === this.extendedId;
  }

  onDeletedGuestInformation(id: number): void {
    delete this.savedInfrormations[id];
    delete this.informationSaveStatus[id];
    this.extendedId = null;
  }

  onSavedGuestInformation(guestInformationToSave: GuestInformationToSave): void {
    this.savedInfrormations[guestInformationToSave.id] = guestInformationToSave.information;
    this.extendedId = null;
  }

  isDeletable(): boolean {
    return Object.keys(this.savedInfrormations).length === 1;
  }

  submit(): void {
    if (!this.canSubmit()) {
      if (!this.canShowError) {
        this.canShowError = true;
      }

      console.log('Can\'t submit');
      return;
    }

    const toSave = Object.values(this.savedInfrormations);
    this.surveyService.createAnswer(toSave)
      .subscribe(_ => this._snackBar.open('Submetido.'));
    return;
  }

  onSaveStatusChange(saveStatus: SaveStatus): void {
    this.informationSaveStatus[saveStatus.id] = saveStatus.isSaved;
  }

  isErroState(): boolean {
    return this.canShowError && !this.canSubmit();
  }

  private canSubmit(): boolean {
    return !Object.values(this.informationSaveStatus).includes(false);
  }
}
