<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useNotify } from 'src/composables/useNotify'
import { api } from 'src/boot/axios'
import { required, chkEmail, chkLength } from 'src/composables/useRules'

const $q = useQuasar()
const $r = useRouter()
const $n = useNotify()

const userInfo = reactive({
  email: '',
  name: '',
  password: '',
  chkPassword: ''
})

const showPass = ref([false, false])

function matchPass(v) {
  if (v === userInfo.password) {
    return true
  }
  return '비밀번호가 일치 하지 않습니다.'
}

async function existsUser(v) {
  try {
    const r = await api.get(`/auth/checkemail?email=${v}`)
    if (r) {
      return '이미 사용중인 이메일 입니다'
    }
    return true
  } catch (err) {
    console.error(err)
    return '사용자 확인중 오류가 발생하였습니다'
  }
}

async function onRegisger() {
  console.log(userInfo)
  try {
    $q.loading.show()
    await api.post('/auth/register', userInfo)
    $q.loading.hide()
    $n.info({
      message: '사용자 등록이 완료 되었습니다',
      caption: '로그인 페이지로 이동합니다'
    })
    $r.push('/auth/login')
  } catch (err) {
    $q.loading.hide()
    $n.error('사용자 등록 중 오류가 발생하였습니다')
    console.error(err)
  }
}
</script>

<template>
  <div class="row justify-center">
    <div class="q-gutter-y-sm" style="max-width: 600px; min-width: 400px">
      <div class="row justify-center text-grey-6">이메일로 가입하기</div>
      <q-separator />
      <q-form @submit="onRegisger" class="q-gutter-y-sm q-pa-sm">
        <div class="text-bold">이름</div>
        <q-input
          v-model="userInfo.name"
          outlined
          placeholder="이름"
          :rules="[required]"
          lazy-rules
        />
        <div class="text-bold">이메일 주소</div>
        <q-input
          v-model="userInfo.email"
          outlined
          placeholder="이메일 주소"
          :rules="[required, chkEmail, existsUser]"
          lazy-rules
        />
        <div class="text-bold">비밀번호</div>
        <q-input
          v-model="userInfo.password"
          outlined
          placeholder="비밀번호"
          :type="showPass[0] ? 'text' : 'password'"
          :rules="[required, chkLength]"
          lazy-rules
        >
          <template #append>
            <q-icon
              class="pointer"
              :name="showPass[0] ? 'visibility' : 'visibility_off'"
              @click="showPass[0] = !showPass[0]"
            />
          </template>
        </q-input>

        <div class="text-bold">비밀번호 확인</div>
        <q-input
          v-model="userInfo.chkPassword"
          outlined
          placeholder="비밀번호 확인"
          :type="showPass[1] ? 'text' : 'password'"
          :rules="[required, chkLength, matchPass]"
          lazy-rules
        >
          <template #append>
            <q-icon
              class="pointer"
              :name="showPass[1] ? 'visibility' : 'visibility_off'"
              @click="showPass[1] = !showPass[1]"
            />
          </template>
        </q-input>

        <q-btn
          class="full-width text-bold"
          rounded
          unelevated
          color="primary"
          size="1rem"
          label="가입하기"
          type="submit"
        ></q-btn>
      </q-form>
      <q-separator />
      <router-link to="/" class="row justify-center text-grey-6"
        >홈으로 돌아가기</router-link
      >
    </div>
  </div>
</template>
