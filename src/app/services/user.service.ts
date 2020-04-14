import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'DATA';

  constructor() { }

  public add(user: User) {
    const data = localStorage.getItem(this.STORAGE_KEY);
    let users: User[] = [];
    user.id = 0;

    if (data !== null) {
      users = JSON.parse(data) as User[];
    }

    user.id = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;

    users.push(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  public get(id: number) {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const users: User[] = [];

    if (data !== null) {
      users.push(...JSON.parse(data) as User[]);
    }

    return of(users.find(u => u.id === id));
  }

  public getAll(): Observable<User[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const users: User[] = [];

    if (data !== null) {
      users.push(...JSON.parse(data) as User[]);
    }

    return of(users);
  }

  public delete(user: User) {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const users: User[] = [];

    if (data !== null) {
      users.push(...JSON.parse(data) as User[]);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users.filter(u => u.id !== user.id)));
  }
}
