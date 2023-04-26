<template>
  <div>
    <v-container class="d-flex justify-center">
      <v-row align="center" justify="center">
        <v-col xl="5" lg="7" md="9" xs="11">
          <form-login @onChange="afficherMotDePasseOublie()" />

          <div id="noAccount" class="
                                                        mt-6
                                                        d-flex
                                                        justify-space-around
                                                        flex-column flex-md-row flex-wrap
                                                        pb-8
                                                      ">
            <span class="d-block full-width">
              <h1 class="pb-2">
                Votre établissement n'a pas encore de compte ?
              </h1>
            </span>
            <v-btn class="btn-2" href="https://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
              target="_blank">Vérifier l'éligibilité
              <font-awesome-icon :icon="['fas', 'question-circle']" class="mx-2" style="font-size: 1.1rem" />
            </v-btn>
            <!-- DISABLED TEMPORAIRE A SUPPRIMER ENSUITE -->
            <v-btn class="btn-2" disabled @click="creerCompte">Créer un compte
              <font-awesome-icon :icon="['fas', 'plus-circle']" class="mx-2" style="font-size: 1.1rem" />
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <!-- ALERTE TEMPORAIRE A SUPPRIMER ENSUITE -->
    <v-row align="center" justify="center">
      <v-col xl="4" lg="6" md="8" xs="10"><v-alert color="#e3040d" type="warning" border="left" dense>
          La création de compte est indisponible pour le moment suite à un problème technique. <br />
          Le service devrait être à nouveau disponible rapidement. <br />
          Pour plus d'informations, contactez nous via le guichet d'assistance de l'Abes : <a
            href="https://stp.abes.fr/node/3?origine=LicencesNationales">https://stp.abes.fr/node/3?origine=LicencesNationales</a>
        </v-alert></v-col>
    </v-row>
  </div>
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
  public metaInfo(): any {
    return {
      meta: [
        {
          name: "description",
          content: "Page de connexion de l'application des Licences Nationales"
        }
      ],
      title: "Connexion - Licences Nationales"
    };
  }

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
