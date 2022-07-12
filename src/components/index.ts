import { App } from "vue";
const components = import.meta.globEager("./**/*.vue");

export default {
  install(app: App) {
    for (let i in components) {
      let component = components[i].default;
      app.component(component.name, component);
    }
  },
};
