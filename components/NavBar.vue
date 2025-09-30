<template>
  <div class="flex justify-between">
    <div
      class="relative flex justify-between items-center rounded-lg p-1 w-28 h-10 sm:w-32 md:w-40 md:h-12"
      :class="showingStaticLocal ? 'bg-gray-96/75' : 'bg-white/75'"
    >
      <button
        id="show-3d-view"
        title="3D View"
        class="relative w-1/2 h-full flex items-center justify-center rounded-sm"
        :class="!showingStaticLocal ? 'bg-gray-94/75' : ''"
        @click="emitUpdate(false)"
      >
        <IconsCube class="w-6 h-6" />
      </button>
      <button
        id="show-static-preview"
        title="Static Preview"
        class="relative w-1/2 h-full flex items-center justify-center rounded-sm"
        :class="showingStaticLocal ? 'bg-white' : ''"
        @click="emitUpdate(true)"
      >
        <IconsImg class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clarityEvent } from '@/composables/useClarityEvent'

const props = defineProps({
  showingStatic: { type: Boolean, default: false },
  offlineMode: { type: Boolean, default: false }
})
const emits = defineEmits<{ (e: 'update:showingStatic', value: boolean): void }>()

const showingStaticLocal = ref(props.showingStatic)

watch(
  () => props.showingStatic,
  newValue => {
    showingStaticLocal.value = newValue
  }
)

const emitUpdate = (value: boolean) => {
  if (value) {
    clarityEvent('clickedSwitchToGLB')
  } else {
    clarityEvent('clickedSwitchPicture')
  }
  showingStaticLocal.value = value
  emits('update:showingStatic', value)
}
</script>
