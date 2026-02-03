import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../app.constants';

@Component({
  selector: 'app-create_qrcode',
  templateUrl: './create_qrcode.component.html',
  styles: ``
})

export class CreateQrcodeComponent {
  valorFixo: string = '';
  parcelas: string = '';
  error: string = '';
  loading: boolean = false;
  qrcodeString: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onValorFixoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove tudo que não for dígito
    let digits = input.value.replace(/\D/g, '');

    // Garante pelo menos 1 dígito
    if (digits.length === 0) {
      digits = '0';
    }

    // Converte para número e divide por 100 para obter centavos
    const numberValue = parseFloat(digits) / 100;

    // Formata para o padrão brasileiro com 2 casas decimais
    const formatted = numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    input.value = formatted.replace(".", "").replace(",",".");
  }

  onCreateQrcode() {
    if (this.valorFixo.toString().replace(".", "").replace(",", "") == '') {
      this.valorFixo = '0';
    }
    if (this.parcelas == '') {
      this.parcelas = '0';
    }


    this.loading = true; // Ativa o loading
    const token = localStorage.getItem('token');
    const merchantId = localStorage.getItem('merchantId');
    this.qrcodeString = '';
    this.error = '';

    const payload = {
      reference_id: "",
      merchant_id: merchantId,
      terminal_id: "",
      payment: {
        amount: this.valorFixo.toString().replace(".", "").replace(",", ""), //deve ser string no formato "100"
        installments: this.parcelas.toString(), //deve ser string no formato "100"
      }
    };

    // Criando os headers
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.post<any>(`${AppConstants.UrlBase}/qrcode`, payload, { headers })
      .subscribe({
        next: (response) => {
          if (response && response.response_code == "00") {

            var response_code = response.response_code;
            var response_message = response.response_message;
            var reference_id = response.reference_id;
            var merchant_id = response.merchant_id;
            var terminal_id = response.terminal_id;
            var transaction_id = response.transaction_id;
            var amount = response.amount;
            var installments = response.installments;
            var additionalInformation = response.additionalInformation;
            var date = response.date;
            var expires = response.expires;
            var qrcode = response.qrcode;
            var status = response.status;

            //Mostrar no front o qrcode
            this.loading = false; // Desativa o loading
            this.qrcodeString = qrcode;

          } else {
            this.loading = false; // Desativa o loading
            this.error = 'QrCode não criado.';
            if (response && response.response_message != "") {
              this.error = response.response_message;
            }
          }
        },
        error: () => {
          this.loading = false; // Desativa o loading
          this.error = 'Erro ao criar qrcode.';
        }
      });
  }
}
