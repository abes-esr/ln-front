<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="9" md="10" xs="12">
        <form-profile />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormProfile from "../components/FormProfile.vue";

@Component({
  components: { FormProfile }
})
export default class App extends Vue {}
</script>
