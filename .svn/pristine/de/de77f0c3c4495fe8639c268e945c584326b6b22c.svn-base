import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { WebSocketService } from './web-socket.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {

    constructor(private _http: Http) { }

    auth() {

      //  let url = document.location.protocol + '//' + document.location.hostname + ("" == document.location.port ? "" : ":8080") + "/webresources/auth";
//        let url = document.location.protocol + '//' + document.location.hostname + "/webresources/auth";
        let url = document.location.protocol + '//' + document.location.hostname + ":8080/webresources/auth";
        console.log("auth url", url);

        let username: string = 'uday';
        let password: string = 'singh';
        let headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Content-Type", "application/json");

        return this._http.get(url, { headers: headers })
            .toPromise()
            .then(res => {
                console.log(res['_body']);
                WebSocketService.getInstance().uuidBehaviorSubject.next(res['_body']);
            });
    }
}
