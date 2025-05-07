import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
  imports: [ReactiveFormsModule,CommonModule]
})
export class UpdatePasswordComponent {

  updatePasswordForm!: FormGroup;
  http = inject(HttpClient);
  router = inject(Router);

  constructor(private fb: FormBuilder,private alertService:AlertService) {
    const storedEmail = localStorage.getItem("resetEmail");

    if (!storedEmail) {
      this.alertService.showAlert("No email found! Please restart the password reset process.","error");
      this.router.navigateByUrl("forgot-password"); // Redirect if email is missing
      return;
    }

    this.updatePasswordForm = this.fb.group({
      email: [{ value: storedEmail, disabled: true }, [Validators.required, Validators.email]], // Readonly email
      otp: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
      
    }, { validators: this.passwordMatchValidator });
  }

  // ✅ Ensure passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  // ✅ Handle Password Update
  onUpdatePassword() {
    if (this.updatePasswordForm.invalid) {
      this.alertService.showAlert("Please fix the errors before submitting.","error");
      return;
    }

    

    const payload = {
      email: this.updatePasswordForm.get('email')?.value,
      otp: this.updatePasswordForm.value.otp,
      newPassword: this.updatePasswordForm.get('newPassword')?.value,
      confirmPassword: this.updatePasswordForm.value.confirmPassword
    };

    this.http.post("http://172.16.100.66:5221/api/auth/update-password", payload)
      .subscribe({
        next: () => {
          this.alertService.showAlert("Password updated successfully!");
          localStorage.removeItem("resetEmail"); // Clear email after reset
          this.router.navigateByUrl("login");
        },
        error: (err) => {
          console.error("Update Password Error:", err);
          this.alertService.showAlert(err.error?.message || "Failed to update password. Try again.","error");
        }
      });
  }
}