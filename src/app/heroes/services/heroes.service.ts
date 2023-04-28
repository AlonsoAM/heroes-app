import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/heroes.interface';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private _baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this._baseUrl}/heroes`);
  }

  getHeroesByID(id: string): Observable<Hero | undefined> {
    return this.http
      .get<Hero>(`${this._baseUrl}/heroes/${id}`)
      .pipe(catchError((err) => of(undefined)));
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this._baseUrl}/heroes?q=${query}&_limit=6`);
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this._baseUrl}/heroes`, hero);
  }

  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw new Error('Hero ID is required!');
    return this.http.patch<Hero>(`${this._baseUrl}/heroes/${hero.id}`, hero);
  }

  deleteHeroByID(id: string): Observable<boolean> {
    return this.http.delete(`${this._baseUrl}/heroes/${id}`).pipe(
      map((resp) => true),
      catchError((err) => of(false))
    );
  }
}
