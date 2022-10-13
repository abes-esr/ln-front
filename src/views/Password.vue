<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="9" md="10" xs="12">
        <change-password />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import ChangePassword from "@/components/authentification/login/ChangePassword.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: { ChangePassword }
})
export default class Password extends Vue {
  public metaInfo(): any {
    return {
      meta: [
        {
          name: "description",
          content:
            "Page de modification du mot de passe de l'application des Licences Nationales"
        }
      ],
      title: "Modifier mon mot de passe - Licences Nationales"
    };
  }
}
</script>
