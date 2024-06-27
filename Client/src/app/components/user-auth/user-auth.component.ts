import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {
  authForm: FormGroup;
  isSignUp: boolean = false;
  passwordFieldType: string = 'password';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.isSignUp = url.some(segment => segment.path === 'signup');
    });
  }

  toggleAuthMode() {
    this.isSignUp = !this.isSignUp;
  }
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    if (this.authForm.valid) {
      const authData = this.authForm.value;
      if (this.isSignUp) {
        this.authService.signup(authData).subscribe({
          next: (res) => console.log('User signed up:', res),
          error: (err) => console.error('Signup failed', err)
        });
      } else {
        this.authService.login(authData).subscribe({
          next: (res) => {
            console.log('User logged in:', res);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => console.error('Login failed', err)
        });
      }
    }
  }
}
