import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {WebSocketService} from '../services/web-socket.service';
import {SalesOrderData} from '../data-models/sales-order-data';
import {CustomerData} from '../data-models/customer-data';
import {DashboardComponent} from '../dashboard/dashboard.component';

@Component({
    selector: 'export-ref',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './export-ref.component.html',
    styleUrls: ['./export-ref.component.scss'],
    providers: [WebSocketService]
})
export class ExportRefComponent implements OnInit {
    //    @Input() tabActive: boolean;
    private disabled: boolean = true;
    private dropdownArray: SelectItem[];
    private sendAs: SelectItem[];
    private selectedData: string;
    private displayApproverBlock: boolean = false;
    private displayEventBlock: boolean = true;
    private displayGTNBlock: boolean = false;
    private salesOrderData: SalesOrderData = new SalesOrderData();
    private salesOrderNo: number = -1;
    private agentName: string = "";
    private carrierBLName: string = "";
    private portLoadName: string = "";
    private portDischargeName: string = "";
    private placeOfReceiptName: string = "";
    private placeOfDeliveryName: string = "";
    private carrierAgentName: string = "";
    private transportMode: any[] = [];
    private moveTypeArray: any[] = [];
    private jobType: any[] = [];
    private vendorData: any[] = [];
    private vendorData2: any[] = [];
    private portData: any[] = [];
    private routes: any[] = [];
    private schTypeInd: any[] = [];
    private blArray: any[] = [];
    private currency: any[] = [];
    private gencodeData: any[] = [];
    private notLoaded: boolean = true;
    private customerName: string = '';
    private customerId: number = -1;
    private customers: SelectItem[];
    private selectCustomer: string = '';
    private validations: any[] = [];
    private sendBookingRequestData : any[] = [];
    private validationFailed: boolean = false;
    private displayValidationDialog: boolean = false;
    private displaySalesOrderSuccess: boolean = false;
    private displaySalesOrderFailure: boolean = false;
    private sendBookingRequestClick : boolean = false;
    private bookingRequestDisable : boolean = false;
    private getCustomerPopUp: boolean;
    private disabledOkButton: boolean = true;
    private selectedCustomer: {customerId: any, customerName: string, deptId: any} = {customerId: "", customerName: "", deptId: ""};
    private displayExportRefContent: boolean = false;
    private sendBookingRequestJSON : string;
    //    private getDeptC: string;

    constructor() {
        console.log("ExportRefComponent: constructor");
        this.setDropDowns();
        this.setRefYM();
        this.startSubscribe();
        this.selectedCustomer = {customerId: "", customerName: "", deptId: ""};
    }

    ngOnInit() {
    }

    setDefaultsSalesOrder() {
        this.salesOrderData.jobType = 'L';
        this.salesOrderData.agentId = '';
        this.salesOrderData.portLoad = 'DUBAI';
        this.salesOrderData.portDischarge = 'DUBAI';
        this.salesOrderData.oblTermId = 'FP';
        this.salesOrderData.refCurrency = 'USD';
        this.salesOrderData.carierRate = '1.0000';
        this.salesOrderData.hbl = '0';
        this.salesOrderData.schTypeInd = 'Direct';
        this.salesOrderData.carrierAgentId = '';
        this.salesOrderData.actualCarrierId = '';
        this.salesOrderData.schFaxInd = 'Yes';

        this.salesOrderData.mode = 'SEA';
        this.salesOrderData.bl = '3';
        this.salesOrderData.blCopy = 3;
        this.salesOrderData.nvoccAgent = '';
        this.salesOrderData.sendAs = 'Original';
        this.salesOrderData.moveType = 'PP';
        this.salesOrderData.includeContainerNumber = 'Yes';

        this.salesOrderData.etaDest = new Date();
        this.salesOrderData.portCutOffDate = new Date();

        this.setRefYM();
        WebSocketService.getInstance().salesOrderDataBehaviorSubject.next(this.salesOrderData);
    }

    customerDataBehaviorSubjectSubscribe(data) {
        this.customers = [];
        this.customers.push({label: 'Select Customer', value: null});
        for (let i in data) {
            this.customers.push({label: data[i].customerName, value: {customerId: data[i].customerId, customerName: data[i].customerName, deptId: data[i].deptId}});
        }
    }

    // selectCustomerHandler() {
    //     console.log("selectCustomerHandler");
    //     // this.getCustomerPopUp = false;
    //     WebSocketService.getInstance().customerIdBehaviorSubject.next(this.selectedCustomer);
    // }

