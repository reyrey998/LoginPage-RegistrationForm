import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Captcha, CaptchaService } from '../captcha.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  captcha: Captcha | null = null;

  constructor(
    private fb: FormBuilder,
    private captchaService: CaptchaService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      captchaInput: ['', Validators.required],
      rememberMe: [false],
      verificationNo: ['']
    }, { validators: this.passwordsMatchValidator() }); 
  }

  ngOnInit(): void {
    this.loadCaptcha();
  }

  passwordsMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
  
      if ( password !== confirmPassword) {
        return { passwordsDoNotMatch: true };
      }
      return null;
    };
  }
  

  onLogin() {
    this.loginForm.markAllAsTouched(); // Ensure all fields are marked as touched
    if (this.loginForm.invalid) {
      alert('Please fix the errors in the form.');
      return;
    }
  
    if (this.loginForm.hasError('passwordsDoNotMatch')) {
      alert('Passwords do not match!');
      return;
    }
  
    if (!this.captcha) {
      alert('CAPTCHA is not loaded.');
      return;
    }
  
    const { username, password, captchaInput, rememberMe, verificationNo } = this.loginForm.value;
  
    const captchaPayload: Captcha = {
      captcha: this.captcha.captcha,
      sitekey: this.captcha.sitekey,
      input: captchaInput
    };
  
    this.captchaService.login(username, password, captchaPayload, rememberMe, verificationNo).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/registration-form']).then(success => {
          if (success) {
            console.log('Navigation to registration-form successful');
          } else {
            console.error('Navigation to registration-form failed');
          }
        });
      },
      error: (error) => {
        console.error('Login failed', error);
        alert('Login failed! Please check your credentials and CAPTCHA.');
      }
    });
  }
  

  loadCaptcha() {
    this.captchaService.getCaptcha().subscribe({
      next: (response) => {
        if (response && response.captcha && response.sitekey) {
          this.captcha = response;
          this.loginForm.get('captchaInput')?.setValue('');
        } else {
          console.error('CAPTCHA data is missing in the response');
        }
      },
      error: (error) => {
        console.error('Failed to load CAPTCHA image', error);
      }
    });
  }

  refreshCaptcha() {
    this.loadCaptcha();
  }
}
