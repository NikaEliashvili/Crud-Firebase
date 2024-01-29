import { Component } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  standalone: true,
  imports: [MatIconModule],
})
export class ErrorComponent {
  constructor(public matIconModule: MatIconModule) {}
}
