import {EventEmitter, Injectable} from '@angular/core';
import {Contact} from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { MOCKCONTACTS } from './MOCKCONTACTS';
import { catchError, map, Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
    contactSelectedEvent = new EventEmitter<Contact>();

    private baseUrl = 'https://cms-firebase-project-default-rtdb.firebaseio.com/';

    contactListChangedEvent = new Subject<Contact[]>();
    private maxContactId: number;

   private contacts: Contact [] =[];

   constructor(private http: HttpClient) {
      this.maxContactId = this.getMaxId();
   }

    getContacts(): Observable<Contact[]> {
        return this.http.get<Contact[]>(this.baseUrl + 'contacts.json').pipe(
          map((contacts: Contact[] | null) => {
            this.contacts = contacts ? contacts : [];
            this.maxContactId = this.getMaxId();
            this.contactListChangedEvent.next(this.contacts.slice());
            return this.contacts;
          }),
          catchError((error) => {
            console.error('Error fetching contacts:', error);
            return of([]);
          })
        );
      }

        private getMaxId(): number {
            let maxId = 0;
            for (let contact of this.contacts) {
                const currentId = +contact.id;
                if (currentId > maxId) {
                    maxId = currentId;
                }
            }
            return maxId;
    }

    storeContacts() {
        let contacts = JSON.stringify(this.contacts);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json'); // Fixed
        this.http.put(this.baseUrl + 'contacts.json', contacts, {headers: headers})
          .subscribe(() => {
            this.contactListChangedEvent.next(this.contacts.slice());
          });
    }

    getContact(id: string): Contact {
        for (let contact of this.contacts) {
            if (contact.id === id) {
                return contact;
            }
        }
        return null;
    }

    addContact(contact: Contact) {
        if (!contact) {
            return;
        }
        this.maxContactId++;
        contact.id = this.maxContactId.toString();
        this.contacts.push(contact);
        // const contactsListClone = this.contacts.slice();
        // this.contactListChangedEvent.next(contactsListClone);
        // this.contactChangedEvent.emit(contactsListClone);
        this.storeContacts();
    }

    updateContact(originalContact: Contact, newContact: Contact) {
        if (!originalContact || !newContact) {
            return;
        }
        const pos = this.contacts.indexOf(originalContact);
        if (pos < 0) {
            return;
        }
        newContact.id = originalContact.id;
        this.contacts[pos] = newContact;
        // const contactsListClone = this.contacts.slice();
        // this.contactListChangedEvent.next(contactsListClone);
        // this.contactChangedEvent.emit(contactsListClone);
        this.storeContacts();
    }

    deleteContact(contact: Contact) {
        if (!contact) {
            return;
        }
        const pos = this.contacts.indexOf(contact);
        if (pos < 0) {
            return;
        }
        this.contacts.splice(pos, 1);
        // const contactsListClone = this.contacts.slice();
        // this.contactListChangedEvent.next(contactsListClone);
        // this.contactChangedEvent.emit(this.contacts.slice());
        this.storeContacts();
    }
}