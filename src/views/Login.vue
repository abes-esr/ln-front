<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <v-alert border="left" type="info" dense outlined>
          <h4>
            Application réservée aux établissements bénéficiaires
          </h4>
          <br />
          <p id="WarningLogin">
            <strong>Important : </strong>L'accès aux corpus sous licences nationales
            est reservé aux établissements bénéficiaires selon les conditions
            spécifiques négociées avec chaque éditeur. Pour permettre la déclaration
            des adresses IP autorisées, l'Abes met à la disposition des
            professionnels de la documentation cette application dédiée à la gestion
            des accès.
          </p>
        </v-alert>
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
import FormLogin from "../components/authentification/login/FormLogin.vue";
import ForgotPassword from "../components/authentification/login/ForgotPassword.vue";
import {Logger} from "@/utils/Logger";
import Etablissement from "@/core/Etablissement";
import MessageBox from "@/components/common/MessageBox.vue";

@Component({
  components: {FormLogin, ForgotPassword }
})
export default class App extends Vue {
  forgotPasswordVisible: boolean = false;
  creerCompte(){
    this.$store
        .dispatch("setCurrentEtablissement", new Etablissement())
        .then(() => {
          this.$router.push({ name: "CreationEtablissement" });
        })
        .catch(err => {
          Logger.error(err);
          // this.error = "Impossible de créer un nouvel éditeur : " + err.message;
          // this.alert = true;
        });
  }
}
</script>
