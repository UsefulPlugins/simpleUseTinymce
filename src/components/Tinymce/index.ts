import TEditor from "./src/Editor.vue";

import { App } from "vue";

TEditor.name = "t-editor";

TEditor.install = (app: App) => {
  app.component(TEditor.name, TEditor);
};

export default TEditor;
