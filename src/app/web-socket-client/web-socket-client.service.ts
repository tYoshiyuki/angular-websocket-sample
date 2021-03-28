import { Injectable, OnDestroy, Optional } from '@angular/core';
import { WebSocketSubject } from 'rxjs/internal-compatibility';
import { webSocket } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { delay, retryWhen, tap } from 'rxjs/operators';

/**
 * WebSocketClientServiceConfig です。
 */
export class WebSocketClientServiceConfig {
  delayMilliseconds?: number;
  webSocketUrl?: string;
}

/**
 * WebSocketClientService です。
 */
@Injectable({
  providedIn: 'root',
})
export class WebSocketClientService implements OnDestroy {
  /**
   * WebSocketClientServiceConfigのデフォルト値です。
   * @private
   */
  private readonly config: Required<WebSocketClientServiceConfig> = {
    delayMilliseconds: 5000,
    webSocketUrl: 'wss://echo.websocket.org',
  };

  /**
   * WebSocketSubject です。
   * @private
   */
  private subject: WebSocketSubject<any>;

  constructor(
    @Optional()
    private webSocketClientServiceConfig?: WebSocketClientServiceConfig
  ) {
    // 設定がパラメータ指定された場合、デフォルト値と合成します。
    if (webSocketClientServiceConfig) {
      this.config = {
        ...webSocketClientServiceConfig,
        ...this.config,
      };
    }

    this.subject = webSocket({
      url: this.config.webSocketUrl,
      // 接続開始時の処理です。
      openObserver: {
        next: (value) => {
          // TODO デバッグ用の出力処理です。
          console.log('websocket connection open.');
          console.log(value);
        },
      },
      // 接続終了時の処理です。
      closeObserver: {
        next: (value) => {
          // TODO デバッグ用の出力処理です。
          console.log('websocket connection close.');
          console.log(value);
        },
      },
      // deserializerは、デフォルトでJSON.parseが適用されます。serializerは、デフォルトでJSON.stringifyが適用されます。
      // スタマイズする場合は、下記の通りに設定を行います。
      //   deserializer: ({data}) => data,
      //   serializer: ({data}) => data,
    });
  }

  /**
   * WebSocketへの接続情報を取得します。
   */
  get connection(): Observable<any> {
    return this.subject.pipe(
      // 接続失敗を考慮し、一定時間毎にリトライを行います。
      retryWhen((errors) =>
        errors.pipe(
          // TODO デバッグ用の出力処理です。
          tap((x) => {
            console.log('websocket retry executed...');
            console.log(x);
          }),
          delay(this.config.delayMilliseconds)
        )
      )
    );
  }

  /**
   * メッセージを送信します。
   * @param msg
   */
  send(msg: string) {
    this.subject.next(msg);
  }

  /**
   * 終端処理を行います。
   */
  dispose() {
    this.subject.complete();
  }

  ngOnDestroy() {
    this.dispose();
  }

  get url(): string {
    return this.config.webSocketUrl;
  }
}
