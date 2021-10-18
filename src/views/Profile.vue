<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="9" md="10" xs="12">
        <form-profile :sirenParam="sirenParam" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormProfile from "../components/etablissement/FormProfile.vue";

const ProfileProps = Vue.extend({
  props: {
    sirenParam: {
      type: String,
      default: ""
    }
  }
});

@Component({
  components: { FormProfile }
})
export default class App extends ProfileProps {}
</script>
