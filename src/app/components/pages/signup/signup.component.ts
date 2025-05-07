
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports:[CommonModule,FormsModule,ReactiveFormsModule]
})
export class SignupComponent {
  signupForm!: FormGroup;

   signObj:any={

      //"id":"",
      "email":"",
      "password":"",
      "username":""
    };
  
    router=inject(Router)
    http=inject(HttpClient)
  

    onSignup() {
      const signupData = this.signupForm.value;

      this.http.post("http://172.16.100.66:5221/api/auth/signup", this.signObj).subscribe({
        next: (res: any) => {
          if (res.message) {
            this.alertService.showAlert("Signup successful! Please verify OTP.");
            this.router.navigateByUrl("otp");
            localStorage.setItem("userEmail", signupData.email);
            localStorage.setItem("authType", "signup"); // ✅ Store authentication type
          } else {
            this.alertService.showAlert("User already exists. Please log in.","error");
          }
          // if (res.message) {
          //   sessionStorage.setItem("userEmail", res.email); // Alternative: Save in sessionStorage
          //   alert("signup successfully");
          //   this.router.navigateByUrl("otp");
          //    // ✅ Show the exact response message
          // }
        
          //  //if (res.message === "Signup successfully") {
          //  //this.router.navigateByUrl("otp"); // ✅ Navigate if signup is successful
          // //}
        },
      });
    }


    
  constructor(private fb: FormBuilder,private alertService:AlertService) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', [Validators.required]]
    });
  }
}
