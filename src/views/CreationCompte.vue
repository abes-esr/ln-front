<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <form-etablissement/>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormEtablissement from "@/components/etablissement/FormEtablissement.vue";

@Component({
  components: { FormEtablissement }
})
export default class CreationCompte extends Vue {}
</script>
