<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/useUserStore'
const $r = useRouter()
const user = useUserStore()

function logout() {
  user.logout()
  $r.push('/')
}
</script>

<template>
  <div v-if="!user.user">
    <q-btn
      class="btnSize"
      flat
      color="grey-2"
      text-color="primary"
      icon="person"
      size="md"
      to="/auth/login"
    >
      <q-tooltip class="tooltip" :delay="500"> Login </q-tooltip>
    </q-btn>
  </div>

  <div v-else>
    <q-btn class="btnSize text-bold" flat text-color="primary">
      {{ user.getNickName }}

      <q-menu :offset="[0, 20]">
        <div>
          <div style="padding: 20px 80px 20px 80px">
            <q-avatar size="80px" color="primary" text-color="white">
              {{ user.getNickName }}
            </q-avatar>
          </div>
          <div class="column justify-center items-center">
            <div class="text-h6">
              {{ user.user.name }}
            </div>

            <div class="text-caption">
              {{ user.user.email }}
            </div>

            <q-btn
              class="q-my-md q-px-lg"
              style="border: solid 1px #aaa"
              rounded
              unelevated
              to="/auth/user"
            >
              사용자 계정 관리
            </q-btn>
          </div>
          <q-separator />
          <div class="row justify-center items-center">
            <q-btn class="q-my-md q-px-lg" flat rounded @click="logout">
              로그아웃
            </q-btn>
          </div>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<style scoped>
.btnSize {
  width: 2.5rem;
  height: 2.5rem;
  border: solid 1px #eee;
  border-radius: 0.5rem;
}
.btn {
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  background: linear-gradient(to bottom right, #1291b1, #012f64);
  border: solid 1px #eee;
  border-radius: 0.5rem;
  color: white;
}
.btn:hover {
  background: linear-gradient(to bottom right, #289fbd, #20548f);
}
</style>
