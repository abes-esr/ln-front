<template>
  <div>
    <v-card witdh="100%">
      <v-form ref="form" lazy-validation>
        <v-card-title>Connexion</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="1" />
            <v-col cols="10">
              <v-text-field
                outlined
                label="SIREN"
                placeholder="SIREN"
                v-model="siren"
                :rules="loginRules"
                required
                @keyup.enter="validate()"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1" />
            <v-col cols="10">
              <v-text-field
                outlined
                label="Mot de passe"
                placeholder="Mot de passe"
                type="password"
                v-model="password"
                :rules="passwordRules"
                required
                @keyup.enter="validate()"
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
                @click="validate()"
                >Envoyer</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-form>
    </v-card>
    <br />
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
    <v-alert dense outlined :value="creationCompteEffectuee" type="success">
      {{ notification }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "FormLogin",
  data() {
    return {
      siren: "" as string,
      loginRules: [
        (v: any) => !!v || "SIREN obligatoire",
        (v: any) => /^\d{9}$/.test(v) || "Le SIREN doit contenir 9 chiffres"
      ],

      passwordRules: [(v: any) => !!v || "Mot de passe obligatoire"],
      password: "" as string,
      buttonLoading: false,
      alert: false,
      error: ""
    };
  },
  methods: {
    ...mapActions({
      loginAction: "login",
      setCreationCompteEffectueeFalse: "setCreationCompteEffectueeFalse",
      setNotification: "setNotification"
    }),
    validate(): void {
      this.alert = false;
      this.error = "";
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate())
        this.login();
    },
    login(): void {
      this.buttonLoading = true;
      this.loginAction({
        siren: this.siren,
        password: this.password
      })
        .then(() => {
          this.$router.push({ name: "Home" });
        })
        .catch(err => {
          this.buttonLoading = false;
          this.error = err.response.data;
          this.alert = true;
        });
    }
  },
  destroyed() {
    this.setNotification("");
    this.setCreationCompteEffectueeFalse();
  },
  computed: mapGetters(["notification", "creationCompteEffectuee"])
});
</script>

<style scoped></style>