    setDropDowns() {
        this.dropdownArray = [];
        this.dropdownArray.push({label: 'Yes', value: 'Yes'});
        this.dropdownArray.push({label: 'No', value: 'No'});
        this.routes = [];
        this.routes.push({label: 'Select Route', value: ''});
        this.routes.push({label: 'East Coast', value: 'East Coast'});
        this.routes.push({label: 'West Coast', value: 'West Coast'});
        this.schTypeInd = [];
        this.schTypeInd.push({label: 'Select', value: ''});
        this.schTypeInd.push({label: 'Direct', value: 'Direct'});
        this.schTypeInd.push({label: 'Console', value: 'Console'});
        this.blArray = [];
        this.blArray.push({label: 'Select BL', value: ''});
        this.blArray.push({label: 'ORIGINAL', value: 'ORIGINAL'});
        this.blArray.push({label: 'SEAWAY BILL', value: 'SEAWAY BILL'});
        this.sendAs = [];
        this.sendAs.push({label: 'Original', value: 'Original'});
        this.sendAs.push({label: 'Amendment', value: 'Amendment'});
        this.transportMode = [];
        this.transportMode.push({label: 'Select Mode', value: ''});
        this.transportMode.push({label: 'SEA', value: 'SEA'});
        this.transportMode.push({label: 'AIR', value: 'AIR'});
        this.transportMode.push({label: 'LAND', value: 'LAND'});
        this.transportMode.push({label: 'RAIL', value: 'RAIL'});
        this.moveTypeArray.push({label: 'Door To Door', value: 'Door To Door'});
        this.moveTypeArray.push({label: 'Door To Port', value: 'Door To Port'});
        this.moveTypeArray.push({label: 'Port To Door', value: 'Port To Door'});
        this.moveTypeArray.push({label: 'Port To Port', value: 'Port To Port'});
        this.moveTypeArray.push({label: 'CY To CY', value: 'CY To CY'});
    }

    // showCustomers() {
    //     console.log("selected value", this.selectedCustomer.customerName);
    //     if (this.selectedCustomer.customerName == "") {
    //         console.log("selected value***************************", this.selectedCustomer.customerName);
    //     }
    //     else {
    //         this.disabledOkButton = false;
    //     }
    // }

    //    ngOnChanges(changes: any) {
    //        if (changes.tabActive.currentValue) {
    //            console.log("ExportRefComponent: ngOnChanges: changes.tabActive.currentValue", changes.tabActive.currentValue);
    //            if (changes.tabActive.currentValue) {
    //                if (this.notLoaded) {
    //                    this.notLoaded = false;
    //                    this.startSubscribe();
    //                }
    //            }
    //        } else {
    //            //            console.log("ExportRefComponent: changes.tabActive.currentValue", changes.tabActive.currentValue);
    //            //            WebSocketService.getInstance().salesOrderDataBehaviorSubject.next(this.salesOrderData);
    //        }
    //    }

    startSubscribe() {
        WebSocketService.getInstance().salesOrderSaveBehaviorSubject.subscribe(data => this.salesOrderSaveHandler(data));
        WebSocketService.getInstance().jobTypeDataBehaviorSubject.subscribe(data => this.showJobTypedropdown(data));
        WebSocketService.getInstance().vendorDataBehaviorSubject.subscribe(data => this.vendorDatadropdown(data));
        WebSocketService.getInstance().portDataBehaviorSubject.subscribe(data => this.portDataBehaviorSubjectSubscribe(data));
        WebSocketService.getInstance().salesOrderDataBehaviorSubject.subscribe(data => this.showSalesOrderData(data));
        WebSocketService.getInstance().currencyDataBehaviorSubject.subscribe(data => this.showCurrencydropdown(data));
        WebSocketService.getInstance().gencodeDataBehaviorSubject.subscribe(data => this.gencodeDataHandler(data));
        WebSocketService.getInstance().customerIdBehaviorSubject.subscribe(data => this.selectedCustomerDataHandler(data));
        WebSocketService.getInstance().customerDataBehaviorSubject.subscribe(data => this.customerDataBehaviorSubjectSubscribe(data));
    }

    salesOrderSaveHandler(data) {
        if (data.status == 'Success') {
            console.log("ExportRefComponent: salesOrderSaveHandler: Success", data, data.message.salesOrderNo);
            this.salesOrderNo = parseInt(data.message.salesOrderNo);
            this.salesOrderData.salesOrderNo = this.salesOrderNo;
            console.log("ExportRefComponent: salesOrderSaveHandler: Success this.salesOrderData", this.salesOrderData);
            WebSocketService.getInstance().salesOrderDataBehaviorSubject.next(this.salesOrderData);
            setTimeout(() => {
                data.status = "";
                WebSocketService.getInstance().salesOrderSaveBehaviorSubject.next(data);
            }, 10)
        } else if (data.status == 'Error') {
            console.log("ExportRefComponent: salesOrderSaveHandler: Error");
            this.displaySalesOrderFailure = true;
        }
    }

