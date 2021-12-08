<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <v-alert dense outlined>
          <font-awesome-icon
            :icon="['fas', 'exclamation-triangle']"
            class="mx-2 icone-attention"
          />
          <h4>
            Application réservée aux établissements bénéficiaires
          </h4>
          <p id="WarningLogin">
            <strong>Important : </strong>L'accès aux corpus sous licences
            nationales est reservé aux établissements bénéficiaires selon les
            conditions spécifiques négociées avec chaque éditeur. Pour permettre
            la déclaration des adresses IP autorisées, l'Abes met à la
            disposition des professionnels de la documentation cette application
            dédiée à la gestion des accès.
          </p>
        </v-alert>
        <transition name="fade">
          <form-login v-if="!forgotPasswordVisible" @onChange="afficherMotDePasseOublie()" />
        </transition>

        <transition name="fade">
          <forgot-password v-if="forgotPasswordVisible" />
        </transition>

        <transition name="fade">
          <a
            v-if="forgotPasswordVisible"
            @click="afficherConnexion()"
            >Revenir au formulaire de connexion</a
          >
        </transition>
        <div
          id="noAccount"
          v-if="!forgotPasswordVisible"
          class="mt-6 d-flex justify-space-around flex-column flex-md-row flex-wrap"
        >
          <span class="d-block full-width"
            >Votre établissement n'a pas encore de compte ?</span
          >
          <v-btn
            class="bouton-simple elevation-0"
            v-if="!forgotPasswordVisible"
            href="http://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
            target="_blank"
            >Vérifier l'éligibilité
            <font-awesome-icon :icon="['fas', 'question-circle']" class="mx-2" />
          </v-btn>

          <v-btn
            class="bouton-simple elevation-0"
            v-if="!forgotPasswordVisible"
            @click="creerCompte"
            >Créer un compte
            <font-awesome-icon :icon="['fas', 'plus-circle']" class="mx-2" />
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormLogin from "../components/authentification/login/FormLogin.vue";
import ForgotPassword from "../components/authentification/login/ForgotPassword.vue";
import { Logger } from "@/utils/Logger";
import Etablissement from "@/core/Etablissement";
import MessageBox from "@/components/common/MessageBox.vue";

@Component({
  components: { FormLogin, ForgotPassword }
})
export default class App extends Vue {
  forgotPasswordVisible: boolean = false;
  creerCompte(): void {
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

  afficherMotDePasseOublie() : void {
    this.$store.dispatch("closeDisplayedMessage");
    this.forgotPasswordVisible = true;
  }

  afficherConnexion(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.forgotPasswordVisible = false;
  }
}
</script>
<style scoped lang="scss">
h4 {
  display: inline;
}

@import '~vuetify/src/styles/settings/_variables';
@media #{map-get($display-breakpoints, 'md-and-up')} {
  #noAccount {
    width: 50%;
  }
}

.full-width {
  width: 100%;
}
</style>
