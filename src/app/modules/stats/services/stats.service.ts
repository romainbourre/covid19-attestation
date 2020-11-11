import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Global, StatsResponseModel} from '../models/stats-response.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient) { }

  public getGlobalStats(): Observable<Global> {
    return this.http.get(`https://coronavirusapi-france.now.sh/FranceLiveGlobalData`).pipe(map((response: StatsResponseModel) => {
      console.log(response);
      return response.FranceGlobalLiveData[0];
    }));
  }
}
