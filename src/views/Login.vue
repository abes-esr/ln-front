<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col xl="5" lg="7" md="9" xs="11">
        <transition name="fade">
          <form-login
            v-if="!forgotPasswordVisible"
            @onChange="afficherMotDePasseOublie()"
          />
        </transition>

        <transition name="fade">
          <forgot-password v-if="forgotPasswordVisible" />
        </transition>
        <v-row id="row_RevenirAccueil">
          <v-col cols="8"></v-col>
          <transition name="fade">
            <a v-if="forgotPasswordVisible" @click="afficherConnexion()">
              <font-awesome-icon :icon="['fas', 'reply']" />&nbsp;Revenir à la
              page d'accueil
            </a>
          </transition>
        </v-row>
        <div
          id="noAccount"
          v-if="!forgotPasswordVisible"
          class="
            mt-6
            d-flex
            justify-space-around
            flex-column flex-md-row flex-wrap
          "
        >
          <span class="d-block full-width"
            ><h1>Votre établissement n'a pas encore de compte ?</h1></span
          >
          <v-btn
            class="btn-2"
            v-if="!forgotPasswordVisible"
            href="http://documentation.abes.fr/aidelicencesnationales/aidelicencesnationalesTestsUX/index.html#Beneficiaires"
            target="_blank"
            >Vérifier l'éligibilité
            <font-awesome-icon
              :icon="['fas', 'question-circle']"
              class="mx-2"
            />
          </v-btn>

          <v-btn
            class="btn-2"
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
      });
  }

  afficherMotDePasseOublie(): void {
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
