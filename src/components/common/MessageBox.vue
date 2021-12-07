<template>
  <v-alert
    text
    :color="getSnackbarColor"
    v-model="snackbarDisplayValue"
    :class="getSnackbarMultiline ? 'multi-line elevation-0' : 'elevation-0'"
    id="messageBox"
  >
    <font-awesome-icon
      v-if="getSnackbarType == MessageType.ERREUR"
      :icon="['fas', 'ban']"
      class="fa-lg mr-5 mb-1 mt-2 icone-erreur"
    />
    <font-awesome-icon
        v-if="getSnackbarType == MessageType.VALIDATION"
        :icon="['fas', 'check-circle']"
        class="fa-lg mr-5 mb-1 mt-2 icone-validation"
    />
    <font-awesome-icon
        v-if="getSnackbarType == MessageType.AVERTISSEMENT"
        :icon="['fas', 'ban']"
        class="fa-lg mr-5 mb-1 mt-2 icone-avertissement"
    />
    <font-awesome-icon
        v-if="getSnackbarType == MessageType.INFORMATION"
        :icon="['fas', 'ban']"
        class="fa-lg mr-5 mb-1 mt-2 icone-information"
    />
    <span v-for="m in getSnackbarText" v-bind:key="m">{{ m }}</span>

    <template v-slot:close="{ attrs }">
      <v-btn
        :color="getSnackbarColor"
        icon
        v-bind="attrs"
        @click="closeSnackBar()"
      >
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="fa-lg mx-2 icone-fermer"
        />
      </v-btn>
    </template>
  </v-alert>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { MessageType } from "@/core/CommonDefinition";
import { Logger } from "@/utils/Logger";

@Component
export default class Message extends Vue {
  MessageType: any = MessageType;

  constructor() {
    super();
  }

  get getSnackbarColor(): string {
    const type: MessageType = this.$store.getters.getDisplayedMessage().type;
    if (type == MessageType.ERREUR) {
      return "erreur";
    } else if (type == MessageType.AVERTISSEMENT) {
      return "avertissement";
    } else if (type == MessageType.INFORMATION) {
      return "information";
    } else if (type == MessageType.VALIDATION) {
      return "validation";
    } else {
      return "information";
    }
  }

  get snackbarDisplayValue(): boolean {
    if (!this.$store.getters.getDisplayedMessage().isSticky) {
      setTimeout(() => {
        this.closeSnackBar();
      }, 6000);
    }
    return this.$store.getters.getDisplayedMessage().isDisplayed;
  }

  get getSnackbarMultiline(): boolean {
    return this.$store.getters.getDisplayedMessage().isMultiline;
  }

  get getSnackbarText(): Array<string> {
    return this.$store.getters.getDisplayedMessage().texte.split("\n");
  }

  get getSnackbarType(): MessageType {
    return this.$store.getters.getDisplayedMessage().type;
  }

  /******************** Events ***************************/
  closeSnackBar(): void {
    this.$store.dispatch("closeDisplayedMessage");
  }
}
</script>
<style scoped>
.multi-line span {
  min-height: 1rem;
  word-break: break-all;
}
</style>
