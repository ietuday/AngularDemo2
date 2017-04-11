import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {WebSocketService} from '../services/web-socket.service';
import {ProductContainerData} from '../data-models/product-container-data';
import {ProductDetails} from '../data-models/product-details';
import {ContTypeData} from '../data-models/contType-data';
import {VgmInfo} from '../data-models/vgm-info';
import {SalesOrderData} from '../data-models/sales-order-data';
import {SelectItem} from 'primeng/primeng';

declare var $: any;

@Component({
    selector: 'product-container',
    templateUrl: './product-container.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./product-container.component.scss']
})
export class ProductContainerComponent implements OnInit {

    private wtUom: SelectItem[];
    private dropdownArray: SelectItem[];
    private dropdownArraySend: SelectItem[];
    private salesOrderData: SalesOrderData = new SalesOrderData();
    private productDetails: ProductDetails = new ProductDetails();
    private displayDialog: boolean = false;
    private saveButton: boolean = false;
    private productContainerData: ProductContainerData = new ProductContainerData();
    private countryData: any[] = [];
    private customerId: number;
    private selectedIndex: number = -1;
    private containerRows: number = 0;
    private contTypeArray: SelectItem[];
    private containers: ProductContainerData[] = [];
    private disabled: boolean = true;
    private saveClicked: boolean = true;
    private displaySalesOrderSuccess: boolean = false;
    private displayEventBlock: boolean = false;
    private vgmInfo: VgmInfo = new VgmInfo();
    private contactDetails: any[] = [];;
    private contactArray: SelectItem[];
    private total20: number = 0;
    private total40: number = 0;
    private total40hicube: number = 0;
    private totalISO: number = 0;
    private totalOther: number = 0;
    private totalTEU: number = 0;
    private rowColor: string = 'bkack';
    private rowBackgroundColor: string = 'white';
    private deleteButton: boolean = false;
    private selectedCustomer: any = {customerId: "", customerName: "", deptId: ""};

    constructor() {
        WebSocketService.getInstance().contTypeBehaviorSubject.subscribe(data => this.contTypeBehaviorSubjectSubscribe(data));
        WebSocketService.getInstance().salesOrderDataBehaviorSubject.subscribe(data => this.showSalesOrderData(data));
        WebSocketService.getInstance().contactInfoDataBehaviorSubject.subscribe(data => this.getContactInfoData(data));
        WebSocketService.getInstance().countryDataBehaviorSubject.subscribe(data => this.countryDataHandler(data));
        WebSocketService.getInstance().customerIdBehaviorSubject.subscribe(data => this.selectedCustomerDataHandler(data));
        this.setDropDowns();
    }

    ngOnInit() {
    }

    showSalesOrderData(data) {
        console.log("ProductContainerComponent: showSalesOrderData", data);
        if (data == null || data == "" || data == undefined) {
            this.cancel(false);
        } else {
            this.salesOrderData = data;
            if (this.salesOrderData.salesOrderNo != undefined) {
                this.saveButton = true;
            } else {
                this.salesOrderData = new SalesOrderData();
            }
            if (this.salesOrderData.containers) {
                this.containerRows = this.salesOrderData.containers.length;
                this.containers = this.salesOrderData.containers.slice(0, 10);
            } else {
                this.containerRows = 0;
                this.containers = [];
            }
            if (this.salesOrderData.vgmInfo) {
                this.vgmInfo = this.salesOrderData.vgmInfo;
            } else {
                this.vgmInfo = new VgmInfo();
            }
            if (this.salesOrderData.productDetails) {
                this.productDetails = this.salesOrderData.productDetails;
            } else {
                this.productDetails = new ProductDetails();
            }
            if (this.containerRows > 0) {
                this.calculateTotals();
            }
        }
    }

    cancel(clearSearch) {
        this.salesOrderData = new SalesOrderData();
        this.containerRows = 0;
        this.vgmInfo = new VgmInfo();
        this.productDetails = new ProductDetails();
        this.productDetails.netWt = 0;
        this.productDetails.grossWt = 0;
        this.productDetails.m3 = 0;
        this.productDetails.totPackages = 0;
        this.containers = [];
        this.total20 = 0;
        this.total40 = 0;
        this.total40hicube = 0;
        this.totalISO = 0;
        this.totalOther = 0;
        this.totalTEU = 0;
        this.saveButton = false;
        if (clearSearch) {
            WebSocketService.getInstance().appSearchClearBehaviorSubject.next(true);
            WebSocketService.getInstance().salesOrderDataBehaviorSubject.next(this.salesOrderData);
        }
    }

