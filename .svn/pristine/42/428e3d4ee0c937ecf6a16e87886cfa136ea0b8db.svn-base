import {Component, OnInit, Output, Input, EventEmitter, ViewEncapsulation} from '@angular/core';
import {SelectItem, Message} from 'primeng/primeng';
import { Routes, RouterModule } from '@angular/router';
import { SchedulerServiiceService } from '../services/scheduler-serviice.service';
import {WebSocketService} from '../services/web-socket.service';


declare var $: any;
@Component({
  selector: 'scheduler-report',
  encapsulation: ViewEncapsulation.None,
  providers : [SchedulerServiiceService],
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})

export class SchedulerComponent implements OnInit {
  schedulerJobType: SelectItem[];
  client: SelectItem[];
  selectedJobType: string;
  SelectedFireDate: Date;
  selectedDate : string;
  SelectedInterval:string;
  SelectedStatus:string;
  selectedJobId :  string;
  ScheduleDate : string;
  selectedJobStatusId :  string;
  selectedStatusJobType :  string;
  scheduleClientName : string ="";
  ServiceschedulerData :any;
  private schedulerData : any[];
  private schedulerAdHocData : any[];
  private jobTypeStatus : any[];
  private schedulerPaginatorData : any[];
  private schedulerPaginatorDataFinals : any[];
  private schedulerPaginatorData1 : any[];
  private jobRows: number = 0;
  private intervalDisabled: boolean = false;
  private schedulerSubmitClick: boolean = false;
  private deleteClicked : boolean = false;
  private bookingConfirmationClicked : boolean = false;

  private myJSON : string;
  private jobStatus:string;
  private salesOrder : string = "SalesOrder";
  private bookingConfirmation = "BookingConfirmation";
  private stringJob :string;
  private dateString :string;
  private offset :number;
  private response :any;



  constructor(private SchedulerServiiceService: SchedulerServiiceService) {
    console.log("SchedulerComponent Constructor");
    this.selectedJobId ="";
    console.log("schedulerDeleteDisabled",this.deleteClicked);
    WebSocketService.getInstance().schedulerStatusBehaviorSubject.subscribe(data => this.schedulerStatusDataHandler(data));
    this.schedulerJobType = [];
    this.schedulerJobType.push({label:'Ad-Hoc Schedule', value:'oneTimejob'});
    this.schedulerJobType.push({label:'Repetitive Schedule', value:'repeatedjob'});
    this.client = [];
    this.client.push({label:'Select Client', value:null});
    this.client.push({label:'Exxon', value:'Exxon'});
    this.client.push({label:'Tasnee', value:'Tasnee'});
    this.schedulerRefresh();
    this.jobStatus = " ";
    // this.clients=[];
    // this.clients.push({label:'Select Customer', value:''});
    // this.clients.push({label:'EXXNMOBIL', value:'Exxon'});
    // this.clients.push({label:'TASNEE', value:'Tasnee'});
  }

  ngOnInit() {
    //  this.ServiceschedulerData = this.SchedulerServiiceService.getSchedulerMedium();
    // this.schedulerRefresh();


  }

  showSelectedJobType() {
    console.log("showSelectedJobType",this.selectedJobType);
    if(this.selectedJobType == 'repeatedjob'){
      this.bookingConfirmationClicked = true;
      this.intervalDisabled = true;
    }
    if(this.selectedJobType == 'oneTimejob'){
      this.intervalDisabled = false;
      this.bookingConfirmationClicked = false;

    }
  }

  schedulerSubmit() {
    this.offset = new Date().getTimezoneOffset();
    console.log(this.offset);
    var client = this.scheduleClientName;

    console.log("schedulerSubmitDisabled",this.schedulerSubmitClick);
    var date = new Date(this.SelectedFireDate);
    var status="Pending";
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();

    this.dateString = y+ '-' + (m <= 9 ? '0' + m : m)+  '-' + (d <= 9 ? '0' + d : d) ;
    console.log("dateString",  this.dateString);

    this.stringJob = this.selectedJobId.toString();
    console.log("stringJob",this.stringJob);
    this.schedulerData = [];
    this.schedulerAdHocData = [];
    if(this.selectedJobType == 'repeatedjob'){
      this.schedulerData.push({jobId :this.stringJob, date :this.dateString +" "+ this.SelectedInterval,status:status, offset : this.offset, externalInterfaceName : this.salesOrder, client: this.scheduleClientName });

    }
    if(this.selectedJobType == 'oneTimejob'){
      var h=date.getHours();
      var m=date.getMinutes();
      var s=date.getSeconds();
      var timeString=h+":"+m+":"+s
      console.log("timeString :"+timeString);
      this.schedulerData.push({jobId :this.stringJob, date :this.dateString+" "+timeString,status:status,  offset : this.offset, client: this.scheduleClientName });

    }
    console.log("this.schedulerData", this.schedulerData[0]);
    this.myJSON = JSON.stringify(this.schedulerData[0]);
    console.log("myJSON()",this.myJSON);
    this.loadSchedulerSubmit();
    console.log("response",this.response);

    this.schedulerSubmitClick = true;
    setTimeout(() => {
      this.schedulerSubmitClick = false;
    }, 2000);
  }

