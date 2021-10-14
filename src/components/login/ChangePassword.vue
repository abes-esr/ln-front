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
                    :type="show ? 'text' : 'password'"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    v-model="oldPassword"
                    :rules="this.rules.passwordObligatoryRules"
                    required
                    @click:append="show = !show"
                    @keyup.enter="validate()"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    label="Nouveau mot de passe"
                    placeholder="Nouveau mot de passe"
                    :type="show ? 'text' : 'password'"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    v-model="newPassword"
                    :rules="this.rules.passwordRules"
                    required
                    @click:append="show = !show"
                    @keyup.enter="validate()"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    label="Confirmer le nouveau mot de passe"
                    placeholder="Confirmer le nouveau mot de passe"
                    :type="show ? 'text' : 'password'"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    v-model="newPasswordConfirm"
                    :rules="[
                      newPassword === newPasswordConfirm ||
                        'Les mots de passe doivent correspondre'
                    ]"
                    required
                    @click:append="show = !show"
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
                >Envoyer
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-form>
    </v-card>
    <br />
    <v-alert v-if="!retourKo" dense outlined :value="alert" type="error">
      {{ message }}
    </v-alert>
    <v-alert v-else dense outlined :value="alert" type="success">
      {{ message }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { serviceLn } from "@/service/licencesnationales/LicencesNationalesApiService";
import { Logger } from "@/utils/Logger";
import { HttpRequestError } from "@/exception/HttpRequestError";
import { rulesForm } from "@/service/RulesForm";

@Component
export default class ChangePassword extends Vue {
  rules = new rulesForm();
  alert: boolean = false;
  show: boolean = false;
  message: string = "";
  buttonLoading: boolean = false;
  oldPassword: string = "";
  newPassword: string = "";
  newPasswordConfirm: string = "";

  retourKo: boolean = false;

  validate(): void {
    this.alert = false;
    this.message = "";
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate())
      this.submit();
  }

  submit(): void {
    this.buttonLoading = true;
    serviceLn
      .changePassword(
        {
          ancienMotDePasse: this.oldPassword,
          nouveauMotDePasse: this.newPassword
        },
        this.$store.getters.token
      )
      .then(response => {
        this.buttonLoading = false;
        this.message = response.message;
        this.alert = true;
        this.retourKo = true;

        setTimeout(() => {
          this.$router.push({ name: "Home" });
        }, 2000);
      })
      .catch(err => {
        this.buttonLoading = false;
        this.alert = true;
        this.retourKo = false;

        if (err instanceof HttpRequestError) {
          Logger.error(
            "Erreur HTTP : " + err.error + " sur la route " + err.path
          );
          this.message = "Erreur de requête : " + err.error;
        } else {
          Logger.error(err.message);
          this.message = err.message;
        }
      });
  }
}
</script>
