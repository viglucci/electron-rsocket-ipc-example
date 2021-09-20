import { RSocketConnector } from '@rsocket/rsocket-core';
import { MessageChannelClientTransport } from '@rsocket/rsocket-message-channel-ipc-client';
import React, { useEffect, useRef, useState } from 'react';
import RSocketContext from './RSocketContext';

const RSocketProvider = (props) => {
  // eslint-disable-next-line react/prop-types
  const { children } = props;
  const [connectionState, setConnectionState] = useState('CONNECTING');
  const rsocket = useRef(null);

  useEffect(() => {
    let connector;
    const connect = async () => {
      connector = new RSocketConnector({
        transport: new MessageChannelClientTransport({
          messagePortProvider: async () => {
            return window.getMainChannelMessagePort();
          },
        }),
      });

      try {
        rsocket.current = await connector.connect();
        setConnectionState('CONNECTED');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setConnectionState('ERROR');
      }
    };

    connect();

    return () => {
      connector.close();
    };
  }, []);

  return (
    <RSocketContext.Provider value={[connectionState, rsocket.current]}>
      {children}
    </RSocketContext.Provider>
  );
};

export default RSocketProvider;
