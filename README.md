# vue-application-insights


## Installation


```console
$ npm install vue-application-insights --save
```

## Get started


```js
import Vue from 'vue'
import VueAppInsights from 'vue-application-insights'

Vue.use(VueAppInsights, {
  id: 'XXXXXXXX--XXXX-XXXX-XXXXXXXXXXXX'
})
```

With vue router


```js
import Vue from 'vue'
import router from './router'

import VueAppInsights from 'vue-application-insights'

Vue.use(VueAppInsights, {
  id: 'XXXXXXXX--XXXX-XXXX-XXXXXXXXXXXX',
  router
})
```

Exemple with custom track event

```js
Vue.extend({

  methods: {
    custom_action() {
      this.$appInsights.trackEvent("custom_action", { value: 'ok' });
    }   
  }
  
});
```
