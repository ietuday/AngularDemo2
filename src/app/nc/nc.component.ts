import {Component, OnInit, Output, Input, EventEmitter, ViewEncapsulation} from '@angular/core';
import {SelectItem, Message} from 'primeng/primeng';
import {TreeNode, ConfirmationService} from 'primeng/primeng';
import {WsMessage} from '../data-models/ws-message';
import {NcParty} from '../data-models/ncParty';
import {WebSocketService} from '../services/web-socket.service';
import {NcType} from '../data-models/ncType';
import {NcCurrency} from '../data-models/ncCurrency';
import {NcDetailsData} from '../data-models/nc-details-data';
import {UploadService} from '../services/upload.service';
import {CustomerData} from '../data-models/customer-data';
import {SalesOrderData} from '../data-models/sales-order-data';

declare var $: any;
@Component({
    selector: 'nc-report',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './nc.component.html',
    styleUrls: ['./nc.component.scss'],
    providers: [WebSocketService, ConfirmationService]
})

export class NcComponent implements OnInit {
    // @Input() salesOrderNo: number;
    @Output() TransNoEvent = new EventEmitter();

    private value: Date;
    private display: boolean = false;
    private disabled: boolean = true;
    private reference: boolean = true;
    private carierDisplay: boolean = false;
    private referNo: number;
    private add11: boolean = false;
    private ncType: SelectItem[];
    private agent: SelectItem[];
    private bank: SelectItem[];
    private jobNo: number;
    private shown: boolean = false;
    private selectName: string;
    private selectedDropdown: string;
    private selectType: boolean = false;
    private ncParty: string;
    private salesOrderNo: number = 2027;
    private selectedValues: string;
    private checked: boolean = true;
    private name: SelectItem[];
    private selectedType: string;
    private cities: SelectItem[];
    private ncPartyData: SelectItem[];
    private cost: number = 0;
    private ncCurrency: SelectItem[];
    private CARRIER: string = '';
    private msgs: Message[];
    private ncDetailsData: NcDetailsData = new NcDetailsData();
    private wsMessage: WsMessage = new WsMessage();
    private transNo: number = -1;
    //    private ncDataArray: NcDetailsData[] = [];
    private displayMarkingDialog: boolean = false;
    private dropdownArray: SelectItem[];
    private customers: SelectItem[];
    private deleteNCDetails;
    private customerName: string = '';
    private customerId: number = -1;
    private salesOrderData: SalesOrderData = new SalesOrderData();
    private displayTransNumberSuccess: boolean = false;
    private disabledCreate: boolean = true;
    private disabledCustomer: boolean = true;
    private saveClicked: boolean = false;
    private deleteClicked: boolean = false;
    private ncJoncCustomerNbNo: string = 'E';
    private createdBy: string = 'Demo';
    private selectedIndex: number = 0;
    private totalRows: number = 1;

