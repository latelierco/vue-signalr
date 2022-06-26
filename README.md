# vue-signalr

## Installation

```console
$ npm install @latelier/vue-signalr --save
```

## Registering in vue 2

```js
// in main.js
import Vue from 'vue';
import VueSignalR from '@latelier/vue-signalr'';

Vue.use(VueSignalR, 'SOCKET_URL');

new Vue({
  el: '#app',
  render: (h) => h(App),

  created() {
    this.$socket.start({
      log: false, // Active only in development for debugging.
    });
  },
});
```

## Registering in vue 3

```js
// in main.js
import { createApp } from 'vue';
import App from './App.vue';

import VueSignalR from '@latelier/vue-signalr'';

createApp(App).use(VueSignalR, 'SOCKET_URL').mount('#app');
```

## Example with component

```js
Vue.extend({

  ...

  methods: {

    someMethod() {
      this.$socket.invoke('socketName', payloadData)
        .then(response => {
          ...
        })
    }

    async someAsyncMethod() {
      const response = await this.$socket.invoke('socketName', payloadData)
      ...
    }

  },

  // Register your listener here.
  sockets: {

    // Equivalent of
    // signalrHubConnection.on('someEvent', (data) => this.someActionWithData(data))
    someEvent(data) {
      this.someActionWithData(data)
    }

    otherSomeEvent(data) {
      this.otheSomeActionWithOtherSomeData(data)
    }

  }

});


```
