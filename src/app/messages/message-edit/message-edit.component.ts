import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css',
  standalone: false
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;
  currentSender: string = '7'; // Using a valid ID from MOCKMESSAGES

  constructor(private messageService: MessageService, 
              private contactService: ContactService) { }

  ngOnInit() {
    // Initialize any required data
  }

  onSendMessage() {
    const subjectValue = this.subject.nativeElement.value;
    const msgTextValue = this.msgText.nativeElement.value;
    
    // Validate that we have content
    if (!subjectValue.trim() || !msgTextValue.trim()) {
      return;
    }

    // Create a new message with the sender id
    const newMessage = new Message('', subjectValue, msgTextValue, this.currentSender);
    
    // Add the message via the service
    this.messageService.addMessage(newMessage);
    
    // Clear the form
    this.onClear();
  }

  onClear() {
    if (this.subject && this.subject.nativeElement) {
      this.subject.nativeElement.value = '';
    }

    if (this.msgText && this.msgText.nativeElement) {
      this.msgText.nativeElement.value = '';
    }
  }
}
