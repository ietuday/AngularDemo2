import { Component, OnInit, OnChanges, ViewEncapsulation, Input } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { WebSocketService } from '../services/web-socket.service';
import { SelectItem } from 'primeng/primeng';
import { SalesOrderData } from '../data-models/sales-order-data';
import { DocsData } from '../data-models/docs-data';

declare var $: any;

@Component({
    selector: 'docs-repo',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './docs-repo.component.html',
    styleUrls: ['./docs-repo.component.scss']
})
export class DocsRepoComponent implements OnInit, OnChanges {
    private docs: {
        docName: string;
        settings: string;
        user: string;
        dateUploaded: string;
    }[] = [];
    private disabled: boolean = true;
    showUploadDialog: boolean = false;
    selectedDocName: string = "--Please Select";
    docNames: any[] = [];
    private fileToUpload: any;
    private docSettings: SelectItem[];
    private dummyArray: number[] = [1, 2, 3, 4];
    private salesOrderData: SalesOrderData = new SalesOrderData();
    private docsDetails: DocsData = new DocsData();
    private salesOrderNo: number = -1;
    uploadedFiles: any[] = [];
    private displaySalesOrderSuccess: boolean = false;
    private docsFileName: string;
    private officeUrl: string = "https://view.officeapps.live.com/op/view.aspx?src=";
    private domainUrl: string = document.location.protocol + '//' + document.location.hostname + ":80/downloadFile/";
    private displayDocument: boolean = false;
    private uploadDocsBtn: boolean = false;
    private fileToUploadName: any;
    private selectedIndex: number = -1;
    private previewFileName: string;

    constructor(private uploadService: UploadService) {
        this.addDummyDocNames();
        this.getDocsRepo();
        WebSocketService.getInstance().docsRepoBehaviorSubject.subscribe(data => this.setDocsRepo(data));
        WebSocketService.getInstance().salesOrderDataBehaviorSubject.subscribe(data => this.showSalesOrderData(data));
    }

    ngOnInit() {
        this.docSettings = [];
        this.docSettings.push({ label: 'Web', value: 'Web' });
        this.docSettings.push({ label: 'In Doc.', value: 'Doc' });
    }

    ngOnChanges(changes: any) {
        console.log("DocsRepoComponent: ngOnChanges: changes.tabActive", changes.tabActive);
        if (changes.tabActive) {
            if (changes.tabActive.currentValue) {
                this.getDocsRepo();
            }
        }
    }

    onUpload(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.fileToUpload = event.target.files[0];
    }

    setDocsRepo(data) {
        console.log("DocsRepoComponent: getDocsRepo: ", data);
        if (data.message) if (data.message.docs) {
            this.showUploadDialog = false;
            this.docs = data.message.docs;
        }
    }

    addDummyDocNames() {
        this.docNames.push({ label: '--Please Select', value: null });
        this.docNames.push({ label: '1st Leg - Packing List', value: { id: 1, name: '1st Leg - Packing List', code: '1LPL' } });
        this.docNames.push({ label: 'ANNEX 4E', value: { id: 2, name: 'ANNEX 4E', code: 'A4E' } });
        this.docNames.push({ label: 'BANK DRAFT - BOA', value: { id: 3, name: 'BANK DRAFT - BOA', code: 'BDBOA' } });
        this.docNames.push({ label: "Beneficiary's Certificate", value: { id: 4, name: "Beneficiary's Certificate", code: 'BC' } });
        this.docNames.push({ label: 'Bill of Lading', value: { id: 5, name: 'Bill of Lading', code: 'BL' } });
    }

    changed() {
        alert(this.selectedDocName);
    }

    fileChange($event) {
        this.fileToUpload = $event.target.files[0];
    }

    save() {
      this.salesOrderData.docsDetails = this.docsDetails;
        WebSocketService.getInstance().sendMessage({
          'action': 'saveDocsDetails',
          'message': {
            'salesOrderNo' : this.salesOrderData.salesOrderNo,
            'docsData' : this.salesOrderData
          }
      });
      this.displaySalesOrderSuccess = true;
    }

