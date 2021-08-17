<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <transition name="fade">
          <form-login v-if="!forgotPasswordVisible" />
        </transition>

        <transition name="fade">
          <forgot-password v-if="forgotPasswordVisible" />
        </transition>

        <transition name="fade">
          <a
            v-if="!forgotPasswordVisible"
            @click="forgotPasswordVisible = !forgotPasswordVisible"
            >Mot de passe ou identifiant oublié ?</a
          >
        </transition>

        <a
          v-if="!forgotPasswordVisible"
          @click="$router.push({ path: '/creationCompte' })"
          ><br />Votre établissement n'a pas encore de compte ? Créer un
          compte</a
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<style src="./style.css"></style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormLogin from "../components/login/FormLogin.vue";
import ForgotPassword from "../components/login/ForgotPassword.vue";

@Component({
  components: { FormLogin, ForgotPassword }
})
export default class App extends Vue {
  forgotPasswordVisible: boolean = false;
}
</script>
