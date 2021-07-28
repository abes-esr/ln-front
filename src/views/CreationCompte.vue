<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <form-creation-compte />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormCreationCompte from "../components/login/FormCreationCompte.vue";

@Component({
  components: { FormCreationCompte }
})
export default class CreationCompte extends Vue {}
</script>
