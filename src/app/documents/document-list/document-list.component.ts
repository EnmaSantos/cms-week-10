import { Component, OnInit, OnDestroy } from '@angular/core';

import { Document } from '../document.model';
import { DocumentService } from '../documents.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-list',
  standalone: false,
  
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[];
  subscription: Subscription;

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this.documentService.getDocuments().subscribe((documents: Document[]) => {
      this.documents = documents;
    });
    // this.documentService.documentChangedEvent
    //   .subscribe(
    //     (documents: Document[]) => {
    //       this.documents = documents;
    //     }
    //   );

      this.subscription = this.documentService.documentListChangedEvent.subscribe(
        (documentsList: Document[]) => {
          this.documents = documentsList;
        }
      )
  }

  ngOnDestroy() {
   if (this.subscription) {
     this.subscription.unsubscribe();
   }
  }

}
