
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
  imports:[ReactiveFormsModule,CommonModule,FormsModule]
})
export class OtpComponent {
  otpForm: FormGroup;

  otpObj: any = {
     "email": "", 
     "otp": ""
    };

  http = inject(HttpClient);
  router = inject(Router);
  authType: string = '';
  isResending: boolean = false; 
  



  constructor(private fb: FormBuilder,private alertService:AlertService) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
    });

    this.loadUserData(); 
  }

 

loadUserData() {
  this.authType = localStorage.getItem('authType') || '';

  if (this.authType === "forgot-password") {
    this.otpObj.email = localStorage.getItem('resetEmail');  
  } else {
    this.otpObj.email = localStorage.getItem('userEmail');  
  }

  if (!this.otpObj.email) {
    this.alertService.showAlert("No email found! Please try logging in again.","error");
    this.router.navigateByUrl("login");
  }
}



// ✅ Verify OTP
onSubmit() {
  if (!this.otpObj.email) {
    //alert("User email is missing!");
    return;
  }

  const otpInputs = document.querySelectorAll('.otp-box') as NodeListOf<HTMLInputElement>;
  const otpValue = Array.from(otpInputs).map(input => input.value).join('');

  if (otpValue.length < 4) {  // Adjust length based on backend requirements
    this.alertService.showAlert("OTP must be at least 4 digits.", "error");
    return;
  }

  this.otpObj.otp = otpValue;  

  // First, verify OTP
  this.http.post("http://172.16.100.66:5221/api/auth/verify-otp", this.otpObj)
    .subscribe({
      next: (res: any) => {
        if (res.message === "Successful Login") {
          this.alertService.showAlert("OTP verified successfully!");
      
         

          // ✅ Now call the user access API after OTP is verified
          this.http.get(`http://172.16.100.66:5221/api/role-access/user-access/${this.otpObj.email}`)
            .subscribe({
              next: (response: any) => {
               
                console.log("User Access Response:", response); 
                localStorage.setItem("userId", response.id); 
   
                 
                

              
                if (response.allowedModules.dashboard) {
                  localStorage.setItem("userId", response.id);
                  if (this.authType === "signup") {
                    localStorage.setItem("authType", ""); // Clear authType
                    this.router.navigateByUrl("login"); // ✅ Signup → OTP → Login
                  } else if (this.authType === "login") {
                    localStorage.setItem("authType", ""); // Clear authType
                    this.router.navigateByUrl("dashboard"); // ✅ Login → OTP → Home
                  } else if (this.authType === "forgot-password") {  // ✅ Forgot Password
                    localStorage.setItem("authType", ""); 
                    this.router.navigateByUrl("update-password");  // ✅ Forgot Password → OTP → Update Password
                  } else {
                    this.alertService.showAlert("Unknown authentication type. Redirecting to login.", "error");
                    this.router.navigateByUrl("login");
                  }
                } else {
                  this.alertService.showAlert("You do not have access to the dashboard module.", "error");
                  this.router.navigateByUrl("login");
                }
              },
              error: (error) => {
                console.error("Error fetching user access", error);
                this.alertService.showAlert("Error fetching access details. Please try again.", "error");
              }
            });

        } else {
          this.alertService.showAlert("Invalid OTP! Please try again.", "error");
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error("OTP Verification Error:", error);
        this.alertService.showAlert("Invalid OTP or server error. Try again.", "error");
      }
    });
  }


  moveFocus(event: any, index: number) {
    const inputElements = document.querySelectorAll('.otp-box') as NodeListOf<HTMLInputElement>;
  
    if (event.target.value && index < inputElements.length - 1) {
      inputElements[index + 1].focus(); // Move to next input
    }
  }
  
  handleBackspace(event: any, index: number) {
    const inputElements = document.querySelectorAll('.otp-box') as NodeListOf<HTMLInputElement>;
  
    if (event.key === "Backspace" && !event.target.value && index > 0) {
      inputElements[index - 1].focus(); // Move to previous input on backspace
    }
  }
  
  

  onResendOTP() {
    if (!this.otpObj.email) {
      this.alertService.showAlert("User email is missing!","error");
      return;
    }

    this.isResending = true; // Disable button temporarily

    this.http.post("http://172.16.100.66:5221/api/auth/resend-otp", { email: this.otpObj.email })
      .subscribe({
        next: (res: any) => {
          this.alertService.showAlert("OTP resent successfully! Please check your email.");
          this.isResending = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error("Resend OTP Error:", error);
          this.alertService.showAlert("Failed to resend OTP. Please try again.","error");
          this.isResending = false;
        }
      });
  }
}
