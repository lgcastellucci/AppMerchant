import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-create_qrcode',
  templateUrl: './create_qrcode.component.html',
  styles: ``
})

export class CreateQrcodeComponent {
  valorFixo: string = '';
  parcelas: string = '';
  error: string = '';
  qrcodeString: string = '';

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  onValorInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove tudo que não for dígito
    let digits = input.value.replace(/\D/g, '');

    // Garante pelo menos 1 dígito
    if (digits.length === 0) {
      digits = '0';
    }

    // Aceita somente 9.999,99
    if (digits.length > 6) {
      // Pega os 6 últimos
      digits = digits.slice(-6);
    }

    // Converte para número e divide por 100 para obter centavos
    const numberValue = parseFloat(digits) / 100;

    // Formata para o padrão brasileiro com 2 casas decimais
    const formatted = numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    input.value = formatted;
    this.valorFixo = formatted; // Atualiza o valor do model
  }

  onCreateQrcode() {
    this.loadingService.show();// Ativa o loading

    if (this.valorFixo.toString().replace(/\D/g, '') == '') {
      this.valorFixo = '0';
    }
    if (this.parcelas == '') {
      this.parcelas = '0';
    }

    const token = localStorage.getItem('token');
    const merchantId = localStorage.getItem('merchantId');
    const terminalId = localStorage.getItem('terminalId');
    this.qrcodeString = '';
    this.error = '';

    const payload = {
      reference_id: "",
      merchant_id: merchantId,
      terminal_id: terminalId,
      payment: {
        amount: this.valorFixo.toString().replace(/\D/g, ''), //deve ser string no formato "100"
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

            this.qrcodeString = qrcode;

            this.loadingService.hide(); // Para desativar o loading
          } else {
            this.error = 'QrCode não criado.';

            if (response && response.response_message != "") {
              this.error = response.response_message;

              this.loadingService.hide(); // Para desativar o loading
            }
          }
        },
        error: () => {
          this.error = 'Erro ao criar qrcode.';

          this.loadingService.hide(); // Para desativar o loading
        }
      });
  }
}
