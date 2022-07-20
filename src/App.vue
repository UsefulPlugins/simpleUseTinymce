<script setup lang="ts">
import { ref } from "vue";
import Editor from "/@/components/Tinymce/src/Editor.vue";

const headers = [
  {
    key: "admin-token", val: "eyJpdiI6InV6VEk5N2ZMTXlkZG43TWkvQm1BeEE9PSIsInZhbHVlIjoibXZUc3F3dXM3OGFLQU1Uak1uODhDdz09IiwibWFjIjoiNTUwODFjMWQ0NDI2YWNmYWI3ZmM1MmVmNmZiNGU3OTkyYmUwZDc4ZWFiNTk2MGUzYTRkOTZlZTY3YTU4NzQ1MSIsInRhZyI6IiJ9"
  }
]

let langArr = ["zh-Hans", "hy", "th_TH"];
let lang = ref(langArr[0]);
let val = ref("");
const editor = ref();

/**
 * You can change the lang in time,it is useful by i18n
 * this template just include Chinese、English、Thai
 */
const changeLang = () => {
  // Random switching language
  lang.value = langArr[Math.floor(Math.random() * 3)];
}

/**
 * use upload function by yourself and set content to the editor
 */
const customElementUpload = (e: any) => {
  const file = e.target.files[0];

  editor.value?.upload(file, () => { }, false).then((res: any) => {
    editor.value.editorRef.setContent(`<img src="${res.location}"/>`)
  });
}

</script>

<template>
  <input type="button" value="Change Language" @click="changeLang" />
  <br /> <br />
  <t-editor v-model="val" uploadUrl="/api/manage/resource/upload-img" :headers="headers" :lang="lang" :key="lang" />
  <br /> <br />
  <Editor v-model="val" uploadUrl="/api/manage/resource/upload-img" :headers="headers" :lang="lang" :key="lang"
    ref="editor">
    <!-- 
    <template #customUploadBtn>
      <input type="file" @change="customElementUpload">
    </template> 
    -->
  </Editor>
</template>
