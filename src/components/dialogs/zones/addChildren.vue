<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { useNotify } from 'src/composables/useNotify'
import { useDeviceStore } from 'src/stores/useDeviceStore'

const props = defineProps({ item: Object })
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

$q = useQuasar()
$n = useNotify()

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

<template></template>

<style scoped></style>
