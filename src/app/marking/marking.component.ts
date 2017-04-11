import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {Router} from '@angular/router';
import {WebSocketService} from '../services/web-socket.service';
import {CustomerData} from '../data-models/customer-data';
import {MarkingDetailsData} from '../data-models/marking-details-data';
import {SalesOrderData} from '../data-models/sales-order-data';

declare var $: any;

@Component({
    selector: 'marking',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './marking.component.html',
    styleUrls: ['./marking.component.scss'],
    providers: [WebSocketService]
})

export class MarkingComponent implements OnInit {

    private cities: SelectItem[];
    private disabled: boolean = true;
    private markingBottom: boolean = false;
    private dropdownArray: SelectItem[];
    private wtUomArray: SelectItem[];
    private dropdownArrayDescription: SelectItem[];
    private bottomRowDisplay: boolean = false;
    private markingDetailsData: MarkingDetailsData = new MarkingDetailsData();
    private salesOrderData: SalesOrderData = new SalesOrderData();
    private productData: any[];
    private markingCountry: SelectItem[];
    private currency: SelectItem[];
    private saveClicked: boolean = false;
    private deleteClicked: boolean = false;
    private addDisabled: boolean = false;
    private deleteDisabled: boolean = false;
    private nextDisabled: boolean = false;
    private previousDisabled: boolean = false;
    private currentIndex: number = -1;
    private totalMarkings: number = 0;
    // private markingProductSearch: any;
    // private markingDataArray: MarkingDetailsData[] = [];

    constructor(private router: Router) {

        this.markingDropDowns();

        setTimeout(() => {
            let elm1: any = $('.ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow ui-dialog-draggable');
            elm1[0]['style']['position'] = 'relative';
            // //  elm1[0]['style']['margin-top'] = '244px';
            // //  elm1[0]['style']['padding'] = '0';
            elm1[0]['style']['overflow'] = 'auto';
            //
            //  elm1[0]['style']['height'] = '469px';
            // //  elm1[0]['style']['bottom'] = '60px';
            console.log("in dcnawkvakasl", elm1[0]);
        }, 100);

        WebSocketService.getInstance().salesOrderDataBehaviorSubject.subscribe(data => this.showSalesOrderData(data));
        WebSocketService.getInstance().currencyDataBehaviorSubject.subscribe(data => this.showCurrencyData(data));
        WebSocketService.getInstance().countryDataBehaviorSubject.subscribe(data => this.showCountryData(data));
        WebSocketService.getInstance().productDataBehaviorSubject.subscribe(data => this.showProductData(data));
    }

    ngOnInit() {

    }

    markingDropDowns() {

        this.dropdownArray = [];
        this.dropdownArray.push({label: 'Yes', value: 'Yes'});
        this.dropdownArray.push({label: 'No', value: 'No'});

        this.dropdownArrayDescription = [];
        this.dropdownArrayDescription.push({label: 'Lubs Hi', value: 'Yes'});
        this.dropdownArrayDescription.push({label: 'Sum All Prod', value: 'No'});

        this.wtUomArray = [];
        this.wtUomArray.push({label: 'KGS', value: 'KGS'});
        this.wtUomArray.push({label: 'LBS', value: 'LBS'});
        this.wtUomArray.push({label: 'MT', value: 'MT'});
    }

    //    saveMarkingsDetails() {
    //        // this.markingDataArray.push(this.markingDetailsData);
    //        // console.log("MarkingComponent.ts: saveMarkingsDetails",this.markingDetailsData);
    //        this.salesOrderData.markings = this.markingDetailsData;
    //        // console.log("Markings: this.salesOrderData", this.salesOrderData);
    //        WebSocketService.getInstance().sendMessage({
    //            'action': 'saveMarkingsDetails',
    //            'message': {
    //                'salesOrderNo': this.salesOrderData.salesOrderNo,
    //                'markingData': this.salesOrderData
    //            }
    //        });
    //        // this.markingDetailsData = [];
    //    }

