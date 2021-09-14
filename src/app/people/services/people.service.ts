import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { People } from './../../models/people';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(
    public httpClient: HttpClient
  ) { }

  /**
   * Call service to get people list
   * @return People[]
   */
  getPeoples(): Observable<any>{
    let headers = new HttpHeaders();

    let params = new HttpParams()

    headers = headers.append('Access-Control-Allow-Origin', '*');

    let options = {
      headers: headers,
      params: params
    };

    const url = environment.serverUrl + 'people';

    return this.httpClient.get(url, options).pipe();
  }

  /**
   * Call service to post new people
   * @return People
   */
  postPeople(peopleData: People): Observable<any>{
    let headers = new HttpHeaders();

    let params = new HttpParams()

    headers = headers.append('Access-Control-Allow-Origin', '*');

    let options = {
      headers: headers,
      params: params
    };

    const url = environment.serverUrl + 'people';

    return this.httpClient.post(url, peopleData, options).pipe();
  }

  /**
   * Call service to edit people
   * @return People
   */
  patchPeople(peopleData: People): Observable<any>{
    let headers = new HttpHeaders();

    let params = new HttpParams()

    headers = headers.append('Access-Control-Allow-Origin', '*');

    let options = {
      headers: headers,
      params: params
    };

    const url = environment.serverUrl + 'people/' + peopleData.id;

    return this.httpClient.patch(url, peopleData, options).pipe();
  }

  /**
   * Call service to delete people
   * @return People
   */
  deletePeople(people: People): Observable<any>{
    let headers = new HttpHeaders();

    let params = new HttpParams()

    headers = headers.append('Access-Control-Allow-Origin', '*');

    let options = {
      headers: headers,
      params: params
    };

    const url = environment.serverUrl + 'people/' + people.id;

    return this.httpClient.delete(url, options).pipe();
  }
}
