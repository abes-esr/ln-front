<template>
  <div>
    <p>Fusion</p>
    <form-etab
        v-for="n in formNumber"
        :key="n"
        :bus="bus"
        v-on:formEtab="send"></form-etab>
    <v-btn @click="triggerChildremForm()">Valider</v-btn>
  </div>
</template>

<script lang="ts">
import FormEtab from "@/components/FormEtab.vue";
import Vue from "vue";

export default Vue.extend({
  name: "FormFusionEtablissement",
  components: {FormEtab},
  data() {
    return {
      formNumber: 2,
      bus: new Vue()
    };
  },
  methods: {
    triggerChildremForm(): void {
      this.bus.$emit('submit');
    },
    send(payload: object): void {
      console.log(payload);
    }
  }
})
</script>

<style scoped>

</style>