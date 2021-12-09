<template>
  <v-dialog v-model="dialog" class="elevation-0 popup" :max-width="options.width" @keydown.esc="cancel">
    <v-card flat  class="confirmPopup">

      <v-card-text class="pa-3 popup-texte"
      > <font-awesome-icon
          :icon="['fas', 'exclamation-triangle']"
          class="mx-2 fa-2x icone-attention"
      /><div  v-if="message"
              class="popup-message"
              v-html="message"></div> </v-card-text>
      <v-card-actions class="pt-0 ma-3">
        <v-spacer></v-spacer>
        <v-btn text class="bouton-annuler" @click="cancel">Annuler</v-btn>
        <v-btn depressed class="bouton-valider" @click="agree">Valider</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ConfirmPopupOptions } from "@/core/CommonDefinition";

@Component
export default class ConfirmPopup extends Vue {
  icon: string = "";
  message: string = "";

  dialog: boolean = false;
  resolve: any = null;
  reject: any = null;
  options: ConfirmPopupOptions = {
    color: "error",
    width: '30vw'
  };

  open( message, options?) {
    this.dialog = true;
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
<style scoped lang="scss">
.icone-attention {
  float:left;
}

.popup-texte {
  border: 0;
}

.popup-message {
  font-size: 1.3rem;
}

.popup-texte div {
  min-height: 1rem;
  white-space: pre-wrap;
}

</style>

