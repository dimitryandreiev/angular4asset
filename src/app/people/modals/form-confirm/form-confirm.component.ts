import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { People } from 'src/app/models/people';

@Component({
  selector: 'app-form-confirm',
  templateUrl: './form-confirm.component.html',
  styleUrls: ['./form-confirm.component.scss']
})
export class FormConfirmComponent implements OnInit {

  deleteInProgress: boolean = false;
  people!: People;

  @Output() onClose = new EventEmitter();
  @Output() onConfirm: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public bsModalRef: BsModalRef
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

    if (this.deleteInProgress) {
      return;
    }

    this.bsModalRef.hide();
    this.onClose.emit(true);
  }

  /**
   * Action to confirm modal
   * @param event {MouseEvent}
   * @return void
   */
  confirmDelete(event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }

    if (this.deleteInProgress) {
      return;
    }

    this.deleteInProgress = true;
    this.onConfirm.emit(true);
  }

}