    showJobTypedropdown(data) {
        this.jobType = [];
        this.jobType.push({label: 'Job Code', value: ''});
        for (let i in data) {
            this.jobType.push({label: data[i].job_description, value: data[i].job_id});
        }
    }

    vendorDatadropdown(data) {
        // Displaying id as label
        this.vendorData = [];
        this.vendorData.push({label: 'Vendor ID', value: ''});
        for (let i in data) {
            this.vendorData.push({label: data[i].VENDOR_ID, value: data[i].VENDOR_NAME});
        }
        // Displaying name as label
        this.vendorData2 = [];
        this.vendorData2.push({label: 'Vendor Name', value: ''});
        for (let i in data) {
            this.vendorData2.push({label: data[i].VENDOR_NAME, value: data[i].VENDOR_ID});
        }
    }

    clickOk() {
        // this.getCustomerPopUp = false;
    }

    portDataBehaviorSubjectSubscribe(data) {
        if (data != undefined) {
            if (data.length > 0) {
                this.portData = [];
                this.portData.push({label: 'Port ID', value: ''});
                for (let i in data) {
                    this.portData.push({label: data[i].portId, value: data[i].portName});
                }
            }
        }
    }

    showSalesOrderData(data) {
        console.log("ExportRefComponent: showSalesOrderData: data", data);
        if (data == null || data == "" || data == undefined) {
            this.salesOrderData = new SalesOrderData();
            this.setDefaultsSalesOrder();
        } else {
            // this is for displaying search (find) data....!!
            this.salesOrderData = data;
            this.salesOrderData.portCutOffDate = this.getNewDate(data.portCutOffDate);
            this.salesOrderData.etaPortnet = this.getNewDate(data.etaPortnet);
            this.salesOrderData.etdPortLoad = this.getNewDate(data.etdPortLoad);
            this.salesOrderData.etd = this.getNewDate(data.etd);
            this.salesOrderData.etaDest = this.getNewDate(data.etaDest);
            this.salesOrderData.etaPlaceOfDel = this.getNewDate(data.etaPlaceOfDel);
            this.salesOrderData.oblCollectDate = this.getNewDate(data.oblCollectDate);
            this.salesOrderData.origBookedVslETA = this.getNewDate(data.origBookedVslETA);
            this.salesOrderData.firstBookedETAPOL = this.getNewDate(data.firstBookedETAPOL);
            this.salesOrderData.firstBookedETD = this.getNewDate(data.firstBookedETD);
            this.salesOrderData.firstBookedETADest = this.getNewDate(data.firstBookedETADest);
            this.salesOrderData.revisedRDD = this.getNewDate(data.revisedRDD);
            this.salesOrderData.approveDate = this.getNewDate(data.approveDate);

            this.setCustomer();
        }
        if (this.salesOrderData['refYM'] == undefined) {
            this.setRefYM();
        } else if (this.salesOrderData['refYM'] == "") {
            this.setRefYM();
        }
    }

    setCustomer() {
        for (let i in this.customers) {
            if (this.customers[i].value) {
                console.log(this.customers[i].value.customerId);
                if (this.customers[i].value.customerId == this.salesOrderData.customerId) {
                    console.log("INside if", this.customers[i].value.customerId);
                    this.customerName = this.customers[i].value.customerName;
                    this.selectedCustomer = {
                        customerId: this.salesOrderData.customerId,
                        customerName: this.customers[i].value.customerName,
                        deptId: this.salesOrderData.deptId
                    };
                    WebSocketService.getInstance().customerIdBehaviorSubject.next(this.selectedCustomer);
                }
            }
        }
    }

    getNewDate(d: string) {
        var timestamp = Date.parse(d)
        if (timestamp == 0) {
            return null;
        } else if (isNaN(timestamp) == false) {
            return new Date(timestamp);
        } else {
            return null;
        }
    }

    showCurrencydropdown(data) {
        this.currency = [];
        this.currency.push({label: 'Currency', value: ''});
        for (let i in data) {
            this.currency.push({value: data[i].CURRENCY_ID, label: data[i].CURRENCY_NAME});
        }
    }

    gencodeDataHandler(data) {
        this.gencodeData = [];
        this.gencodeData.push({label: 'Select Gencode', value: ''});
        for (let i in data) {
            this.gencodeData.push({label: data[i].GENCODE_ID, value: data[i].GENCODE_DES});
        }
    }

