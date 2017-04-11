import {Component, OnInit, OnChanges, ViewEncapsulation, Input} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {WebSocketService} from '../services/web-socket.service';
import {SalesOrderData} from '../data-models/sales-order-data';

declare var $: any;

@Component({
    selector: 'export-bl',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './export-bl.component.html',
    styleUrls: ['./export-bl.component.scss'],
})
export class ExportBLComponent implements OnInit {

    @Input() tabActive: boolean;

    private disabled: boolean = true;
    private getCustomerPopUp: boolean = false;
    private dropdownArray: SelectItem[];
    private selectedData: string;
    private salesOrderData: SalesOrderData = new SalesOrderData();
    private salesOrderNo: number = -1;
    private gencodeData: any[] = [];
    private countryData: any[] = [];
    private paymentData: any[] = [];
    private portData: any[] = [];
    private premiumRates: any[] = [];
    private customers: SelectItem[];
    private customerId: number = -1;
    private customerName: string = "";
    private etdDate: any;
    private validations: any[] = [];
    private validationFailed: boolean = false;
    private displayValidationDialog: boolean = false;
    private displaySalesOrderSuccess: boolean = false;
    private displaySalesOrderFailure: boolean = false;
    private selectedCustomer: {customerId: any, customerName: string, deptId: any} = {customerId: "", customerName: "", deptId: ""};

    private applyHeightAddRef: number = 68;
    private addRefCount: number = 1;
    private addRefBlock1: boolean = false;
    private addRefBlock2: boolean = false;
    private addRefDisplay: boolean = true;

    private oceanFreightCostError: boolean = false;
    private insuranceValueError: boolean = false;
    private chargeError: boolean = false;
    private premiumAmtError: boolean = false;
    private blCostError: boolean = false;
    private numericError: boolean = false;

    constructor() {

        this.getCustomerPopUp = false;
        this.dropdownArray = [];
        this.dropdownArray.push({label: 'Yes', value: 'Yes'});
        this.dropdownArray.push({label: 'No', value: 'No'});

        this.premiumRates = [];
        this.premiumRates.push({label: 'Select', value: ''});
        this.premiumRates.push({label: '0', value: '0'});
        this.premiumRates.push({label: '0.06', value: '0.06'});
        this.premiumRates.push({label: '0.095', value: '0.095'});
        this.premiumRates.push({label: '0.10', value: '0.10'});
        this.premiumRates.push({label: '0.12', value: '0.12'});
        this.premiumRates.push({label: '0.135', value: '0.135'});
        this.premiumRates.push({label: '0.155', value: '0.155'});

        WebSocketService.getInstance().salesOrderSaveBehaviorSubject.subscribe(data => this.salesOrderSaveHandler(data));
        WebSocketService.getInstance().salesOrderDataBehaviorSubject.subscribe(data => this.showSalesOrderData(data));
        WebSocketService.getInstance().gencodeDataBehaviorSubject.subscribe(data => this.gencodeDataHandler(data));
        WebSocketService.getInstance().countryDataBehaviorSubject.subscribe(data => this.countryDataHandler(data));
        WebSocketService.getInstance().paymentDataBehaviorSubject.subscribe(data => this.paymentDataHandler(data));
        WebSocketService.getInstance().portDataBehaviorSubject.subscribe(data => this.portDataBehaviorSubjectSubscribe(data));
        WebSocketService.getInstance().customerIdBehaviorSubject.subscribe(data => this.selectedCustomerDataHandler(data));
        WebSocketService.getInstance().customerDataBehaviorSubject.subscribe(data => this.customerDataBehaviorSubjectSubscribe(data));
    }

    ngOnInit() {
    }

    customerDataBehaviorSubjectSubscribe(data) {
        this.customers = [];
        this.customers.push({label: 'Select Customer', value: null});
        for (let i in data) {
            this.customers.push({label: data[i].customerName, value: {customerId: data[i].customerId, customerName: data[i].customerName, deptId: data[i].deptId}});
        }
        this.cancel();
    }

