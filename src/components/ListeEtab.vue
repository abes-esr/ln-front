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
                            @click="listeAcces(item.siren)"
                            >mdi-ip-network</v-icon
                          >
                          <v-icon
                            small
                            @click.stop="openDialogSuppression(item.siren)"
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

    <!-- Popup de suppression -->
    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Supprimer un établissement
          </v-card-title>

          <v-card-text>
            Vous êtes sur le point de supprimer l'établissement :
            {{ currentSirenToDelete }}. Êtes vous sûr ? Veuillez indiquer le
            motif de la suppresion :
            <v-textarea
              outlined
              label="Motif suppression"
              v-model="motifSuppression"
            ></v-textarea>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              Annuler
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="
                dialog = false;
                supprimerEtab();
              "
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
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
          sortable: true
        },
        { text: "ID Abes", value: "idAbes", sortable: true },
        { text: "SIREN", value: "siren", sortable: true },
        { text: "Etablissement", value: "nomEtab", sortable: true },
        { text: "Type d'établissement", value: "typeEtab", sortable: true },
        { text: "Statut", value: "statut", sortable: true },
        { text: "Action", value: "action", sortable: false }
      ],
      dialog: false,
      currentSirenToDelete: "",
      motifSuppression: ""
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
      setNotification: "setNotification",
      setSirenEtabSiAdmin: "setSirenEtabSiAdmin"
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
        dateCreation: moment(etab.dateCreation).format("L"),
        idAbes: etab.idAbes,
        siren: etab.siren,
        nomEtab: etab.name,
        typeEtab: etab.typeEtablissement,
        statut: etab.valide ? "Validé" : "En validation"
      };
    },
    listeAcces(siren): void {
      (this as any).setSirenEtabSiAdmin(siren);
      this.$router.push({
        name: "ListeAcces"
      });
    },
    openDialogSuppression(siren): void {
      (this as any).dialog = true;
      (this as any).currentSirenToDelete = siren;
      //(this as any).supprimerEtab(siren);
    },
    supprimerEtab(): void {
      HTTP.post(
        "/ln/etablissement/suppression/" + (this as any).currentSirenToDelete,
        { motif: (this as any).motifSuppression }
      )
        .then(response => {
          (this as any).refreshList();
          console.log("notification = " + response.data);
          (this as any).setNotification(response.data);
        })
        .catch(err => {
          (this as any).error = err.response.data;
          (this as any).alert = true;
        });
      (this as any).currentSirenToDelete = "";
      (this as any).motifSuppression = "";
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
