import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import 'rxjs/add/operator/share';

// Define all your data classes below thi
import {CustomerData} from '../data-models/customer-data';
import {ProductContainerData} from '../data-models/product-container-data';
import {jobData} from '../data-models/job-data';
import {ContTypeData} from '../data-models/contType-data';
import {NcParty} from '../data-models/ncParty';
import {NcType} from '../data-models/ncType';
import {NcCurrency} from '../data-models/ncCurrency';
import {NcDetailsData} from '../data-models/nc-details-data';
import {PortData} from '../data-models/port-data';
import {WsMessage} from '../data-models/ws-message';

@Injectable()
export class WebSocketService {

    private static _instance: WebSocketService = new WebSocketService();
    private ws: WebSocket;
    private authenticated: boolean = true;
    private unauthorized: boolean = false;

    // define all your behavioural subjects below this
    private uuid: string = "";
    public uuidBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject(this.uuid);
    public loginBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject("");
    public customerIdBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject({customerId: "", customerName: "", deptId: ""});
    public salesOrderSaveBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject("");
    public saveTransNoDetailsBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject("");
    public saveNcDetailsBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject("");
    public ncDetailsArrayBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject("");
    public ncDetailsSchedulerBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
    public docsRepoBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject("");
    public salesOrderDataBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject("");
    public salesOrderNumbersBehaviorSubject: BehaviorSubject<number[]> = new BehaviorSubject([]);
    public ncpartyDataBehaviorSubject: BehaviorSubject<NcParty[]> = new BehaviorSubject([]);
    public nctypeDataBehaviorSubject: BehaviorSubject<NcType[]> = new BehaviorSubject([]);
    public currencyDataBehaviorSubject: BehaviorSubject<NcCurrency[]> = new BehaviorSubject([]);
    public jobTypeDataBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
    public vendorDataBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
    public customerDataBehaviorSubject: BehaviorSubject<CustomerData[]> = new BehaviorSubject([]);
    public productContainerDataBehaviorSubject: BehaviorSubject<ProductContainerData[]> = new BehaviorSubject([]);
    public jobDataBehaviorSubject: BehaviorSubject<jobData[]> = new BehaviorSubject([]);
    public contTypeBehaviorSubject: BehaviorSubject<ContTypeData[]> = new BehaviorSubject([]);
    public portDataBehaviorSubject: BehaviorSubject<PortData[]> = new BehaviorSubject([]);
    public gencodeDataBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
    public countryDataBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
    public productDataBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
    public deleteNCDetailsBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
    public paymentDataBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
    public showExportRefBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public sideMenuBarHeightBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject("150vh");
    public contactInfoDataBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject("");
    public appSearchClearBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public showMarkingBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public showNCBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public schedulerStatusBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject({});

    constructor() {
        if (WebSocketService._instance) {
            throw new Error("Error: Instantiation failed: Use WebSocketService.getInstance() instead of new.");
        }
        WebSocketService._instance = this;
    }

    public static getInstance(): WebSocketService {
        return WebSocketService._instance;
    }

    public resetBehaviorSubject() {
        this.loginBehaviorSubject.next("");
        this.customerIdBehaviorSubject.next({customerId: "", customerName: "", deptId: ""});
        this.salesOrderSaveBehaviorSubject.next("");
        this.saveNcDetailsBehaviorSubject.next("");
        this.ncDetailsArrayBehaviorSubject.next("");
        this.docsRepoBehaviorSubject.next("");
        this.salesOrderDataBehaviorSubject.next("");
        this.salesOrderNumbersBehaviorSubject.next([]);
        //        this.ncpartyDataBehaviorSubject.next([]);
        //        this.nctypeDataBehaviorSubject.next([]);
        //        this.currencyDataBehaviorSubject.next([]);
        //        this.jobTypeDataBehaviorSubject.next([]);
        //        this.vendorDataBehaviorSubject.next([]);
        //        this.customerDataBehaviorSubject.next([]);
        //        this.productContainerDataBehaviorSubject.next([]);
        //        this.jobDataBehaviorSubject.next([]);
        //        this.contTypeBehaviorSubject.next([]);
        //        this.portDataBehaviorSubject.next([]);
        //        this.gencodeDataBehaviorSubject.next([]);
        //        this.countryDataBehaviorSubject.next([]);
        //        this.paymentDataBehaviorSubject.next([]);
        this.showExportRefBehaviorSubject.next(true);
        // this.contactInfoDataBehaviorSubject.next("");
    }

