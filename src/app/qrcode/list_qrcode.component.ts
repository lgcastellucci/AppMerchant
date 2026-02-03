import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../app.constants';

@Component({
  selector: 'app-list_qrcode',
  templateUrl: './list_qrcode.component.html',
  styles: ``
})

export class ListQrcodeComponent {
  dataInicial: string = '';
  dataFinal: string = '';
  error: string = '';
  loading: boolean = false;
  qrcodeString: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onListQrcode() {

    this.loading = true; // Ativa o loading
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

            //Mostrar no front o qrcode
            this.loading = false; // Desativa o loading

          } else {
            this.loading = false; // Desativa o loading
            this.error = 'Erro ao consultar.';
            if (response && response.response_message != "") {
              this.error = response.response_message;
            }
          }
        },
        error: () => {
          this.loading = false; // Desativa o loading
          this.error = 'Erro ao consultar.';
        }
      });
  }
}
