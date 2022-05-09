<template>
  <v-card>
    <v-card-text class="fondGris pa-0">
      <v-row>
        <v-col cols="1">
          <font-awesome-icon
            class="ma-4"
            :icon="['fas', 'info-circle']"
            size="3x"
            :style="{ color: '#478dcb' }"
        /></v-col>
        <v-col cols="6">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="pb-2"
                ><span class="dot"></span>
                <a
                  href="http://documentation.abes.fr/aidelicencesnationales/aidelicencesnationalesTestsUX/co/StatutsEtProcessusDeValidationDesIP.html#CgILNaqqg4eJrTC78srR8c"
                  target="_blank"
                  >En savoir plus sur les délais d'ouverture des accès</a
                ></v-list-item-title
              >
              <v-list-item-title
                ><span class="dot"></span>
                <a
                  href="http://documentation.abes.fr/aidelicencesnationales/aidelicencesnationalesTestsUX/index.html#StatutsEtProcessusDeValidationDesIP"
                  target="_blank"
                  >Les différents statuts des IP</a
                ></v-list-item-title
              >
            </v-list-item-content>
          </v-list-item> </v-col
        ><v-col cols="5">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="pb-2"
                ><span class="dot"></span>
                <a
                  href="http://documentation.abes.fr/aidelicencesnationales/aidelicencesnationalesTestsUX/co/StatutsEtProcessusDeValidationDesIP.html#DdxqgVeI57cdWkxUf4O9Vc"
                  target="_blank"
                  >Pourquoi une attestation est parfois demandée ?</a
                ></v-list-item-title
              >
              <v-list-item-title
                ><span class="dot"></span>
                <a
                  href="http://documentation.abes.fr/aidelicencesnationales/ModeleAttestationAdressesIP.PNG"
                  target="_blank"
                  >Télécharger un modèle d'attestation</a
                ></v-list-item-title
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

<style scoped></style>
