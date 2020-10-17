import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {AttestationPageComponent} from './pages/attestation-page/attestation-page.component';


const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'attestation/:id', component: AttestationPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
