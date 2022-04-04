<template>
  <div>
    <v-card flat>
      <h1>Rechercher dans toute la base</h1>
      <br />
      <v-alert :value="message !== ''" dense type="error">
        {{ message }}
      </v-alert>

      <v-form ref="searchForm">
        <v-row>
          <v-col cols="1" class="d-none d-md-flex"></v-col>
          <v-col cols="12" md="10">
            <v-card-text>
              <v-row class="d-flex justify-center align-center">
                <v-col cols="2" class="pb-0">
                  <v-select
                    outlined
                    :items="listeDomaine"
                    v-model="domaine"
                    placeholder="Domaine de recherche"
                    hide-details="auto"
                    persistent-placeholder
                    required
                    :rules="rulesForm.selectSearchRules"
                  ></v-select>
                </v-col>
                <v-col cols="9" class="pb-0">
                  <v-text-field
                    outlined
                    label="Mots clés"
                    placeholder="Mots clés"
                    hide-details="auto"
                    v-model="criteres"
                    required
                    :rules="rulesForm.searchRules"
                    @keyup.enter="search()"
                  ></v-text-field
                ></v-col>
                <v-col class="pb-0">
                  <v-btn @click="search()" :loading="buttonLoading"
                    >Rechercher</v-btn
                  ></v-col
                >
              </v-row>
              <br />
            </v-card-text> </v-col
        ></v-row>
      </v-form>
      <v-row>
        <v-col cols="1" class="d-none d-md-flex"></v-col>
        <v-col cols="12" md="8" v-if="afficheResultat">
          <h3>Résultats pour "{{ criteres }}" dans {{ domaine }} :</h3>
          <br />
          <div v-if="domaineValide == 'IPs'">
            <v-list dense>
              <v-list-item-group>
                <div v-for="item in resultats" :key="item.id">
                  <v-list-item @click="clickIP(item)">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.ip }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.idAbes }} - {{ item.siren }} -
                        {{ item.nomEtab }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider /></div
              ></v-list-item-group>
            </v-list>
          </div>
          <div v-if="domaineValide == 'Etablissements'">
            <v-list dense>
              <v-list-item-group>
                <div v-for="item in resultats" :key="item.id">
                  <v-list-item @click="clickEtab(item)">
                    <v-list-item-content>
                      <v-list-item-title
                        >{{ item.idAbes }} - {{ item.siren }} -
                        {{ item.nomEtab }} -
                        {{ item.villeContact }}</v-list-item-title
                      >
                      <v-list-item-subtitle
                        >{{ item.nomContact }} {{ item.prenomContact }} -
                        {{ item.mailContact }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider /></div
              ></v-list-item-group>
            </v-list>
          </div>
          <div v-if="domaineValide == 'Editeurs'">
            <v-list dense>
              <v-list-item-group>
                <div v-for="item in resultats" :key="item.id">
                  <v-list-item @click="clickEditeur(item)">
                    <v-list-item-content>
                      <v-list-item-title
                        >{{ item.idEditeur }} - {{ item.nom }} -
                        {{ item.adresse }}</v-list-item-title
                      >
                      <v-list-item-subtitle
                        v-for="contactCommerciaux in item.contactsCommerciaux"
                        :key="contactCommerciaux.id"
                      >
                        {{ contactCommerciaux.nom }}
                        {{ contactCommerciaux.prenom }} -
                        {{ contactCommerciaux.mail }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle
                        v-for="contactTechnique in item.contactsTechniques"
                        :key="contactTechnique.id"
                      >
                        {{ contactTechnique.nom }}
                        {{ contactTechnique.prenom }} -
                        {{ contactTechnique.mail }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider /></div
              ></v-list-item-group>
            </v-list>
          </div>
          <br />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { editeurService } from "@/core/service/licencesnationales/EditeurService";
import { iPService } from "@/core/service/licencesnationales/IPService";
import { rulesForm } from "@/core/RulesForm";

@Component
export default class Recherche extends Vue {
  criteres: string = "";
  domaine: string = "";
  domaineValide: string = "";
  listeDomaine: Array<string> = ["Etablissements", "IPs", "Editeurs"];
  resultats: Array<string> = [];
  message: string = "";
  afficheResultat: boolean = false;
  buttonLoading: boolean = false;
  rulesForm: any = rulesForm;

  search() {
    if (
      (this.$refs.searchForm as Vue & {
        validate: () => boolean;
      }).validate()
    ) {
      const listeCriteres: Array<string> = this.criteres.split(" ");
      this.domaineValide = this.domaine;
      let service;
      switch (this.domaineValide) {
        case "Etablissements":
          service = etablissementService;
          break;
        case "IPs":
          service = iPService;
          break;
        case "Editeurs":
          service = editeurService;
          break;
        default:
          this.message = "Le domaine de recherche est obligatoire";
          return;
      }

      this.buttonLoading = true;
      this.resultats = [];
      service
        .search(listeCriteres, this.$store.getters.getToken())
        .then(res => {
          this.afficheResultat = true;
          res.data.forEach(element => {
            this.resultats.push(element);
          });
        })
        .catch(err => {
          this.message = err.data.message;
        })
        .finally(() => {
          this.buttonLoading = false;
        });
    }
  }

  clickEtab(item): void {
    this.$store
      .dispatch("setCurrentEtablissement", item)
      .then(() => {
        this.$router.push({ name: "AfficherEtablissement" });
      })
      .catch(err => {
        this.message = err.data.message;
        // On glisse sur le message d'erreur
        window.scrollTo(0, 0);
      });
  }

  clickIP(item): void {
    this.$store
      .dispatch("setCurrentEtablissement", item)
      .then(() => {
        this.$router.push({ name: "ListeIP" });
      })
      .catch(err => {
        this.message = err.data.message;
        // On glisse sur le message d'erreur
        window.scrollTo(0, 0);
      });
  }

  clickEditeur(item): void {
    this.$store
      .dispatch("setCurrentEditeur", item)
      .then(() => {
        this.$router.push({ name: "ModifierEditeur" });
      })
      .catch(err => {
        this.message = err.data.message;
        // On glisse sur le message d'erreur
        window.scrollTo(0, 0);
      });
  }
}
</script>
