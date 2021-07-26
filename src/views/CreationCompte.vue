<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <form-creation-compte />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FormCreationCompte from "../components/login/FormCreationCompte.vue";

export default Vue.extend({
  name: "CreationCompte",
  components: {
    FormCreationCompte
  }
});
</script>

<style scoped></style>
