<template>
  <div>
    <v-card flat>
      <v-alert :value="alert" dense type="error"> {{ error }} </v-alert>
      <v-form ref="formModuleSegmentsIpPlage" lazy-validation>
        <v-card-text flat>
          <v-row v-if="this.typeAcces === 'ip'">
            <v-col>
              <v-alert outlined>
                <v-row> <v-col cols="1"/></v-row>
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
                      @click="clearIpSegment(index, ipv4Segments)"
                      @input="nextSegment(index, ipv4Segments, 'ipv4Segments')"
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
                      @click="clearIpSegment(index, ipv6Segments)"
                      @input="nextSegment(index, ipv6Segments, 'ipv6Segments')"
                      @paste="onPasteIp"
                      @paste.prevent
                      dense
                      outlined
                      required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col>
              <v-alert outlined>
                <v-row> <v-col cols="1"/></v-row>
                <!-- PLAGE IP v4 -->
                <div v-if="this.typeIp === 'IPV4'">
                  <v-row>
                    <v-col
                      v-for="(value, index) in ipv4SegmentsPlageDebut"
                      :key="index"
                    >
                      <v-text-field
                        :data-length="value.length"
                        :data-index="index"
                        :rules="rulesForm.ipv4SegmentsRules"
                        :placeholder="getLabelSegmentsIpv4(index)"
                        ref="ipv4SegmentsPlageDebut"
                        v-model="value.value"
                        v-bind:suffix="getSuffix(index)"
                        @click="clearIpSegment(index, ipv4SegmentsPlageDebut)"
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
                    >
                      <v-text-field
                        :data-length="value.length"
                        :data-index="index"
                        :rules="rulesForm.ipv4SegmentsRules"
                        :placeholder="getLabelSegmentsIpv4(index)"
                        ref="ipv4SegmentsPlageFin"
                        v-model="value.value"
                        v-bind:suffix="getSuffix(index)"
                        @click="clearIpSegment(index, ipv4SegmentsPlageFin)"
                        @input="
                          nextSegment(
                            index,
                            ipv4SegmentsPlageFin,
                            'ipv4SegmentsPlageFin'
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

                <!-- PLAGE IP v6 -->
                <div v-else>
                  <v-row>
                    <v-col
                      v-for="(value, index) in ipv6SegmentsPlageDebut"
                      :key="index"
                    >
                      <v-text-field
                        :data-length="value.length"
                        :data-index="index"
                        :rules="rulesForm.ipv6SegmentsRules"
                        :placeholder="getLabelSegmentsIpv6(index)"
                        ref="ipv6SegmentsPlageDebut"
                        v-model="value.value"
                        v-bind:suffix="getSuffix(index)"
                        @click="clearIpSegment(index, ipv6SegmentsPlageDebut)"
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
                    >
                      <v-text-field
                        :data-length="value.length"
                        :data-index="index"
                        :rules="rulesForm.ipv6SegmentsRules"
                        :placeholder="getLabelSegmentsIpv6(index)"
                        ref="ipv6SegmentsPlageFin"
                        v-model="value.value"
                        v-bind:suffix="getSuffix(index)"
                        @click="clearIpSegment(index, ipv6SegmentsPlageFin)"
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
              </v-alert>
            </v-col>
          </v-row>

          <!-- COMMENTAIRES -->
          <v-row>
            <v-col>
              <v-textarea
                outlined
                auto-grow
                label="Commentaires"
                hint="Apporter ici toute précisions sur l'attribution de cette IP, surtout si elle n'appartient pas au réseau Renater."
                v-model="commentaires"
                clearable
                persistent-hint
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="ajouterIp()" :loading="buttonLoading"
            >Enregistrer</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { SegmentPlage } from "@/core/CommonDefinition";
import { iPService } from "@/core/service/licencesnationales/IPService";
import { rulesForm } from "@/core/RulesForm";
import { Logger } from "@/utils/Logger";

@Component
export default class ModuleSegmentsIpPlage extends Vue {
  @Prop({ default: "IPV4" }) readonly typeIp!: string;
  @Prop({ default: "ip" }) readonly typeAcces!: string;
  rulesForm: any = rulesForm;
  suffix: string = "";
  ipv4Segments: Array<SegmentPlage> = [];
  ipv6Segments: Array<SegmentPlage> = [];
  ipv4SegmentsPlageDebut: Array<SegmentPlage> = [];
  ipv4SegmentsPlageFin: Array<SegmentPlage> = [];
  ipv6SegmentsPlageDebut: Array<SegmentPlage> = [];
  ipv6SegmentsPlageFin: Array<SegmentPlage> = [];

  labelIp: string = "";
  labelIpResultat: string = "";
  ip: string = "";
  alert: boolean = false;
  error: string = "";
  commentaires: string = "";

  buttonLoading: boolean = false;

  mounted() {
    this.clear();
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
        this.clearIpSegment(index + 1, array);
        (this as any).$refs[refArray][index + 1].focus();
      }
    } else {
      if (array[index].value.length >= 4 && index < indexMax) {
        this.clearIpSegment(index + 1, array);
        (this as any).$refs[refArray][index + 1].focus();
      }
    }
  }

  clearIpSegment(index, array): void {
    array[index].value = "";
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

  setText(): void {
    if (this.typeAcces === "ip") {
      this.labelIp = "Saisissez votre adresse ip.";
      this.labelIpResultat = "Ip fournie";
    } else {
      this.labelIp = "Saisissez votre plage d'adresse ip.";
      this.labelIpResultat = "Plage d'adresses ip fournie";
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
        .addIP(this.$store.getters.getToken(), siren, [
          { typeIp: this.typeIp, ip: this.ip, commentaires: this.commentaires }
        ])
        .then(() => {
          this.$emit("FormModuleSegmentsIpPlageEvent", {
            typeIp: this.typeIp,
            ip: this.ip,
            commentaires: this.commentaires
          });
          this.clear();
          this.buttonLoading = false;
        })
        .catch(err => {
          Logger.error(err.toString());
          this.alert = true;
          this.error = err.toString();
          this.buttonLoading = false;
        });
    }
  }

  clear(): void {
    this.alert = false;
    this.error = "";
    this.ip = "";
    this.commentaires = "";
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
.v-card__text {
  border: none;
}
</style>
