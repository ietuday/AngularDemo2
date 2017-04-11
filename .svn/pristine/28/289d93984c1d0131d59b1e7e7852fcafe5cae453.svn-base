import { Injectable } from '@angular/core';

@Injectable()
export class UploadService {

  constructor() { }

  upload(actionName, data, file, fileName) {
    console.log("Welcome To Upload Services...", actionName, data, file.name, fileName);
    return new Promise(resolve => {

              const XHR = new XMLHttpRequest();

		      // We bind the FormData object and the form element
		      var FD  = new FormData();

                      FD.append('actionName', actionName);
                      FD.append('data', data);
                      FD.append('user', sessionStorage.getItem('userName'));
                      FD.append(fileName, file, fileName);

		      // We define what will happen if the data are successfully sent
		      XHR.addEventListener("load", function(event) {
                        resolve(event.target['responseText']);
		      });

		      // We define what will happen in case of error
		      XHR.addEventListener("error", function(event) {
		        alert('Oups! Something goes wrong.');
		      });

		      // We setup our request
		      XHR.open("POST", document.location.protocol + '//' + document.location.hostname + ":8080/uploadFile");
//		      XHR.open("POST", document.location.protocol + '//' + document.location.hostname + "/uploadFile");
		      // XHR.open("POST", "http://192.168.10.120:8080/uploadFile");

		      // The data sent are the one the user provide in the form
		      XHR.send(FD);

      });
  }

  download() {
    console.log("Welcome To download Services...");
    return new Promise(resolve => {

              const XHR = new XMLHttpRequest();

		      // We define what will happen if the data are successfully sent
		      XHR.addEventListener("load", function(event) {
		        alert(event.target['responseText']);
		      });

		      // We define what will happen in case of error
		      XHR.addEventListener("error", function(event) {
		        alert('Oups! Something goes wrong.');
		      });

		      // We setup our request
		      XHR.open("GET", "http://localhost:8080/downloadFile");

		      // The data sent are the one the user provide in the form
		      XHR.send();

      });
  }

}
