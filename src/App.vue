<script setup lang="ts">
import Editor from "/@/components/Tinymce/src/Editor.vue";

const headers = [
  {
    key: "admin-token", val: "eyJpdiI6InV6VEk5N2ZMTXlkZG43TWkvQm1BeEE9PSIsInZhbHVlIjoibXZUc3F3dXM3OGFLQU1Uak1uODhDdz09IiwibWFjIjoiNTUwODFjMWQ0NDI2YWNmYWI3ZmM1MmVmNmZiNGU3OTkyYmUwZDc4ZWFiNTk2MGUzYTRkOTZlZTY3YTU4NzQ1MSIsInRhZyI6IiJ9"
  }
]

</script>

<template>
  <Editor uploadUrl="/api/manage/resource/upload-img" :headers="headers" />
</template>

<style>
</style>
