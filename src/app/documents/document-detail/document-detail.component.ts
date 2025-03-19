import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../documents.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WindRefService } from '../../wind-ref.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css',
  standalone: false
})
export class DocumentDetailComponent implements OnInit, OnDestroy {
  document: Document;
  id: string;
  nativeWindow: any;
  subscription: Subscription;

  constructor(private documentService: DocumentService,
              private route: ActivatedRoute,
              private router: Router,
              private window: WindRefService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        
        // Subscribe to the document service to get the documents
        this.subscription = this.documentService.getDocuments().subscribe(
          (documents: Document[]) => {
            // Now we can find the document by id from the fetched documents
            this.document = this.documentService.getDocument(this.id);
            
            // If document is still null, redirect to documents page
            if (!this.document) {
              this.router.navigate(['/documents']);
              return;
            }
            
            this.nativeWindow = this.window.getNativeWindow();
          }
        );
      }
    );
  }

  onView() {
    if (this.document && this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    if (this.document) {
      this.documentService.deleteDocument(this.document);
      this.router.navigate(['/documents']);
    }
  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
