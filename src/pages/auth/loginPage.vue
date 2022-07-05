<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LocalStorage as Local, useQuasar } from 'quasar'
import { required, chkEmail, chkLength } from 'src/composables/useRules'
import { useNotify } from 'src/composables/useNotify'
import { api } from 'src/boot/axios'
import { socket } from 'src/boot/io'

const $n = useNotify()
const $q = useQuasar()
const $r = useRouter()

const userInfo = reactive({
  email: '',
  password: '',
  emailSave: false
})
const showPass = ref(false)

function emailFromLocal() {
  if (Local.has('email')) {
    userInfo.emailSave = true
    userInfo.email = Local.getItem('email')
  }
}

function emailToLocal() {
  if (userInfo.emailSave && userInfo.email) {
    Local.set('email', userInfo.email)
  } else {
    Local.remove('email')
  }
}

async function onLogin() {
  try {
    $q.loading.show()
    //ckeck save email to local storage
    emailToLocal()
    // 로그인 확인
    const r = await api.post('/auth', userInfo)
    $q.loading.hide()
    // 리턴 데이터 확인
    if (r.data.status) {
      // socket io connect
      socket.connect()
      // route home
      $r.push('/')
    } else {
      $n.warn(r.data.message)
    }
  } catch (err) {
    $q.loading.hide()
    $n.error('로그인 오류가 발생하였습니다.')
    console.error(err)
  }
}
onMounted(() => {
  emailFromLocal()
})
</script>

<template>
  <div class="row justify-center">
    <div class="q-gutter-y-sm" style="max-width: 600px; min-width: 400px">
      <div class="row justify-center text-grey-6">이메일로 로그인하기</div>
      <q-separator />
      <q-form @submit="onLogin" class="q-gutter-y-sm q-pa-sm">
        <div class="text-bold">이메일 주소</div>
        <q-input
          v-model="userInfo.email"
          outlined
          placeholder="이메일 주소"
          :rules="[required, chkEmail]"
          lazy-rules
        />
        <div class="text-bold">비밀번호</div>
        <q-input
          v-model="userInfo.password"
          outlined
          placeholder="비밀번호"
          :type="showPass ? 'text' : 'password'"
          :rules="[required, chkLength]"
          lazy-rules
        >
          <template #append>
            <q-icon
              class="pointer"
              :name="showPass ? 'visibility' : 'visibility_off'"
              @click="showPass = !showPass"
            />
          </template>
        </q-input>

        <q-btn
          class="full-width text-bold"
          rounded
          unelevated
          color="primary"
          size="1rem"
          label="로그인하기"
          type="submit"
        ></q-btn>

        <div class="row justify-end">
          <q-checkbox
            label="이메일 저장하기"
            left-label
            v-model="userInfo.emailSave"
            @update:model-value="emailToLocal"
          />
        </div>
      </q-form>
      <q-separator />
      <router-link to="/auth/register" class="row justify-center text-grey-6"
        >계정이 없나요?</router-link
      >
    </div>
  </div>
</template>
