<script setup>
import { useUserStore } from 'src/stores/useUserStore'
import { useQuasar } from 'quasar'
import moment from 'moment'
import { api } from 'src/boot/axios'
import { useNotify } from 'src/composables/useNotify'
import confirm from 'src/components/dialogs/confirmDialog.vue'

const $q = useQuasar()
const $n = useNotify()
const auth = useUserStore()

function delAccount() {
  $q.dialog({
    component: confirm,
    componentProps: {
      icon: 'delete',
      iconColor: 'red-10',
      title: '탈퇴하시겠습니까?',
      caption: '해당 사용자의 모든 계정 및 정보가 삭제 됩니다.'
    }
  }).onOk(async () => {
    try {
      $q.loading.show()
      await api.get(
        `/auth/deleteuser?id=${auth.user._id}&name=${auth.user.name}&email=${auth.user.email}`
      )
      $n.info('사용자 계정이 삭제 되었습니다')
      $q.loading.hide()
      $r.push('/')
    } catch (err) {
      $q.loading.hide()
      $n.error('사용자 계정 삭제 중 오류가 발생하였습니다.')
      console.error(err)
    }
  })
}
</script>

<template>
  <div class="column items-center q-gutter-y-md">
    <q-card style="min-width: 400px; max-width: 600px">
      <q-card-section class="q-py-sm">
        <q-item>
          <q-item-section avatar>
            <q-icon name="svguse:icons.svg#usersColor" size="md" />
          </q-item-section>
          <q-item-section>
            <q-item-label>사용자 정보</q-item-label>
            <q-item-label caption>나의 계정 및 로그인 정보</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />

      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label> 이름 </q-item-label>
              <q-item-label caption>{{ auth.user.name }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 이메일 </q-item-label>
              <q-item-label caption>{{ auth.user.email }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 관리자 </q-item-label>
              <q-item-label caption>{{ auth.user.admin }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 사용자 등급 </q-item-label>
              <q-item-label caption>{{ auth.user.level }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 로그인 횟수 </q-item-label>
              <q-item-label caption>{{ auth.user.numberOfLogin }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 마지막 로그인 </q-item-label>
              <q-item-label caption>{{
                moment(auth.user.loginAt).format('YYYY-MM-DD hh:mm:ss a')
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 가입일 </q-item-label>
              <q-item-label caption>{{
                moment(auth.user.createdAt).format('YYYY-MM-DD hh:mm:ss a')
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          unelevated
          color="red-10"
          label="탈퇴하기"
          @click="delAccount"
        ></q-btn>
      </q-card-actions>
    </q-card>
    <div>
      <router-link class="text-grey-6" to="'/">홈으로 돌아가기</router-link>
    </div>
  </div>
</template>

<style scoped></style>
