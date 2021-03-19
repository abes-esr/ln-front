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
import Vue from "vue";
import FormProfile from "../components/FormProfile.vue";

export default Vue.extend({
  name: "Profile",
  components: {
    FormProfile
  }
});
</script>

<style scoped></style>
