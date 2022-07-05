<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { api } from 'src/boot/axios'
import { useDeviceStore } from 'src/stores/useDeviceStore'
import { useNotify } from 'src/composables/useNotify'
import { required, chkInt, chkZoneIndex } from 'src/composables/useRules'

const $q = useQuasar()
const $n = useNotify()

const devices = useDeviceStore()
const options = ref(devices.sender)

const props = defineProps({ item: Object })
const emits = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const zone = reactive({
  index: null,
  core: null,
  name: '',
  channels: 0,
  children: []
})

function fnFilter(val, update) {
  if (!val) {
    update(() => {
      options.value = devices.sender
    })
  } else {
    update(() => {
      options.value = devices.sender.filter((v) => v.name.indexOf(val) > -1)
    })
  }
}

function updateCore(core) {
  console.log(core)
  try {
    switch (core.model) {
      case '110f':
        zone.channels = 4
        break
      case '510i':
        zone.channels = 32
        break
      default:
        zone.channels = 16
        break
    }
  } catch (err) {
    console.error(err)
  }
}

async function chkCoreDub(v) {
  try {
    const r = await api(
      `/zones/existCore?json=${encodeURIComponent(JSON.stringify(v))}`
    )
    if (r.data && r.data.length) {
      return '다른 지역에 사용중인 코어 입니다'
    }
    return true
  } catch (err) {
    console.error(err)
    return '중복 확인중 오류가 발생하였습니다'
  }
}

function onSubmit() {
  onDialogOK(zone)
}

onMounted(() => {
  if (props.item) {
    ;(zone._id = props.item._id),
      (zone.index = props.item.index),
      (zone.name = props.item.name),
      (zone.core = props.item.core),
      (zone.channels = props.item.channels),
      (zone.children = props.item.children)
  }
})
</script>

<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-dialog-plugin">
      <q-form @submit="onDialogOK(zone)">
        <q-card-section>
          <q-item>
            <q-item-section avatar>
              <q-icon name="svguse:icons.svg#serverColorPlus" />
            </q-item-section>

            <q-item-section>
              <q-item-label> 방송구간 추가 </q-item-label>
              <q-item-label caption> 지역단위 방송구간 추가 </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section>
          <div>
            <q-input
              v-model="zone.index"
              :disable="true"
              dense
              filled
              label="ID"
              type="number"
              lazy-rules
              :rules="[required, chkInt, chkZoneIndex]"
            />

            <q-input
              v-model="zone.name"
              dense
              filled
              label="Name"
              lazy-rules
              :rules="[required]"
            />

            <!-- select core -->
            <q-select
              v-model="zone.core"
              :disable="true"
              :options="options"
              dense
              filled
              use-input
              label="Core"
              option-label="name"
              lazy-rules
              :rules="[required, chkCoreDub]"
              @filter="fnFilter"
              @update:model-value="updateCore(zone.core)"
            >
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    {{ scope.opt.deviceType }}
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption> </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              v-model="zone.channels"
              dense
              filled
              label="channels"
              type="number"
              lazy-rules
              :rules="[required, chkInt]"
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
