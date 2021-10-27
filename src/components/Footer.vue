<template>
  <v-footer app bottom absolute dark padless flat id="footer">
    <v-layout fill-height class="d-flex justify-space-between ml-9">
      <v-container
          class="d-flex flex-lg-column justify-space-around align-center"
          style="height: 150px; width: 30%;"
      >
        <v-flex
            class="d-flex flex-column justify-space-around align-stretch"
            style="width: 40%;"
        >
          <div>
            <font-awesome-icon
                :icon="['fas', 'external-link-alt']"
                class="mx-2"
            />
            Accès direct
          </div>
          <v-btn
              href="https://stp.abes.fr/node/3?origine=LicencesNationales"
              target="_blank"
              class="btn-1 mx-2 d-flex justify-space-between no-text-transform"
          >Assistance
            <font-awesome-icon :icon="['fas', 'comments']" class="mx-2" />
          </v-btn>
          <v-btn
              href="https://www.licencesnationales.fr/"
              target="_blank"
              class="btn-1 mx-2 d-flex justify-space-between no-text-transform"
          >Site Licences nationales
            <font-awesome-icon
                :icon="['fas', 'arrow-circle-right']"
                class="mx-2"
            />
          </v-btn>
          <v-btn
              href="http://documentation.abes.fr/aidelicencesnationales/index.html"
              target="_blank"
              class="btn-1 mx-2 d-flex justify-space-between no-text-transform"
          >Documentation Licences nationales
            <font-awesome-icon :icon="['fas', 'question']" class="mx-2" />
          </v-btn>
        </v-flex>
      </v-container>
      <v-divider class="mx-4" vertical style="height: auto;"></v-divider>
      <v-spacer />
      <v-divider class="mx-4" vertical style="height: auto;"></v-divider>
      <v-container
          class="d-flex justify-space-around align-center align-center"
          style="width: 30%"
      >
        <div
            class="d-flex flex-column justify-space-between"
            style="height:100% ; width: 30%"
        >
          <h4>Agence bibliographique de l’enseignement supérieur</h4>
          <div>
            227 av. Jean-Louis Viala CS 84308 34193 Montpellier Cedex 5
          </div>
          <div>Tél : +33 (0)4 67 54 84 10</div>
        </div>
        <div  class="d-flex flex-column justify-space-around"   style="height:100% ; width: 30%">
          <a href="https://abes.fr/" target="_blank">
            <v-img
                alt="Logo Abes"
                src="@/assets/img/logo-abes-blanc.svg"
                max-width="60px"
            ></v-img>
          </a>
          <a
              href="https://www.enseignementsup-recherche.gouv.fr/"
              target="_blank"
          >
            <v-img
                alt="Logo MESRI"
                src="@/assets/img/logo-mesri-2020.svg"
                max-width="60px"
            ></v-img>
          </a>
        </div>
      </v-container>
    </v-layout>
  </v-footer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";

@Component
export default class Footer extends Vue {
}
</script>
