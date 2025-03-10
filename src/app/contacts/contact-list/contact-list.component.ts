import { Component, OnInit, OnDestroy } from '@angular/core';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  standalone: false,
  
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css',
  // providers: [ContactService]
})
export class ContactListComponent implements OnInit, OnDestroy {

  contacts: Contact[];
  subscription: Subscription;
  term: string;

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.contactService.getContacts().subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
    });
    // this.contacts = this.contactService.getContacts();
    // this.contactService.contactChangedEvent
    //   .subscribe(
    //     (contacts: Contact[]) => {
    //       this.contacts = contacts;
    //     }
    //   );
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contactsList: Contact[]) => {
        this.contacts = contactsList;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  search(value: string) {
    this.term = value;
  }

}
