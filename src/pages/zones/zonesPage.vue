<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDeviceStore } from '/src/stores/useDeviceStore'
import { useZoneStore } from '/src/stores/useZoneStore'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useNotify } from 'src/composables/useNotify'

import PageName from 'components/layout/pageName.vue'
import ConfirmDialog from 'components/dialogs/confirmDialog.vue'
import TooltipDelay from 'components/tooltipDelay.vue'
import AddCoreDialog from 'components/dialogs/zones/addCore.vue'
import EditCoreDialog from 'components/dialogs/zones/editCore.vue'
import AddChildrenDialog from 'components/dialogs/zones/addChildren.vue'

const $q = useQuasar()
const $n = useNotify()

const devices = useDeviceStore()
const zones = useZoneStore()

async function getZones() {
  try {
    $q.loading.show()
    await zones.getZones()
    $q.loading.hide()
  } catch (err) {
    $q.loading.hide()
    console.error(err)
    $n.error('방송구간을 불러올 수 없습니다.')
  }
}

async function getDevices() {
  try {
    $q.loading.show()
    await devices.getDevices()
    await devices.getStatus()
    $q.loading.hide()
  } catch (err) {
    $q.loading.hide()
    console.error(err)
    $n.error('디바이스 상태를 불러올 수 없습니다')
  }
}

function addCore() {
  $q.dialog({
    component: AddCoreDialog
  }).onOk(async (zone) => {
    try {
      $q.loading.show()
      await api.post('/zones', zone)
      await zones.getZones()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      console.error(err)
      $n.error('방송구간 추가중 오류가 발생하였습니다')
    }
  })
}

function editCore(item) {
  $q.dialog({
    component: EditCoreDialog,
    componentProps: { item }
  }).onOk(async (zone) => {
    try {
      $q.loading.show()
      await api.put('/zones', zone)
      await zones.getZones()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      console.error(err)
      $n.error('방송구간 수정중 오류가 발생하였습니다')
    }
  })
}

function deleteCore(item) {
  $q.dialog({
    component: ConfirmDialog,
    componentProps: {
      icon: 'delete',
      iconColor: 'red-10',
      title: '삭제',
      caption: `${item.index}:${item.name} 해당 지역을 삭제 하시겠습니까?`
    }
  }).onOk(async () => {
    try {
      $q.loading.show()
      await api.get(
        `/zones/delete?item=${encodeURIComponent(JSON.stringify(item))}`
      )
      await zones.getZones()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      $n.error('방송구간 삭제중 오류가 발생하였습니다')
      console.error(err)
    }
  })
}

function addChildren(item) {
  $q.dialog({
    component: AddChildrenDialog,
    componentProps: { item }
  })
}

onMounted(() => {
  getZones()
  getDevices()
})
</script>

<template>
  <div class="q-gutter-y-md">
    <div class="row justify-between">
      <PageName
        name="방송구간 관리"
        caption="방송구간 등록 및 관리"
        icon="svguse:icons.svg#serverColorPlus"
      />
      <div class="row no-wrap q-gutter-x-sm">
        <q-btn flat round color="primary" icon="add_circle" @click="addCore">
          <q-tooltip>추가</q-tooltip>
        </q-btn>

        <q-separator vertical inset />

        <q-btn flat round color="primary" icon="refresh" @click="getZones">
          <q-tooltip>새로고침</q-tooltip>
        </q-btn>
      </div>
    </div>

    <div>
      <q-list>
        <div v-for="zone in zones.zones" :key="zone.index">
          <q-expansion-item
            expand-separator
            default-opened
            header-class="bg-grey-2"
          >
            <!-- header -->
            <template #header>
              <q-item-section avatar>
                <q-icon name="svguse:icons.svg#serverColor" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ zone.name }}</q-item-label>
                <q-item-label caption>
                  <a
                    :href="`http://${zone.core.ipaddress}`"
                    target="_blank"
                    @click.stop
                  >
                    {{ zone.core.ipaddress }}
                  </a>
                </q-item-label>
              </q-item-section>

              <!-- 지역 기능 버튼 -->
              <q-item-section side>
                <div class="row no-wrap">
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="edit"
                    @click.prevent.stop="editCore(zone)"
                  >
                    <q-tooltip>수정</q-tooltip>
                  </q-btn>
                  <q-separator class="q-mx-sm" vertical inset />
                  <q-btn
                    flat
                    round
                    icon="add_circle"
                    color="primary"
                    @click.prevent.stop="addChildren(zone)"
                  >
                    <q-tooltip>방송구간추가</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    icon="delete"
                    color="negative"
                    @click.prevent.stop="deleteCore(zone)"
                  >
                    <q-tooltip>지역삭제</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </template>

            <!-- body -->
            <div class="flex q-pa-sm q-gutter-x-sm">
              <div
                v-for="(children, idx) in zone.children"
                :key="idx"
                class="children-card"
              >
                <!-- children card -->
                <q-card v-if="children">
                  <q-card-section>
                    <div class="row no-wrap justify-between items-center">
                      <div class="text-over-flow">
                        {{ children.name }}
                        <TooltipDelay :msg="children.name" />
                      </div>
                      <q-icon class="pointer" name="settings">
                        <q-tooltip>수정</q-tooltip>
                      </q-icon>
                    </div>
                  </q-card-section>

                  <q-separator />

                  <q-card-section>
                    <div>Channel {{ idx + 1 }}</div>
                    <div v-if="children.mode !== 'Local'">
                      <a
                        :href="`http://${children.ipaddress}`"
                        target="_blank"
                        >{{ children.ipaddress }}</a
                      >
                    </div>
                    <div v-else>NONE</div>
                  </q-card-section>
                </q-card>
                <!-- None Card -->
                <q-card v-else>
                  <q-card-section>
                    <div class="row no-wrap justify-between items-center">
                      <div class="text-over-flow">NONE</div>
                      <q-icon class="pointer" name="settings">
                        <q-tooltip>수정</q-tooltip>
                      </q-icon>
                    </div>
                  </q-card-section>

                  <q-separator />

                  <q-card-section>
                    <div>Channel {{ idx + 1 }}</div>
                    <div>NONE</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-expansion-item>
        </div>
      </q-list>
    </div>
  </div>
</template>

<style scoped>
.children-card {
  width: 10rem;
  height: ' 100%';
}

.text-over-flow {
  width: 8rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
