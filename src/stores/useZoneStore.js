import { defineStore } from 'pinia'
import { api } from '/src/boot/axios'
import { socket } from 'src/boot/io'

export const useZoneStore = defineStore('zones', {
  state: () => ({
    zones: []
  }),
  getters: {
    len: (state) => {
      return state.zones.length
    }
  },
  actions: {
    async getZones() {
      const r = await api.get('/zones')
      this.zones = r.data
    }
  }
})
