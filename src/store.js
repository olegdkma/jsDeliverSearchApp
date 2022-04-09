import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        count: 0,
        offset: 0,
        searchKey: '',
        packageList: [],
        loading: false,
        timeout: false,
        selectedItem: null
    },
    actions: {
        async search({dispatch, state, commit}, payload) {
            if (state.timeout) {
                clearTimeout(state.timeout)

            }
            commit('setLoadingStatus', true)
            const timeout = setTimeout(async () => {
                try {

                    const {data} = await window.axios.get(`https://registry.npmjs.org/-/v1/search`, {
                        params: {
                            text: payload,
                            size: 10,
                            from: state.offset
                        }
                    })
                    commit('setLoadingStatus', false)
                    commit('setSearchResult', data)

                } catch (e) {
                    console.error(e)
                    commit('setLoadingStatus', false)
                }
            }, 500)
            commit('setTimeO', timeout)

        }
    },
    mutations: {

        setSearchResult(state, payload) {
            state.packageList = payload
        },
        setOffset(state, payload) {
            state.offset = payload
        },
        setSearchKey(state, payload) {
            state.searchKey = payload
        },
        setLoadingStatus(state, payload) {
            state.loading = payload
        },
        setTimeO(state, payload) {
            state.timeout = payload
        },
        setSelectedItem(state, payload) {
            state.selectedItem = payload
        },
    },
    getters: {
        getPackageList: (state) => state.packageList,
        getSearchKey: (state) => state.searchKey,
        getLoadingStatus: (state) => state.loading,
        getSelectedItem: (state) => state.selectedItem,
    }
})

export default store