import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../app.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``
})

export class LoginComponent {
  merchantId: string = '';
  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  onLogin() {
    this.loading = true; // Ativa o loading

    const payload = {
      integrator_key: AppConstants.ChaveIntegrador,
      merchant_id: this.merchantId,
      user: this.username,
      password: this.password
    };

    this.http.post<any>(`${AppConstants.UrlBase}/token/merchant/user`, payload)
      .subscribe({
        next: (response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('merchantId', this.merchantId);
            this.router.navigate(['/menu']);
          } else {
            this.loading = false; // Desativa o loading
            this.error = 'Token não recebido.';

            if (response && response.response_message != "") {
              this.error = response.response_message;
            }
          }
        },
        error: () => {
          this.loading = false; // Desativa o loading
          this.error = 'Usuário ou senha inválidos.';
        }
      });
  }
}
