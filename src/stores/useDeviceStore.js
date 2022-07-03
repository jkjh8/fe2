import { defineStore } from 'pinia'
import { api } from '/src/boot/axios'
import { socket } from 'src/boot/io'

export const useDeviceStore = defineStore('devices', {
  state: () => ({
    devices: [],
    pa: null,
    status: null
  }),
  getters: {
    sender: (state) => {
      const r = []
      state.devices.forEach((d) => {
        if (d.mode === 'Core' || d.mode === 'Send') {
          r.push(d)
        } else {
          if (d.mode === 'Send') {
            r.push(d)
          }
        }
      })
      return r
    },
    receiver: (state) => {
      const r = []
      state.devices.forEach((d) => {
        if (d.mode === 'Receive') {
          r.push(d)
        }
      })
      return r
    },
    len: (state) => {
      return state.devices.length
    }
  },
  actions: {
    async getDevices() {
      const r = await api.get('/device')
      this.devices = r.data
    },
    async getStatus() {
      const r = await api.get('/device/status')
      this.status = r.data
    }
  }
})
