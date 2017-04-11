import { VgmInfo } from './vgm-info';
import { ProductDetails } from './product-details';
import { MarkingDetailsData } from './marking-details-data';
import { NcDetailsData } from '../data-models/nc-details-data';
import { DocsData } from '../data-models/docs-data';
import { ProductContainerData } from '../data-models/product-container-data';

export class SalesOrderData {
    salesOrderNo: number; // exportRefNo
    jobNo: number; // exportJobNo
    customerId: number;
    vessel: string;
    voyage: string;
    voyage2: string;
    mode: string;
    jobType: string;
    portLoad: string;
    portDischarge: string;
    carrierAgentId: string;

    etaPortLoad: string;
    eta: string;
    transitDays: number;

    vesselRef: string;
    preCarriage: string;
    agentId: string;
    placeOfReceipt: string;
    placeOfDelivery: string;
    carrierBL: string;
    oblTermId: string;
    route: string;
    refCurrency: string;
    carierRate: string;
    hbl: string;
    carrierBkgRefNo: string;
    schTypeInd: string;
    truckWaybillNo: string;
    actualCarrierId: string;
    warehouse: string;
    plantCode: string;
    nvoccAgent: string;
    nvoccAgentPrintInd: boolean;
    portOfDischargeAgentId: string;
    noOfContainer: string;
    containers: ProductContainerData[];
    ncs: any[];
    docs: any[];
    schFaxInd: string;
    vesselLocation: string;

    bl: string;
    blOption: string;
    blCopy: number;
    deptId: string;

    portCutOffDate: Date;
    etaPortnet: Date;
    etdPortLoad: Date;
    etd: Date;
    etaDest: Date;
    etaPlaceOfDel: Date;
    oblCollectDate: Date;
    origBookedVslETA: Date;
    firstBookedETAPOL: Date;
    firstBookedETD: Date;
    firstBookedETADest: Date;
    revisedRDD: Date;

    actualCarrierIdPrintInd: boolean;
    exportPermitNotRequired: boolean;
    noPermitAmendmentRequired: boolean;
    approverInd: boolean;
    approver: string;
    approveDate: Date;
    approvalRemarks: string;
    preferredVesselSailingSchedules: boolean;
    availabilityOfEquipment: boolean;
    shorterTransitTime: boolean;

    moveType: string;
    sendAs: string;
    container20: number;
    container40: number;
    container20HiCube: number;
    containerISO: number;
    containerRemarks: string;
    nor: boolean;
    referInd: boolean;
    refer: string;
    includeContainerNumber: string;

    // BL fields
    refNo: string;
    quickTrackNo: string;
    //    forPayableAt: string;
    packagesSTC: string;
    purchaseOrderNo: number;
    shipperRef: string;
    shipmentNo: number;
    deliveryNo: number;
    addRefNo: number;
    otherRefNo: number;
    consigneeRef: string;
    vehicleLoadNo: number;
    entity: string;
    lcNo: string;
    lcDesc: string;
    FCRNo: string;
    tranship: string;
    transhipInd: boolean;
    freightTermId: string;
    portDischargeTerms: string;
    placeOfDeliveryTerms: string;
    finalRemarks: string;
    countryOfUltimateDest: string;
    priceTermPort: string;
    incoTerms: string;
    paymentTerms: string;
    collectingBank: string;
    oceanFreightCost: number;
    invoiceNo: number;
    insuranceValue: number;
    invoiceDate: Date;
    premiumRate: number;
    ISFRef: string;
    lcConfirmed: string;
    CNBApprovalDate: Date;
    CNBLicenceNo: number;
    invoiceAmount: number;
    containerized: string;
    premiumAmount: number;
    ranking: string;
    blCost: number;
    remarksComments: string;
    specialInstruction: string;
    cancelRemarks: string;
    internalRemarks: string;
    loadingInstruction: string;
    bln: string;
    vgmInfo: VgmInfo;
    productDetails: ProductDetails;
    markings: MarkingDetailsData[];
    ncsdetail: NcDetailsData[];   //Need to figure out and remove from ts.
    docsDetails: DocsData;
}