    calculateTotals() {
        this.total20 = 0;
        this.total40 = 0;
        this.total40hicube = 0;
        this.totalISO = 0;
        this.totalOther = 0;
        this.totalTEU = 0;
        this.productDetails.netWt = 0;
        this.productDetails.grossWt = 0;
        this.productDetails.m3 = 0;
        this.productDetails.totPackages = 0;
        for (let i in this.salesOrderData.containers) {
            let contSize = this.getContSize(this.salesOrderData.containers[i].contType);
            if (contSize == 20) {
                ++this.total20;
            } else if (contSize == 40) {
                ++this.total40;
            } else if (contSize == 'HIGH CUBE') {
                ++this.total40hicube;
            } else if (contSize == 'ISO') {
                ++this.totalISO;
            } else {
                ++this.totalOther;
            }
            this.productDetails.netWt = 0 + this.productDetails.netWt + (isNaN(this.salesOrderData.containers[i].netWt) ? 0 : Number(this.salesOrderData.containers[i].netWt));
            this.productDetails.grossWt = 0 + this.productDetails.grossWt + (isNaN(this.salesOrderData.containers[i].grossWt) ? 0 : Number(this.salesOrderData.containers[i].grossWt));
            this.productDetails.m3 = 0 + this.productDetails.m3 + (isNaN(this.salesOrderData.containers[i].m3) ? 0 : Number(this.salesOrderData.containers[i].m3));
            this.productDetails.totPackages = 0 + this.productDetails.totPackages + (isNaN(this.salesOrderData.containers[i].noOfPackage) ? 0 : Number(this.salesOrderData.containers[i].noOfPackage));
            this.totalTEU = 0 + this.totalTEU + (isNaN(this.salesOrderData.containers[i].teu) ? 0 : Number(this.salesOrderData.containers[i].teu));
        }
    }

    getContSize(contType) {
        for (let i in this.contTypeArray) {
            if (this.contTypeArray[i].value.CONT_TYPE_ID == contType) {
                if (this.contTypeArray[i].label.indexOf('HIGH CUBE') > -1) {
                    return "HIGH CUBE";
                } else {
                    return this.contTypeArray[i].value.CONT_SIZE;
                }
            }
        }
    }

    paginate(event) {
        this.containers = this.salesOrderData.containers.slice(event.first, event.first + event.rows);
    }

    addContainer() {
        this.selectedIndex = -1;
        this.displayDialog = true;
        this.productContainerData = new ProductContainerData();
        if (this.salesOrderData.containers != undefined) {
            console.log("Inside If ##############No. of Containers", this.salesOrderData.containers.length);
            this.productContainerData.sn = 1;
            for (let i in this.salesOrderData.containers) {
                if (this.salesOrderData.containers[i].sn > this.productContainerData.sn) {
                    this.productContainerData.sn = this.salesOrderData.containers[i].sn;
                }
            }
            this.productContainerData.sn = this.productContainerData.sn + 1;
        } else {
            console.log("Inside Else of Add Container", this.productContainerData.sn);
            this.productContainerData.sn = 1;
        }
        this.productContainerData.exportN = this.salesOrderData.jobNo;
    }

    saveContainerDetails() {
        this.calculateTotals();
        console.log("After calculateTotals", this.selectedIndex);
        if (this.selectedIndex == -1) {
            if (this.salesOrderData.containers == undefined) {
                this.salesOrderData['containers'] = [];
            }
            this.salesOrderData.containers.push(this.productContainerData);
        } else {
            this.salesOrderData.containers[this.selectedIndex] = this.productContainerData;
        }
        console.log("After if else");
        this.selectedIndex = -1;
        //        this.rowColor = 'black';
        //        this.rowBackgroundColor = 'white';
        this.productContainerData = new ProductContainerData();
        console.log("Before Save call");
        this.save(true);
    }

    save(addFlag) {
        console.log("Inside Save");
        this.salesOrderData.vgmInfo = this.vgmInfo;
        this.salesOrderData.productDetails = this.productDetails;
        WebSocketService.getInstance().sendMessage({
            'action': 'saveSalesOrder',
            'message': this.salesOrderData
        });
        if (addFlag) {
            this.saveClicked = false;
            setTimeout(() => {
                this.displayDialog = false;
                this.saveClicked = true;
            }, 2000);
        } else {
            this.displaySalesOrderSuccess = true;
        }
    }

    deleteContainer() {
        if (this.selectedIndex != -1) {
            this.deleteButton = true;
            console.log(this.containers.splice(this.selectedIndex, 1));
            this.salesOrderData.containers = this.containers;
            this.save(false);
            if (this.selectedIndex == 0) {
              this.selectedIndex = -1;
            }
        }
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

        WebSocketService.getInstance().salesOrderDataBehaviorSubject.next(this.salesOrderData);
    }


