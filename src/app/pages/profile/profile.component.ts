import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController } from '@ionic/angular';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  userForm: FormGroup;

  constructor(
    private exceptionsService: ExceptionsService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private usersService: UsersService,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      username: [this.usersService.username, [Validators.required]],
      email: [this.usersService.email, [Validators.required, Validators.email]],
      gender: [this.usersService.gender, [Validators.required]],
      height: [this.usersService.height, [Validators.required]],
      age: [this.usersService.age, [Validators.required]],
      targetWeight: [this.usersService.targetWeight, [Validators.required]]
    });
  }

  onSave() {
    if (this.userForm.invalid) {
      this.toastService.presentToast('Completa todos los campos', 'warning');
      return;
    }

    this.usersService.updateUser(this.userForm.value).subscribe({
      next: () => {
        this.toastService.presentToast('Información de perfil actualizada', 'primary');
        // Actualizams la información que se muestra en el perfil
        this.usersService.validateToken().subscribe({
          error: (err) => {
            this.exceptionsService.throwError(err);
          }
        })
      }, error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  async onDeleteAccount() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: '¿Quieres eliminar tu cuenta?',
      subHeader: 'Esta acción no se puede deshacer y perderás todos tus datos',
      mode: 'ios',
      buttons: [
        {
          text: 'Eliminar cuenta',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.usersService.deleteUser().subscribe({
              next: () => {
                this.usersService.logout();
                this.toastService.presentToast('Cuenta eliminada', 'danger');
              }, error: (err) => {
                this.exceptionsService.throwError(err);
              }
            });
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async onLogout() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: '¿Quieres cerrar sesión?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          icon: 'log-out',
          handler: () => {
            this.usersService.logout();
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

}
