import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';


@NgModule({
  declarations: [
    MainLayoutComponent,
    HomeComponent,
    ProfileComponent,
    ChangePasswordComponent
  ],
  exports: [
    MainLayoutComponent,
    HomeComponent,
    ProfileComponent,
    ChangePasswordComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