    uploadFile() {
        var docDate = new Date().toISOString();
        var dbFileName = sessionStorage.getItem('userName') + "-" + docDate + '-' + this.salesOrderNo + '-' + this.fileToUpload.name;
        var updatedFileName = dbFileName.replace(/\s/g, "");
        console.log(dbFileName, updatedFileName);
        var data = JSON.stringify({
            'user': sessionStorage.getItem('userName'),
            'docName': this.selectedDocName['name'],
            'settings': 'Doc',
            'dateUploaded': new Date(),
            'salesOrderNo': this.salesOrderNo,
            'fileName': this.fileToUpload.name,
            'dbFileName': updatedFileName
        });
        this.docsFileName = dbFileName;
        this.uploadService.upload('saveSalesOrderDocument', data, this.fileToUpload, updatedFileName).then(
            (data: string) => {
                // Success
                console.log("Success: File upload successful", data);
                this.getDocsRepo();
            },
            function(err) {
                // Error
                console.log("Error: File upload returned error", err);
            }
        );
    }

    download(fileName) {
        console.log("Downloading...");
        this.uploadService.download(fileName).then(
            (data: string) => {
                // Success
                console.log("Success: File download successful", data);
            },
            function(err) {
                // Error
                console.log("Error: File download returned error", err);
            }
        );
    }

    getDocsRepo() {
        console.log(" getDocsRepo", this.salesOrderNo);
        WebSocketService.getInstance().sendMessage({
            'action': 'getDocsRepo',
            'message': {
                "salesOrderNo": this.salesOrderNo
            }
        });
    }

    showDocsData(data) {
        console.log("showDocsData: data", data.docs);
        if (data == null || data == "" || data == undefined) {
            console.log("Ignore");
        } else {
            this.docs = data.docs;
        }
    }

    showSalesOrderData(data) {
        console.log("Docs Repo: showSalesOrderData : data", data);
        if (data == null || data == "" || data == undefined) {
            this.cancel(false);
        } else {
          this.salesOrderData = data;
          if (this.salesOrderData.salesOrderNo != undefined) {
              this.uploadDocsBtn = true;
              this.salesOrderNo = this.salesOrderData.salesOrderNo;
              this.getDocsRepo();
          } else {
              this.salesOrderData = new SalesOrderData();
          }
          if (this.salesOrderData.docsDetails != null || this.salesOrderData.docsDetails != undefined ) {
              this.docsDetails = this.salesOrderData.docsDetails;
          }
        }
    }

    previewDoc() {
      console.log("Domain Name: ", this.domainUrl);
      var patternIpAddress = new RegExp("^http[s]?:\/\/((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])");
      var verifyIpAddress = patternIpAddress.test(this.domainUrl);
      console.log("verifyIpAddress", verifyIpAddress);

      if (verifyIpAddress || this.domainUrl.indexOf("localhost") != -1) {
          $("#viewNode").empty();
          $("#viewNode").append('<span>Domain name is required for viewing the document.</span>');
      } else {
        let fileName = this.previewFileName
        var re = /(?:\.([^.]+))?$/;
        var fileExtension = re.exec(fileName)[1];
        console.log(fileName,fileExtension);
        if (fileExtension == 'pdf') {
          $("#viewNode").empty();
          $("#viewNode").append('<embed src=' + this.domainUrl + fileName + ' width="1000" height="650" alt="pdf" />');
        } else {
          $("#viewNode").empty();
          $("#viewNode").append('<embed src=' + this.officeUrl + this.domainUrl + fileName + ' width="1000" height="650" alt="pdf" />');
        }
      }
    //   var patternDomainName = new RegExp([
    // '^https?:\/\/([a-z0-9\\.\\-_%]+:([a-z0-9\\.\\-_%])+?@)?',
    // '((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4',
    // '][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])?',
    // '(:[0-9]+)?(\/[^\\s]*)?$'
    //  ].join(''), 'i');
    }

    cancel(clearSearch) {
        this.salesOrderData = new SalesOrderData();
        this.docs = [];
        this.docsDetails = new DocsData();
        this.uploadDocsBtn = false;
        if (clearSearch) {
            WebSocketService.getInstance().appSearchClearBehaviorSubject.next(true);
            WebSocketService.getInstance().salesOrderDataBehaviorSubject.next(this.salesOrderData);
        }
    }

    uploadDialogDisplay() {
      this.selectedDocName = '';
      this.fileToUploadName = '';
      // this.fileToUpload = '';
      this.showUploadDialog=true;
    }

    onRowSelect(index, fileName) {
        console.log("ProductContainer", index);
        this.selectedIndex = index;
        this.previewFileName = fileName;
    }

}
