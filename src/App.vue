<template>
  <v-app id="inspire">
    <v-card class="overflow-hidden">
      <v-app-bar

          dense
          color="deep-purple accent-4"
          dark
      >

        <v-toolbar-title>jsDeliver search App</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-text-field
            v-model="searchValue"
            :placeholder="'Search npm packages'"
            :prepend-inner-icon="'mdi-magnify'"
            @change="searchFunc"/>


      </v-app-bar>

      <v-container>
        <div v-if="packageList.length">

          <v-data-table

              :headers="headers"
              :items="packageList"
              :items-per-page="10"
              :server-items-length="200"
              :loading="loading"
              :disable-sort="true"

              :loading-text="'Loading...'"
              class="elevation-1"
              @click:row="openSelectedItem"
              @pagination="paginate"
          >


            <template v-slot:item.name="{ item }">
              <value-wrap :item="item.name"></value-wrap>
            </template>
            <template v-slot:item.description="{ item }">
              <value-wrap :item="item.description"></value-wrap>
            </template>
            <template v-slot:item.version="{ item }">
              <value-wrap :item="item.version"></value-wrap>
            </template>
            <template v-slot:item.date="{ item }">
              <value-wrap :item="item.date"></value-wrap>
            </template>
            <template v-slot:item.author="{ item }">
              <value-wrap :item="item.author"></value-wrap>
            </template>


          </v-data-table>

        </div>
        <div v-else style="display:flex;justify-content: center;height: 68vh;"> No data, use search to find packages
        </div>
      </v-container>


      <v-dialog
          v-model="dialog"
          width="500"
      >
        <modal-card :item="getSelectedItem" @close="closeDialog"></modal-card>

      </v-dialog>

    </v-card>
    <v-footer
        style="padding: 0"
    >
      <v-card


          width="100%"
          color="deep-purple accent-4 text-center"
      >
        <v-card-text>
          <a href="https://github.com/olegdkma" target="_blank">
            <v-btn
                class="mx-4"
                icon
            >
              <v-icon size="24px">
                mdi-github
              </v-icon>
            </v-btn>
          </a>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — created by <strong>Oleh Duldiier</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>

import modalCard from './components/modal-card'
import valueWrap from './components/value-wrap'


import {mapActions, mapMutations, mapGetters} from 'vuex'


export default {
  name: 'App',

  components: {modalCard, valueWrap},

  data: () => ({

    searchValue: '',
    offset: 0,
    packageList: [],

    dialog: false,
    icons: [
      'mdi-home',
      'mdi-email',
      'mdi-calendar',
      'mdi-delete',
    ],
    alignments: [
      'start',
      'center',
      'end',
    ],

  }),
  computed: {
    ...mapGetters({
      getPackageList: 'getPackageList',
      getSearchKey: 'getSearchKey',
      getSelectedItem: 'getSelectedItem',
      loading: 'getLoadingStatus'
    }),
    headers() {
      return ['name', 'description', 'version', 'author', 'date'].map(el => {
        return {
          text: el,
          value: el
        }
      })
    }
  },
  watch: {
    getPackageList(data) {
      if (data && data.objects.length) {
        this.packageList = data.objects.map(el => {
          let result = {}
          for (let key in el.package) {
            result[key] = valueTransform(key, el.package[key])
          }
          return result
        })


      }
    },
    getSearchKey() {
      this.setOffset(0)
    }

  },
  methods: {
    ...mapActions({
      searchF: 'search'
    }),
    ...mapMutations({
      setOffset: 'setOffset',
      setSelectedItem: 'setSelectedItem',
      setSearchKey: 'setSearchKey'
    }),
    async searchFunc(d) {

      this.setSearchKey(d)
      await this.searchF(d)


    },
    async paginate(data) {
      this.setOffset((data.page - 1) * 10)
      await this.searchF(this.getSearchKey)

    },
    openSelectedItem(d) {
      this.setSelectedItem(d)
      this.dialog = true
    },
    closeDialog() {
      this.setSelectedItem(null)
      this.dialog = false
    }
  }
};

function valueTransform(name, val) {
  switch (name) {
    case 'author':
      return new Author(val)
    case 'date':
      return new DateField(val)
    case 'description':
      return new Description(val)
    case 'version':
      return new Version(val)
    case 'name':
      return new Name(val)
    case 'links':
      return new Links(val)
    case 'publisher':
      return new Publisher(val)
    case 'keywords':
      return new Keywords(val)
    case 'maintainers':
      return new Maintainers(val)
    default:
      return {text: val}
  }
}

function Author(val) {
  this.text = val ? val.name : ''
  this.icon = 'mdi-account'
}

function Publisher(val) {
  this.component = 'a'
  this.props = {
    href: 'mailto:' + val.email
  }
  this.text = val ? val.username : ''
  this.icon = 'mdi-account'
}

function DateField(val) {
  this.props = {
    style: {
      display: 'flex',
      'align-items': 'center'
    }
  }
  this.text = val ? val.substring(0, 10) : ''
  this.icon = 'mdi-calendar-range'
}

function Description(val) {
  this.text = val
}

function Version(val) {
  this.component = 'v-chip'
  this.props = {
    label: true,
    outlined: true
  }
  this.icon = 'mdi-tag'
  this.text = val
}

function Name(val) {
  this.component = 'span'
  this.style = {
    'font-weight': 'bold'
  }
  this.text = val
}

function Keywords(val) {
  this.style = {
    'display': 'flex',
    'flex-wrap': 'wrap'
  }
  this.arr = val.map(el => {
    return {
      component: 'v-chip',
      props: {
        link: true,
        small: true,

        href: el,
        style: {
          'margin-right': '5px'
        },
      },

      text: el
    }
  })
}

function Links(val) {
  this.style = {
    'display': 'flex'
  }
  this.arr = Object.entries(val).map(el => {
    return {
      component: 'a',
      props: {
        href: el[1],
        style: {
          'margin-right': '5px'
        },
      },

      text: el[0]
    }
  })


}

function Maintainers(val) {
  this.style = {
    'display': 'flex'
  }
  this.arr = val.map(el => {
    return {
      component: 'a',
      props: {
        href: 'mailto:' + el.email,
        style: {
          'margin-right': '5px'
        },
      },

      text: el.username
    }
  })


}
</script>

<style>
.v-data-footer__select {
  opacity: 0;
  pointer-events: none;
}
</style>