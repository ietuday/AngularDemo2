import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class SchedulerServiiceService {

  constructor(private http: Http) {}
  getSchedulerMedium(){
    return this.http.get("http://192.168.10.134:8080/EliteJava/webresources/scheduleJob/repeatedjob/")
    .toPromise()
    .then(data => { return data; });
  }
}