    salesOrderSaveHandler(data) {
        if (data.status == 'Success') {
            console.log("ExportBLComponent: salesOrderSaveHandler: Success", data, data.message.jobNo);
            this.salesOrderNo = parseInt(data.message.salesOrderNo);
            this.salesOrderData.salesOrderNo = this.salesOrderNo;
            this.salesOrderData.jobNo = parseInt(data.message.jobNo);
            WebSocketService.getInstance().salesOrderDataBehaviorSubject.next(this.salesOrderData);
            setTimeout(() => {
                data.status = "";
                WebSocketService.getInstance().salesOrderSaveBehaviorSubject.next(data);
            }, 10)
        } else if (data.status == 'Error') {
            console.log("ExportBLComponent: salesOrderSaveHandler: Error");
            this.displaySalesOrderFailure = true;
        }
    }

    setDefaultsSalesOrder() {
        this.salesOrderData.bln = 'TBA';
        this.salesOrderData.transhipInd = false;
        this.salesOrderData.tranship = '0';
        this.salesOrderData.freightTermId = 'FP';
        this.salesOrderData.portDischargeTerms = 'CY';
        this.salesOrderData.placeOfDeliveryTerms = 'CY';
        this.salesOrderData.countryOfUltimateDest = 'SA';
        this.salesOrderData.lcConfirmed = 'No';
        this.salesOrderData.containerized = 'Yes';
        this.salesOrderData.oceanFreightCost = 1.10;
        this.etdDate = '';
        //        this.salesOrderData.agentId = '';
        //        this.salesOrderData.portLoad = 'DUBAI';
        //        this.salesOrderData.portDischarge = 'DUBAI';
        //        this.salesOrderData.oblTermId = 'FP';
        //        this.salesOrderData.refCurrency = 'USD';
        //        this.salesOrderData.carierRate = '1.0000';
        //        this.salesOrderData.hbl = '0';
        //        this.salesOrderData.schTypeInd = 'Direct';
        //        this.salesOrderData.carrierAgentId = '';
        //        this.salesOrderData.actualCarrierId = '';
        //        this.salesOrderData.schFaxInd = 'Yes';
        //
        //        this.salesOrderData.etaDest = new Date();
        //        this.salesOrderData.portCutOffDate = new Date();

        WebSocketService.getInstance().salesOrderDataBehaviorSubject.next(this.salesOrderData);
    }

