import { Component, OnInit } from '@angular/core';

import { Document } from './document.model';
import { DocumentService } from './documents.service';

@Component({
  selector: 'app-documents',
  standalone: false,
  
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  selectedDocument: Document;

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this.documentService.documentSelectedEvent
      .subscribe(
        (document: Document) => {
          this.selectedDocument = document;
        }
      );
  }

}
