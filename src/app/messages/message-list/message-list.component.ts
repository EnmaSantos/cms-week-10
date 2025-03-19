import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
  standalone: false
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  subscription: Subscription;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.subscription = this.messageService.messageChangedEvent
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
        }
      );
    
    // Initial fetch of messages
    this.messageService.getMessages();
  }

  onAddMessage(message: Message) {
    this.messageService.addMessage(message);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
