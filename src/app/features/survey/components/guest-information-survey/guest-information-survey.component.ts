import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';
import { GuestInformation } from '../../../../core/GuestInformation';
import { DietRestriction } from '../../../../core/DietRestrictions';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GuestInformationToSave } from '../../../../core/GuestInformationToSave';
import { SaveStatus } from '../../../../core/FormValidation';
import { ChildAge } from '../../../../core/ChildAge';
import { distinctUntilChanged } from 'rxjs';
import { DietRestrictionSelection } from '../../../../core/DietRestrictionSelection';

@Component({
  selector: 'app-guest-information-survey',
  templateUrl: './guest-information-survey.component.html',
  styleUrl: './guest-information-survey.component.scss'
})
export class GuestInformationSurveyComponent implements OnInit {
  @Input({
    alias: 'guestInformationId',
    required: true
  }) id: number = 0;
  @Input() isDeletable: boolean = true;
  @Input() startExpanded: boolean = false;
  @Output() onInformationSaved: EventEmitter<GuestInformationToSave> = new EventEmitter<GuestInformationToSave>();
  @Output() onInformationDeleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() onSaveStatusChange: EventEmitter<SaveStatus> = new EventEmitter<SaveStatus>();

  readonly defaultGuestName: string = 'Informações do convidado';

  private ageZeroToThree: ChildAge =
  {
    text: '0-3',
    value: 'ageZeroToThree'
  };

  private ageFourToNine: ChildAge =
  {
    text: '4-9',
    value: 'ageFourToNine'
  };

  ages: ChildAge[] = [
    this.ageZeroToThree,
    this.ageFourToNine
  ];

  restrictions: DietRestrictionSelection  [] = Object
  .values<DietRestriction>(DietRestriction)
  .map((r: DietRestriction) => ({
    dietRestriction: r,
    isSelected: false
  }));

  isInitialized: boolean = false;

  get isChild(): boolean {
    if (!this.isInitialized) {
      return false;
    }

    return this.guestInformationForm.get('child_toggle')?.value ?? false;
  }

  guestInformationForm: FormGroup = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
    child_toggle: new FormControl(),
    age: new FormControl(),
    restrictions: new FormControl()
  });

  savedGuestInformation?: GuestInformation | null;

  ngOnInit(): void {
    this.isInitialized = false;

    this.guestInformationForm.statusChanges
      .subscribe(() =>
        this.onSaveStatusChange.emit({
          id: this.id,
          isSaved: this.isInformationSaved()
      }));

    this.guestInformationForm.controls['child_toggle'].valueChanges
    .pipe(
      distinctUntilChanged()
    )
    .subscribe(() => {
      if (this.isChild) {
        this.guestInformationForm.controls['age'].enable();
        return;
      }
      this.guestInformationForm.controls['age'].disable();
    })

    this.guestInformationForm.controls['age'].disable();

    this.isInitialized = true;
  }

  update(dietRestriction: DietRestriction, isChecked: boolean): void {
    const restriction = this
      .restrictions
      .find((selection: DietRestrictionSelection) => selection.dietRestriction === dietRestriction);

    if (restriction) {
        restriction.isSelected = isChecked;
    }
  }

  delete(): void {
    this.onInformationDeleted.emit(this.id);
  }

  save(): void {
    if (!this.guestInformationForm.valid) {
      return;
    }

    if (this.hasChildAgeError()) {
      return;
    }

    this.onInformationSaved.emit({
      id: this.id,
      information: this.currentInformation
    });
    console.log(this.isChild)

    this.savedGuestInformation = this.currentInformation;

    this.onSaveStatusChange.emit({
      id: this.id,
      isSaved: this.isInformationSaved(),
    });
  }

  isInformationSaved(): boolean {
    return JSON.stringify(this.savedGuestInformation) === JSON.stringify(this.currentInformation);
  }

  hasChildAgeError(): boolean {
    return !this.currentInformation.isAdult && !this.currentInformation.isAgeFourToNine && !this.currentInformation.isAgeZeroToThree;
  }

  private get name(): string {
    return this.guestInformationForm.get('name')?.value;
  }

  private get age(): string {
    return this.guestInformationForm.get('age')?.value;
  }

  // TODO: Change this to have correct information.
  private get currentInformation(): GuestInformation {
    return {
      name: this.name,
      isAgeZeroToThree: this.isChild && (this.age === this.ageZeroToThree.value),
      isAgeFourToNine: this.isChild && (this.age === this.ageFourToNine.value),
      isAdult: !this.isChild,
      restrictions: this
        .restrictions
        .filter((selection: DietRestrictionSelection) => selection.isSelected)
        .map((selection: DietRestrictionSelection) => selection.dietRestriction),
    }
  }
}
