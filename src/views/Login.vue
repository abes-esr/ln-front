<template>
  <v-container class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col xl="5" lg="7" md="9" xs="11">
        <form-login @onChange="afficherMotDePasseOublie()" />

        <div
          id="noAccount"
          class="
            mt-6
            d-flex
            justify-space-around
            flex-column flex-md-row flex-wrap
            pb-8
          "
        >
          <span class="d-block full-width"
            ><h1 class="pb-2">
              Votre établissement n'a pas encore de compte ?
            </h1></span
          >
          <v-btn
            class="btn-2"
            href="https://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
            target="_blank"
            >Vérifier l'éligibilité
            <font-awesome-icon
              :icon="['fas', 'question-circle']"
              class="mx-2"
              style="font-size: 1.1rem"
            />
          </v-btn>

          <v-btn class="btn-2" @click="creerCompte"
            >Créer un compte
            <font-awesome-icon
              :icon="['fas', 'plus-circle']"
              class="mx-2"
              style="font-size: 1.1rem"
            />
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormLogin from "../components/authentification/login/FormLogin.vue";
import { Logger } from "@/utils/Logger";
import Etablissement from "@/core/Etablissement";

@Component({
  components: { FormLogin }
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
    this.$router.push({ name: "ForgotPassword" });
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
