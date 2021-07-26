<template>
  <div>
    <v-card width="100%" outlined>
      <v-form ref="form" lazy-validation>
        <v-card-title>Modifier mon mot de passe</v-card-title>
        <v-card-text>
          <v-row>
            <v-col lg="12" md="12" xs="12">
              <v-row>
                <v-col cols="1" />
                <v-col cols="8">
                  <v-text-field
                    outlined
                    label="Ancien mot de passe"
                    placeholder="Ancien mot de passe"
                    v-model="oldPassword"
                    :rules="passwordRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    label="Nouveau mot de passe"
                    placeholder="Nouveau mot de passe"
                    v-model="newPassword"
                    :rules="passwordRules"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    label="Confirmer le nouveau mot de passe"
                    placeholder="Confirmer le nouveau mot de passe"
                    v-model="newPasswordConfirm"
                    :rules="[
                      newPassword === newPasswordConfirm ||
                        'Les mots de passe doivent correspondre'
                    ]"
                    required
                    @keyup.enter="validate()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="10"></v-col>
            <v-col>
              <v-btn
                color="success"
                :loading="buttonLoading"
                x-large
                @click="validate()"
                >Envoyer</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions></v-form
      >
    </v-card>
    <br />
    <v-alert dense outlined :value="alert" type="error">
      {{ error }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { LicencesNationalesApiService } from "../../service/licencesnationales/LicencesNationalesApiService";

export default Vue.extend({
  name: "FormLogin",
  data() {
    return {
      alert: false,
      error: "",
      buttonLoading: false,
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",

      passwordRules: [
        v => !!v || "Champ obligatoire",
        v =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            v
          ) ||
          "Le mot de passe doit contenir des lettres dont au moins une majuscule, au moins un chiffre et un caractère spécial, et faire 8 caractères minimum"
      ]
    };
  },
  methods: {
    validate(): void {
      this.alert = false;
      this.error = "";
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate())
        this.submit();
    },
    submit(): void {
      this.buttonLoading = true;
      LicencesNationalesApiService.changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
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
  }
});
</script>

<style scoped></style>
