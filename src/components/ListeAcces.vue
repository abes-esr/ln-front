<template>
  <div>
    <v-card width="100%">
      <v-card-text>
        <v-row>
          <v-col lg="12" md="12" xs="12">
            <v-row>
              <v-col cols="12" sm="12">
                <v-card class="mx-auto" tile>
                  <v-card-title>Liste des Accès</v-card-title>
                  <v-row>
                    <v-col cols="1" />
                    <v-col cols="10">
                      <v-data-table
                        dense
                        :headers="headers"
                        :items="acces"
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
                            @click="modifierAcces(item.id, item.typeAcces)"
                            >mdi-pencil</v-icon
                          >
                          <!--                      <v-icon small class="mr-2" @click="analyserAcces(item.id)"
                            >mdi-help-circle-outline</v-icon
                          >-->
                          <v-icon small @click="supprimerAcces(item.id)"
                            >mdi-delete</v-icon
                          >
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1" />
                    <v-col cols="10">
                      <a @click="$router.push({ path: '/ajouterAcces/ip' })"
                        ><br />Ajouter une adresse IP</a
                      >
                      <a @click="$router.push({ path: '/ajouterAcces/plage' })"
                        ><br />Ajouter une plage d'adresses IP</a
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
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { IpChangeEvent, ListeAccesEvent } from "@/main";

export default Vue.extend({
  name: "ListeAcces",
  data() {
    return {
      rechercher: "",
      acces: [] as any,
      title: "" as string,
      id: "" as string,
      error: "",
      alert: false,
      sirenEtabSiAdmin: "" as string,
      headers: [
        {
          text: "Date de création",
          align: "start",
          value: "dateCreation",
          sortable: false
        },
        {
          text: "Date de modification",
          value: "dateModification",
          sortable: false
        },
        {
          text: "Type d'accès" as any,
          value: "typeAcces" as any,
          sortable: false
        },
        {
          text: "Type d'IP" as any,
          value: "typeIp" as any,
          sortable: false
        },
        { text: "Valeur" as any, value: "ip" as any, sortable: false },
        {
          text: "Statut" as any,
          value: "statut" as any,
          sortable: false
        },
        { text: "Action", value: "action", sortable: false }
      ]
    };
  },
  computed: {
    ...mapGetters(["notification"]),

    getUserSiren() {
      return this.$store.state.user.siren;
    },
    isAdmin() {
      console.log("role = " + this.$store.state.user.isAdmin);
      return this.$store.state.user.isAdmin;
    }
  },
  mounted() {
    moment.locale("fr");
    const onlisteAccesEventHandler = siren => {
      (this as any).sirenEtabSiAdmin = siren;
      console.log(
        `Event Handler sirenEtabSiAdmin =  ` + (this as any).sirenEtabSiAdmin
      );
    };
    ListeAccesEvent.$on("listeAccesEvent", onlisteAccesEventHandler);
    (this as any).collecterAcces();
    (this as any).id = (this as any).getIdAcces((this as any).acces);

    if (this.isAdmin === "true") {
      console.log("getAll - isAdmin");
      console.log(
        "(this as any).sirenEtabSiAdmin = " + (this as any).sirenEtabSiAdmin
      );
      return HTTP.get("/ln/ip/ipsEtab/" + (this as any).sirenEtabSiAdmin);
    } else {
      console.log("getAll - pas Admin");
      console.log("this.getUserSiren = " + this.getUserSiren);
      return HTTP.get("/ln/ip/" + this.getUserSiren);
    }
  },

  methods: {
    ...mapActions({
      setNotification: "setNotification"
    }),
    getIdAcces(acces) {
      return {
        id: acces.id
      };
    },
    getAll() {
      if (this.isAdmin === "true") {
        console.log("getAll - isAdmin");
        console.log(
          "(this as any).sirenEtabSiAdmin = " + (this as any).sirenEtabSiAdmin
        );
        return HTTP.get("/ln/ip/ipsEtab/" + (this as any).sirenEtabSiAdmin);
      } else {
        console.log("getAll - pas Admin");
        console.log("this.getUserSiren = " + this.getUserSiren);
        return HTTP.get("/ln/ip/" + this.getUserSiren);
      }
    },
    collecterAcces(): void {
      (this as any)
        .getAll()
        .then(response => {
          (this as any).acces = response.data.map((this as any).affichageAcces);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    affichageAcces(acces) {
      return {
        id: acces.id,
        dateCreation:
          moment(acces.dateCreation).format("L") +
          " " +
          moment(acces.dateCreation).format("LTS,MS"),
        dateModification: (this as any).getDateModification(acces),
        typeAcces: acces.typeAcces,
        typeIp: acces.typeIp,
        ip: acces.ip,
        statut: acces.validee ? "Validée" : "En validation"
      };
    },
    getDateModification(acces) {
      if (acces.dateModification === null) return acces.dateModification;
      else
        return (
          moment(acces.dateModification).format("L") +
          " " +
          moment(acces.dateModification).format("LTS,MS")
        );
    },
    supprimerAcces(id): void {
      console.log("id = " + id);
      HTTP.post("/ln/ip/supprime", {
        id: id,
        siren: this.getUserSiren
      })
        .then(response => {
          (this as any).refreshList();
          console.log("notification = " + response.data);
          (this as any).setNotification(response.data);
          console.log("notification = " + this.$store.state.notification);
        })
        .catch(err => {
          (this as any).error = err.response.data;
          (this as any).alert = true;
        });
    },
    refreshList(): void {
      (this as any).collecterAcces();
    },
    modifierAcces(id, typeAcces) {
      this.$router.push({
        name: "ModifierAcces",
        params: { id: id, typeAcces: typeAcces }
      });
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
