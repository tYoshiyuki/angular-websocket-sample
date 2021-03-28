import { Component, Inject, LOCALE_ID } from '@angular/core';
import { WebSocketClientService } from './web-socket-client/web-socket-client.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  connection$: Observable<any>;
  messages: string[] = [];
  messageControl: FormControl = new FormControl('');
  url: string;
  locale: string;

  constructor(
    private service: WebSocketClientService,
    @Inject(LOCALE_ID) private localeId: string
  ) {
    this.url = service.url;
    this.locale = localeId;

    this.connection$ = service.connection.pipe(
      // メッセージ受信時の処理です。
      map((x) =>
        this.messages.push(
          this.now() + '[Receive] << ' + x
        )
      )
    );
  }

  /**
   * メッセージを送信します。
   */
  send() {
    console.log('send message: ' + this.messageControl.value);
    this.messages.push(this.now() + '[Send] >> ' + this.messageControl.value);
    this.service.send(this.messageControl.value);
    this.messageControl.setValue('');
  }

  private now(){
    return formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', this.locale)
  }
}
