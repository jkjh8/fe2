<script setup>
// import { onBeforMount } from 'vue'

import { useRouter } from 'vue-router'
import Menu from 'components/layout/headerMenu.vue'
import UserState from 'components/layout/userState.vue'
const router = useRouter()
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header row justify-between items-center">
      <div class="row items-center">
        <div class="row q-gutter-x-sm pointer" @click="router.push('/')">
          <q-icon name="svguse:icons.svg#logo" size="md" />
          <div class="header-font">Media Server</div>
        </div>
      </div>
      <!-- Menu Components -->
      <Menu />
      <UserState />
    </q-header>

    <q-page-container>
      <div class="router-view">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>