    public connect(uuid) {
        this.uuid = uuid;
        if ("WebSocket" in window && uuid) {
            console.log("WebSocket is supported by your Browser!");

            // Let us open a web socket
            //  var url = ("https:" == document.location.protocol ? "wss://" : "ws://") + (document.location.hostname) + ("" == document.location.port ? "" : ":8080") + "/wsendpoint";
            //  var url = "ws://" + (document.location.hostname) + "/wsendpoint";
            var url = "ws://" + (document.location.hostname) + ":80/wsendpoint";
            console.log("ws url", url);
            this.ws = new WebSocket(url);
            this.ws.onopen = () => {
                console.log("Connection opened...", uuid);
                this.sendMessage({
                    action: "confirmAuth",
                    message: uuid
                });
            };
            this.ws.onmessage = (evt: any) => {
                try {
                    var decodedMessage = evt.data;
                    // console.log("Message received... decodedMessage", decodedMessage);
                    // var slicedMessage = decodedMessage.slice(1, decodedMessage.length - 1);
                    // console.log("slicedMessage", slicedMessage);
                    var encodedMesage = atob(decodedMessage);
                    // console.log("encodedMesage", encodedMesage);
                    var received_msg = JSON.parse(encodedMesage);
                    //                     console.log("************received_msg", received_msg);
                    if (received_msg.action === "confirmAuth") {
                        if (received_msg.status === 'Success') {
                            this.authenticated = true;
                        } else {
                            this.unauthorized = true;
                        }
                    } else if (received_msg.action === 'login') {
                        if (received_msg['status'] === 'Success') {
                            this.loginBehaviorSubject.next(received_msg['message']['userName']);
                        } else {
                            this.loginBehaviorSubject.next("ERROR");
                        }
                    } else if (received_msg.action === 'getSOnumbers') {
                        this.salesOrderNumbersBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action === 'saveSalesOrder') {
                        console.log("saveSalesOrder", received_msg);
                        this.salesOrderSaveBehaviorSubject.next(received_msg);
                    } else if (received_msg.action === 'saveSalesOrderNCs') {
                        console.log("saveSalesOrderNCs", received_msg);
                        this.salesOrderDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action === 'saveNcDetails') {
                        console.log("saveNcDetails", received_msg);
                        this.saveNcDetailsBehaviorSubject.next(received_msg);
                    } else if (received_msg.action === 'showNCDetailsScheduler') {
                        console.log("showNCDetailsScheduler", received_msg);
                        this.salesOrderDataBehaviorSubject.next(received_msg.message);
                        this.showNCBehaviorSubject.next(true);
                    } else if (received_msg.action === 'saveTransNo') {
                        console.log("saveTransNo", received_msg);
                        this.saveTransNoDetailsBehaviorSubject.next(received_msg);
                    } else if (received_msg.action === 'getNcDetails') {
                        console.log("getNcDetails", received_msg);
                        this.ncDetailsArrayBehaviorSubject.next(received_msg);
                    } else if (received_msg.action === 'getSalesOrder') {
                        console.log("getSalesOrder", received_msg);
                        this.salesOrderDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action === 'getDocsRepo') {
                        this.docsRepoBehaviorSubject.next(received_msg);
                    } else if (received_msg.action === 'getCustomers') {
                        this.customerDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action == "getNCParties") {
                        this.ncpartyDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action == "getCurrencies") {
                        this.currencyDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action == "getNCTypes") {
                        this.nctypeDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action === 'deleteLastNC') {
                        console.log("In WebScocket service.ts", received_msg.message);
                        this.deleteNCDetailsBehaviorSubject.next(received_msg.message);
                    } else if (received_msg["action"] == "findContainer") {
                        this.productContainerDataBehaviorSubject.next(received_msg["message"]);
                        console.log("In WebScocket service.ts Container Data", received_msg.message);
                    } else if (received_msg["action"] == "getContactInfo") {
                        this.contactInfoDataBehaviorSubject.next(received_msg["message"]);
                        console.log("In WebScocket service.ts Container Data", received_msg.message);
                    } else if (received_msg["action"] == "sendJobType") {
                        this.productContainerDataBehaviorSubject.next(received_msg["message"]);
                    } else if (received_msg["action"] == "getContainerTypes") {
                        this.contTypeBehaviorSubject.next(received_msg["message"]);
                    } else if (received_msg.action == "getVendors") {
                        this.vendorDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action == "getJobTypes") {
                        this.jobTypeDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action == "getPorts") {
                        this.portDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action == "getGencodes") {
                        this.gencodeDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action == "getCountries") {
                        this.countryDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action == "getPayments") {
                        this.paymentDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action == "getProducts") {
                        this.productDataBehaviorSubject.next(received_msg.message);
                    } else if (received_msg.action == "schedulerStatus") {
                        console.log("inside websocket : scheduler", received_msg.message);
                        this.schedulerStatusBehaviorSubject.next(received_msg.message);
                        console.log("inside websocket : scheduler", received_msg.message);
                    }
                } catch (e) {
                    console.log("Message received... Catch Error", atob(evt.data), "error", e);
                }
            };
            this.ws.onclose = function () {
                // websocket is closed.
                console.log("Connection is closed...");
            };
        } else {
            // The browser doesn't support WebSocket
            console.log("WebSocket NOT supported by your Browser!");
        }
    }

    public sendMessage(message: any) {
        // console.log("Inside sendMessage: message.action", message);
        // message.sessionId = this.uuid;
        // message.source = 'webApp';
        // this.ws.send(btoa(JSON.stringify(message)));
        // console.log("Inside sendMessage: Message ", message);

        if (this.unauthorized) {}
        let sendFlag = this.ws === undefined ? false : (this.ws.readyState === 1);
        if (message.action !== 'confirmAuth') {
            sendFlag = sendFlag && this.authenticated;
        }
        if (sendFlag) {
            message.sessionId = this.uuid;
            message.source = 'webApp';
            this.ws.send(btoa(JSON.stringify(message)));
            // console.log("Inside sendMessage: Message ", message);
        } else {
            setTimeout(() => this.sendMessage(message), 1000);
        }
    }

}
