## Notice

This template help you eary to use the newest tinymce (6). 

## API

|params|content|type|default|
|----|----|----|----|
|disabled|disabled the editor|boolean|false|
|height|editor height   |number|300|
|lang|the value is same as Language file name|string|""|
|uploadUrl|upload image url|string|""|
|headers|upload image url api headers|array<{key:string,val:any}>|""|

**Other config you can see the tinymce API**

## Function

**1. upload the image and auto send to server**
**2. paste the image and auto send to server**

## DEMO

```
main.ts

import { createApp } from "vue";
import App from "./App.vue";

import TEditor from "simpleusetinymce";

createApp(App).use(TEditor).mount("#app");
```

```
App.vue

<t-editor v-model="val" />
```