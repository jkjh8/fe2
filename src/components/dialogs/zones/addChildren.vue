<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { useNotify } from 'src/composables/useNotify'
import { useDeviceStore } from 'src/stores/useDeviceStore'

const props = defineProps({ item: Object })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const $q = useQuasar()
const $n = useNotify()

const childrens = ref([])
const devices = useDeviceStore()
const options = ref(devices.receiver)
const filter = ref('')

function fnFilter(val, update) {
  if (!val) {
    update(() => {
      options.value = devices.receiver
    })
  } else {
    update(() => {
      options.value = devices.receiver.filter((v) => v.name.indexOf(val) > -1)
    })
  }
}
</script>

<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-dialog-plugin">
      <q-form @submit="onDialogOK(childrens)">
        <q-card-section>
          <q-item>
            <q-item-section avatar>
              <q-icon name="svguse:icons.svg#localColor" />
            </q-item-section>
            <q-item-section>
              <q-item-label>방송구간 추가</q-item-label>
              <q-item-label caption>세부방송구간 추가</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
