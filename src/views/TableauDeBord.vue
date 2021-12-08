<template>
  <v-card flat>
    <h1>Tableau de bord {{ etablissement.nom }}</h1>
    <MessageBox></MessageBox>
    <v-container class="mx-9 elevation-0">
      <v-card-title class="px-0">Information du compte  <font-awesome-icon
          :icon="['fas', 'download']"
          class="mx-2 fa-sm"
      /></v-card-title>
      <span>Compte créé le : {{ etablissement.dateCreation.toLocaleDateString() }}</span>
      <v-row class="d-flex justify-space-between flex-wrap">
        <v-col
          cols="12"
          md="3"
          lg="3"
          xl="3"
          class="d-flex align-content-start justify-center flex-wrap"
        >
          <v-card-title class="d-block titre-block"></v-card-title>
          <v-card-text class="d-flex justify-space-between flex-column">
            <div class="d-flex justify-space-between align-center">
              <h2 class="my-3">Etablissement</h2>
              <font-awesome-icon
                :icon="['fas', 'lock']"
                class="fa-2x mx-2"
                v-if="!isAdmin"
              />
            </div>
            <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
              <div>
                <h3 class="d-inline">Siren :</h3>
                {{ etablissement.siren }}
              </div>
              <div>
                <h3 class="d-inline">ID Abes :</h3>
                {{ etablissement.idAbes }}
              </div>
              <div>
                <h3 class="d-inline">Nom :</h3>
                {{ etablissement.nom }}
              </div>
              <div>
                <h3 class="d-inline">Type :</h3>
                {{ etablissement.typeEtablissement }}
              </div>
            </div>
            <v-alert outlined>
              <font-awesome-icon
                :icon="['fas', 'info-circle']"
                class="fa-2x mr-5 mb-1 icone-information"
              />
              Pour toute demande de modification des infos de l'établissement,
              nous contacter via le guichet d'assistance
              <v-btn
                class="bouton-simple elevation-0 pa-0"
                href="http://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
                target="_blank"
                >ABESstp
              </v-btn>
            </v-alert>
          </v-card-text>
        </v-col>
        <v-col
          cols="12"
          md="3"
          lg="3"
          xl="3"
          class="d-flex align-content-start justify-center flex-wrap"
        >
          <v-card-title class="d-block titre-block"></v-card-title>
          <v-card-text class="d-flex justify-space-between flex-column">
            <div class="d-flex justify-space-between align-center">
              <h2 class="my-3">Contact</h2>
            </div>
            <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
              <div>
                <h3 class="d-inline">Nom :</h3>
                {{ etablissement.contact.nom }}
              </div>
              <div>
                <h3 class="d-inline">Prénom :</h3>
                {{ etablissement.contact.prenom }}
              </div>
              <div>
                <h3 class="d-inline">Tél :</h3>
                {{ etablissement.contact.telephone }}
              </div>
              <div>
                <h3 class="d-inline">Email :</h3>
                {{ etablissement.contact.mail }}
              </div>
              <div>
                <h3 class="d-inline">Adresse :</h3>
                {{ etablissement.contact.adresse }}
              </div>
              <div>
                <h3 class="d-inline">BP :</h3>
                {{ etablissement.contact.boitePostale }}
              </div>
              <div>
                <h3 class="d-inline">Code postal :</h3>
                {{ etablissement.contact.codePostal }}
              </div>
              <div>
                <h3 class="d-inline">Ville :</h3>
                {{ etablissement.contact.ville }}
              </div>
              <div>
                <h3 class="d-inline">Cedex :</h3>
                {{ etablissement.contact.cedex }}
              </div>
            </div>
            <v-row class="text-right">
              <v-col>
                <v-btn class="btn-2" @click="allerAMonProfil()"
                  >Modifier mon contact</v-btn
                ></v-col
              >
              <v-col>
                <v-btn class="btn-2" @click="allerAModifierMotDePasse()"
                  >Modifier mon mot de passe</v-btn
                ></v-col
              >
            </v-row>
          </v-card-text>
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="6"
          xl="6"
          class="d-flex align-content-start justify-center flex-wrap"
        >
          <v-card-title class="d-block titre-block" style="margin-bottom:-4px;">
            <font-awesome-icon :icon="['fas', 'bell']" class="fa-lg mx-2 icone-standard" />
            Notifications</v-card-title
          >
          <v-card-text class="d-flex justify-space-between flex-column">
            <div class="d-flex flex-column justify-start mx-3 my-3  bloc-info">
              Fonctionnalité à venir
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MessageBox from "@/components/common/MessageBox.vue";
import Etablissement from "@/core/Etablissement";
import { Action } from "@/core/CommonDefinition";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { Logger } from "@/utils/Logger";

@Component({
  components: { MessageBox }
})
export default class Home extends Vue {
  etablissement: Etablissement;
  Action: any = Action;
  isAdmin: boolean = this.$store.getters.isAdmin();

  constructor() {
    super();
    this.etablissement = this.getEtablissement;
    this.$store.dispatch("setCurrentEtablissement", this.etablissement);
  }

  get getEtablissement(): Etablissement {
    return this.$store.getters.getEtablissementConnecte();
  }

  allerAMonProfil(): void {
    this.$router.push({ name: "Profil" });
  }

  allerAModifierMotDePasse(): void {
    this.$router.push({ name: "Password" }).catch(err => {
      Logger.error(err);
    });
  }
}
</script>
<style scoped lang="scss">
.container {
  width: auto !important;
}

.block-content {
  height: 100%;
}

.bloc-info div {
  margin-top: 1rem;
}

.titre-block {
  width: 100%;
  min-height: 60px;
}
</style>
