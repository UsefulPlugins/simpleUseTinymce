## Notice
[英文](https://github.com/numver/simpleUseTinymce#readme) &emsp; [中文](https://github.com/numver/simpleUseTinymce#readme_cn)

此插件帮助你更容易使用最新版的tinymce(6)富文本编辑器

**1. 上传图片到服务器**

**2. 粘贴图片时也会将图片上传到服务器**

## API

|params|content|type|default|
|----|----|----|----|
|disabled|是否禁用富文本|boolean|false|
|height|富文本高度 |number|300|
|lang|富文本语言包, 语言文字必须和tinymce语言包名字相同，且将对应的语言包文件放到指定的文件夹内 |string|""|
|uploadUrl|上传图片的地址|string|""|
|headers|上传图片的地址的 headers设置|array<{key:string,val:any}>|[]|
|showUploadBtn|是否显示自定义上传按钮|boolean|true|
|uploadBtnText|自定义上传按钮值|string|'Upload'|
|customUploadBtn|自定义上传按钮|slot|
|urlPrefix|上传图片的地址前缀 |string|""|
|jsonKey| 上传图片返回数据当中,默认的KEY值 |string|'data'|
|urlFunc|自定义返回数据当中图片的处理函数,该函数执行在前缀处理之后 |function||
|otherInitConfig|自定义 tinymce 配置, 覆盖当前配置 |object|{}|

**\* 其他配置方法可以参照tinymce的配置，需要注意的是，目前自定义配置会覆盖当前富文本配置**

## Event

|Name|Description|Type|
|----|----|----|
|uploadDone|上传成功回调事件|function(editorRef)|

## DefineExpose

|Name|Description|Type|
|----|----|----|
|upload|和tinymce 中images_upload_handler函数方法一致|function(blobInfo,progress,isBlob: boolean= true)|
|editorRef|富文本 editor的 ref|Ref|

## DEMO
**tinymce 资源文件存放在public文件夹当中，示例如下**

![resource](https://github.com/numver/simpleUseTinymce/blob/main/assets/resource.png)


##### main.ts
```javascript
import { createApp } from "vue";
import App from "./App.vue";

import TEditor from "simpleusetinymce";

createApp(App).use(TEditor).mount("#app");
```

##### App.vue
```javascript
<!-- 基础示例 -->
<t-editor v-model="val" />
```

##### *.vue
```javascript
<!-- i18n 国际化语言相关 -->
let langArr = ["zh-Hans", "hy", "th_TH"];
let lang = ref(langArr[0]);
let val = ref("");

/**
 * 以下示例模仿多语言情况，随机切换语言
 * 例子当中包裹中文、英文、泰文
 */
const changeLang = () => {
  // Random switching language
  lang.value = langArr[Math.floor(Math.random() * 3)];
}

<t-editor v-model="val" :lang="lang" :key="lang" />
```

```javascript
<!-- 自定义上传按钮和方法 -->
const editor = ref();

/**
 * 自定义上传方法，需要自己将结果插入到富文本当中
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

```javascript
<!-- 自定义 tinymce 配置 -->
// 可以覆盖已有的tinymce配置
const otherInitConfig = {
  // tinymce config
}
<t-editor v-model="val" />

// 会覆盖所有，重新初始化tinymce, 慎重使用
const tinymceConfig = {
  // tinymce config
}
<t-editor v-model="val" :init="tinymceConfig"/>
```