    showSalesOrderData(data) {
        console.log("ExportBLComponent: data", data);
        if (data == null || data == "" || data == undefined) {
            this.salesOrderData = new SalesOrderData();
            this.setDefaultsSalesOrder();
        } else {
            if (data.etd != null) {
                let convertedDate = this.convertDate(data.etd);
                this.etdDate = convertedDate;
            }
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
            this.salesOrderData.invoiceDate = this.getNewDate(data.invoiceDate);
            this.salesOrderData.CNBApprovalDate = this.getNewDate(data.CNBApprovalDate);

            this.setCustomer();

            //            this.salesOrderData.portCutOffDate = new Date(data.portCutOffDate);
            //            this.salesOrderData.etaPortnet = new Date(data.etaPortnet);
            //            this.salesOrderData.etdPortLoad = new Date(data.etdPortLoad);
            //            this.salesOrderData.etd = new Date(data.etd);
            //            this.salesOrderData.etaDest = new Date(data.etaDest);
            //            this.salesOrderData.etaPlaceOfDel = new Date(data.etaPlaceOfDel);
            //            this.salesOrderData.oblCollectDate = new Date(data.oblCollectDate);
            //            this.salesOrderData.origBookedVslETA = new Date(data.origBookedVslETA);
            //            this.salesOrderData.firstBookedETAPOL = new Date(data.firstBookedETAPOL);
            //            this.salesOrderData.firstBookedETD = new Date(data.firstBookedETD);
            //            this.salesOrderData.firstBookedETADest = new Date(data.firstBookedETADest);
            //            this.salesOrderData.revisedRDD = new Date(data.revisedRDD);
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
        //        console.log(d, timestamp, new Date(timestamp));

        if (d == null) {
            return null;
        } else if (timestamp == 0) {
            return null;
        } else if (isNaN(timestamp) == false) {
            return new Date(timestamp);
        } else {
            return null;
        }
    }

    gencodeDataHandler(data) {
        this.gencodeData = [];
        this.gencodeData.push({label: 'Select Gencode', value: ''});
        for (let i in data) {
            this.gencodeData.push({label: data[i].GENCODE_DES, value: data[i].GENCODE_ID});
        }
    }

    countryDataHandler(data) {
        this.countryData = [];
        this.countryData.push({label: 'Select Country', value: ''});
        for (let i in data) {
            this.countryData.push({label: data[i].COUNTRY_NAME, value: data[i].COUNTRY_ID});
        }
    }

    paymentDataHandler(data) {
        this.paymentData = [];
        this.paymentData.push({label: 'Select Payment', value: ''});
        for (let i in data) {
            this.paymentData.push({label: data[i].DESCRIPTION, value: data[i].ID});
        }
    }

    portDataBehaviorSubjectSubscribe(data) {
        if (data != undefined) {
            if (data.length > 0) {
                this.portData = [];
                this.portData.push({label: 'Port ID', value: 'Port Name'});
                for (let i in data) {
                    this.portData.push({label: data[i].portId, value: data[i].portName});
                }
            }
        }
    }

    save() {
        this.displaySalesOrderSuccess = true;
        console.log("ExportBLComponent: saveSalesOrder", this.salesOrderData);
        WebSocketService.getInstance().sendMessage({
            'action': 'saveSalesOrder',
            'message': this.salesOrderData
        });
    }

    cancel() {
        console.log("ExportBLComponent: cancel");
        this.salesOrderData = new SalesOrderData();
        this.customerName = '';
        this.getCustomerPopUp = (this.customerName == '') ? true : false;
        this.selectedCustomer = {customerId: "", customerName: "", deptId: ""};
        //        WebSocketService.getInstance().customerIdBehaviorSubject.next(this.selectedCustomer);
        WebSocketService.getInstance().appSearchClearBehaviorSubject.next(true);
        this.setDefaultsSalesOrder();
        console.log('this.getCustomerPopUp', this.getCustomerPopUp, '**' + this.customerName + '**');
    }

    selectedCustomerDataHandler(data) {
        console.log('selectedCustomerDataHandler', data);
        //        if (this.salesOrderData.salesOrderNo == null) {
        this.customerName = data.customerName;
        this.salesOrderData.deptId = data.deptId;
        this.customerId = data.customerId;
        //        }
    }

    convertDate(inputFormat) {
        function pad(s) {return (s < 10) ? '0' + s : s;}
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
    }

    addBtnClicked(data) {
        console.log("addBtnClicked", data);
        if (data == 'addRefNoPlus1') {
            this.applyHeightAddRef = this.applyHeightAddRef + 30;
            this.addRefCount = this.addRefCount + 1;
            this.addRefBlock1 = true;
        } else if (data == 'addRefNoPlus2') {
            this.applyHeightAddRef = this.applyHeightAddRef + 44;
            this.addRefCount = this.addRefCount + 1;
            this.addRefBlock2 = true;
            this.addRefDisplay = false;
        } else if (data == 'addRefNoMinus1') {
            this.addRefBlock1 = false;
            this.addRefCount = this.addRefCount - 1;
            this.applyHeightAddRef = this.applyHeightAddRef - 30;
        } else if (data == 'addRefNoMinus2') {
            this.addRefBlock2 = false;
            this.addRefCount = this.addRefCount - 1;
            this.addRefDisplay = true;
            this.applyHeightAddRef = this.applyHeightAddRef - 44;
        }
    }

    matchPattern(event, data) {
        console.log("event data", event, data);
        var re = new RegExp("^([0-9]+([.][0-9]+)?)$");
        if (re.test(event)) {
            console.log("Valid");
            this.numericError = false;
            if (data == 'ofc') {
                this.oceanFreightCostError = false;
            } else if (data == 'insuranceValue') {
                this.insuranceValueError = false;
            } else if (data == 'charge') {
                this.chargeError = false;
            } else if (data == 'premiumAmt') {
                this.premiumAmtError = false;
            } else if (data == 'blCost') {
                this.blCostError = false;
            }
        } else {
            console.log("Invalid");
            this.numericError = true;
            if (data == 'ofc') {
                this.oceanFreightCostError = true;
            } else if (data == 'insuranceValue') {
                this.insuranceValueError = true;
            } else if (data == 'charge') {
                this.chargeError = true;
            } else if (data == 'premiumAmt') {
                this.premiumAmtError = true;
            } else if (data == 'blCost') {
                this.blCostError = true;
            }
        }
    }
}
