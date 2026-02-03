import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showHeader = false;
  constructor( private router: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.showHeader = !!token;

    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  onLogout(event: Event) {
    event.preventDefault();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
