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

        <transition name="fade">
          <a
            v-if="forgotPasswordVisible"
            @click="forgotPasswordVisible = !forgotPasswordVisible"
            >Revenir au formulaire de connexion</a
          >
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FormLogin from "../components/FormLogin.vue";
import ForgotPassword from "../components/ForgotPassword.vue";

export default Vue.extend({
  name: "Login",
  components: {
    FormLogin,
    ForgotPassword
  },
  data() {
    return {
      forgotPasswordVisible: false
    };
  }
});
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.8s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
