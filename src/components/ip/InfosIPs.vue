<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="2">
          <font-awesome-icon
            :icon="['fas', 'info-circle']"
            size="3x"
            :style="{ color: '#478dcb' }"
        /></v-col>
        <v-col cols="5">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                ><a
                  href="http://documentation.abes.fr/aidelicencesnationales/co/DeclarerAdressesIP.html#gB5a7METtVdtDpUiRFlcMb"
                  target="_blank"
                  >En savoir plus sur les délais d'ouverture des accès</a
                ></v-list-item-title
              >
              <v-list-item-title
                ><a
                  href="http://documentation.abes.fr/aidelicencesnationales/co/DeclarerAdressesIP.html#Mbo6KY6WPbcV7DfxzQEqbb"
                  target="_blank"
                  >Les différents statuts des IP</a
                ></v-list-item-title
              >
            </v-list-item-content>
          </v-list-item> </v-col
        ><v-col cols="5">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                ><a
                  href="http://documentation.abes.fr/aidelicencesnationales/co/DeclarerAdressesIP.html#h6cleoZtHXSMiDIX5wCuf"
                  target="_blank"
                  >Pourquoi une attestation est parfois demandée ?</a
                ></v-list-item-title
              >
              <v-list-item-title
                ><a>Télécharger un modèle d'attestation</a></v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
@Component
export default class InfosIPs extends Vue {}
</script>
