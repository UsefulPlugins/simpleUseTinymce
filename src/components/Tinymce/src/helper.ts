export const image_upload_handler = (
  blobInfo: any,
  progress: any,
  isBlob: boolean = true,
  uploadUrl: string,
  headers: Header[]
) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    console.log(uploadUrl);

    xhr.withCredentials = false;
    xhr.open("POST", uploadUrl);

    if (headers.length) {
      try {
        for (let i = 0; i < headers.length; i++) {
          const header = headers[i];
          xhr.setRequestHeader(header.key, header.val);
        }
      } catch (error) {}
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

export const retrieveImageFromClipboardAsBlob = (
  pasteEvent: ClipboardEvent
) => {
  if (pasteEvent.clipboardData === null) {
    return false;
  }

  var items = pasteEvent.clipboardData.items;

  if (items === undefined) {
    return false;
  }

  for (var i = 0; i < items.length; i++) {
    // Only paste if image is only choice
    if (items[i].type.indexOf("image") === -1) {
      continue;
    }
    // Retrieve image on clipboard as blob
    var blob = items[i].getAsFile();

    // load image if there is a pasted image
    if (blob !== null) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // console.log('result', e.target.result);
      };
      reader.readAsDataURL(blob);
      return blob;
    }
  }
  return false;
};
