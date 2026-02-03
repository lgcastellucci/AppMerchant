import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../app.constants';
import { LoadingService } from '../loading/loading.service';

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

  constructor(private http: HttpClient, private router: Router, private loadingService: LoadingService) { }

  onLogin() {
    this.loadingService.show();// Ativa o loading

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

            const terminalId = 'AppEstab' + Math.floor(Math.random() * 1000000).toString().padStart(8, '0');

            localStorage.setItem('token', response.token);
            localStorage.setItem('merchantId', this.merchantId);
            localStorage.setItem('terminalId', terminalId);

            this.loadingService.hide(); // Para desativar o loading
            this.router.navigate(['/menu']);
          } else {
            this.error = 'Token não recebido.';

            if (response && response.response_message != "") {
              this.error = response.response_message;

              this.loadingService.hide(); // Para desativar o loading
            }
          }
        },
        error: () => {
          this.error = 'Usuário ou senha inválidos.';

          this.loadingService.hide(); // Para desativar o loading
        }
      });
  }
}