    setDropDowns() {
        this.dropdownArray = [];
        this.dropdownArray.push({label: 'Yes', value: 'Yes'});
        this.dropdownArray.push({label: 'No', value: 'No'});

        this.dropdownArraySend = [];
        this.dropdownArraySend.push({label: 'Original', value: 'Original'});
        this.dropdownArraySend.push({label: 'Amendment', value: 'Amendment'});

        this.wtUom = [];
        this.wtUom.push({label: 'KGS', value: {id: 1, name: 'KGS', code: 'KGS'}});
        this.wtUom.push({label: 'MT', value: {id: 2, name: 'MT', code: 'MT'}});
        this.wtUom.push({label: 'LBS', value: {id: 3, name: 'LBS', code: 'LBS'}});
    }

    cancelContainerDetails() {
        console.log("Inside ProductContainerComponent : saveContainerDetails ");
        this.displayDialog = false;
    }

    getContactInfoData(data) {
        console.log("Inside ContainerComponent: getContactInfoData", data);
        this.contactDetails = data;
        this.contactArray = [];
        this.contactArray.push({label: 'Contact Id', value: 'Contact Id '});
        for (let i in data) {
            this.contactArray.push({label: data[i].contactId, value: data[i].contactId});
        }
    }

    getContactInfo() {
        console.log("Inside getContactInfo");
        for (let i in this.contactDetails) {
            if (this.contactDetails[i].customerId == this.customerId) {
                console.log("$$$$$$$$$Inside getContactInfo", this.customerId);
                this.vgmInfo.contactEmail = this.contactDetails[i].contactEmail;
                this.vgmInfo.contactName = this.contactDetails[i].contactName;
                this.vgmInfo.contactPhone = this.contactDetails[i].contactPhone;
                this.vgmInfo.contactId = this.contactDetails[i].contactId;
            }
        }

    }

    contTypeBehaviorSubjectSubscribe(data: any) {
        console.log("Inside ContainerComponent: contTypeBehaviorSubjectSubscribe", data);
        this.contTypeArray = [];
        //        this.contTypeArray.push({label: 'ContType Des', value: 'ContType Id '});
        for (let i in data) {
            this.contTypeArray.push({
                label: data[i].CONT_TYPE_DES,
                value:
                {
                    "CONT_TYPE_ID": data[i].CONT_TYPE_ID,
                    "CONT_SIZE": data[i].CONT_SIZE,
                    "CONT_TEU": data[i].CONT_TEU
                }
            });
        }
    }

    contChanged(e) {
        this.productContainerData.size = e.value.CONT_SIZE;
        this.productContainerData.teu = e.value.CONT_TEU;
        this.productContainerData.contType = e.value.CONT_TYPE_ID;
    }

    onRowSelect(index) {
        console.log("ProductContainer", index);
        this.selectedIndex = index;
        //        this.rowColor = 'white';
        //        this.rowBackgroundColor = '#5f5f5f';
        this.productContainerData = this.salesOrderData.containers[index];
        this.productContainerData.verifiedDt = this.getNewDate(this.salesOrderData.containers[index].verifiedDt + '');
        this.productContainerData.emptyReleaseDate = this.getNewDate(this.salesOrderData.containers[index].emptyReleaseDate + '');
        this.productContainerData.emptyPickup = this.getNewDate(this.salesOrderData.containers[index].emptyPickup + '');
        this.productContainerData.gateIn = this.getNewDate(this.salesOrderData.containers[index].gateIn + '');
        this.productContainerData.vesselLoad = this.getNewDate(this.salesOrderData.containers[index].vesselLoad + '');
        this.productContainerData.vesselDeparture = this.getNewDate(this.salesOrderData.containers[index].vesselDeparture + '');
        this.productContainerData.vesselArrival = this.getNewDate(this.salesOrderData.containers[index].vesselArrival + '');
        this.productContainerData.unloadedFromVessel = this.getNewDate(this.salesOrderData.containers[index].unloadedFromVessel + '');
        this.productContainerData.returned = this.getNewDate(this.salesOrderData.containers[index].returned + '');
        this.productContainerData.gatedOut = this.getNewDate(this.salesOrderData.containers[index].gatedOut + '');

        // this.productContainerData.verifiedDt = new Date(this.productContainerData.verifiedDt);
        // this.productContainerData.emptyReleaseDate = new Date(this.productContainerData.emptyReleaseDate);
        console.log(this.salesOrderData.containers[index]);
        console.log(this.productContainerData);
        //        this.displayDialog = true;
    }

    countryDataHandler(data) {
        this.countryData = [];
        this.countryData.push({label: 'Select Country', value: ''});
        for (let i in data) {
            this.countryData.push({label: data[i].COUNTRY_NAME, value: data[i].COUNTRY_ID});
        }
    }

    selectedCustomerDataHandler(data) {
        console.log('selectedCustomerDataHandler', data);
        this.customerId = data.customerId;
        console.log("selectedCustomerDataHandler :this.customerId ", this.customerId);
        this.getContactInfo();
    }

    formatDate(dt) {
        let d = new Date(dt);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
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

}
