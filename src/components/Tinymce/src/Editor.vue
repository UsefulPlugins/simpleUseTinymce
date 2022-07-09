<script setup lang="ts">
import type { Editor as ed } from 'tinymce';
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default';
import 'tinymce/models/dom';
import { array, bool, number, string } from 'vue-types';
import { computed, onMounted, onUnmounted, ref, useAttrs, watch, unref } from 'vue';
import { plugins, toolbar } from './tinymce';
import 'tinymce/plugins/image'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/save'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/code'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/link'
import 'tinymce/plugins/media'
import 'tinymce/plugins/template'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/table'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/help'
import 'tinymce/plugins/quickbars'
import { retrieveImageFromClipboardAsBlob } from './helper';

const props = defineProps({
    disabled: bool().def(false),
    height: number().def(300),
    lang: string().def('CN'),
    uploadUrl: string().isRequired,
    headers: array<Header>().def([])
});

const attr = useAttrs();

const editorRef = ref<Nullable<ed>>(null);

const getLangUrl = (lang: string) => {
    const langPath = '/tinymce/langs/';
    return langPath + lang + '.js'
}

const image_upload_handler = (
    blobInfo: any,
    progress: any,
    isBlob: boolean = true
) =>
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.withCredentials = false;
        xhr.open("POST", props.uploadUrl);

        if (props.headers.length) {
            try {
                for (let i = 0; i < props.headers.length; i++) {
                    const header = props.headers[i];
                    xhr.setRequestHeader(header.key, header.val);
                }
            } catch (error) { }
        }

        xhr.upload.onprogress = (e) => {
            progress((e.loaded / e.total) * 100);
        };

        xhr.onload = () => {
            if (xhr.status === 403) {
                reject({ message: "HTTP Error: " + xhr.status, remove: true });
                return;
            }

            if (xhr.status < 200 || xhr.status >= 300) {
                reject("HTTP Error: " + xhr.status);
                return;
            }

            const json = JSON.parse(xhr.responseText);
            json.location = json.data;

            if (!json || typeof json.location != "string") {
                reject("Invalid JSON: " + xhr.responseText);
                return;
            }

            resolve(isBlob ? json.location : json);
        };

        xhr.onerror = () => {
            reject(
                "Image upload failed due to a XHR Transport error. Code: " + xhr.status
            );
        };

        const formData = new FormData();

        if (!isBlob) {
            formData.append("file", blobInfo, blobInfo.name);
        } else {
            formData.append("file", blobInfo.blob(), blobInfo.filename());
        }

        xhr.send(formData);
    });

const file_picker_callback = (
    callback: Function,
    value: any,
    meta: any
) => {
    var filetype =
        ".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4";
    //后端接收上传文件的地址
    var upurl = props.uploadUrl;
    //为不同插件指定文件类型及后端地址
    switch (meta.filetype) {
        case "image":
            filetype = ".jpg, .jpeg, .png, .gif";
            //upurl = "upimg.php";
            break;
        case "media":
            filetype = ".mp3, .mp4";
            //upurl = "upfile.php";
            break;
        case "file":
        default:
    }
    //模拟出一个input用于添加本地文件
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", filetype);
    input.click();
    input.onchange = function () {
        var file = this.files[0];

        var xhr: XMLHttpRequest, formData;
        console.log(file.name);
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open("POST", upurl);
        xhr.onload = function () {
            var json;
            if (xhr.status != 200) {
                console.warn("HTTP Error: " + xhr.status);
                return;
            }
            json = JSON.parse(xhr.responseText);
            if (!json || typeof json.data != "string") {
                console.warn("Invalid JSON: " + xhr.responseText);
                return;
            }
            callback(json.data, { text: file.name });
        };
        formData = new FormData();
        formData.append("file", file, file.name);
        xhr.send(formData);
    };
};

const setup = (editor: any) => {
    editorRef.value = editor;

    editor.on("paste", function (e: ClipboardEvent) {
        var imageBlob = retrieveImageFromClipboardAsBlob(e);
        if (!imageBlob) {
            return;
        }
        e.preventDefault();

        let p = image_upload_handler(imageBlob, () => { }, false);

        p.then((res: any) => {
            if (editor) {
                editor.insertContent(`<img src="${res.location}" />`);
            } else {
                console.log("Tinymce editor not found!");
            }
        });
    });
};

const initConfig: any = {
    height: props.height,
    skin_url: '/tinymce/skins/ui/oxide',
    content_css: '/tinymce/skins/content/default/content.min.css',
    plugins,
    toolbar,
    //menubar: 'file edit view insert format tools table help',
    images_upload_url: props.uploadUrl,
    automatic_uploads: true,
    images_upload_handler: image_upload_handler,
    paste_data_images: true,

    image_advtab: true,
    importcss_append: true,
    file_picker_callback: file_picker_callback,
    setup: setup,
}


onMounted(() => {
    tinymce.init({})
})

onUnmounted(() => {
    tinymce.remove();
});

watch(() => props.lang, (newVal) => {
    if (newVal == "CN") {
        initConfig.language = 'zh-Hans';
        initConfig.language_url = getLangUrl(initConfig.language);
    } else if (newVal == "US") {
        initConfig.language = 'hy';
        initConfig.language_url = getLangUrl(initConfig.language);
    } else if (newVal == "TH") {
        initConfig.language = 'th_TH';
        initConfig.language_url = getLangUrl(initConfig.language);
    } else {
        delete initConfig.language
        delete initConfig.language_url
    }
}, {
    immediate: true
})

</script>

<template>
    <Editor api-key="no-api-key" :init="initConfig" :disabled="disabled" v-bind="attr" :key="lang" />
</template>

<style scoped>
</style>