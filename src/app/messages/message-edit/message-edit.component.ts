import { Component, ViewChild, ElementRef } from '@angular/core';

import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  standalone: false,
  
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;
  currentSender: string = 'Enmanuel';

  constructor(private messageService: MessageService) { }


  onSendMessage() {
    const subjectValue = this.subject.nativeElement.value;
    const msgTextValue = this.msgText.nativeElement.value;
    const newMessage = new Message('1', subjectValue, msgTextValue, this.currentSender);
    this.messageService.addMessage(newMessage);
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
