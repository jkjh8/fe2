<script setup>
import { reactive } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { useNotify } from 'src/composables/useNotify'
import { useDeviceStore } from 'src/stores/useDeviceStore'
import {
  required,
  chkIpaddr,
  chkInt,
  chkDeviceIndex,
  chkIpExists
} from 'src/composables/useRules'

const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const $q = useQuasar()

const devices = useDeviceStore()
const device = reactive({
  index: null,
  ipaddress: null,
  name: '',
  deviceType: '',
  mode: '',
  model: ''
})

async function onSubmit() {
  onDialogOK(device)
}
</script>

<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section class="q-py-sm">
        <q-item>
          <q-item-section avatar>
            <q-icon name="svguse:icons.svg#serverColorPlus"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>하드웨어 추가</q-item-label>
            <q-item-label caption>하드웨어 추가</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator />
      <q-form @submit="onSubmit">
        <q-card-section>
          <div>
            <q-input
              v-model="device.index"
              filled
              dense
              label="ID"
              type="number"
              lazy-rules
              :rules="[required, chkInt, chkDeviceIndex]"
            />

            <q-input
              v-model="device.name"
              dense
              filled
              label="Name"
              lazy-rules
              :rules="[required]"
            />

            <q-select
              v-model="device.deviceType"
              dense
              filled
              label="Device Type"
              :options="['Q-Sys', 'Barix']"
              lazy-rules
              :rules="[required]"
            />

            <!-- device type === barix -->
            <q-select
              v-if="device.deviceType === 'Barix'"
              v-model="device.mode"
              dense
              filled
              label="Mode"
              :options="['Send', 'Receive']"
              lazy-rules
              :rules="[required]"
            />

            <!-- device type === qsys -->
            <q-select
              v-if="device.deviceType === 'Q-Sys'"
              v-model="device.mode"
              dense
              filled
              label="Mode"
              :options="['Core', 'Local']"
              lazy-rules
              :rules="[required]"
            />

            <q-select
              v-if="device.deviceType === 'Q-Sys' && device.mode !== 'Local'"
              v-model="device.model"
              dense
              filled
              label="Device Model"
              :options="['110f', '510i']"
              lazy-rules
              :rules="[required]"
            />

            <!-- ipaddress -->
            <q-input
              v-if="device.mode !== 'Local'"
              v-model="device.ipaddress"
              dense
              filled
              label="IP Address"
              lazy-rules
              :rules="[required, chkIpaddr, chkIpExists]"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            class="btn"
            flat
            color="red-10"
            label="취소"
            @click="onDialogCancel"
          ></q-btn>
          <q-btn
            class="btn"
            unelevated
            color="primary"
            label="확인"
            type="submit"
          ></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.btn {
  width: 4rem;
}
</style>
