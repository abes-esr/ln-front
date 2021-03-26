<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <div>
          <v-card witdh="100%">
            <v-form ref="formCreationCompte" lazy-validation>
              <v-card-title>Réinitialisation de votre mot de passe</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-alert border="left" color="grey" dark>
                      Votre mot de passe doit contenir au minimum 8 caractères
                      dont une lettre majuscule, une lettre minuscule, un
                      chiffre et un caractère spécial parmis @ $ ! % * ? &
                    </v-alert>
                    <v-text-field
                        outlined
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        label="Mot de passe"
                        placeholder="Mot de passe"
                        v-model="passContact"
                        :rules="passContactRules"
                        :type="show1 ? 'text' : 'password'"
                        required
                        @keyup.enter="validate()"
                        @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10">
                    <v-text-field
                        outlined
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        label="Confirmez votre mot de passe"
                        placeholder="Confirmez votre mot de passe"
                        v-model="confirmPassContact"
                        :rules="
                        confirmPassContactRules.concat(confirmPassContactRule)
                      "
                        :type="show1 ? 'text' : 'password'"
                        required
                        @keyup.enter="validate()"
                        @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="1" />
                  <v-col cols="10"> </v-col>
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
                        @click="recaptcha()"
                    >Envoyer</v-btn
                    >
                    <v-btn @click="clear">
                      Effacer
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-form>
          </v-card>
          <br />
          <v-alert dense outlined :value="alert" type="error">
            {{ error }}
          </v-alert>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "FormReinitialisationPass",
  data() {
    return {
      show1: false,
      token:"" as unknown,
      tokenrecaptcha: this.$recaptchaLoaded() as unknown,

      passContact: "" as string,
      passContactRules: [
        (v: never) => !!v || "Le mot de passe du contact est obligatoire",
        (v: never) =>
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                v
            ) || "Le mot de passe fourni n'est pas valide"
      ],
      confirmPassContact: "" as string,
      confirmPassContactRules: [
        (v: never) => !!v || "Vous devez confirmer le mot de passe du contact"
      ],
      buttonLoading: false,
      alert: false,
      error: ""
    };
  },
  computed: {
    confirmPassContactRule() {
      return () =>
          this.confirmPassContact === this.passContact ||
          "Le mot de passe de confirmation n'est pas valide";
    },

    loggedIn() {
      return this.$store.state.user.isLoggedIn;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
    this.token = this.$route.query.token
      console.log(this.token)
  },

  methods: {
    async recaptcha() {
      // (optional) Wait until recaptcha has been loaded.
      await this.$recaptchaLoaded();

      // Execute reCAPTCHA with action "creationCompte".
      this.tokenrecaptcha = await this.$recaptcha("reinitialisationPass");
      console.log("token dans recaptcha() " + this.token);
      // Do stuff with the received token.
      this.validate();
    },
    /* si on veut faire la verif du score sur le front et pas le back on peut faire comme ceci :
    isHuman(token: any) {
      const endpoint = `${process.env.VUE_APP_RECAPTCHA_VERIFY_URL}?response=${token}&secret=${process.env.VUE_APP_RECAPTCHA_KEY_SITE}`;
      console.log("requete axios = " + axios.post(endpoint)
          .then(({data}) => data.score > process.env.VUE_APP_RECAPTCHA_SCORE_THRESHOLD));
      return axios.post(endpoint)
          .then(({data}) => data.score > process.env.VUE_APP_RECAPTCHA_SCORE_THRESHOLD);

    },*/
    validate(): void {
      this.alert = false;
      this.error = "";
      //this.recaptcha();
      //if (this.isHuman(this.recaptcha()) {
      if (this.tokenrecaptcha != null) {
        if (
            (this.$refs.formCreationCompte as Vue & {
              validate: () => boolean;
            }).validate()
        ) {
          this.creationCompte();
        }
      }
    },
    creationCompte(): void {
      this.buttonLoading = true;
      axios
          .post(process.env.VUE_APP_ROOT_API + "reinitialisationPass", {
            //nom: this.nomEtab,
            //siren: this.sirenEtab,
            motDePasse: this.passContact,
            //roleContact: this.roleContact,
            recaptcha: this.tokenrecaptcha,
            token:this.token
          })
          .then(() => {
            this.$router.push({ name: "home" });
          })
          .catch(err => {
            this.buttonLoading = false;
            this.error = err;
            this.alert = true;
          });
    },

    clear() {
      //this.$refs.formCreationCompte.reset();
    }
  }
});
</script>

<style scoped></style>
