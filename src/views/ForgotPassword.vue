<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col xl="5" lg="7" md="9" xs="11">
        <forgot-password />
        <v-row id="row_RevenirAccueil">
          <v-col cols="8"></v-col>
          <a @click="allerAConnexion()">
            <font-awesome-icon :icon="['fas', 'reply']" />&nbsp;Revenir à la
            page d'accueil
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ForgotPassword from "../components/authentification/login/ForgotPassword.vue";

@Component({
  components: { ForgotPassword }
})
export default class App extends Vue {
  allerAConnexion(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$router.push({ name: "Login" });
  }
}
</script>
<style scoped lang="scss">
h4 {
  display: inline;
}

.full-width {
  width: 100%;
}

#row_RevenirAccueil {
  margin: auto;
}

p {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 0;
}

strong {
  font-weight: 900;
}

h4 {
  font-size: 18px;
}
</style>
