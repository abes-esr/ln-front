<template>
  <div>
    <v-card flat>
      <v-alert :value="alert" dense type="error"> {{ error }} </v-alert>
      <v-alert :value="alertSuccess" dense type="success">
        {{ success }}
      </v-alert>
      <v-form ref="formModuleSegmentsIpPlage" lazy-validation>
        <v-app-bar dense flat class="barIp">
          <span v-if="this.typeAcces === 'ip'">Saisir une adresse IP</span>
          <span v-else>Saisir une plage d'adresses IP</span>
          <span v-if="this.typeIp === 'IPV4'">v4</span>
          <span v-else>v6</span>
        </v-app-bar>
        <v-card-text flat class="overflow-auto">
          <v-row class="ma-0">
            <v-col class="py-0">
              <p class="caption mb-0">
                Possibilité de copier/coller directement les IP dans les champs
                de saisie
              </p>
              <v-row v-if="this.typeAcces === 'ip'">
                <v-col class="pb-0">
                  <!-- IP v4 -->
                  <v-row v-if="this.typeIp === 'IPV4'">
                    <v-col v-for="(value, index) in ipv4Segments" :key="index">
                      <v-text-field
                        :data-length="value.length"
                        :data-index="index"
                        :rules="rulesForm.ipv4SegmentsRules"
                        :placeholder="getLabelSegmentsIpv4(index)"
                        ref="ipv4Segments"
                        v-model="ipv4Segments[index].value"
                        v-bind:suffix="getSuffix(index)"
                        @input="
                          nextSegment(index, ipv4Segments, 'ipv4Segments')
                        "
                        @paste="onPasteIp"
                        @paste.prevent
                        dense
                        outlined
                        required
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- IP v6 -->
                  <v-row v-else>
                    <v-col v-for="(value, index) in ipv6Segments" :key="index">
                      <v-text-field
                        :data-length="value.length"
                        :data-index="index"
                        :rules="rulesForm.ipv6SegmentsRules"
                        :placeholder="getLabelSegmentsIpv6(index)"
                        ref="ipv6Segments"
                        v-model="value.value"
                        v-bind:suffix="getSuffix(index)"
                        @input="
                          nextSegment(index, ipv6Segments, 'ipv6Segments')
                        "
                        @paste="onPasteIp"
                        @paste.prevent
                        dense
                        outlined
                        required
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <!-- PLAGE IP v4 -->
                  <div v-if="this.typeIp === 'IPV4'">
                    <v-row>
                      <v-col
                        v-for="(value, index) in ipv4SegmentsPlageDebut"
                        :key="index"
                        class="pb-0"
                      >
                        <v-text-field
                          :data-length="value.length"
                          :data-index="index"
                          :rules="rulesForm.ipv4SegmentsRules"
                          :placeholder="getLabelSegmentsIpv4(index)"
                          ref="ipv4SegmentsPlageDebut"
                          v-model="value.value"
                          v-bind:suffix="getSuffix(index)"
                          @input="
                            nextSegment(
                              index,
                              ipv4SegmentsPlageDebut,
                              'ipv4SegmentsPlageDebut'
                            )
                          "
                          @paste="onPastePlageDebut"
                          @paste.prevent
                          dense
                          outlined
                          required
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        v-for="(value, index) in ipv4SegmentsPlageFin"
                        :key="index"
                        class="pt-0"
                      >
                        <v-text-field
                          :data-length="value.length"
                          :data-index="index"
                          :rules="rulesForm.ipv4SegmentsRules"
                          :placeholder="getLabelSegmentsIpv4(index)"
                          ref="ipv4SegmentsPlageFin"
                          v-model="value.value"
                          v-bind:suffix="getSuffix(index)"
                          @input="
                            nextSegment(
                              index,
                              ipv4SegmentsPlageFin,
                              'ipv4SegmentsPlageFin'
                            )
                          "
                          @paste="onPastePlageFin"
                          @paste.prevent
                          :disabled="index > 1 ? false : true"
                          :filled="index > 1 ? false : true"
                          dense
                          outlined
                          required
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- PLAGE IP v6 -->
                  <div v-else>
                    <v-row>
                      <v-col
                        v-for="(value, index) in ipv6SegmentsPlageDebut"
                        :key="index"
                        class="pb-0"
                      >
                        <v-text-field
                          :data-length="value.length"
                          :data-index="index"
                          :rules="rulesForm.ipv6SegmentsRules"
                          :placeholder="getLabelSegmentsIpv6(index)"
                          ref="ipv6SegmentsPlageDebut"
                          v-model="value.value"
                          v-bind:suffix="getSuffix(index)"
                          @input="
                            nextSegment(
                              index,
                              ipv6SegmentsPlageDebut,
                              'ipv6SegmentsPlageDebut'
                            )
                          "
                          @paste="onPastePlageDebut"
                          @paste.prevent
                          dense
                          outlined
                          required
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        v-for="(value, index) in ipv6SegmentsPlageFin"
                        :key="index"
                        class="pt-0"
                      >
                        <v-text-field
                          :data-length="value.length"
                          :data-index="index"
                          :rules="rulesForm.ipv6SegmentsRules"
                          :placeholder="getLabelSegmentsIpv6(index)"
                          ref="ipv6SegmentsPlageFin"
                          v-model="value.value"
                          v-bind:suffix="getSuffix(index)"
                          @input="
                            nextSegment(
                              index,
                              ipv6SegmentsPlageFin,
                              'ipv6SegmentsPlageFin'
                            )
                          "
                          @paste="onPastePlageFin"
                          @paste.prevent
                          dense
                          outlined
                          required
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </v-col> </v-row
            ></v-col>
            <v-col cols="2">
              <v-row id="fillHeight"> </v-row>
              <v-row>
                <a @click="clear(true)"
                  >Vider les champs
                  <font-awesome-icon :icon="['fas', 'backspace']"/></a></v-row
            ></v-col>
          </v-row>

          <!-- COMMENTAIRES -->
          <v-row class="mx-0 mt-0">
            <v-col>
              <v-textarea
                counter="255"
                outlined
                auto-grow
                rows="2"
                label="Commentaires"
                hint="Apporter ici toute précisions sur l'attribution de cette IP, surtout si elle n'appartient pas au réseau Renater."
                :rules="rulesForm.commentaires"
                v-model="commentaires"
                clearable
                persistent-hint
              ></v-textarea>
            </v-col>
            <v-col cols="2">
              <v-row id="btnToBtm"></v-row>
              <v-row>
                <v-card-actions>
                  <v-btn
                    @click="ajouterIp()"
                    :loading="buttonLoading"
                    id="btnSave"
                    ><span id="btnText">Enregistrer </span
                    ><v-icon>mdi-arrow-right-circle-outline </v-icon></v-btn
                  >
                </v-card-actions></v-row
              ></v-col
            >
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { SegmentPlage } from "@/core/CommonDefinition";
import { iPService } from "@/core/service/licencesnationales/IPService";
import { rulesForms } from "@/core/RulesForm";
import { Logger } from "@/utils/Logger";

