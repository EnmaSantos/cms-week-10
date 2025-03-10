import { OnInit, Injectable, EventEmitter } from "@angular/core";
import { of, Observable, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';


import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { Document } from "./document.model";

@Injectable({
    providedIn: 'root'
  })
  export class DocumentService implements OnInit {
    private baseUrl = 'https://cms-firebase-project-default-rtdb.firebaseio.com/';
    documentListChangedEvent = new Subject<Document[]>();
    documentSelectedEvent = new EventEmitter<Document>();
    private documents: Document[] = []; // Initialize with an empty array
    private maxDocumentId: number;
  
    constructor(private http: HttpClient) {
      this.maxDocumentId = this.getMaxId(); // This method assumes the array isn't empty
    }
  
    ngOnInit() {}
  
    getDocuments(): Observable<Document[]> {
        return this.http.get<Document[]>(this.baseUrl + 'documents.json').pipe(
          map((documents: Document[] | null) => {
            this.documents = documents ? documents : []; // Ensure array is not null/undefined
            this.maxDocumentId = this.getMaxId();
      
            // Sort by name
            this.documents.sort((a, b) => a.name.localeCompare(b.name));
      
            // Emit event to notify components
            this.documentListChangedEvent.next(this.documents.slice());
      
            return this.documents; // Ensure method returns the documents array
          }),
          catchError((error) => {
            console.error('Error fetching documents:', error);
            return of([]); // Return an empty array in case of error
          })
        );
      }

    storeDocuments() {
        let documents = JSON.stringify(this.documents);
        let headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json');
        this.http.put(this.baseUrl + 'documents.json', documents, {headers: headers})
          .subscribe(() => {
            this.documentListChangedEvent.next(this.documents.slice());
          });
      }
      
  
    getDocument(id: string) {
      for (let document of this.documents) {
        if (document.id === id) {
          return document;
        }
      }
      return null;
    }
  
    getMaxId(): number {
      let maxId = 0;
      for (let document of this.documents) {
        const currentId = +document.id;
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
      return maxId;
    }
  
    addDocument(newDocument: Document) {
      if (!newDocument) {
        return;
      }
      this.maxDocumentId++;
      newDocument.id = this.maxDocumentId.toString();
      this.documents.push(newDocument);
    //   const documentsListClone = this.documents.slice();
    //   this.documentListChangedEvent.next(documentsListClone);
        this.storeDocuments();
    }
  
    updateDocument(originalDocument: Document, newDocument: Document) {
      if (!originalDocument || !newDocument) {
        return;
      }
      const pos = this.documents.indexOf(originalDocument);
      if (pos < 0) {
        return;
      }
      newDocument.id = originalDocument.id;
      this.documents[pos] = newDocument;
    //   const documentsListClone = this.documents.slice();
    //   this.documentListChangedEvent.next(documentsListClone);
        this.storeDocuments();
    }
  
    deleteDocument(document: Document) {
      if (!document) {
        return;
      }
      const pos = this.documents.indexOf(document);
      if (pos < 0) {
        return;
      }
      this.documents.splice(pos, 1);
    //   const documentsListClone = this.documents.slice();
    //   this.documentListChangedEvent.next(documentsListClone);
        this.storeDocuments();
    }
  }
  