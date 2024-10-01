import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent  implements OnInit {

  passwordForm: FormGroup;

  constructor(
    private exceptionsService: ExceptionsService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.toastService.presentToast('Completa todos los campos', 'warning');
      return;
    }

    this.usersService.updatePassword(this.passwordForm).subscribe({
      next: () => {
        this.toastService.presentToast('Contraseña actualizada', 'primary');
        this.router.navigateByUrl('/profile');
      }, error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })

  }

}
