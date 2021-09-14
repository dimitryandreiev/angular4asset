import { PeopleComponent } from './people.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { FormPeopleComponent } from './modals/form-people/form-people.component';
import { FormConfirmComponent } from './modals/form-confirm/form-confirm.component';

@NgModule({
  declarations: [PeopleComponent, FormPeopleComponent, FormConfirmComponent],
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule
  ],
  providers: [DatePipe]
})
export class PeopleModule { }
