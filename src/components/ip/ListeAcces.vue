<template>
  <div>
    <v-card flat>
      <v-row>
        <v-col lg="12" md="12" xs="12">
          <v-row>
            <v-col cols="12" sm="12">
              <v-row>
                <h1>Liste des IP déclarées</h1>
              </v-row>
              <v-row>
                <v-col cols="12" sm="8"></v-col>
                <v-col cols="12" sm="2">
                  <v-btn @click="$router.push({ path: '/ajouterAcces/' })"
                    ><span class="btnText"
                      >Ajouter une adresse ou une plage IP</span
                    >
                    <font-awesome-icon :icon="['fas', 'plus-circle']"/></v-btn
                ></v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-alert
                    dense
                    :value="error !== ''"
                    type="error"
                    v-html="error"
                  >
                  </v-alert>
                  <v-alert dense :value="notification !== ''" type="success">
                    {{ notification }}
                  </v-alert>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <v-data-table
                          id="mytable"
                          :key="refreshKey"
                          :headers="headers"
                          :items="filteredAccesByStatut"
                          :items-per-page="30"
                          :item-class="RowClasses"
                          :search="rechercher"
                          flat
                        >
                          <template v-slot:[header.statut="{ header }">
                            {{ header.texte }}
                            <v-menu offset-y :close-on-content-click="false">
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                  <v-icon
                                    small
                                    :color="statut ? 'primary' : ''"
                                  >
                                    mdi-filter
                                  </v-icon>
                                </v-btn>
                              </template>
                              <div
                                style="background-color: white; width: 280px"
                              >
                                <v-card-actions
                                  ><v-select
                                    v-model="statut"
                                    label="Selectionnez le statut"
                                    outlined
                                    :items="selectStatut"
                                  ></v-select
                                ></v-card-actions>
                              </div>
                            </v-menu>
                          </template>
                          <template v-slot:top>
                            <v-row>
                              <v-col cols="12" sm="6"></v-col>
                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="rechercher"
                                  label="Chercher dans les colonnes"
                                  class="mx-4"
                                  prepend-inner-icon="mdi-magnify"
                                  outlined
                                  clearable
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-tooltip top max-width="20vw" open-delay="100">
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    text
                                    @click="downloadIPs()"
                                    class="mx-2 text-lowercase bouton-simple"
                                    v-on="on"
                                    ><span class="text-uppercase">T</span
                                    >élécharger la liste des
                                    <span class="text-uppercase">IP</span>
                                    <font-awesome-icon
                                      :icon="['fas', 'download']"
                                      class="mx-2"
                                  /></v-btn>
                                </template>
                                <span
                                  >Le téléchargement correspond à la vue
                                  filtrée</span
                                >
                              </v-tooltip>
                            </v-row>
                          </template>
                          <template v-slot:[`item.statut`]="{ item }">
                            <td>
                              {{ item.statut }}
                              <font-awesome-icon
                                :icon="['fas', 'info-circle']"
                              />
                            </td>
                          </template>
                          <template v-slot:[`item.action`]="{ item }">
                            <v-btn
                              v-if="isAdmin"
                              class="ma-0 pa-0 bouton-simple "
                              icon
                              title="Analyser"
                              @click.stop="openDialog(item)"
                            >
                              <font-awesome-icon :icon="['fas', 'search']"
                            /></v-btn>
                            <v-btn
                              v-else
                              class="ma-0 pa-0 bouton-simple "
                              icon
                              :loading="buttlonLoading"
                              title="Supprimer"
                              @click="supprimerIP(item.id)"
                            >
                              <font-awesome-icon :icon="['fas', 'trash-alt']"
                            /></v-btn>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>
                        <div
                          style="float: right;"
                          class="actions"
                          v-if="isAdmin"
                        >
                          <v-btn @click="clearActions" class="btn-6"
                            ><span class="btnText">Annuler</span>
                          </v-btn>
                          <v-btn
                            @click="dispatchAllAction"
                            :loading="buttlonLoading"
                            ><span class="btnText"
                              >Enregistrer mes actions</span
                            >
                            <font-awesome-icon
                              :icon="['fas', 'arrow-circle-right']"
                          /></v-btn>
                        </div> </v-col
                    ></v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-col cols="12" style="padding: 24px;">
      <v-row>
        <v-col cols="1" xs="0"/>
        <v-col cols="10" xs="12"> <infos-i-ps></infos-i-ps></v-col></v-row
    ></v-col>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>
          Analyse de l'adresse IP
        </v-card-title>
        <v-card-text>
          <h3>Commentaire</h3>
          <span>{{ currentIP.commentaires }}</span>
          <span v-if="currentIP.commentaires === null">Aucun commentaire</span>
          <br />
          <h3>Whois</h3>
          <v-expansion-panels focusable accordion>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span v-if="checkIfWhoIsRenater(whoIs)"
                  >L'adresse <span v-if="whoIs2 !== ''">de début </span>fait
                  partie du réseau RENATER
                  <span style="padding: 5px;" /><font-awesome-icon
                    :icon="['fas', 'check']"
                  />
                </span>
                <span v-else
                  >L'adresse <span v-if="whoIs2 !== ''">de début </span> ne fait
                  pas partie du réseau RENATER<span
                    style="padding: 5px;"
                  /><font-awesome-icon :icon="['fas', 'times']" />
                </span>
                Afficher/Cacher WhoIS
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p><span v-html="highlightRenater(whoIs)"></span></p>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel v-if="whoIs2 !== ''">
              <v-expansion-panel-header>
                <span v-if="checkIfWhoIsRenater(whoIs2)"
                  >L'adresse de fin fait partie du réseau RENATER
                  <span style="padding: 5px;" /><font-awesome-icon
                    :icon="['fas', 'check']"
                  />
                </span>
                <span v-else
                  >L'adresse de fin ne fait pas partie du réseau RENATER<span
                    style="padding: 5px;"
                  /><font-awesome-icon :icon="['fas', 'times']" />
                </span>
                Afficher/Cacher WhoIS
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p><span v-html="highlightRenater(whoIs2)"></span></p>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <br />
          <h3>Commentaire admin</h3>
          <v-textarea
            hide-details
            outlined
            auto-grow
            rows="2"
            label="Raisons de la suppression"
            v-model="commentaires"
            clearable
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <div style="float: right" class="actions">
                <v-btn
                  @click="
                    dialog = false;
                    currentIPid = '';
                  "
                  class="btn-6"
                >
                  Annuler
                </v-btn>
                <v-btn @click="addActionToBuffer('SUPPRIMER')" class="btn-5">
                  Supprimer
                </v-btn>
                <v-btn @click="addActionToBuffer('REJETER')" class="btn-2">
                  Rejeter
                </v-btn>
                <v-btn @click="addActionToBuffer('VALIDER')" class="btn-4">
                  Valider
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import { Logger } from "@/utils/Logger";
import { iPService } from "@/core/service/licencesnationales/IPService";
import { Message, MessageType } from "@/core/CommonDefinition";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { AxiosResponse } from "axios";
import InfosIPs from "@/components/ip/InfosIPs.vue";

const ListeAccesProps = Vue.extend({
  props: {
    sirenEtabSiAdmin: {
      type: String,
      default: ""
    }
  }
});

@Component({
  components: { InfosIPs }
})
export default class ListeAcces extends ListeAccesProps {
  refreshKey: number = 0;
  statut: string = "";
  selectStatut: Array<string> = ["En validation", "Validée", ""];
  rechercher: string = "";
  acces: Array<any> = [];
  title: string = "";
  id: string = "";
  whoIs: string = "";
  whoIs2: string = "";
  currentIP: any = "";
  bufferActions: Array<any> = [];
  error: string = "";
  dialog: boolean = false;
  buttlonLoading: boolean = false;
  notification: string = "";
  commentaires: string = "";
  headers = [{}];

  get getUserSiren() {
    return this.$store.state.user.siren;
  }

  get isAdmin() {
    return this.$store.getters.isAdmin();
  }

  get filteredAccesByStatut(): string[] {
    const conditions = [] as any;
    if (this.statut) {
      conditions.push(this.filterStatut);
    }
    if (conditions.length > 0) {
      return this.acces.filter(acces => {
        return conditions.every(condition => {
          return condition(acces);
        });
      });
    }
    return this.acces;
  }

  mounted() {
    moment.locale("fr");
    this.collecterAcces();
    this.id = this.getIdAcces(this.acces);
    this.setHeaders();
  }

  setHeaders() {
    if (this.isAdmin) {
      this.headers = [
        {
          text: "Date de saisie",
          align: "start",
          value: "dateCreation",
          sortable: true
        },
        {
          text: "Type d'IP",
          value: "typeAcces",
          sortable: true
        },
        {
          text: "Type d'IP",
          value: "typeIp",
          sortable: true
        },
        { text: "Valeur", value: "ip", sortable: true },
        { text: "Statut", value: "statut", sortable: true },
        {
          text: "Action admin",
          value: "dateModification",
          sortable: true
        },
        { text: "Commentaires", value: "commentaires", sortable: true },
        { text: "Action", value: "buffer", sortable: false },
        { text: "Examiner", value: "action", sortable: false }
      ];
    } else {
      this.headers = [
        {
          text: "Date de saisie",
          align: "start",
          value: "dateCreation",
          sortable: true
        },
        {
          text: "Type d'IP",
          value: "typeAcces",
          sortable: true
        },
        {
          text: "Type d'IP",
          value: "typeIp",
          sortable: true
        },
        { text: "Valeur", value: "ip", sortable: true },
        { text: "Statut", value: "statut", sortable: true },
        {
          text: "Action admin",
          value: "dateModification",
          sortable: true
        },
        { text: "Commentaires", value: "commentaires", sortable: true },
        { text: "Supprimer", value: "action", sortable: false }
      ];
    }
  }

  getIdAcces(acces): any {
    return {
      id: acces.id
    };
  }

  filterStatut(statutRecherche) {
    return statutRecherche.statut.toString().includes(this.statut);
  }

  getAll() {
    if (this.isAdmin)
      return iPService.getListIPEtab(
        this.$store.getters.getToken(),
        this.$store.getters.getCurrentEtablissement().siren
      );
    else
      return iPService.getListIP(
        this.$store.getters.getToken(),
        this.getUserSiren
      );
  }

  collecterAcces(): void {
    this.getAll()
      .then(response => {
        this.acces = response.data.map(this.affichageAcces);
      })
      .catch(err => {
        Logger.error(err);
        this.error = err.response.data.message;
      });
  }

  affichageAcces(acces) {
    return {
      id: acces.id,
      dateCreation: moment(acces.dateCreation).format("L"),
      dateModification: this.getDateModification(acces),
      typeAcces: acces.typeAcces,
      typeIp: acces.typeIp,
      ip: acces.ip,
      statut: acces.statut,
      commentaires: acces.commentaires
    };
  }

  getDateModification(acces) {
    if (acces.dateModification === null) return acces.dateModification;
    else return moment(acces.dateModification).format("L");
  }

  openDialog(item): void {
    this.clearAlerts();
    this.fetchwhoIs(item);
    this.dialog = true;
    this.currentIP = item;
  }

  fetchwhoIs(item): void {
    this.whoIs = "";
    this.whoIs2 = "";

    if (item.typeAcces === "ip") {
      iPService
        .getWhoIs(this.$store.getters.getToken(), item.ip)
        .then(res => {
          this.whoIs = res.data;
        })
        .catch(() => {
          Logger.error("Impossible d'exécuter le WhoIS");
        });
    } else {
      const ips = this.splitRangeIntoIPs(item.typeIp, item.ip);
      iPService
        .getWhoIs(this.$store.getters.getToken(), ips[0])
        .then(res => {
          this.whoIs = res.data;
        })
        .catch(() => {
          Logger.error("Impossible d'exécuter le WhoIS");
        });
      iPService
        .getWhoIs(this.$store.getters.getToken(), ips[1])
        .then(res => {
          this.whoIs2 = res.data;
        })
        .catch(() => {
          Logger.error("Impossible d'exécuter le WhoIS");
        });
    }
  }

  splitRangeIntoIPs(typeIP: string, range: string): string[] {
    let ip1 = "";
    let ip2 = "";
    if (typeIP === "IPV4") {
      range.split(".").forEach(element => {
        if (element.includes("-")) {
          const tabSplit = element.split("-");
          ip1 += "." + tabSplit[0];
          ip2 += "." + tabSplit[1];
        } else {
          ip1 += "." + element;
          ip2 += "." + element;
        }
      });
    } else {
      range.split(":").forEach(element => {
        if (element.includes("-")) {
          const tabSplit = element.split("-");
          ip1 += ":" + tabSplit[0];
          ip2 += ":" + tabSplit[1];
        } else {
          ip1 += ":" + element;
          ip2 += ":" + element;
        }
      });
    }

    ip1 = ip1.substring(1);
    ip2 = ip2.substring(1);
    return [ip1, ip2];
  }

  checkIfWhoIsRenater(whoIs: string): boolean {
    if (whoIs.toLowerCase().includes("renater")) {
      return true;
    }
    return false;
  }

  highlightRenater(whoIs: string) {
    return whoIs
      .replaceAll("renater", "<mark>renater</mark>")
      .replaceAll("RENATER", "<mark>RENATER</mark>");
  }

  dispatchAllAction(): void {
    this.updateIP()
      .then(() => {
        this.notification = "Actions effectuées";
      })
      .catch(err => {
        Logger.debug(err);
        this.error = err.response.data.message;
      })
      .finally(() => {
        this.collecterAcces();
        this.clearActions();
        this.buttlonLoading = false;
      });
  }

  updateIP(): Promise<AxiosResponse> {
    this.buttlonLoading = true;
    return iPService.updateIP(
      this.$store.getters.getToken(),
      this.$store.getters.getCurrentEtablissement().siren,
      this.bufferActions
    );
  }

  addActionToBuffer(action: string): void {
    this.bufferActions.push({
      idIp: this.currentIP.id,
      action: action,
      ip: this.currentIP.ip,
      commentaireAdmin: this.commentaires
    });
    this.addActionToDatatable(action, this.currentIP.id);
    this.dialog = false;
    this.refreshKey++;
  }

  addActionToDatatable(action: string, id: number) {
    this.acces.forEach(element => {
      if (element.id === id) {
        element.buffer = action;
      }
    });
  }

  // Suppression par un USER
  supprimerIP(ip: string) {
    this.buttlonLoading = true;
    this.clearAlerts();

    iPService
      .updateIP(
        this.$store.getters.getToken(),
        this.$store.getters.getCurrentEtablissement().siren,
        [{ idIp: ip, action: "SUPPRIMER" }]
      )
      .then(() => {
        this.notification = "IP supprimée.";
      })
      .catch(err => {
        Logger.error = err;
        this.error = err.message;
      })
      .finally(() => {
        this.buttlonLoading = false;
        this.collecterAcces();
      });
  }

  RowClasses(item) {
    let action = "";
    this.bufferActions.forEach(element => {
      if (element.ip === item.ip) {
        action = element.action;
      }
    });
    return action;
  }

  clearActions() {
    this.bufferActions = [];
    this.refreshKey++;
    this.acces.forEach(element => {
      if (element.buffer !== undefined) {
        delete element.buffer;
      }
    });
  }

  clearAlerts() {
    this.notification = "";
    this.error = "";
  }

  getSirenEtabSujet() {
    if (this.isAdmin)
      return this.$store.getters.getCurrentEtablissement().siren;
    else return this.getUserSiren;
  }

  downloadIPs(): void {
    this.$store.dispatch("closeDisplayedMessage");
    iPService
      .downloadIPs(this.getSirenEtabSujet(), this.$store.state.user.token)
      .then(response => {
        const fileURL = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/csv" })
        );
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", "export.csv");
        document.body.appendChild(fileLink);

        fileLink.click();
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesBadRequestApiError) {
          message.texte = err.message;
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;

        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
      });
  }
}
</script>

<style src="./style.css"></style>
<style>
h3 {
  padding-top: 10px;
}
.row {
  margin: 0 !important;
}
.btnText {
  padding-right: 5px;
}
.actions .v-btn {
  margin: 5px;
}

.VALIDER {
  background-color: #1cd74b60;
}

.SUPPRIMER {
  background-color: #ee492e4d;
}

.REJETER {
  background-color: #155fab47;
}
</style>
