<template>
  <v-container fill-height class="d-flex justify-center">
    <v-col sm="8" md="4">
      <v-form ref="form">
        <v-card>
          <v-card-title>Connexion</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="11">
                <v-text-field
                  label="Nom d'utilisateur"
                  placeholder="Nom d'utilisateur"
                  v-model="username"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="11">
                <v-text-field
                  label="Mot de passe"
                  placeholder="Mot de passe"
                  type="password"
                  v-model="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col cols="9"></v-col>
              <v-col cols="2">
                <v-btn color="success" x-large @click="login()">Login</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "FormLogin",
  data() {
    return {
      username: "" as string,
      password: "" as string
    };
  },
  methods: {
    login(): void {
      if (this.username !== "" && this.password !== null) {
        axios
          .post("http://localhost:8081/signin", {
            username: this.username,
            password: this.password
          })
          .then(
            result => {
              console.log("login réussi" + result);
            },
            error => {
              console.log("échec login" + error);
            }
          );
      } else {
        console.log("login et mdp obligatoire");
      }
    }
  }
});
</script>

<style scoped></style>
