import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-contact-edit',
  standalone: false,
  
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})
export class ContactEditComponent implements OnInit {

    originalContact: Contact;
    contact: Contact;
    groupContacts: Contact[] = [];
    editMode: boolean = false;
    id: string;
  
    constructor(
      private contactService: ContactService,
      private router: Router,
      private route: ActivatedRoute

    ) { }
  
    ngOnInit() {
      this.route.params.subscribe((params: Params) => {
          const id = params['id'];
          if (!id) {
            this.editMode = false;
            return;
          }

          this.originalContact = this.contactService.getContact(id);
          if (!this.originalContact) {
            return;
          }

          this.editMode = true;
          this.contact = JSON.parse(JSON.stringify(this.originalContact));

          if (this.contact.group) {
            this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
          }

        })
    }

    onSubmit() {
      if (this.editMode) {
        this.contactService.updateContact(this.originalContact, this.contact);
      } else {
        this.contactService.addContact(this.contact);
      }
      this.router.navigate(['/contacts']);
    }

    onCancel() {
      this.router.navigate(['/contacts']);
    }

    onDrop(event: CdkDragDrop<Contact[]>) {
      // Get the contact that is being dragged
      const selectedContact: Contact = event.item.data;
    
      // Check if the contact is invalid for the group
      const invalidGroupContact = this.isInvalidContact(selectedContact);
      if (invalidGroupContact) {
        return; // If invalid, don't add to the group
      }
    
      // Add the selected contact to the groupContacts array
      this.groupContacts.push(selectedContact);
    }

    isInvalidContact(newContact: Contact) {
      if (!newContact) {
        return true;
      }
      if (this.contact && newContact.id === this.contact.id) {
        return true;
      }

      for (let i = 0; i < this.groupContacts.length; i++) {
        if (newContact.id === this.groupContacts[i].id) {
          return true;
        }
      }
      return false;
    }

    onRemoveItem(index: number, event: MouseEvent) {
      event.preventDefault();
      
      if (index < 0 || index >= this.groupContacts.length) {
        return;
      }
      this.groupContacts.splice(index, 1);
    }

}
