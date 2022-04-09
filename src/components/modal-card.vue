<template>
  <v-card
      elevation="2"
  >
    <v-card-title>
      <div style="display:flex;justify-content: flex-end;width: 100%;">

        <v-icon
            @click="$emit('close')"
            large
        >
          mdi-close
        </v-icon>
      </div>
    </v-card-title>
    <div style="display:flex; align-items: center;padding: 10px;" v-for="(value,name) in item">
      <i style="margin-right: 6px; flex-basis: 90px; flex-shrink: 0;overflow: hidden">{{ name }}:</i>
      <valueWrap :item="value"></valueWrap>

    </div>


  </v-card>
</template>

<script>

import valueWrap from './value-wrap'

export default {
  name: "modal-card",
  components: {
    valueWrap
  },
  props: {
    item: Object
  },
  mounted() {

  },
  methods: {
    closeModal() {

    }
  }
}
</script>

<style scoped>

</style>