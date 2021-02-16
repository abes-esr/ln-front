<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <v-card witdh="100%">
          <v-form ref="form">
            <v-card-title>Connexion</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-text-field
                    label="Nom d'utilisateur"
                    placeholder="Nom d'utilisateur"
                    v-model="username"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
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
                  <v-btn
                    color="success"
                    :loading="buttonLoading"
                    x-large
                    @click="login()"
                    >Login</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "FormLogin",
  data() {
    return {
      username: "" as string,
      password: "" as string,
      buttonLoading: false
    };
  },
  methods: {
    ...mapActions({
      loginAction: "login"
    }),
    login(): void {
      if (this.username !== "" && this.password !== null) {
        this.loginAction({
          username: this.username,
          password: this.password
        })
          .then(() => {
            this.$router.push({ name: "home" });
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        console.log("login et mdp obligatoire");
      }
    }
  }
});
</script>

<style scoped></style>
