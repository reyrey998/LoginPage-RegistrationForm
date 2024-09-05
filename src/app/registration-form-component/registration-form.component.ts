import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  registrationForm: FormGroup;
  registeredUsers: MatTableDataSource<User> = new MatTableDataSource<User>([]);

  displayedColumns: string[] = ['firstName', 'lastName', 'phoneNumber', 'email'];

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(09\d{9}|(\(\d{3}\) \d{8}))$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onRegister() {
    if (this.registrationForm.valid) {
      const newUser: User = this.registrationForm.value;
      this.registeredUsers.data = [...this.registeredUsers.data, newUser]; 

      this.registrationForm.reset({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
      });

      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control) {
          control.markAsPristine();
          control.markAsUntouched();
        }
      });
    } else {
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control) {
          control.markAsUntouched();
        }
      });
      alert('Please fill all fields correctly.');
    }
  }
}
