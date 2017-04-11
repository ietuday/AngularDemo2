import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
//import {Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import {CustomerData} from '../data-models/customer-data';
import {WebSocketService} from '../services/web-socket.service';
import {SelectItem} from 'primeng/primeng';
import {SalesOrderData} from '../data-models/sales-order-data';

declare var $: any;

@Component({
    selector: 'app-dashboard',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    private displayMenu: boolean = false;
    private displayPopupFlag: boolean = false;
    private displayNCReport: boolean = false;
    private windowWidth: number;
    private userInfo: any;
    private userName: any;
    private selectedCustomerId: any;
    private customersData: CustomerData[] = [];
    private customers: SelectItem[];
    private customer: CustomerData = new CustomerData();
    private salesOrderNo: number = -1;
    private showFindSO: boolean = false;
    private selectedSalesOrderNo: any;
    private soNumbers = [];
    private displayMarkingDialog: boolean = false;
    private displayNcDialog: boolean = false;
    private displayExportRef: boolean = true;
    private salesOrderData: SalesOrderData = new SalesOrderData();
    private displayMarkingNcDialog: boolean = false;
    selectedCity: string;
    private getCustomerPopUp: boolean;
    private selectedCustomer: {customerId: any, customerName: string, deptId: any} = {customerId: "", customerName: "", deptId: ""};
    private displayTabs: boolean = false;
    private customerAction: string;

    constructor() {
        console.log("HomePageComponent: displayExportRef", this.displayExportRef);
        setTimeout(() => {
            let elm1: any = $('.ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow ui-dialog-draggable');
            elm1[0]['style']['overflow'] = 'auto';
        }, 100);
        this.windowWidth = window.innerWidth;
        window.addEventListener("resize", (e) => {
            this.windowWidth = window.innerWidth;
            if (this.windowWidth >= 768) {
                this.displayMenu = false
            }
        });
        WebSocketService.getInstance().salesOrderDataBehaviorSubject.subscribe(data => this.showSalesOrderData(data));
        WebSocketService.getInstance().showExportRefBehaviorSubject.subscribe(data => {this.displayExportRef = data});
        WebSocketService.getInstance().ncDetailsSchedulerBehaviorSubject.subscribe(data => this.ncDetailsSchedulerHandler(data));
        WebSocketService.getInstance().showMarkingBehaviorSubject.subscribe(data => this.showMarkingBehaviorSubjectHandler(data));
        WebSocketService.getInstance().showNCBehaviorSubject.subscribe(data => this.showNCBehaviorSubjectHandler(data));
        WebSocketService.getInstance().customerDataBehaviorSubject.subscribe(data => this.customerDataBehaviorSubjectSubscribe(data));

        this.selectedCustomer = {customerId: "", customerName: "", deptId: ""};

    }

    ngOnInit() {
        this.userName = sessionStorage.getItem("userName");
    }

    showMarkingBehaviorSubjectHandler(data) {
        this.displayMarkingDialog = data;
    }

    showNCBehaviorSubjectHandler(data) {
      console.log("************************************", data);
        this.displayNcDialog = data;
    }

    showSalesOrderData(data) {
        console.log("ExportBLComponent: data", data);
        if (data == null || data == "" || data == undefined) {
            this.salesOrderData = new SalesOrderData();
        } else {
          this.salesOrderData = data;
            if (this.salesOrderData.customerId != undefined) {
              this.displayTabs = true;
            }
        }
    }

    displayDialogOfMarkings() {
        console.log("this.salesOrderData", this.salesOrderData);
        if (this.salesOrderData.salesOrderNo == -1 || this.salesOrderData.salesOrderNo == undefined) {
          console.log("Do nothing");
        }
        else {
            this.displayMarkingDialog = true;
        }
    }

    displayDialogOfNc() {
        if (this.salesOrderData.salesOrderNo == -1 || this.salesOrderData.salesOrderNo == undefined) {
          console.log("Do nothing");
        }
        else {
            this.displayNcDialog = true;
        }
    }

    ncDetailsSchedulerHandler(data) {
      console.log("ncDetailsSchedulerHandler data",data);
        if (data == null || data == "" || data == undefined || data.length != 1) {
            console.log("Do nothing");
        } else {
            console.log("Do something");
            if (!this.displayNcDialog)
                this.displayNcDialog = true;
        }
    }

    selectSO() {
        this.salesOrderNo = this.selectedSalesOrderNo.salesOrderNo;
        this.showFindSO = false;
        console.log("Dashboard: selectSO()", this.salesOrderNo);
        this.getSalesOrderData();
    }

    toggleMenu() {
        this.displayMenu = !this.displayMenu;
    }

    showNC() {
        this.displayNCReport = true;
    }

    salesOrderNoChanged($event) {
        console.log("salesOrderNoChanged: ", $event);
        this.salesOrderNo = $event;
    }

    getSalesOrderData() {
        console.log("Dashboard: getSalesOrder()", this.salesOrderNo);
        WebSocketService.getInstance().sendMessage({
            'action': 'getSalesOrder',
            'message': {
                "salesOrderNo": this.salesOrderNo
            }
        });
    }

    customerDataBehaviorSubjectSubscribe(data) {
        this.customers = [];
        this.customers.push({label: 'Select Customer', value: null});
        for (let i in data) {
            this.customers.push({label: data[i].customerName, value: {customerId: data[i].customerId, customerName: data[i].customerName, deptId: data[i].deptId}});
        }
    }

    selectCustomerHandler() {
        console.log("selectCustomerHandler");
        this.getCustomerPopUp = false;
        this.displayTabs = true;
        if (this.customerAction == 'addNewRef') {
          WebSocketService.getInstance().appSearchClearBehaviorSubject.next(true);
          WebSocketService.getInstance().salesOrderDataBehaviorSubject.next('');
          WebSocketService.getInstance().customerIdBehaviorSubject.next(this.selectedCustomer);
          this.customerAction = '';
        } else {
          WebSocketService.getInstance().customerIdBehaviorSubject.next(this.selectedCustomer);
        }
    }

    clickOk() {
        this.getCustomerPopUp = false;
    }

    showCustomers() {
        console.log("selected value", this.selectedCustomer.customerName);
        if (this.selectedCustomer.customerName == "") {
            console.log("selected value***************************", this.selectedCustomer.customerName);
        }
        else {
            // this.disabledOkButton = false;
        }
    }

    displayGetCustomerDialog(event) {
      this.selectedCustomer = {customerId: "", customerName: "", deptId: ""};
      this.getCustomerPopUp = true;
      this.customerAction = event;
    }

    closeNCDialog() {
      console.log("*****@@@@@@@@@@@@@@@@@@");
      WebSocketService.getInstance().showNCBehaviorSubject.next(false);
    }

}