    //    saveMarkingsDetails() {
    //        this.salesOrderData.markings = this.markingDetailsData;
    //        this.saveClicked = true;
    //        WebSocketService.getInstance().sendMessage({
    //            'action': 'saveSalesOrder',
    //            'message': this.salesOrderData
    //        });
    //        setTimeout(() => {
    //            WebSocketService.getInstance().showMarkingBehaviorSubject.next(false);
    //            this.saveClicked = false;
    //        }, 2000);
    //    }

    showCountryData(data) {
        this.markingCountry = [];
        this.markingCountry.push({label: 'Select Country', value: 'Select Country'});
        for (let i in data) {
            this.markingCountry.push({label: data[i].COUNTRY_ID, value: data[i].COUNTRY_NAME, });
        }
        // console.log("this.markingCountry.",this.markingCountry);
    }

    showProductData(data) {
        console.log("MarkingComponent: showProductData", data);
        this.productData = [];
        this.productData.push({label: 'Select Product', value: null});
        for (let i in data) {
            this.productData.push({
                label: data[i].PRODUCT_ID,
                fullName: data[i].prod_full_name,
                value: {
                    PRODUCT_ID: data[i].PRODUCT_ID,
                    prod_full_name: data[i].prod_full_name,
                    customs_hs_code: data[i].customs_hs_code
                }
            });
        }
        console.log("this.productData.", this.productData);
    }

    productChangeHandler(e) {
        console.log(e);
        this.markingDetailsData.prodId = e.value.PRODUCT_ID;
        this.markingDetailsData.prodName = e.value.prod_full_name;
        // this.markingDetailsData.prodDescription = e.value.prod_full_name;
        if (e.value.customs_hs_code == 'NULL') {
            this.markingDetailsData.hsCode = null;
        } else {
            this.markingDetailsData.hsCode = e.value.customs_hs_code;
        }
    }

    showCurrencyData(data) {
        // console.log("In marking component showCurrencyData",data);
        this.currency = [];
        this.currency.push({label: 'Select Currency', value: 'Select Currency'});
        for (let i in data) {
            // this.currency.push({label: data[i].CURRENCY_NAME, value: data[i].CURRENCY_ID, });
            this.currency.push({label: data[i].CURRENCY_ID, value: data[i].CURRENCY_NAME, });

        }
        // console.log("this.currency.",this.currency);
    }

    showSalesOrderData(data) {
         console.log("MarkingComponent: showSalesOrderData data", data);
        if (data == null || data == "" || data == undefined) {
            this.salesOrderData = new SalesOrderData();
            this.markingDetailsData = new MarkingDetailsData();
            this.addDisabled = false;
            this.deleteDisabled = true;
            this.nextDisabled = true;
            this.previousDisabled = true;
            this.currentIndex = 0;
            this.totalMarkings = 1;
        } else {
            this.salesOrderData = data;
            if (this.salesOrderData.markings) {
                if (this.salesOrderData.markings.length > 0) {
                    this.totalMarkings = this.salesOrderData.markings.length;
                    this.currentIndex = this.totalMarkings - 1;
                    this.markingDetailsData = this.salesOrderData.markings[this.currentIndex];
                    this.addDisabled = false;
                    this.deleteDisabled = false;
                    this.nextDisabled = true;
                    if (this.currentIndex == 0) {
                        this.previousDisabled = true;
                    } else {
                        this.previousDisabled = false;
                    }
                } else {
                    this.currentIndex = 0;
                    this.totalMarkings = 1;
                    this.addDisabled = true;
                    this.deleteDisabled = true;
                    this.nextDisabled = true;
                    this.previousDisabled = true;
                }
            } else {
                this.currentIndex = 0;
                this.totalMarkings = 1;
                this.addDisabled = true;
                this.deleteDisabled = true;
                this.nextDisabled = true;
                this.previousDisabled = true;
            }
            console.log("add delete next prev", this.addDisabled, this.deleteDisabled, this.nextDisabled, this.previousDisabled);
            //            if (this.salesOrderData.markings) {
            //                this.markingDetailsData = this.salesOrderData.markings;
            //                // this.markingProductSearch = {
            //                //         PRODUCT_ID: this.markingDetailsData.prodId,
            //                //         prod_full_name: this.markingDetailsData.prodName,
            //                //         customs_hs_code: this.markingDetailsData.hsCode
            //                // };
            //                if (this.markingDetailsData.invoiceDate) {
            //                    if (this.markingDetailsData.invoiceDate != null) {
            //                        this.markingDetailsData.invoiceDate = new Date(this.markingDetailsData.invoiceDate);
            //                    }
            //                }
            //                this.calculateInsurance();
            //            } else {
            //                this.markingDetailsData = new MarkingDetailsData();
            //            }
        }
    }

