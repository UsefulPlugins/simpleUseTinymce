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
let val = ref("")

//* You can change the lang in time,it is useful to i18n
/* setInterval(() => {
  lang.value = langArr[Math.floor(Math.random() * 3)];
  console.log(lang.value, val.value)
}, 2000) */

</script>

<template>
  <t-editor v-model="val" uploadUrl="/api/manage/resource/upload-img" :headers="headers" :lang="lang" :key="lang" />
  <br />
  <Editor v-model="val" uploadUrl="/api/manage/resource/upload-img" :headers="headers" :lang="lang" :key="lang" />
</template>

<style>
</style>