@Component
export default class ModuleSegmentsIpPlage extends Vue {
  @Prop({ default: "IPV4" }) readonly typeIp!: string;
  @Prop({ default: "ip" }) readonly typeAcces!: string;
  rulesForm: any = rulesForms;
  suffix: string = "";
  ipv4Segments: Array<SegmentPlage> = [];
  ipv6Segments: Array<SegmentPlage> = [];
  ipv4SegmentsPlageDebut: Array<SegmentPlage> = [];
  ipv4SegmentsPlageFin: Array<SegmentPlage> = [];
  ipv6SegmentsPlageDebut: Array<SegmentPlage> = [];
  ipv6SegmentsPlageFin: Array<SegmentPlage> = [];

  ip: string = "";
  alert: boolean = false;
  alertSuccess: boolean = false;
  error: string = "";
  success: string = "";
  commentaires: string = "";

  buttonLoading: boolean = false;

  @Watch("ipv4SegmentsPlageDebut")
  onPlageIpV4Changed() {
    this.ipv4SegmentsPlageDebut[0] = this.ipv4SegmentsPlageFin[0];
    this.ipv4SegmentsPlageDebut[1] = this.ipv4SegmentsPlageFin[1];
  }

  mounted() {
    this.clear(false);
  }

  get isAdmin() {
    return this.$store.getters.isAdmin();
  }

  getSuffix(index) {
    if (this.typeIp === "IPV4") {
      if (index === 3) return "";
      else return ".";
    } else {
      if (index === 7) return "";
      else return ":";
    }
  }

  nextSegment(index, array, refArray) {
    let indexMax;
    if (this.typeAcces === "ip") {
      if (this.typeIp === "IPV4") {
        indexMax = 3;
      } else {
        indexMax = 5;
      }
    }
    if (this.typeIp === "IPV4") {
      if (array[index].value.length > 2 && index < indexMax) {
        (this as any).$refs[refArray][index + 1].focus();
      }
    } else {
      if (array[index].value.length >= 4 && index < indexMax) {
        (this as any).$refs[refArray][index + 1].focus();
      }
    }
  }
  getLabelSegmentsIpv4(index) {
    switch (index) {
      case 0:
        return "192";
      case 1:
        return "168";
      case 2:
        return "136";
      case 3:
        return "120";
    }
  }
  getLabelSegmentsIpv6(index) {
    switch (index) {
      case 0:
        return "5800";
      case 1:
        return "10C3";
      case 2:
        return "E3C3";
      case 3:
        return "F1AA";
      case 4:
        return "48E3";
      case 5:
        return "D923";
      case 6:
        return "D494";
      case 7:
        return "AAFF";
    }
  }

