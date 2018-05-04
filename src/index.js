import * as SignalR from '@aspnet/signalr-client';

const EventEmitter = require('events');

const defaultOptions = {
  log: false,
  connectionTimeout: false,
};

class SocketConnection extends EventEmitter {
  constructor(connection) {
    super();

    this.connection = connection;
    this.listened = [];
    this.socket = false;

    this.toSend = [];

    this.offline = false;
  }

  async _initialize(connection = '') {
    try {
      const con = connection || this.connection;
      const socket = new SignalR.HubConnection(con);

      socket.connection.onclose = async (error) => {
        if (this.options.log) console.log('reconect');

        this.socket = false;
        /* eslint-disable no-underscore-dangle */
        await this._initialize();
        this.emit('reconect');
      };

      await socket.start();

      this.socket = socket;
      this.emit('init');
    } catch (error) {
      if (this.options.log) console.log('Error reconect');

      setTimeout(() => {
        this._initialize();
      }, 1000);
    }
  }

  async start(options = {}) {
    this.options = Object.assign(defaultOptions, options);

    if (this.options.connectionTimeout) {
      this.connection = `${this.connection}?connectionTimeout=${this.options.connectionTimeout}`;
    }

    await this._initialize();
  }

  async authenticate(accessToken, options = {}) {
    this.connection = `${this.connection}?authorization=${accessToken}`;

    /* eslint-disable no-underscore-dangle */
    await this.start(options);
  }

  listen(method) {
    if (this.offline) return;

    if (this.listened.some(v => v === method)) return;
    this.listened.push(method);

    this.on('init', () => {
      this.socket.on(method, (data) => {
        if (this.options.log) console.log({ type: 'receive', method, data });

        this.emit(method, data);
      });
    });
  }

  send(methodName, ...args) {
    if (this.options.log) console.log({ type: 'send', methodName, args });
    if (this.offline) return;

    if (this.socket) {
      this.socket.send(methodName, ...args);
      return;
    }

    this.once('init', () => this.socket.send(methodName, ...args));
  }

  async invoke(methodName, ...args) {
    if (this.options.log) console.log({ type: 'invoke', methodName, args });
    if (this.offline) return false;

    if (this.socket) {
      return this.socket.invoke(methodName, ...args);
    }

    return new Promise(async resolve =>
      this.once('init', () =>
        resolve(this.socket.invoke(methodName, ...args))));
  }

  async sendKeepAlive() {
    if (!this.socket) return;
    await this.socket.invoke('keepAlive');
  }
}

if (!SignalR) {
  throw new Error('[Vue-SignalR] cannot locate signalr-client');
}

function install(Vue, connection) {
  if (!connection) {
    throw new Error('[Vue-SignalR] cannot locate connection');
  }

  const Socket = new SocketConnection(connection);

  Vue.socket = Socket;

  let interval;
  Socket.listen('authenticated');

  Socket.on('authenticated', () => {
    if (interval) clearInterval(interval);
    interval = setInterval(() => Socket.sendKeepAlive(), 3000);
  });

  Object.defineProperties(Vue.prototype, {

    $socket: {
      get() {
        return Socket;
      },
    },

  });

  Vue.mixin({

    created() {
      if (this.$options.sockets) {
        const methods = Object.getOwnPropertyNames(this.$options.sockets);

        methods.forEach((method) => {
          Socket.listen(method);

          Socket.on(method, data =>
            this.$options.sockets[method].call(this, data));
        });
      }

      if (this.$options.subscribe) {
        Socket.on('authenticated', () => {
          this.$options.subscribe.forEach((channel) => {
            Socket.invoke('join', channel);
          });
        });
      }
    },

  });
}

export default install;
