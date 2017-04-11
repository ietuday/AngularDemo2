import {Component, ViewEncapsulation} from '@angular/core';
import {WebSocketService} from './services/web-socket.service';
import {AuthService} from './services/auth.service';
import {SelectItem} from 'primeng/primeng';
// import {Router} from '@angular/router';
import {Router, NavigationEnd} from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-root',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [WebSocketService]
})
export class AppComponent {
    title = 'app works!';
    displayUnderConstruction: boolean = false;
    private userName: any;
    private headerLogin: boolean = true;
    private menuClassLeft = 'slideoutHideLeft';
    private menuClassRight = 'slideoutHideRight';
    private pageNames: SelectItem[];
    private routerUrl: string = "/";
    private pageName: string = "";
    private displaySearchDialog: boolean = false;

    private menuClass = 'ulInactiveBlock';
    private subMenuRefClass = 'subListInactiveBlock'
    private subMenuBLClass = 'subListInactiveBlock'
    private subMenuChartClass = 'subListInactiveBlock'
    private sideMenuBarHeight;

    private queryTypes: {
        'queryType': string,
        'queryTypeDesc': string
    }[] = [];
    private selectedQueryTypeIndex: number = 0;
    private queryTypeDesc: string = "Ref No";     // Currentlt works with salesOrderNo, bl, customer. These fields are not in SalesOrder: invoiceNo, shipperRef. consigneeRef, purchaseOrderNo
    private queryType: string = "salesOrderNo";     // Currentlt works with salesOrderNo, bl, customer. These fields are not in SalesOrder: invoiceNo, shipperRef. consigneeRef, purchaseOrderNo
    private queryValue: string = "";    // 1079
    private displaySearchError: boolean = false;
    private displaySearchErrorInit: boolean = true;
    private count: number = -1;
    private showSearchBar: boolean;

    constructor(private authService: AuthService, private router: Router) {
      // var count = 1;
      console.log("Inside AppComponent: constructor");
        sessionStorage.clear();
        this.setQueryTypes();
        authService.auth();
        WebSocketService.getInstance().uuidBehaviorSubject.subscribe(uuid => {
            WebSocketService.getInstance().connect(uuid);
            this.userName = 'User name';
            this.router.navigate(['/login']);
        });

        this.getMasterData();

        router.events.subscribe(x => {
            if (x instanceof NavigationEnd) {
                console.log(x.url);
                console.log(x.urlAfterRedirects, this.count, sessionStorage.getItem("userName"));
                console.log("############", sessionStorage.getItem("userName"));
                if (x.urlAfterRedirects == "/" || x.urlAfterRedirects == "/login") {
                    this.headerLogin = true;
                    console.log("@@@@@@@@@@", sessionStorage.getItem("userName"));
                    if (sessionStorage.getItem("userName") != null) {
                      window.history.go(-1);
                    }
                } else {
                  this.headerLogin = false;
                  this.showSearchBar = true;
                }
                if (x.urlAfterRedirects == "/scheduler") {
                  this.showSearchBar = false;
                }
            }
        });
        WebSocketService.getInstance().loginBehaviorSubject.subscribe(data => this.loginBehaviorSubjectSubscribe(data));
        WebSocketService.getInstance().salesOrderDataBehaviorSubject.subscribe(data => this.showSalesOrderData(data));
        WebSocketService.getInstance().appSearchClearBehaviorSubject.subscribe(data => {
            if (data) {
                this.queryValue = "";
            }
        });
        // WebSocketService.getInstance().loginBehaviorSubject.subscribe(data => this.loginBehaviorSubjectSubscribe(data));

        // WebSocketService.getInstance().sideMenuBarHeightBehaviorSubject.subscribe(data => this.sideMenuBarHeightBehaviorSubjectSubscribe(data));
    }

    showSalesOrderData(data) {
        console.log("AppComponent: showSalesOrderData: data", data);
        if (data == undefined && !this.displaySearchErrorInit) {
            this.displaySearchError = true;
        }
        if (this.displaySearchErrorInit) {
            this.displaySearchErrorInit = false;
        }
    }

    loginBehaviorSubjectSubscribe(data) {
        console.log("*************************AppComponent: loginBehaviorSubjectSubscribe: ", data);
        this.queryValue = "";
        if (data === '') {
            console.log("Ignore");
            this.count = 1;
        } else if (data === 'ERROR') {
            alert("Login failed.");
        } else {
            this.headerLogin = false;
            console.log($(document).height());
            this.count = this.count + 1;
            // this.sideMenuBarHeight = 672;
            //            setInterval(() => {
            //                this.sideMenuBarHeight = $(document).height();
            //            }, 500);
        }
    }

    // sideMenuBarHeightBehaviorSubjectSubscribe(data) {
    //     this.sideMenuBarHeight = data;
    // }

