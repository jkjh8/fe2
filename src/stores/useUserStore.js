import { defineStore } from 'pinia'
import { api } from '/src/boot/axios'
import { socket } from 'src/boot/io'

export const useUserStore = defineStore('users', {
  state: () => ({
    user: null
  }),
  getters: {
    getNickName: (state) => {
      if (state.user) {
        return state.user.name.substring(0, 1)
      } else {
        return 'N'
      }
    }
  },
  actions: {
    getUser() {
      this.counter++
    },
    update(user) {
      this.user = user
    },
    async logout() {
      try {
        await api.get('/auth/logout')
        socket.disconnect()
        this.user = null
      } catch (err) {
        console.error(err)
      }
    }
  }
})
