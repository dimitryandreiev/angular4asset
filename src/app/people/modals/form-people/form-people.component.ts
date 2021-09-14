import { People } from './../../../models/people';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { PeopleService } from '../../services/people.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-form-people',
  templateUrl: './form-people.component.html',
  styleUrls: ['./form-people.component.scss']
})
export class FormPeopleComponent implements OnInit {

  editPeople: People = new People();
  title: string = 'Adicionar cadastro';

  @Output() onEdit: EventEmitter<People> = new EventEmitter<People>();
  @Output() onCreate: EventEmitter<People> = new EventEmitter<People>();
  @Output() onClose = new EventEmitter();

  @ViewChild('peopleForm') peopleForm: NgForm | undefined;

  saveInProgress: boolean = false;

  private ngUnsubscribe = new Subject<Subscription>();

  constructor(
    public bsModalRef: BsModalRef,
    public peopleService: PeopleService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Close Modal Actions
   * @param event {MouseEvent}
   * @return void
   */
   closeModal(event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }

    this.bsModalRef.hide();
    this.onClose.emit(true);
  }

  /**
   * Submit action to validate form
   * @param event {MouseEvent}
   * @return void
   */
  submitPeople(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.validateForm()) {
      return
    }

    this.saveModal();
  }

  validateForm(): boolean {
    if (!this.editPeople.name || !this.editPeople.email) {
      return false;
    }

    return true;
  }

  /**
   * Save form, choose if edit or create people
   * @return void
   */
  saveModal(): void {
    this.saveInProgress = true;

    if (this.editPeople.id) {
      this.saveEditPeople();
      return;
    }

    this.createPeople();
  }

  /**
   * Save edited people
   * @return void
   */
  saveEditPeople(): void {
    this.peopleService.patchPeople(this.editPeople).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe (
        response => {
          this.onEdit.emit(response);
          this.bsModalRef.hide();
        },
        error => console.log(error),
        () => {
          this.saveInProgress = false;
        }
      );
  }

  /**
   * Save new people
   * @return void
   */
  createPeople(): void {
    this.peopleService.postPeople(this.editPeople).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe (
        response => {
          this.onCreate.emit(response);
          this.bsModalRef.hide();
        },
        error => console.log(error),
        () => {
          this.saveInProgress = false;
        }
      );
  }
}
