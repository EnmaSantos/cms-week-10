import { EventEmitter, Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { Message } from "./message.model";
import { MOCKMESSAGES } from "./MOCKMESSAGES";

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnInit {
  messageChangedEvent = new EventEmitter<Message[]>();
  messageListChangedEvent = new Subject<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;
  
  private baseUrl = 'https://cms-firebase-project-default-rtdb.firebaseio.com/';

  constructor(private http: HttpClient) {
    this.maxMessageId = this.getMaxId();
  }

  ngOnInit() {
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.baseUrl + 'messages.json').pipe(
      map((messages: Message[] | null) => {
        this.messages = messages ? messages : [];
        this.maxMessageId = this.getMaxId();
        this.messageListChangedEvent.next(this.messages.slice());
        return this.messages;
      }),
      catchError(error => {
        console.error('Error fetching messages:', error);
        return of([]);
      })
    );
  }

  getMessage(id: string) {
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // make sure id of the new Message is empty
    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages();
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }

    const pos = this.messages.findIndex(m => m.id === originalMessage.id);
    if (pos < 0) {
      return;
    }

    // set the id of the new Message to the id of the old Message
    newMessage.id = originalMessage.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put(
      'https://cms-firebase-project-default-rtdb.firebaseio.com/messages/' + originalMessage.id + '.json',
      newMessage,
      { headers: headers })
      .subscribe(
        () => {
          this.messages[pos] = newMessage;
          this.storeMessages();
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

    // delete from database
    this.http.delete('https://cms-firebase-project-default-rtdb.firebaseio.com/messages/' + message.id + '.json')
      .subscribe(
        () => {
          this.messages.splice(pos, 1);
          this.storeMessages();
        }
      );
  }

  storeMessages() {
    let messagesToSend = JSON.stringify(this.messages);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(
      'https://cms-firebase-project-default-rtdb.firebaseio.com/messages.json',
      messagesToSend,
      { headers: headers })
      .subscribe(
        () => {
          this.messageListChangedEvent.next([...this.messages]);
        }
      );
  }

  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}