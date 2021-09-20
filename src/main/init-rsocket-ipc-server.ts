import { MessageChannelMain } from 'electron';
import {
  OnExtensionSubscriber,
  OnNextSubscriber,
  OnTerminalSubscriber,
  Payload,
  RSocketServer,
} from '@rsocket/rsocket-core';
import {
  MessageChannelServerTransport,
  MessagePortMainElectronApiAdapter,
} from '@rsocket/rsocket-message-channel-ipc-server';

const makeAcceptor = () => {
  return async (setupFrame: any) => {
    console.log(`RSocket client connected.`, setupFrame);
    return {
      requestResponse(
        payload: Payload,
        responderStream: OnNextSubscriber &
          OnExtensionSubscriber &
          OnTerminalSubscriber
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const data = Buffer.concat([Buffer.from('Echo: '), payload.data]);
        responderStream.onNext(
          {
            data,
          },
          true
        );

        return {
          cancel() {},
          onExtension() {},
        };
      },
    };
  };
};

export default async function initRSocketServer() {
  // Create a message channel which consists of two ports. One port will be used by the
  // "server", whith the other being sent to the "client" (the browser window). Throw these
  // ports the main process and the browser window process are able to communicate.
  const { port1, port2 } = new MessageChannelMain();

  port1.on('message', (event) => {
    console.log(event.data);
  });

  const transport = new MessageChannelServerTransport({
    messagePortProvider: async () =>
      new MessagePortMainElectronApiAdapter(port1),
  });

  const server = new RSocketServer({
    transport,
    acceptor: {
      accept: makeAcceptor(),
    },
  });

  const closeable = await server.bind();

  // TODO: should RSocket transport call start in `bind`?
  port1.start();

  return {
    closeable,
    clientPort: port2,
  };
}
