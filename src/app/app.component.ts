import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AppMerchant';
  showHeader = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.showHeader = !!token;

    if (token) {
      // Token existe, você pode executar alguma ação aqui
      this.router.navigate(['/menu']);
    } else {
      // Token não existe
      this.router.navigate(['/login']);
    }
  }

  onLogout(event: Event) {
    event.preventDefault();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
