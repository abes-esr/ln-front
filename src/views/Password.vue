<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="9" md="10" xs="12">
        <change-password />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import ChangePassword from "@/components/login/ChangePassword.vue";
import Vue from "vue";

export default Vue.extend({
  name: "Profile",
  components: {
    ChangePassword
  }
});
</script>

<style scoped></style>
