<template>
  <v-footer padless id="footer">
    <v-card class="flex" flat tile>
      <v-card-title class="teal footer-top align-center pa-0">
        <v-col cols="12" md="4" lg="3" xl="3">
          <div class="left-container d-flex flex-column justify-space-between">
            <div class="raccourci">
              <font-awesome-icon
                :icon="['fas', 'external-link-alt']"
                class="mx-2"
              />
              <span class="texte">Accès direct</span>
            </div>
            <v-btn
              href="https://stp.abes.fr/node/3?origine=LicencesNationales"
              target="_blank"
              class="footer-btn mx-2 text-center no-text-transform"
            >
              <span class="texte">Assistance</span>
              <font-awesome-icon :icon="['fas', 'comments']" class="mx-2" />
            </v-btn>
            <v-btn
              href="https://www.licencesnationales.fr/"
              target="_blank"
              class="footer-btn mx-2 text-center no-text-transform"
              ><span class="texte">Site Licences nationales</span>
              <font-awesome-icon
                :icon="['fas', 'arrow-circle-right']"
                class="mx-2"
              />
            </v-btn>
            <v-btn
              href="http://documentation.abes.fr/aidelicencesnationales/index.html"
              target="_blank"
              class="footer-btn mx-2 text-center no-text-transform"
              ><span class="texte">Documentation Licences nationales</span>
              <font-awesome-icon :icon="['fas', 'question']" class="mx-2" />
            </v-btn>
          </div>
        </v-col>
        <v-divider
          class="mx-4 hidden-sm-and-down"
          vertical
          style="height: auto;"
        ></v-divider>
        <v-spacer />
        <v-divider
          class="mx-4 "
          :vertical="this.$vuetify.breakpoint.mdAndUp"
          style="height: auto;"
        ></v-divider>
        <v-col
          cols="12"
          md="4"
          lg="4"
          xl="4"
          class="d-flex justify-space-around align-center"
        >
          <div
            class="d-flex flex-column justify-space-between text-right mr-3 right-container"
          >
            <h4 class="mb-2 no-text-transform">
              Agence bibliographique de l’enseignement supérieur
            </h4>
            <div>
              227 av. Jean-Louis Viala CS 84308 34193 Montpellier Cedex 5
            </div>
            <div>Tél : +33 (0)4 67 54 84 10</div>
          </div>
          <div
            class="d-flex flex-column justify-space-around"
            style="height:100% ; width: 30%"
          >
            <a href="https://abes.fr/" target="_blank" class="ma-2">
              <v-img
                alt="Logo Abes"
                src="@/assets/img/logo-abes-blanc.svg"
                max-width="60px"
              ></v-img>
            </a>
            <a
              href="https://www.enseignementsup-recherche.gouv.fr/"
              target="_blank"
              class="ma-2"
            >
              <v-img
                alt="Logo MESRI"
                src="@/assets/img/logo-mesri-2020.svg"
                max-width="60px"
              ></v-img>
            </a>
          </div>
        </v-col>
      </v-card-title>

      <v-card-text class="py-2 white--text footer-bottom">
        <strong>Licences Nationales</strong>
        <div id="mentions">
          <a href="https://abes.fr/accessibilite/" target="_blank"
            >Accessibilité</a
          >
          |
          <a @click="$router.push({ path: '/donneespersonnelles' })"
            >Données personnelles</a
          >
          | <a>CGU</a> |
          <a>Mentions légales</a>
        </div>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Footer extends Vue {}
</script>
<style scoped lang="scss">
#footer,
#footer .v-btn__content {
  font-size: 0.6rem !important;
  text-transform: capitalize;
  overflow-wrap: break-word !important;
  word-wrap: break-word;
  white-space: normal !important;
  flex: 1 0 100%;
}

#footer .v-btn:not(.v-btn--round).v-size--default {
  //height: auto;
  min-height: 20px;
}

#footer .v-divider--vertical {
  margin: 0.5rem 0 0.5rem 0;
}

#footer .container {
  width: auto !important;
}

@import "~vuetify/src/styles/settings/_variables";
@media #{map-get($display-breakpoints, 'md-and-up')} {
  .left-container .v-btn {
    width: 250px;
  }
}

.left-container {
  min-height: 200px;
  padding-left: 4vw;
}

.right-container {
  width: 250px;
}

.right-container h4 {
  word-break: normal;
  font-weight: 900;
  font-size: 1.1rem;
}

.right-container {
  font-weight: 500;
  font-size: 0.8rem;
}

.footer-btn {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer-btn .texte {
  width: 170px !important;
  text-transform: none !important;
  display: block !important;
  word-wrap: break-word !important;
  white-space: normal;
  font-size: 12px;
}

.footer-top,
.footer-bottom {
  width: 100%;
}

.footer-top {
  height: 100%;
}

#mentions {
  float: right;
}

#mentions a {
  text-decoration: none;
  color: white !important;
}
</style>