    constructor(private confirmationService: ConfirmationService) {

        this.dropdownArray = [];
        this.dropdownArray.push({label: 'Yes', value: 'Yes'});
        this.dropdownArray.push({label: 'No', value: 'No'});
        // this.TransNoEvent.emit(this.transNo);
        setTimeout(() => {
            let elm1: any = $('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-shadow.ui-dialog-draggable');
            elm1[0]['style']['overflow'] = 'auto';
            elm1[0]['style']['top'] = '70px';
            elm1[0]['style']['bottom'] = '70px';
        }, 100);


        //            WebSocketService.getInstance().salesOrderSaveBehaviorSubject.subscribe(data => this.showSalesOrderData(data));
        WebSocketService.getInstance().salesOrderDataBehaviorSubject.subscribe(data => this.showSalesOrderData(data));
        //        WebSocketService.getInstance().saveTransNoDetailsBehaviorSubject.subscribe(data => this.saveTransNoDetails(data));
        WebSocketService.getInstance().ncpartyDataBehaviorSubject.subscribe(data => this.showNcpartydropdown(data));
        WebSocketService.getInstance().nctypeDataBehaviorSubject.subscribe(data => this.showNcTypedropdown(data));
        WebSocketService.getInstance().currencyDataBehaviorSubject.subscribe(data => this.showNcCurrencydropdown(data));
        //    WebSocketService.getInstance().saveNcDetailsBehaviorSubject.subscribe(data => this.saveNcDetailsHandler(data));
        //    WebSocketService.getInstance().ncDetailsArrayBehaviorSubject .subscribe(data => this.showNcDetailsData(data));
        WebSocketService.getInstance().customerDataBehaviorSubject.subscribe(data => this.customerDataBehaviorSubjectSubscribe(data));
        //    WebSocketService.getInstance().deleteNCDetailsBehaviorSubject.subscribe(data => this.deleteNCDetailsBehaviorSubjectSubscribe(data));
        // WebSocketService.getInstance().ncDetailsSchedulerBehaviorSubject.subscribe(data => this.ncDetailsSchedulerHandler(data));
        WebSocketService.getInstance().customerIdBehaviorSubject.subscribe(data => this.selectedCustomerDataHandler(data));
    }
    ngOnInit() {
    }


    //  deleteNCDetailsBehaviorSubjectSubscribe(data){
    //    console.log("In NCComponent :deleteNCDetailsBehaviorSubjectSubscribe",data);
    //    console.log("In NCComponent :deleteNCDetailsBehaviorSubjectSubscribe",data.ncParty);
    //    this.deleteNCDetails = [];
    //  }

    //    saveTransNoDetails(data) {
    //        console.log("In NC Component", data);
    //        console.log("Trans number on html", data.message);
    //        this.ncDetailsData.transNo = data.message;
    //        console.log("Trans number further", this.ncDetailsData.transNo);
    //    }

    customerDataBehaviorSubjectSubscribe(data) {
        this.customers = [];
        this.customers.push({label: 'Select Customer', value: null});
        for (let i in data) {
            this.customers.push({label: data[i].customerName, value: {customerId: data[i].customerId, customerName: data[i].customerName, deptId: data[i].deptId}});
        }
    }
    selectedCustomerDataHandler(data) {
        console.log('selectedCustomerDataHandler', data);
        this.ncDetailsData.customerName = data.customerName;
        this.customerName = data.customerName;
        this.salesOrderData.deptId = data.deptId;
        this.customerId = data.customerId;
    }

    //  salesOrderSaveHandler(data)     {
    //    console.log(" In NC Component salesOrderSaveHandler",data)    ;
    //    console.log(" In NC Component salesOrderSaveHandler",data.message)    ;
    //    console.log(" In NC Component salesOrderSaveHandler",data.message)    ;
    //    console.log(" In NC Component salesOrderSaveHandler",data)    ;
    //
    //    // console.log(" In NC Component",data.message.jobNo)    ;
    //    //   this.ncKhaliArray =[]    ;
    //    // this.ncKhaliArray= data.message    ;
    //    // console.log("ncKhaliArray",this.ncKhaliArray[])    ;
    //
    //  }

