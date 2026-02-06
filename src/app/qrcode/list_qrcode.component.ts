import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../app.constants';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-list_qrcode',
  templateUrl: './list_qrcode.component.html',
  styles: ``
})

export class ListQrcodeComponent {
  dataInicial: string = '';
  dataFinal: string = '';
  error: string = '';
  qrcodeString: string = '';

  constructor(private http: HttpClient, private router: Router, private loadingService: LoadingService) { }

  onListQrcode() {
    this.loadingService.show();// Ativa o loading

    const token = localStorage.getItem('token');
    const merchantId = localStorage.getItem('merchantId');
    this.error = '';

    const payload = {
      reference_id: "",
      merchant_id: merchantId,
      terminal_id: ""
    };

    // Criando os headers
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.post<any>(`${AppConstants.UrlBase}/qrcode/consulta`, payload, { headers })
      .subscribe({
        next: (response) => {
          if (response && response.response_code == "00") {

            this.loadingService.hide(); // Para desativar o loading
          } else {
            this.error = 'Erro ao consultar.';

            if (response && response.response_message != "") {
              this.error = response.response_message;

              this.loadingService.hide(); // Para desativar o loading
            }
          }
        },
        error: () => {
          this.error = 'Erro ao consultar.';
          this.loadingService.hide(); // Para desativar o loading
        }
      });
  }
}
