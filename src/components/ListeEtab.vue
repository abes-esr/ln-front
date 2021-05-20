<template>
  <div>
    <v-card width="100%">
      <v-card-text>
        <v-row>
          <v-col lg="12" md="12" xs="12">
            <v-row>
              <v-col cols="12" sm="12">
                <v-card class="mx-auto" tile>
                  <v-card-title>Liste des Etablissements</v-card-title>
                  <v-row>
                    <v-col cols="1" />
                    <v-col cols="10">
                      <v-data-table
                        dense
                        :headers="headers"
                        :items="etab"
                        class="elevation-1"
                        :search="rechercher"
                      >
                        <template v-slot:top>
                          <v-text-field
                            v-model="rechercher"
                            label="Chercher sur toutes les colonnes"
                            class="mx-4"
                          ></v-text-field>
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                          <v-icon
                            small
                            class="mr-2"
                            @click="modifierEtab(item.id)"
                            >mdi-pencil</v-icon
                          >
                          <v-icon
                            small
                            class="mr-2"
                            @click="listAcces(item.siren)"
                            >mdi-help-circle-outline</v-icon
                          >
                          <v-icon small @click="supprimerEtab(item.siren)"
                            >mdi-delete</v-icon
                          >
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1" />
                    <v-col cols="10">
                      <a @click="$router.push({ path: '/ajouterEtab' })"
                        ><br />Ajouter un établissement</a
                      >
                      <a @click="$router.push({ path: '/ajoutEditeur' })"
                        ><br />Ajouter un éditeur</a
                      >
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <br />
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
    <v-alert dense outlined :value="notification !== ''" type="success">
      {{ notification }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { HTTP } from "../utils/http-commons";
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import moment from "moment";

export default Vue.extend({
  name: "ListeEtab",
  data() {
    return {
      rechercher: "",
      etab: [] as any,
      title: "" as string,
      id: "" as any,
      error: "",
      alert: false,
      headers: [
        {
          text: "Date de création",
          align: "start",
          value: "dateCreation",
          sortable: false
        },
        { text: "SIREN", value: "siren", sortable: false },
        { text: "Etablissement", value: "nomEtab", sortable: false },
        { text: "Type d'établissement", value: "typeEtab", sortable: false },
        { text: "Statut", value: "statut", sortable: false },
        { text: "Action", value: "action", sortable: false }
      ]
    };
  },
  computed: {
    ...mapGetters(["notification"]),

    getUserSiren() {
      return this.$store.state.user.siren;
    }
  },
  mounted() {
    moment.locale("fr");
    (this as any).collecterEtab();
    (this as any).id = (this as any).getIdEtab((this as any).etab);
  },

  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),
    getIdEtab(etab) {
      return {
        id: etab.id
      };
    },
    getAll(): any {
      return HTTP.get("/ln/etablissement/getListEtab");
    },
    collecterEtab(): any {
      (this as any)
        .getAll()
        .then(response => {
          (this as any).etab = response.data.map((this as any).affichageEtab);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    affichageEtab(etab) {
      return {
        id: etab.id,
        dateCreation:
          moment(etab.dateCreation).format("L") +
          " " +
          moment(etab.dateCreation).format("LTS,MS"),
        siren: etab.siren,
        nomEtab: etab.name,
        typeEtab: etab.typeEtablissement,
        statut: etab.valide ? "Validé" : "En validation"
      };
    },
    supprimerEtab(siren): void {
      console.log(siren);
      HTTP.delete("/ln/etablissement/suppression/" + siren)
        .then(response => {
          (this as any).refreshList();
          console.log("notification = " + response.data);
          (this as any).setNotification(response.data);
        })
        .catch(err => {
          (this as any).error = err.response.data;
          (this as any).alert = true;
        });
    },
    refreshList(): void {
      (this as any).collecterEtab();
    },
    modifierAcces(id): void {
      this.$router.push({ name: "ModifierEtab", params: { id: id } });
    }
  },
  destroyed() {
    (this as any).setNotification("");
  }
});
</script>
<style>
.list {
  max-width: 750px;
}
</style>
