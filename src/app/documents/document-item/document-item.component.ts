import { Component, Input } from '@angular/core';

import { Document } from '../document.model';

@Component({
  selector: 'app-document-item',
  standalone: false,
  
  templateUrl: './document-item.component.html',
  styleUrl: './document-item.component.css'
})
export class DocumentItemComponent {
  @Input() document: Document;
  @Input() index: number;

}
