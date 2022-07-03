<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDeviceStore } from '/src/stores/useDeviceStore'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useNotify } from 'src/composables/useNotify'
import { ISOToDate } from 'src/composables/useDate'

import PageName from 'components/layout/pageName.vue'
import ConfirmDialog from 'components/dialogs/confirmDialog.vue'

const $q = useQuasar()
const $n = useNotify()

const devices = useDeviceStore()

const filter = ref('')
const pages = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
})
const totalPages = computed(() => {
  return Math.ceil(devices.len / pages.value.rowsPerPage)
})

onMounted(() => {
  devices.getDevices()
  devices.getStatus()
})
</script>

<template>
  <div class="q-gutter-y-md">
    <div class="row justify-between">
      <PageName
        name="장치 관리"
        caption="하드웨어 등록 및 관리"
        icon="svguse:icons.svg#serverColorPlus"
      />

      <div class="row items-center">
        <q-input v-model="filter" dense filled label="Search">
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-separator class="q-ml-md" vertical inset />
        <q-btn icon="add_circle" flat round color="primary">
          <q-tooltip>추가</q-tooltip>
        </q-btn>
        <q-btn icon="refresh" flat round color="primary">
          <q-tooltip>새로고침</q-tooltip>
        </q-btn>
      </div>
    </div>

    <q-table
      :columns="[
        {
          name: 'index',
          align: 'center',
          label: 'ID',
          field: 'index',
          sortable: true
        },
        {
          name: 'name',
          align: 'center',
          label: 'Name',
          field: 'name',
          sortable: true
        },
        {
          name: 'ipaddress',
          align: 'center',
          label: 'IP Address',
          field: 'ipaddress',
          sortable: true
        },
        {
          name: 'deviceType',
          align: 'center',
          label: 'Device Type',
          field: 'deviceType',
          sortable: true
        },
        {
          name: 'mode',
          align: 'center',
          label: 'Active Mode',
          field: 'mode',
          sortable: true
        },
        { name: 'actions', align: 'center', label: 'Actions' }
      ]"
      :rows="devices.devices"
      :filter="filter"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="index" :props="props">
            <q-avatar size="1.5rem">
              {{ props.row.index }}
              <q-badge
                v-if="
                  devices.status &&
                  devices.status[props.row.ipaddress] === 'false' &&
                  props.row.mode !== 'Local'
                "
                rounded
                floating
                color="red-10"
              />
            </q-avatar>
          </q-td>

          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>

          <q-td key="ipaddress" :props="props">
            <a :href="`http://${props.row.ipaddress}`" target="_blank">
              {{ props.row.ipaddress }}
            </a>
          </q-td>

          <q-td key="deviceType" :props="props">
            {{ props.row.deviceType.toUpperCase() }}
          </q-td>

          <q-td key="mode" :props="props">
            {{ props.row.mode.toUpperCase() }}
          </q-td>

          <q-td key="actions" :props="props">
            <div>
              <q-btn flat round color="primary" icon="info">
                <q-tooltip>상세정보</q-tooltip>
              </q-btn>
              <q-btn flat round color="primary" icon="edit">
                <q-tooltip>수정</q-tooltip>
              </q-btn>
              <q-btn flat round color="red-10" icon="delete">
                <q-tooltip>삭제</q-tooltip>
              </q-btn>
              <q-btn flat round color="primary" icon="refresh">
                <q-tooltip>새로고침</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-pagination
      class="flex flex-center"
      v-model="pages.page"
      :max="totalPages"
      :max-pages="pages.rowsPerPage"
      direction-links
      boundary-links
    />
  </div>
</template>

<style scoped></style>
