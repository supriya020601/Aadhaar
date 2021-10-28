import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressformComponent } from './addressform/addressform.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'address',component:AddressformComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
