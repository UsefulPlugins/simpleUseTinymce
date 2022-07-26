## Notice

This template help you eary to use the newest tinymce (6). 

**1. upload the image and auto send to server**

**2. paste the image and auto send to server**

## API

|params|content|type|default|
|----|----|----|----|
|disabled|disabled the editor|boolean|false|
|height|editor height   |number|300|
|lang|the value is same as Language file name,if you want to use other lang, please download the file and put it in to the right way by tinymce |string|""|
|uploadUrl|upload image url|string|""|
|headers|upload image url api headers|array<{key:string,val:any}>|[]|
|showUploadBtn|show the custom input file btn|boolean|true|
|customUploadBtn|custom upload button|slot|
|urlPrefix|if your image url is not a full url,You can complete the address through it |string|""|
|jsonKey|Api response like {code:0,data:'xxxx'}, it use the data keyword |string|data|
|urlFunc|Custom function processing the upload url,it is complete after use urlPrefix |function||

**\* Other config you can see the tinymce API**

## Event

|Name|Description|Type|
|----|----|----|
|uploadDone|upload complete|function(editorRef)|

## DefineExpose

|Name|Description|Type|
|----|----|----|
|upload|same as tinymce images_upload_handler|function(blobInfo,progress,isBlob: boolean= true)|
|editorRef|the editor ref|Ref|

## DEMO
**public dir input tinymce resource**

![resource](https://github.com/numver/simpleUseTinymce/blob/main/assets/resource.png)

```
main.ts

import { createApp } from "vue";
import App from "./App.vue";

import TEditor from "simpleusetinymce";

createApp(App).use(TEditor).mount("#app");
```

```
App.vue

<!-- basic -->
<t-editor v-model="val" />
```

```
<!-- i18n -->
let langArr = ["zh-Hans", "hy", "th_TH"];
let lang = ref(langArr[0]);
let val = ref("");

/**
 * You can change the lang in time,it is useful by i18n
 * this template just include Chinese、English、Thai
 */
const changeLang = () => {
  // Random switching language
  lang.value = langArr[Math.floor(Math.random() * 3)];
}

<t-editor v-model="val" :lang="lang" :key="lang" />
```

```
<!-- Custom upload function by yourself -->
const editor = ref();

/**
 * use upload function by yourself and set content to the editor
 */
const customElementUpload = (e: any) => {
  const file = e.target.files[0];

  editor.value?.upload(file, () => { }, false).then((res: any) => {
    editor.value.editorRef.setContent(`<img src="${res.location}"/>`)
  });
}

<t-editor v-model="val" :lang="lang" :key="lang">
    <template #customUploadBtn>
      <input type="file" @change="customElementUpload">
    </template> 
</t-editor>
```
