import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AttestationPageComponent } from './pages/attestation-page/attestation-page.component';
import {HttpClientModule} from '@angular/common/http';
import {DatePipe} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AttestationPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [FormBuilder, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
