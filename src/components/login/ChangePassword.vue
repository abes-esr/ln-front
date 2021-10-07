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
import { serviceLn } from "../../service/licencesnationales/LicencesNationalesApiService";
import { Logger } from "@/utils/Logger";
import { LicencesNationalesUnauthorizedApiError } from "@/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";

@Component
export default class ChangePassword extends Vue {
  alert: boolean = false;
  message: string = "";
  buttonLoading: boolean = false;
  oldPassword: string = "";
  newPassword: string = "";
  newPasswordConfirm: string = "";
  passwordRules = [
    (v: string) => !!v || "Champ obligatoire",
    (v: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        v
      ) ||
      "Le mot de passe doit contenir des lettres dont au moins une majuscule, au moins un chiffre et un caractère spécial, et faire 8 caractères minimum"
  ];
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
        this.$store.getters.getToken
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

        if (err instanceof LicencesNationalesUnauthorizedApiError) {
          this.message =
            "Vous n'êtes pas autorisé à effectuer cette opération.: " +
            err.message;
          Logger.error(err.toString());
        } else {
          Logger.error(err.toString());
          this.message = "Impossible d'exécuter l'action : " + err.message;
        }
      });
  }
}
</script>
