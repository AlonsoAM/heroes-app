import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _baseUrl = environments.baseUrl;
  private _user?: User;

  constructor(private http: HttpClient) {}

  get currentUser(): User | undefined {
    if (!this._user) return undefined;
    return structuredClone(this._user); // Desde la version 17 de node, nos crea un clon del objeto o propiedad
  }

  login(email: string, password: string): Observable<User> {
    // http.post('login', {email, password})

    return this.http.get<User>(`${this._baseUrl}/users/1`).pipe(
      tap((user) => (this._user = user)),
      tap((user) => localStorage.setItem('token', user.id.toString()))
    );
  }

  checkAuthentication(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);
    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this._baseUrl}/users/1`).pipe(
      tap((user) => (this._user = user)),
      map((user) => !!user),
      catchError((err) => of(false))
    );
  }

  logout() {
    this._user = undefined;
    localStorage.clear();
  }
}
