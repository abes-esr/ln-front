<template>
  <v-alert
    outlined
    text
    :color="getSnackbarColor"
    v-model="snackbarDisplayValue"
    :class="getSnackbarMultiline?'multi-line':''"
  >
    <span class="errorLine" v-for="m in getSnackbarText" v-bind:key="m">{{
      m
    }}</span>
    <template v-slot:close="{ attrs }">
      <v-btn
        :color="getSnackbarColor"
        icon
        v-bind="attrs"
        @click="closeSnackBar()"
      >
        <font-awesome-icon :icon="['fas', 'window-close']" class="mx-2" />
      </v-btn>
    </template>
  </v-alert>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {MessageType} from "@/core/CommonDefinition";

@Component
export default class Message extends Vue {
  constructor() {
    super();
  }

  get getSnackbarColor(): string {
    const type:MessageType = this.$store.getters.getDisplayedMessage().color;
    if (type == MessageType.ERREUR) {
      return 'red';
    } else if (type == MessageType.AVERTISSEMENT) {
      return 'orange';
    } else if (type == MessageType.INFORMATION) {
      return 'blue';
    } else {
      return 'blue';
    }
  }

  get snackbarDisplayValue(): boolean {
    if (!this.$store.getters.getDisplayedMessage().isSticky) {
      setTimeout(() => {
        this.closeSnackBar();
      }, 2000);
    }
    return this.$store.getters.getDisplayedMessage().isDisplayed;
  }

  get getSnackbarMultiline(): boolean {
    return this.$store.getters.getDisplayedMessage().isMultiline;
  }

  get getSnackbarText(): Array<string> {
    return this.$store.getters.getDisplayedMessage().texte.split("\n");
  }

  /******************** Events ***************************/
  closeSnackBar(): void {
    this.$store.dispatch("closeDisplayedMessage");
  }
}
</script>
<style scoped></style>