  setIp(): void {
    let value = "";
    if (this.typeAcces === "ip") {
      if (this.typeIp === "IPV4") {
        for (const field of this.ipv4Segments) {
          value += field.value + ".";
        }
        value = value.substr(0, value.lastIndexOf("."));
      } else {
        for (const field of this.ipv6Segments) {
          value += field.value + ":";
        }
        value = value.substr(0, value.lastIndexOf(":"));
      }
    } else {
      if (this.typeIp === "IPV4") {
        this.ipv4SegmentsPlageDebut.forEach((content, index) => {
          if (index === 2 || index === 3) {
            value +=
              content.value +
              "-" +
              this.ipv4SegmentsPlageFin[index].value +
              ".";
          } else {
            value += content.value + ".";
          }
        });
        value = value.substr(0, value.lastIndexOf("."));
      } else {
        this.ipv6SegmentsPlageDebut.forEach((content, index) => {
          if (content.value === this.ipv6SegmentsPlageFin[index].value) {
            value += content.value + ":";
          } else {
            value +=
              content.value +
              "-" +
              this.ipv6SegmentsPlageFin[index].value +
              ":";
          }
        });
        value = value.substr(0, value.lastIndexOf(":"));
      }
    }
    this.ip = value;
  }

  ajouterIp(): void {
    this.buttonLoading = true;
    if (
      (this.$refs.formModuleSegmentsIpPlage as Vue & {
        validate: () => boolean;
      }).validate()
    ) {
      // On emet les IPs pour que le composant parent puisse afficher le tableau récapitulatif
      this.setIp();

      // Récupération du SIREN si admin, sinon utilisation du SIREN de l'utilisateur connecté
      let siren = "";
      if (this.isAdmin) {
        siren = this.$store.getters.getCurrentEtablissement().siren;
      } else {
        siren = this.$store.getters.userSiren();
      }

      // Envoi au back
      iPService
        .addIP(this.$store.getters.getToken(), siren, {
          typeIp: this.typeIp,
          ip: this.ip,
          commentaires: this.commentaires
        })
        .then(response => {
          this.$emit("FormModuleSegmentsIpPlageEvent", {
            id: response.data.id,
            typeIp: this.typeIp,
            ip: this.ip,
            commentaires: this.commentaires
          });
          const refForm: any = this.$refs.formModuleSegmentsIpPlage;
          refForm.resetValidation();
          this.clear(false);
          this.alertSuccess = true;
          this.success = response.data.message;
        })
        .catch(err => {
          Logger.error(err.toString());
          this.alert = true;
          this.alertSuccess = false;
          this.error = err.response.data.message;
        })
        .finally(() => {
          this.buttonLoading = false;
        });
    } else {
      this.buttonLoading = false;
    }
  }

  clear(dontClearComments: boolean): void {
    this.alert = false;
    this.alertSuccess = false;
    this.error = "";
    this.success = "";
    this.ip = "";
    if (!dontClearComments) this.commentaires = "";
    this.ipv4Segments = [
      { length: 3, value: "" },
      { length: 3, value: "" },
      { length: 3, value: "" },
      { length: 3, value: "" }
    ];
    this.ipv6Segments = [
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" }
    ];
    this.ipv4SegmentsPlageDebut = [
      { length: 3, value: "" },
      { length: 3, value: "" },
      { length: 3, value: "" },
      { length: 3, value: "" }
    ];
    this.ipv4SegmentsPlageFin = [
      { length: 3, value: "" },
      { length: 3, value: "" },
      { length: 3, value: "" },
      { length: 3, value: "" }
    ];
    this.ipv6SegmentsPlageDebut = [
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" }
    ];
    this.ipv6SegmentsPlageFin = [
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" },
      { length: 5, value: "" }
    ];
  }

  onPasteIp(evt): void {
    if (this.typeIp === "IPV4") {
      evt.clipboardData
        .getData("text")
        .split(".")
        .forEach((content, index) => {
          this.ipv4Segments[index].value = content;
        });
    } else {
      evt.clipboardData
        .getData("text")
        .split(":")
        .forEach((content, index) => {
          this.ipv6Segments[index].value = content;
        });
    }
  }

  onPastePlageDebut(evt): void {
    if (this.typeIp === "IPV4") {
      evt.clipboardData
        .getData("text")
        .split(".")
        .forEach((content, index) => {
          this.ipv4SegmentsPlageDebut[index].value = content;
        });
    } else {
      evt.clipboardData
        .getData("text")
        .split(":")
        .forEach((content, index) => {
          this.ipv6SegmentsPlageDebut[index].value = content;
        });
    }
  }

  onPastePlageFin(evt): void {
    if (this.typeIp === "IPV4") {
      evt.clipboardData
        .getData("text")
        .split(".")
        .forEach((content, index) => {
          this.ipv4SegmentsPlageFin[index].value = content;
        });
    } else {
      evt.clipboardData
        .getData("text")
        .split(":")
        .forEach((content, index) => {
          this.ipv6SegmentsPlageFin[index].value = content;
        });
    }
  }
}
</script>
<style scoped>
button {
  font-size: 12px !important;
}
#btnText {
  padding-right: 5px;
}
#btnToBtm {
  height: 58%;
}
#fillHeight {
  height: 70%;
}
</style>