    showSalesOrderData(data) {
        console.log("NcComponent: data", data);
        if (data == null || data == "" || data == undefined) {
            this.salesOrderData = new SalesOrderData();
            this.ncDetailsData = new NcDetailsData();
        } else {
            this.salesOrderData = data;
            if (this.salesOrderData.ncs) {
                if (this.salesOrderData.ncs.length > 0) {
                    this.totalRows = this.salesOrderData.ncs.length;
                    this.selectedIndex = this.salesOrderData.ncs.length - 1;
                    this.ncDetailsData = this.salesOrderData.ncs[this.selectedIndex];


                    if (this.ncDetailsData.startDate) {
                        if (this.ncDetailsData.startDate != null) {
                            this.ncDetailsData.startDate = new Date(this.ncDetailsData.startDate);
                        }
                    }

                    if (this.ncDetailsData.dueDateOfAction) {
                        if (this.ncDetailsData.dueDateOfAction != null) {
                            this.ncDetailsData.dueDateOfAction = new Date(this.ncDetailsData.dueDateOfAction);
                        }
                    }

                    if (this.ncDetailsData.revisedBookedEtd) {
                        if (this.ncDetailsData.revisedBookedEtd != null) {
                            this.ncDetailsData.revisedBookedEtd = new Date(this.ncDetailsData.revisedBookedEtd);
                        }
                    }

                    if (this.ncDetailsData.actionDate) {
                        if (this.ncDetailsData.actionDate != null) {
                            this.ncDetailsData.actionDate = new Date(this.ncDetailsData.actionDate);
                        }
                    }

                    if (this.ncDetailsData.implementationDate) {
                        if (this.ncDetailsData.implementationDate != null) {
                            this.ncDetailsData.implementationDate = new Date(this.ncDetailsData.implementationDate);
                        }
                    }

                    this.showNCType();

                } else {
                    this.totalRows = 1;
                    this.selectedIndex = 0;
                    this.ncDetailsData = new NcDetailsData();
                    this.ncDetailsData.customerName = this.customerName;
                }
            } else {
                this.totalRows = 1;
                this.selectedIndex = 0;
                this.salesOrderData.ncs = [];
                this.ncDetailsData = new NcDetailsData();
            }
        }
    }

    showNCType() {
        if (this.ncDetailsData.ncParty == null) {
            console.log("Its Null value on which You Clicked", this.ncDetailsData.ncParty);
        } else {
            console.log("Hello action is NcTYPE", this.ncDetailsData.ncParty);
            this.disabled = false;
            this.wsMessage.name = this.ncDetailsData.ncParty;
            this.wsMessage.action = 'getNCTypes';
            console.log("In showNCType", this.wsMessage);
            WebSocketService.getInstance().sendMessage(this.wsMessage);
        }
    }

    ncDelete() {
        console.log("NcComponent: ncDelete", this.salesOrderNo);
        if (this.salesOrderData.ncs) {
            if (this.salesOrderData.ncs.length > 0) {
                this.deleteClicked = true;
                this.salesOrderData.ncs.splice(this.selectedIndex, 1);
                WebSocketService.getInstance().sendMessage({
                    'action': 'saveSalesOrderNCs',
                    'message': this.salesOrderData
                });
                setTimeout(() => {
                    this.deleteClicked = false;
                }, 2000);
            }
        }
    }

    ncAdd() {
        this.ncDetailsData = new NcDetailsData();
        this.ncDetailsData.customerName = this.customerName;
        this.salesOrderData.ncs.push(this.ncDetailsData);
        this.totalRows = this.salesOrderData.ncs.length;
        this.selectedIndex = this.totalRows - 1;
    }

    ncSave() {
        this.saveClicked = true;
        this.salesOrderData.ncs[this.selectedIndex] = this.ncDetailsData;
        console.log("this.salesOrderData", this.salesOrderData);
        WebSocketService.getInstance().sendMessage({
            'action': 'saveSalesOrderNCs',
            'message': this.salesOrderData
        });
        setTimeout(() => {
            this.saveClicked = false;
        }, 2000);
    }

    ncNext() {
        this.selectedIndex = this.selectedIndex + 1;
        this.ncDetailsData = this.salesOrderData.ncs[this.selectedIndex];
        this.showNCType();
    }

    ncPrev() {
        this.selectedIndex = this.selectedIndex - 1;
        this.ncDetailsData = this.salesOrderData.ncs[this.selectedIndex];
        this.showNCType();
    }

