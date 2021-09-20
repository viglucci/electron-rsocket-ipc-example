# Electron RSocket IPC Example

> This example project is based off of Electron React Boilerplate. See [https://github.com/electron-react-boilerplate/](https://github.com/electron-react-boilerplate) for further documentation.

This project provides an example of leveraging [RSocket](https://rsocket.io) as a mechanism for transmitting streaming messages between processes in an electron application.

The implementation is based off of the concepts described in the [Reply streams](https://www.electronjs.org/docs/latest/tutorial/message-ports/#reply-streams) documentation.

#### Notable Files

- [init-rsocket-ipc-server.ts](./src/main/init-rsocket-ipc-server.ts)
- [RSocketProvider.jsx](./src/renderer/contexts/RSocketProvider.jsx)

## Usage

### Prereqs

This example relies on an experimental version of [rsocket-js](https://github.com/rsocket/rsocket-js). More information on this work in progress can be found [in this issue](https://github.com/rsocket/rsocket-js/issues/158).

#### Clone and checkout RSocket-JS Branch

```
git clone https://github.com/rsocket/rsocket-js.git
git checkout dev-message-channel-ipc-transport
```

#### Link Packages

```
cd rsocket-js
cd packages/rsocket-core && yarn link && cd ..
cd packages/rsocket-message-channel-ipc-client && yarn link && cd .. && cd ..
cd packages/rsocket-message-channel-ipc-server && yarn link && cd .. && cd ..
```

#### Install & Build

> From within `rsocket-js`

```
yarn && yarn build
```

### Install

First, clone the repo via git and install dependencies:

```bash
git clone --depth 1 --branch main https://github.com/electron-react-boilerplate your-project-name
cd your-project-name
yarn
```

### Starting Development

Start the app in the `dev` environment:

```bash
yarn start
```
