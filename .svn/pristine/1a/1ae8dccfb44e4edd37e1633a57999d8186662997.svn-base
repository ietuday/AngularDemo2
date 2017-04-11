import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { WebSocketService } from '../services/web-socket.service';
import { CustomerData } from '../data-models/customer-data';

declare var $: any;

@Component({
    selector: 'login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [WebSocketService]
})

export class LoginComponent implements OnInit {

    private customerName: string = '';
    private displayMenu: boolean = false;
    private windowWidth: number;
    private customers: SelectItem[];
    private region: SelectItem[];
    private userName: string = '';
    private password: string = '';
    private selectCustomerRegion: any = '';
    private selectCustomerObj: any = { customerId: "", customerName: "Customer Name", deptId: "" };
    private loginStatus: string = "";
    private display: boolean = false;
    private displaySignInBtn: boolean = true;
    private mainLoginBlock = 'mainBlockAfter';
    private expanded: number = 0;
    private userNameMarginLeft: number = 200;


    constructor(private router: Router) {
      // setTimeout(() => {
      //           let elm1: any = $('.ui-dropdown-items.ui-dropdown-list.ui-widget-content.ui-widget.ui-corner-all.ui-helper-reset');
      //               console.log('elm1 Dropdown classOverriding ',elm1[0]);
      //             elm1[0]['style']['top'] = '-96px !important';
      //             console.log('elm1 Dropdown classOverriding ',elm1[0]);
      //       },100);
        console.log("LoginComponent: constructor");
        this.windowWidth = window.innerWidth;
        //    window.addEventListener("resize", (e) => {
        //      this.windowWidth = window.innerWidth;
        //      if (this.windowWidth >= 768) {
        //        this.displayMenu = false
        //      }
        //    });
        this.region = [];
        this.region.push({ label: 'Select Region', value: null });
        this.region.push({ label: 'Saudi Arabia', value: 'Saudi Arabia' });
        this.region.push({ label: 'USA', value: 'USA' });
        this.region.push({ label: 'Singapore', value: 'Singapore' });
        WebSocketService.getInstance().customerDataBehaviorSubject.subscribe(data => this.customerDataBehaviorSubjectSubscribe(data));
        WebSocketService.getInstance().loginBehaviorSubject.subscribe(data => this.loginBehaviorSubjectSubscribe(data));
    }

    focusLogin() {
        $('input').blur(function() {
            var $this = $(this);
            if ($this.val())
                $this.addClass('used');
            else
                $this.removeClass('used');
        });
    }

    ngOnInit() {
        this.focusLogin();
        $(document).ready(function () {
            $('.btn').click(function () {
                $('.show-2').animate({ width: '608px' })
                $('.show-1').animate({ width: '820px'});
            });
        });
    }

    loginBehaviorSubjectSubscribe(data) {
        console.log("LoginComponent: loginBehaviorSubjectSubscribe: ", data);
        if (data === '') {
            console.log("Ignore");
        } else if (data === 'ERROR') {
            //      alert("Login failed.");
            this.loginStatus = "Login failed.";
        } else {
            // this.loginStatus = "Success.";
            // sessionStorage.setItem("userName", this.userName);
            //      sessionStorage.setItem("selectCustomer", this.selectCustomer);
            //      let custId = parseInt(this.selectCustomer);
            // WebSocketService.getInstance().customerIdBehaviorSubject.next(this.selectCustomer);
            // this.router.navigate(['/dashboard']);
        }
    }

    toggleMenu() {
        this.displayMenu = !this.displayMenu;
    }

    customerDataBehaviorSubjectSubscribe(data) {
       //    console.log("LoginComponent: customerDataBehaviorSubjectSubscribe: ", data);
       this.customers = [];
       this.customers.push({ label: 'Select Customer', value: null });
       for (let i in data) {
           this.customers.push({ label: data[i].customerName, value: { customerId: data[i].customerId, customerName: data[i].customerName, deptId: data[i].deptId } });
       }
   }

   login() {
       console.log("Sending login ws message", this.selectCustomerRegion);
       this.expanded = this.expanded + 1;
       if (this.expanded == 1) {
         this.userNameMarginLeft = 0;
       }
       if (this.expanded > 1) {
         if (this.userName =='Demo' && this.password == 'Demo' && this.selectCustomerRegion == 'Saudi Arabia') {
             sessionStorage.setItem("userName", this.userName);
             WebSocketService.getInstance().sendMessage({
                 'action': 'login',
                 'message': {
                     "userName": this.userName,
                     "password": this.password
                 }
             });
             this.router.navigate(['/dashboard']);
         }
         else if (this.userName != 'Demo' || this.password != 'Demo' ){
           this.loginStatus = "Login failed";
         }
         else if (this.selectCustomerRegion != 'Saudi Arabia' || this.selectCustomerRegion == 'Select Customer') {
             this.loginStatus = "Please select the valid region";
         }
       }

   }


    signUp() {
        console.log("Inside Signup");
        this.router.navigate(['/dashboard']);
    }

    customerChange(e) {
        console.log(e);
    }

    clickedSignIn() {
        this.displaySignInBtn = false;
        this.mainLoginBlock = this.mainLoginBlock == 'mainBlockBefore' ? 'mainBlockAfter' : 'mainBlockBefore';
    }
}
