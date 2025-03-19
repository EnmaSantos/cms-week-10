import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageListChangedEvent = new Subject<Message[]>();
  private messages: Message[] = [];

  constructor(private http: HttpClient) {}

  getMessages() {
    this.http.get<Message[]>('http://localhost:3000/messages')
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
          this.messageListChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getMessage(id: string): Message {
    return this.messages.find(message => message.id === id);
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, newMessage: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          this.messages.push(responseData.newMessage);
          this.messageListChangedEvent.next(this.messages.slice());
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
          this.messageListChangedEvent.next(this.messages.slice());
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
          this.messageListChangedEvent.next(this.messages.slice());
        }
      );
  }
}