<template>
  <v-dialog v-model="dialog" :max-width="options.width" @keydown.esc="cancel">
    <v-card>
      <v-toolbar dark :color="options.color" dense flat>
        <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text
        v-if="message"
        class="pa-4 text-center"
        v-html="message"
      ></v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="cancel">Annuler</v-btn>
        <v-btn depressed :color="options.color" @click="agree">Oui</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import { ConfirmPopupOptions } from "@/core/CommonDefinition";

@Component
export default class ConfirmPopup extends Vue {
  title: string = "";
  message: string = "";
  dialog: boolean = false;
  resolve: any = null;
  reject: any = null;
  options: ConfirmPopupOptions = {
    color: "error",
    width: 300
  };

  open(title, message, options?) {
    this.dialog = true;
    this.title = title;
    this.message = message;
    this.options = Object.assign(this.options, options);
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  agree() {
    this.resolve(true);
    this.dialog = false;
  }

  cancel() {
    this.resolve(false);
    this.dialog = false;
  }
}
</script>
