import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports:[ReactiveFormsModule,FormsModule,CommonModule]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  http = inject(HttpClient);
  router = inject(Router);

  constructor(private fb: FormBuilder,private alertService:AlertService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // ✅ Handle Email Submission
  onContinue() {
    const email = this.forgotPasswordForm.value.email;
    this.http.post("http://172.16.100.66:5221/api/auth/forgot-password", { email })
      .subscribe({
        next: (res: any) => {
          this.alertService.showAlert("OTP sent to your email.");
          this.router.navigate(["/update-password"]);
          //this.router.navigate(["/otp"]); // ✅ Correct navigation
          localStorage.setItem('resetEmail',email); 
          localStorage.setItem("authType", "forgot-password"); // ✅ Set authType for OTP verification

        },
        // error: () => {
        //   alert("Email not found. Please enter a registered email.");
        // }
      });
  }
}
