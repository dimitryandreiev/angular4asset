import { Component, OnInit, ViewChild } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

import { BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';

import { People } from './../models/people';

import { FormPeopleComponent } from './modals/form-people/form-people.component';
import { FormConfirmComponent } from './modals/form-confirm/form-confirm.component';

import { PeopleService } from './services/people.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  providers: [PeopleService, DatePipe]
})
export class PeopleComponent implements OnInit {

  loadPeople: boolean = false;
  deleteInProgress: boolean = false;
  peopleEdit: People = new People();
  peopleList: People[] = [];

  private ngUnsubscribe = new Subject<Subscription>();

  modalRef: BsModalRef = new BsModalRef();

  @ViewChild('confirmDeleteModal') confirmDeleteModal!: ModalDirective;
  confirmDeleteModalRef!: BsModalRef;


  constructor(
    public peopleService: PeopleService,
    private modalService: BsModalService,
    public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getPeopleList();
  }

  /**
   * Get peoples and fill the peopleList
   * @return void
   */
  getPeopleList(): void {
    this.loadPeople = true;

    this.peopleService.getPeoples().pipe(
    takeUntil(this.ngUnsubscribe))
    .subscribe (
      response => {
        response.map(
          (people: People) => {
            if (people.birth_at) {
              people.birth_at = this.datepipe.transform(people.birth_at, 'dd/MM/yyyy');
            }

          }
        );

        response.sort(
          (a: any,b:any) => a.name.localeCompare(b.name)
        );

        this.peopleList = response;
      },
      error => console.log(error),
      () => {
        this.loadPeople = false;
      }
    );
  }

  /**
   * confirm delete people to remove from the list
   * @param people {People}
   * @return void
   */
   confirmDeletePeople(people: People): void {
    this.peopleService.deletePeople(people).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe (
        response => {
          let index = this.peopleList.findIndex((peopleObj : People) => peopleObj.id === people.id)

          if (index < 0) {
            return;
          }

          this.peopleList.splice(index, 1);

          this.confirmDeleteModalRef.hide();
        },
        error => console.log(error),
        () => {
          this.loadPeople = false;
        }
      );
  }

  // functions
  /**
   * Call form modal to add people
   * @return void
   */
  addPeople(): void {
    this.peopleEdit = new People();

    this.openModalPeople(this.peopleEdit);
  }

  /**
   * Call form modal to edit people selected
   * @param people {People}
   * @return void
   */
  editPeople(people: People): void {
    this.peopleEdit = JSON.parse(JSON.stringify(people));
    this.openModalPeople(this.peopleEdit);
  }

  // FormModal
  openModalPeople(people: People): void {
    const initialState = {
      title: people.id ? 'Editar pessoa': 'Adicionar pessoa',
      editPeople: people
    };

    const options: ModalOptions ={
      initialState,
      animated: true,
      class: 'modal-md',
      backdrop: 'static'
    }

    this.modalRef = this.modalService.show(FormPeopleComponent, options);

    this.modalRef.content.onEdit.pipe(
      take(1),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
      (response: any) => {
        let index = this.peopleList.findIndex((people : People) => people.id === response.id)

        if (index < 0) {
          return;
        }

        if (response.birth_at) {
          response.birth_at = this.datepipe.transform(response.birth_at, 'dd/MM/yyyy');
        }

        this.peopleList[index] = response;

        this.peopleList.sort(
          (a: any,b:any) => a.name.localeCompare(b.name)
        );
    });

    this.modalRef.content.onCreate.pipe(
      take(1),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
      (response: any) => {
        if (response.birth_at) {
          response.birth_at = this.datepipe.transform(response.birth_at, 'dd/MM/yyyy');
        }

        this.peopleList.push(response);

        this.peopleList.sort(
          (a: any,b:any) => a.name.localeCompare(b.name)
        );
    });
  }

  /**
   * Call confirm form modal to delete selected people
   * @param people {People}
   * @return void
   */
   deletePeople(people: People): void {
    const initialState = {
      people: people
    };

    const options: ModalOptions ={
      initialState,
      animated: true,
      class: 'modal-sm',
      backdrop: 'static'
    }

    this.confirmDeleteModalRef = this.modalService.show(FormConfirmComponent, options);

    this.confirmDeleteModalRef.content.onConfirm.pipe(
      take(1),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
      (response: any) => {
        if (!response) {
          return;
        }

        this.confirmDeletePeople(people)
    });
  }
}