    save() {
        this.displaySalesOrderSuccess = true;
        // this.salesOrderData.customerId = this.selectedCustomer.customerId;
        this.salesOrderData.customerId = this.customerId;
        console.log("this.salesOrderData.sale", this.salesOrderData.salesOrderNo)
        WebSocketService.getInstance().sendMessage({
            'action': 'saveSalesOrder',
            'message': this.salesOrderData
        });
        // this.salesOrderData.customerId = this.customerId;
    }

    cancel() {
        console.log("ExportRefComponent: cancel");
        let deptId = this.salesOrderData.deptId;
        this.salesOrderData = new SalesOrderData();
        // this.customerName = '';
        // this.getCustomerPopUp = (this.customerName == '') ? true : false;
        // this.selectedCustomer = {customerId: "", customerName: "", deptId: ""};
        // WebSocketService.getInstance().customerIdBehaviorSubject.next(this.selectedCustomer);
        WebSocketService.getInstance().appSearchClearBehaviorSubject.next(true);
        // console.log('this.getCustomerPopUp', this.getCustomerPopUp, '**' + this.customerName + '**');

        // set default values
        this.salesOrderData.deptId = deptId;
        this.salesOrderData.customerId = this.selectedCustomer.customerId;
        this.setDefaultsSalesOrder();
    }

    setRefYM() {
        let currentDate = new Date();
        let str = "" + (currentDate.getMonth() + 1)
        let pad = "00"
        let month = pad.substring(0, pad.length - str.length) + str
        this.salesOrderData['refYM'] = currentDate.getFullYear() + "" + month;
    }

    calculateTransitDays() {
        if (this.salesOrderData.etaDest != undefined && this.salesOrderData.etd != undefined)
            this.salesOrderData.transitDays = Math.ceil((new Date(new Date(this.salesOrderData.etaDest).setHours(0, 0, 0, 0)).getTime() - new Date(new Date(this.salesOrderData.etd).setHours(0, 0, 0, 0)).getTime()) / 1000 / 60 / 60 / 24);
    }

    approverIndHandler(e) {
        if (e) {
            this.salesOrderData.approver = sessionStorage.getItem("userName");
            this.salesOrderData.approveDate = new Date();
        } else {
            this.salesOrderData.approver = "";
            this.salesOrderData.approveDate = null;
        }
    }

    selectedCustomerDataHandler(data) {
        console.log('selectedCustomerDataHandler', data);
        if (data.customerName != '' || data.customerId != '') {
          this.displayExportRefContent = true;
        }
        this.customerName = data.customerName;
        this.salesOrderData.deptId = data.deptId;
        this.customerId = data.customerId;
        // this.getCustomerPopUp = (this.customerName == '') ? true : false;
        console.log('this.getCustomerPopUp', this.getCustomerPopUp, '**' + this.customerName + '**');
    }


    sectionClick(data) {
        console.log(data);
        if (data == 'displayApproverBlock') {
            this.displayApproverBlock = !this.displayApproverBlock;
        } else if (data == 'displayApproverBlock') {
            this.displayApproverBlock = !this.displayApproverBlock;
        } if (data == 'displayEventBlock') {
            this.displayEventBlock = !this.displayEventBlock;
        } if (data == 'displayGTNBlock') {
            this.displayGTNBlock = !this.displayGTNBlock;
        }
        if (this.displayApproverBlock && this.displayApproverBlock && this.displayApproverBlock) {

        }
        if (!this.displayApproverBlock && !this.displayApproverBlock && !this.displayApproverBlock) {

        }
    }

    sendBookingRequest() {
     this.sendBookingRequestData = [];
     this.sendBookingRequestData.push({salesOrderNo : this.salesOrderData.salesOrderNo, moveType : this.salesOrderData.moveType, sendAs : this.salesOrderData.sendAs});
     this.sendBookingRequestJSON = JSON.stringify(this.sendBookingRequestData[0]);
     console.log("sendBookingRequestJSON",this.sendBookingRequestJSON);
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          this.responseText;
          console.log("responseText : ",this.responseText);
        }
      };

      xhttp.open("GET", "http://54.251.188.71:8080/EliteJava/webresources/scheduleJob/bookingRequest/"+this.sendBookingRequestJSON, true);

      xhttp.send();
      this.sendBookingRequestClick = true;
      setTimeout(() => {
        this.sendBookingRequestClick =  false;
      }, 2000);
     this.bookingRequestDisable = true;
    }
}
