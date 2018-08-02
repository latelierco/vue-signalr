# vue-signalr


## Installation


```console
$ npm install vue-signalr --save
```

## Get started


```js
import Vue from 'vue'
import VueSignalR from 'vue-signalr'

Vue.use(VueSignalR, 'SOCKET_URL');

new Vue({
  el: '#app',
  render: h => h(App),
  
  created() {
    this.$socket.start({
      log: false // Active only in development for debugging.
    });
  },

});
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
