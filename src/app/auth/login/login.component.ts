import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private exceptionsService: ExceptionsService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.usersService.login(username, password).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        }, error: (err) => {
          this.exceptionsService.throwError(err);
        }
      })
    } else {
      console.log('Formulario inválido');
      this.toastService.presentToast('Formulario inválido', 'danger');
    }
  }

}
