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
      }, 2000);
    }
    return this.$store.getters.getDisplayedMessage().isDisplayed;
  }

  get getSnackbarMultiline(): boolean {
    return this.$store.getters.getDisplayedMessage().isMultiline;
  }

  get getSnackbarText(): Array<string> {
    return "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum".split("\n");
    //return this.$store.getters.getDisplayedMessage().texte.split("\n");
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
