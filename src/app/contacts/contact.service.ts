import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  private contacts: Contact[] = [];

  constructor(private http: HttpClient) {}

  getContacts() {
    this.http.get<Contact[]>('http://localhost:3000/contacts')
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.sortAndSend();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getContact(id: string): Contact {
    return this.contacts.find(contact => contact.id === id);
  }

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    newContact._id = originalContact._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response: any) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        }
      );
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) {
      return;
    }

    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: any) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  sortAndSend() {
    this.contacts.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}