    saveMarkingsDetails() {

        if (!this.deleteClicked) {
            if (this.salesOrderData.markings) {
                this.salesOrderData.markings[this.currentIndex] = this.markingDetailsData;
            } else {
                this.salesOrderData['markings'] = [];
                this.salesOrderData.markings.push(this.markingDetailsData);
            }
        }

        this.saveClicked = true;
        setTimeout(() => {
//            WebSocketService.getInstance().showMarkingBehaviorSubject.next(false);
            this.saveClicked = false;
            this.deleteClicked = false;
        }, 2000);

        WebSocketService.getInstance().sendMessage({
            'action': 'saveSalesOrder',
            'message': this.salesOrderData
        });

    }

    markingCancelClick() {
        this.markingDetailsData = new MarkingDetailsData();
        // this.markingProductSearch = '';
        // console.log("In NC Component:ncCancel",this.markingDetailsData);
    }

    addMarking() {
        this.markingDetailsData = new MarkingDetailsData();
        this.currentIndex = this.salesOrderData.markings.length;
        this.salesOrderData.markings.push(this.markingDetailsData);
        this.totalMarkings = this.salesOrderData.markings.length;
        this.addDisabled = true;
        this.deleteDisabled = true;
        this.nextDisabled = true;
        this.previousDisabled = true;
    }

    deleteMarking() {
        console.log("MarkingComponent: deleteMarking currentIndex", this.currentIndex);
        this.deleteClicked = true;
        this.addDisabled = true;
        this.deleteDisabled = true;
        this.nextDisabled = true;
        this.previousDisabled = true;
        this.salesOrderData.markings.splice(this.currentIndex, 1);
//        this.totalMarkings = this.salesOrderData.markings.length;
//        console.log("MarkingComponent: deleteMarking totalMarkings", this.totalMarkings);
//        this.currentIndex = this.currentIndex - 1;
//        this.markingDetailsData = this.salesOrderData.markings[this.currentIndex];
        this.saveMarkingsDetails();
    }

    next() {
        this.currentIndex = this.currentIndex + 1;
        this.markingDetailsData = this.salesOrderData.markings[this.currentIndex];
        this.addDisabled = false;
        this.deleteDisabled = false;
        if (this.currentIndex == this.salesOrderData.markings.length - 1) {
            this.nextDisabled = true;
        } else {
            this.nextDisabled = false;
        }
        this.previousDisabled = false;
    }

    previous() {
        this.currentIndex = this.currentIndex - 1;
        this.markingDetailsData = this.salesOrderData.markings[this.currentIndex];
        this.addDisabled = false;
        this.deleteDisabled = false;
        this.nextDisabled = false;
        if (this.currentIndex == 0) {
            this.previousDisabled = true;
        } else {
            this.previousDisabled = false;
        }
    }

    calculateInsurance() {
        let unitPrice = 0 + (isNaN(this.markingDetailsData.unitPrice) ? 0 : Number(this.markingDetailsData.unitPrice));
        let netWt = 0 + (isNaN(this.markingDetailsData.netWt) ? 0 : Number(this.markingDetailsData.netWt));
        let insurance = 0 + (isNaN(this.markingDetailsData.insurance) ? 0 : Number(this.markingDetailsData.insurance));
        console.log("calculateInsurance unitPrice netWt insurance", unitPrice, netWt, insurance);
        this.markingDetailsData.insuranceValue = unitPrice * netWt * insurance;
    }
}
