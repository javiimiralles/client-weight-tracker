import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/users.model';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { getHeaders } from '../utils/headers.utils';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private user: User;

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) { }

  login(username: string, password: string): Observable<any> {
    const loginForm = this.formBuilder.group({
      username,
      password
    });
    return this.http.post(`${environment.base_url}/login`, loginForm.value)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res['token'] as string);
          const { uid } = res;
          this.user = new User(uid);
        })
      );
  }

  logout(): void {
    this.cleanLocalStorage();
    this.router.navigateByUrl('/login');
  }

  validateToken(): Observable<boolean> {
    return this.validate(true, false);
  }

  validateNoToken(): Observable<boolean> {
    return this.validate(false, true);
  }

  updateUser(user:User) {
    user._id = this._id;
    console.log(user);
    return this.http.put(`${environment.base_url}/users/${this._id}`, user, getHeaders());
  }

  updatePassword(passwordForm: FormGroup) {
    return this.http.put(`${environment.base_url}/users/change-password/${this._id}`, passwordForm.value, getHeaders());
  }

  deleteUser() {
    return this.http.delete(`${environment.base_url}/users/${this._id}`, getHeaders());
  }

  private validate(correct: boolean, incorrect: boolean): Observable<boolean> {

    if (this.token === '') {
      this.cleanLocalStorage();
      return of(incorrect);
    }

    return this.http.get(`${environment.base_url}/login/token`, getHeaders())
      .pipe(
        tap((res: any) => {
          const { token, _id, username, email, gender, height, age, targetWeight } = res;
          localStorage.setItem('token', token);
          this.user = new User(_id, username, email, null, gender, height, age, targetWeight);
        }),
        map (res => {
          return correct;
        }),
        catchError (err => {
          this.cleanLocalStorage();
          return of(incorrect);
        })
      );
  }

  private cleanLocalStorage(): void{
    localStorage.removeItem('token');
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get _id(): string {
    return this.user._id;
  }

  get username(): string {
    return this.user.username;
  }

  get email(): string {
    return this.user.email;
  }

  get gender(): string {
    return this.user.gender;
  }

  get height(): number {
    return this.user.height;
  }

  get age(): number {
    return this.user.age;
  }

  get targetWeight(): number {
    return this.user.targetWeight;
  }

}
