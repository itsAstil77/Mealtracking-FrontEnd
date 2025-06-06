
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports:[ReactiveFormsModule,FormsModule,CommonModule]
})
export class LoginComponent {

  loginForm: FormGroup;
  loginObj:any={

        "email":"",
        "password":""
      };
  forgotPasswordForm: FormGroup;
  showForgotPassword: boolean = false;
  isSendingOTP: boolean = false;

  http = inject(HttpClient);
  router = inject(Router);

  constructor(private fb: FormBuilder,private alertService:AlertService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // ✅ Handle Login
  onLogin() {
    this.http.post("http://172.16.100.66:5221/api/auth/login", this.loginForm.value)
      .subscribe({
        next: (res: any) => {
          if (res.message) {
            localStorage.setItem("userEmail", this.loginForm.value.email);
            localStorage.setItem("authType", "login");
            this.alertService.showAlert("Login successful!");

            this.router.navigateByUrl("otp");
           
          } else {
            this.alertService.showAlert("Invalid login credentials!","error");
          }
        },
        error: (err) => {
          this.alertService.showAlert("Login failed! Check your email & password.","error");
          console.error(err);
        }
      });
  }

  
  navigateToForgotPassword() {
    this.router.navigateByUrl("forgot-password");
  }

  //  Reset OTP
  onSendResetOTP() {
    if (this.forgotPasswordForm.invalid) {
      this.alertService.showAlert("Please enter a valid email.");
      return;
    }

    this.isSendingOTP = true;

    this.http.post("http://172.16.100.66:5221/api/auth/forgot-password", this.forgotPasswordForm.value)
      .subscribe({
        next: (res: any) => {
          this.alertService.showAlert("OTP sent! Please check your email.");
          localStorage.setItem("resetEmail", this.forgotPasswordForm.value.email);
          this.router.navigateByUrl("reset-password");
          this.isSendingOTP = false;
        },
        error: (err) => {
          this.alertService.showAlert("Failed to send OTP. Try again.","error");
          console.error(err);
          this.isSendingOTP = false;
        }
      });
  }
}
