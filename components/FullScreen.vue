<template>
  <button
    id="full-screen"
    class="w-12 h-12 flex items-center justify-center rounded-lg text-gray-40 hover:text-black transition-all duration-300"
    @click="handleClick"
  >
    <IconsMaximize
      v-if="!isFullScreen"
      class="w-6 h-6"
    />
    <IconsMinimize
      v-else
      class="w-6 h-6"
    />
  </button>
</template>

<script setup lang="ts">
import Clarity from '@microsoft/clarity'
import { useFullScreen } from '@/composables/useFullScreen'

const { isFullScreen, toggleFullScreen } = useFullScreen()

const handleClick = () => {
  toggleFullScreen()

  if (!isFullScreen.value) {
    Clarity.event('clickedFullScreen')
  } else {
    Clarity.event('clickedFullScreenExit')
  }
}
</script>