    showNcpartydropdown(data) {
        console.log("In showNcpartydropdown", data);

        this.ncPartyData = [];
        this.ncPartyData.push({label: 'Description', value: 'CODE'});
        for (let i in data) {
            this.ncPartyData.push({label: data[i].NC_PARTY_DESC, value: data[i].NC_PARTY_CODE});
        }
        console.log("In showNcpartydropdown", this.ncPartyData);
    }

    showNcCurrencydropdown(data) {
        this.ncCurrency = [];
        this.ncCurrency.push({label: 'Currency', value: 'Code'});
        for (let i in data) {
            this.ncCurrency.push({value: data[i].CURRENCY_ID, label: data[i].CURRENCY_NAME});
        }
    }

    showNcTypedropdown(data) {
        this.ncType = [];
        this.ncType.push({label: 'Code', value: 'Description'});
        for (let i in data) {
            this.ncType.push({value: data[i].NC_TYPE_DESC, label: data[i].NC_TYPE_CODE});
        }
    }

    //    saveTransNo() {
    //        // this.displayTransNumberSuccess = true;
    //        console.log("In saveTransNo", this.ncDetailsData.transNo);
    //        this.saveClicked = true;
    //        setTimeout(() => {
    //            WebSocketService.getInstance().showNCBehaviorSubject.next(false);
    //            this.saveClicked = false;
    //        }, 2000);
    //        this.ncDataArray.push(this.ncDetailsData);
    //        // console.log("In saveTransNo******",this.ncDetailsData);
    //        this.salesOrderData.ncsdetail = this.ncDataArray;
    //        console.log("Markings: this.salesOrderData", this.salesOrderData);
    //        WebSocketService.getInstance().sendMessage({
    //            'action': 'saveTransNo',
    //            'message': {
    //                'salesOrderNo': this.salesOrderData.salesOrderNo,
    //                'ncData': this.ncDataArray
    //            }
    //        });
    //        this.ncDataArray = [];
    //    }

    ncCancel() {
        this.ncDetailsData = new NcDetailsData();
        console.log("In NC Component:ncCancel", this.ncDetailsData);
    }

    //  saveNcDetailsHandler(data)     {
    //    console.log("saveNcDetailsHandler: data", data)    ;
    //
    //    if (data.status == 'Success')     {
    //      console.log("Iside if saveNcDetailsHandler", data.message.TransNo)    ;
    //      // this.TransNo = parseInt(data.message.TransNo)    ;
    //      // this.ncDetailsData.TransNo = this.TransNo    ;
    //      // this.TransNoEvent.emit(this.TransNo)    ;
    //      // this.msgs = []    ;
    //      // console.log("Before Inserting Push",this.msgs)    ;
    //      // this.msgs.push({severity: 'success', summary: 'Success.', detail: 'Trans No Generated #' + data.message.TransNo})    ;
    //      // console.log("After Inserting Push",this.msgs)    ;
    //    } else if (data.status == 'Error')     {
    //      // this.msgs = []    ;
    //      // this.msgs.push({severity: 'error', summary: 'Error.', detail: 'Trans No Generation failed.'})    ;
    //        }
    //  }

    //  showNcDetailsData(data){
    //    console.log("showNcDetailsData: data", data);
    //    if (data == null || data == "" || data == undefined) {
    //      console.log("Ignore");
    //    } else {
    //      // this is for displaying search (find) data....!!
    //      // this.ncDataArray = data;
    //      console.log("NcComponent :showNcDetailsData#####UUUUU******* ");
    //      // Data is getting displayed on page and then throws the 'Getter' error
    //      // Only need to fix this error
    //    }
    //
    //  }

    showDialog() {
        this.displayMarkingDialog = true;
    }

    getNcDetails() {
        console.log(" getNcDetails", this.salesOrderNo);
        WebSocketService.getInstance().sendMessage({
            'action': 'getNcDetail',
            'message': {
                "salesOrderNo": this.salesOrderNo,
                "ncDetails": this.ncDetailsData
            }
        });
    }

}
