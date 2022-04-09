<template>

  <div :style="item.style">
    <template v-if="item.text">
      <component :is="item.component||'div'" v-bind="item.props">
        <v-icon
            v-if="item.icon"
            small
            color="blue darken-2"
        >
          {{ item.icon }}
        </v-icon>
        <span v-html="item.text"></span>

      </component>
    </template>
    <div style="display:flex;flex-wrap: wrap" v-if="item.arr">

      <value-wrap v-for="arrItem in item.arr" :item="arrItem">

      </value-wrap>

    </div>

  </div>

</template>

<script>

import {VChip} from 'vuetify/lib'
import valueWrap from './value-wrap'

export default {
  name: "value-wrap",
  components: {VChip, valueWrap},
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style scoped>

</style>