    getMasterData() {
        WebSocketService.getInstance().sendMessage({
            'action': 'getCustomers'
        });
        WebSocketService.getInstance().sendMessage({
            'action': 'getCurrencies'
        });
        WebSocketService.getInstance().sendMessage({
            'action': 'getNCParties'
        });
        WebSocketService.getInstance().sendMessage({
            'action': 'getJobTypes'
        });
        WebSocketService.getInstance().sendMessage({
            'action': 'getVendors'
        });
        WebSocketService.getInstance().sendMessage({
            'action': 'getContainerTypes'
        });
        WebSocketService.getInstance().sendMessage({
            'action': 'getPorts'
        });
        WebSocketService.getInstance().sendMessage({
            'action': 'getGencodes'
        });
        WebSocketService.getInstance().sendMessage({
            'action': 'getCountries'
        });
        WebSocketService.getInstance().sendMessage({
            'action': 'getPayments'
        });
        WebSocketService.getInstance().sendMessage({
            'action': 'getContactInfo'
        });
        WebSocketService.getInstance().sendMessage({
            'action': 'getProducts'
        });
    }

    setQueryTypes() {
        this.queryTypes.push({'queryType': 'salesOrderNo', 'queryTypeDesc': 'Ref No'});
        this.queryTypes.push({'queryType': 'jobNo', 'queryTypeDesc': 'Job No'});
        this.queryTypes.push({'queryType': 'bl', 'queryTypeDesc': 'BL'});
        this.queryTypes.push({'queryType': 'Customer', 'queryTypeDesc': 'Customer'});
        this.queryTypes.push({'queryType': 'invoiceNo', 'queryTypeDesc': 'Invoice No'});
        this.queryTypes.push({'queryType': 'shipperRef', 'queryTypeDesc': 'Shipper Ref.'});
        this.queryTypes.push({'queryType': 'consigneeRef', 'queryTypeDesc': 'Consignee Ref.'});
        this.queryTypes.push({'queryType': 'purchaseOrderNo', 'queryTypeDesc': 'PO No'});
        this.queryTypes.push({'queryType': 'optimumSearch', 'queryTypeDesc': 'Optimum Search'});
    }

    logout() {
        console.log("Inside logout");
        // WebSocketService.getInstance().loginBehaviorSubject.next('');
        // WebSocketService.getInstance().customerIdBehaviorSubject.next({customerId: "", customerName: "", deptId: ""});
        // sessionStorage.setItem("userName", '');
        // sessionStorage.clear();
        // WebSocketService.getInstance().resetBehaviorSubject();
        // this.headerLogin = true;
        // this.router.navigate(['/login']);

        window.location.reload(true);
    }

    toggleMenu() {
        this.displayUnderConstruction = !this.displayUnderConstruction;
    }

    toggleSideMenu() {
        console.log('clicked on toggle side');
        this.menuClassLeft = this.menuClassLeft == 'slideoutHideLeft' ? 'slideoutShowLeft' : 'slideoutHideLeft';
    }

    displayExportMenu() {
        this.menuClass = this.menuClass == 'ulInactiveBlock' ? 'ulActiveBlock' : 'ulInactiveBlock';
    }

    selectRefMenu() {
        this.subMenuRefClass = this.subMenuRefClass == 'subListInactiveBlock' ? 'subListActiveBlock' : 'subListInactiveBlock';
        this.subMenuBLClass = 'subListInactiveBlock';
        this.subMenuChartClass = 'subListInactiveBlock';
        //        setTimeout(() => {
        this.toggleSideMenu();
        if (this.routerUrl.indexOf("dashboard") == -1)
            this.router.navigate(['/dashboard']);
        WebSocketService.getInstance().showExportRefBehaviorSubject.next(true);
        //        },100);
    }

    selectBLMenu() {
        this.subMenuBLClass = this.subMenuBLClass == 'subListInactiveBlock' ? 'subListActiveBlock' : 'subListInactiveBlock';
        this.subMenuRefClass = 'subListInactiveBlock';
        this.subMenuChartClass = 'subListInactiveBlock';
        //        setTimeout(() => {
        this.toggleSideMenu();
        if (this.routerUrl.indexOf("dashboard") == -1)
            this.router.navigate(['/dashboard'])
        WebSocketService.getInstance().showExportRefBehaviorSubject.next(false);
        //        },100);
    }

    selectOPSChartMenu() {
        this.subMenuChartClass = this.subMenuChartClass == 'subListInactiveBlock' ? 'subListActiveBlock' : 'subListInactiveBlock';
        this.subMenuRefClass = 'subListInactiveBlock';
        this.subMenuBLClass = 'subListInactiveBlock';
        this.toggleSideMenu();
    }

    displaySchedulerMenu() {
        console.log("in displaySchedulerMenu");
        this.toggleSideMenu();
        this.router.navigate(['/scheduler']);
    }

    getSalesOrderData() {
        console.log("AppComponent: getSalesOrder()", this.queryType, this.queryValue);
        let query: any = {};
        if (this.queryType == 'salesOrderNo' || this.queryType == 'jobNo') {
            query[this.queryType] = isNaN(Number(this.queryValue)) ? this.queryValue : parseInt(this.queryValue);
        } else {
            query[this.queryType] = this.queryValue;
        }
        WebSocketService.getInstance().sendMessage({
            'action': 'getSalesOrder',
            'message': query
        });
    }
}