  schedulerRefresh() {
    console.log("inside schedulerRefresh",this.selectedJobType,this.selectedJobId,this.SelectedFireDate);

    WebSocketService.getInstance().sendMessage({
      'action': 'schedulerStatus',
    });

    if(this.selectedJobType == 'repeatedjob'){
      this.intervalDisabled = true;
    }
    if(this.selectedJobType == 'oneTimejob'){
      this.intervalDisabled = false;
    }

    this.selectedJobType = '';
    this.selectedJobId = '';
    this.SelectedInterval ='';
    this.scheduleClientName ='';
    this.SelectedFireDate = null;
  }


  loadSchedulerSubmit() {
    var jobType = this.selectedJobType;
    console.log("jobType",jobType);
    var job =encodeURIComponent(this.myJSON);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200) {
        this.responseText;
        console.log("resp : ",this.responseText);
      }
    };

    xhttp.open("GET", "http://192.168.10.134:8080/EliteJava/webresources/scheduleJob/"+jobType+"/"+this.myJSON, true);

    xhttp.send();
  }

  loadSchedulerDelete() {
    var jobType = this.selectedJobType;
    var job =encodeURIComponent(this.myJSON);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        this.responseText;
        console.log("responseText : ",this.responseText);
      }
    };

    xhttp.open("GET", "http://192.168.10.134:8080/EliteJava/webresources/scheduleJob/delete/"+this.selectedJobId.toString(), true);

    xhttp.send();

  }

  schedulerDelete() {
    console.log("this.schedulerDeleteDisabled");
    this.loadSchedulerDelete();
    this.deleteClicked = true;
    setTimeout(() => {
      this.deleteClicked =  false;

    }, 2000);
  }

  schedulerStatusDataHandler(data) {
    this.jobRows = data.length;
    console.log("jobRows",this.jobRows);
    this.schedulerPaginatorData = [];
    this.schedulerPaginatorDataFinals = [];
    for (let i in data) {
      this.schedulerPaginatorData.push({jId: data[i].jobId, jType: data[i].jobType, jStatus : data[i].status, jobDate : data[i].date});
    }
    this.schedulerPaginatorDataFinals = this.schedulerPaginatorData.reverse();
    this.schedulerPaginatorData1 = this.schedulerPaginatorDataFinals.slice(0,5);
    console.log("In schedulerStatusDataHandler(data)",this.schedulerPaginatorData1);

  }

  paginate(event) {
    this.schedulerPaginatorData1 = this.schedulerPaginatorDataFinals.slice(event.first, parseInt(event.first) + parseInt(event.rows));
  }

  schedulerBookingConfirmation() {
    console.log("schedulerBookingConfirmation");
    var date = new Date(this.SelectedFireDate);
    var status="Pending";
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();

    this.dateString = y+ '-' + (m <= 9 ? '0' + m : m)+  '-' + (d <= 9 ? '0' + d : d) ;
    console.log("dateString",  this.dateString);
    this.offset = new Date().getTimezoneOffset();
    this.schedulerData = [];
    this.schedulerData.push({jobId :this.selectedJobId, date : this.dateString +" "+ this.SelectedInterval,status : status, offset : this.offset, externalInterfaceName : this.bookingConfirmation, client:this.scheduleClientName });
    this.myJSON = JSON.stringify(this.schedulerData[0]);
    console.log("myJSON()",this.myJSON);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        this.responseText;
        console.log("responseText : ",this.responseText);
      }
    };
    //
    xhttp.open("GET", "http://192.168.10.134:8080/EliteJava/webresources/scheduleJob/"+this.selectedJobType+"/"+this.myJSON, true);

    xhttp.send();

  }

}
