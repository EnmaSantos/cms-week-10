import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageListChangedEvent = new Subject<Message[]>();
  messageChangedEvent = new EventEmitter<Message[]>();
  private messages: Message[] = [];

  constructor(private http: HttpClient) {
    this.fetchMessages();
  }

  fetchMessages() {
    this.http.get<Message[]>('http://localhost:3000/messages')
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
          this.messageChangedEvent.emit(this.messages.slice());
        },
        (error: any) => {
          console.log('Error fetching messages:', error);
        }
      );
  }

  getMessages() {
    this.fetchMessages();
    return this.messageChangedEvent;
  }

  getMessage(id: string): Message {
    return this.messages.find(message => message.id === id);
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // Log the message to debug
    console.log('Sending message to server:', message);

    // Make sure id is not included or is empty
    const messageToSend = {
      subject: message.subject,
      msgText: message.msgText,
      sender: message.sender
    };

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<any>('http://localhost:3000/messages',
      messageToSend,
      { headers: headers })
      .subscribe(
        (responseData) => {
          console.log('Server response:', responseData);
          // Refresh messages from server
          this.fetchMessages();
        },
        (error: any) => {
          console.error('Error adding message:', error);
          // As a fallback, add message locally so UI updates
          const tempMessage = new Message(
            (this.messages.length + 1).toString(),
            message.subject,
            message.msgText, 
            message.sender
          );
          this.messages.push(tempMessage);
          this.messageChangedEvent.emit(this.messages.slice());
        }
      );
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }

    const pos = this.messages.findIndex(m => m.id === originalMessage.id);
    if (pos < 0) {
      return;
    }

    newMessage.id = originalMessage.id;
    
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('http://localhost:3000/messages/' + originalMessage.id,
      newMessage, { headers: headers })
      .subscribe(
        () => {
          this.fetchMessages();
        },
        (error: any) => {
          console.error('Error updating message:', error);
        }
      );
  }

  deleteMessage(message: Message) {
    if (!message) {
      return;
    }

    const pos = this.messages.findIndex(m => m.id === message.id);
    if (pos < 0) {
      return;
    }

    this.http.delete('http://localhost:3000/messages/' + message.id)
      .subscribe(
        () => {
          this.fetchMessages();
        },
        (error: any) => {
          console.error('Error deleting message:', error);
        }
      );
  }
}