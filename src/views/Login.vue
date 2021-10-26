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
        <transition name="fade">
          <a
            v-if="forgotPasswordVisible"
            @click="forgotPasswordVisible = !forgotPasswordVisible"
            >Revenir au formulaire de connexion</a
          >
        </transition>
        <p id="noAccount" v-if="!forgotPasswordVisible">
          Votre établissement n'a pas encore de compte ?
        </p>
        <v-row>
          <v-col cols="4" class="createAccountLinks">
            <a
              v-if="!forgotPasswordVisible"
              href="http://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
              target="_blank"
              ><br />Vérifier l'éligibilité</a
            >
          </v-col>
          <v-col cols="4" class="createAccountLinks">
            <a
              v-if="!forgotPasswordVisible"
              @click="creerCompte"
              ><br />Créer un compte</a
            ></v-col
          ></v-row
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
import {Logger} from "@/utils/Logger";

@Component({
  components: { FormLogin, ForgotPassword }
})
export default class App extends Vue {
  forgotPasswordVisible: boolean = false;
  creerCompte(){
    this.$router.push({ name: "CreationEtablissement" }).catch(err => {
      Logger.debug("Ca marche pas : " + err);
    });
  }
}
</script>
