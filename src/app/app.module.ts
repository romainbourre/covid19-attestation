import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AttestationPageComponent } from './pages/attestation-page/attestation-page.component';
import {HttpClientModule} from '@angular/common/http';
import {DatePipe, registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import {StatsModule} from './modules/stats/stats.module';

registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AttestationPageComponent,
    DateFormatPipe,
    NavbarComponent,
    FooterComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        StatsModule
    ],
  providers: [
    {provide: LOCALE_ID, useValue: 'fr-FR' },
    FormBuilder,
    DateFormatPipe,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
