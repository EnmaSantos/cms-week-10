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
    this.getMessages();
  }

  getMessages() {
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
    return this.messageChangedEvent;
  }

  getMessage(id: string): Message {
    return this.messages.find(message => message.id === id);
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // make sure id of the new Message is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, newMessage: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new message to messages
          this.messages.push(responseData.newMessage);
          this.messageChangedEvent.emit(this.messages.slice());
        },
        (error: any) => {
          console.log('Error adding message:', error);
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
    newMessage._id = originalMessage._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('http://localhost:3000/messages/' + originalMessage.id,
      newMessage, { headers: headers })
      .subscribe(
        (response: any) => {
          this.messages[pos] = newMessage;
          this.messageChangedEvent.emit(this.messages.slice());
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
        (response: any) => {
          this.messages.splice(pos, 1);
          this.messageChangedEvent.emit(this.messages.slice());
        }
      );
  }
}