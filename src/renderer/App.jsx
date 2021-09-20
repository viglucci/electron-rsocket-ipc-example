import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import RSocketProvider from './contexts/RSocketProvider';
import RSocketContext from './contexts/RSocketContext';

import './App.global.css';

const ConnectedState = () => {
  const [rsocketStatus, rsocket] = useContext(RSocketContext);
  const [response, setResponse] = useState(null);
  const cancellable = useRef(null);

  const requestResponse = useCallback(() => {
    cancellable.current = rsocket.requestResponse(
      {
        data: Buffer.from(`${new Date().toString()}`),
      },
      {
        onNext(payload, isComplete) {
          console.log(
            `[requestResponse][onNext] payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`
          );
          const data = payload.data.toString();
          setResponse(data);
        },
        onComplete() {},
        onExtension() {},
      }
    );
  }, [rsocket]);

  useEffect(() => {
    return () => {
      if (cancellable.current) cancellable.current.cancel();
    };
  }, [requestResponse, rsocket]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <span>Status: {rsocketStatus}</span>
      <p className="mb-4 mt-4">{response ? <span>{response}</span> : null}</p>
      <button
        type="button"
        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => {
          requestResponse();
        }}
      >
        Echo Date
      </button>
      <p className="mt-2 max-w-xs text-center">
        Click the button above and main process will echo back the data sent to
        it (the current date/time).
      </p>
    </div>
  );
};

const ErrorState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h3 className="mb-4">Failed to connect to server.</h3>
      <div>
        <button
          type="button"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            window.location.reload();
          }}
        >
          Reload
        </button>
      </div>
    </div>
  );
};

const ConnectingState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <span>Connecting...</span>
    </div>
  );
};

const Index = () => {
  const [rsocketState] = useContext(RSocketContext);

  let elements;

  switch (rsocketState) {
    case 'ERROR': {
      elements = <ErrorState />;
      break;
    }
    case 'CONNECTED': {
      elements = <ConnectedState />;
      break;
    }
    default:
      elements = <ConnectingState />;
  }

  return <div className="h-screen w-full">{elements}</div>;
};

export default function App() {
  return (
    <RSocketProvider>
      <Router>
        <Switch>
          <Route path="/" component={Index} />
        </Switch>
      </Router>
    </RSocketProvider>
  );
}
