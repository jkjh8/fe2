<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { api } from 'src/boot/axios'

import DetailInfoQSys from 'components/dialogs/devices/infoQSys.vue'
import DetailInfoBarix from 'components/dialogs/devices/infoBarix.vue'

const props = defineProps({ item: Object })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogHide, onDialogCancel } =
  useDialogPluginComponent()

const $q = useQuasar()
const info = ref(null)

onMounted(async () => {
  try {
    $q.loading.show()
    const r = await api.get(
      `/device/getstatusinfo?ipaddress=${props.item.ipaddress}`
    )
    info.value = r.data
    $q.loading.hide()
  } catch (err) {
    $q.loading.hide()
    console.error(err)
  }
})
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-item>
          <q-item-section avatar>
            <q-icon name="svguse:icons.svg#serverColorInfo" />
          </q-item-section>
          <q-item-section>
            <q-item-label>하드웨어 상세정보</q-item-label>
            <q-item-label caption>하드웨어 상태 정보</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-section>
        <DetailInfoQSys
          v-if="item.deviceType === 'Q-Sys'"
          :item="item"
          :status="info"
        />
        <DetailInfoBarix
          v-else-if="item.deviceType === 'Barix'"
          :item="item"
          :status="info"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          unelevated
          color="primary"
          label="확인"
          @click="onDialogOK"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
