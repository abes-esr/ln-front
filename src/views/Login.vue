<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <FormLogin />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FormLogin from "../components/FormLogin.vue";

export default Vue.extend({
  name: "Login",
  components: {
    FormLogin
  }
});
</script>
