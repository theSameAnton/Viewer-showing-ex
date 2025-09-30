<template>
  <div
    id="slider"
    ref="sliderContainer"
    class="bg-white/75 p-2 w-12 flex flex-col items-center rounded-lg select-none"
  >
    <div class="relative h-48 mt-4 w-1 bg-gray-90 rounded-lg">
      <div
        class="progress-bar absolute bottom-0 w-full bg-primary-dark-blue rounded-lg z-20"
        :style="{ height: percentage + '%' }"
      ></div>

      <div
        v-for="tickPercentage in [25, 50, 75, 99]"
        :key="tickPercentage"
        class="tick absolute left-1/2 w-1 h-1 bg-primary-dark-blue rounded-full"
        :style="{ bottom: tickPercentage + '%' }"
      ></div>

      <div
        id="slider-handle"
        tabindex="0"
        class="absolute -left-1.5 w-4 h-4 bg-primary-dark-blue rounded-full cursor-pointer z-10"
        :class="{
          'ring-4 ring-gray-90 outline-hidden z-50': isDragging
        }"
        :style="{ bottom: percentage + '%' }"
        @mousedown="handleDragStart"
        @touchstart.prevent="handleDragStart"
      ></div>
    </div>
    <div
      id="slider-value"
      class="pt-2 pb-0.5 text-center text-primary-dark-blue font-normal border-b border-primary-dark-blue"
    >
      {{ internalValue }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Clarity from '@microsoft/clarity'
import { useSliderDrag } from '@/composables/useSliderDrag'

const props = defineProps<{ modelValue: number; min: number; max: number }>()
const emits = defineEmits(['update:modelValue'])

const sliderContainer = ref<HTMLElement | null>(null)

const { internalValue, isDragging, percentage, startDrag } = useSliderDrag(
  sliderContainer,
  props,
  emits
)

const handleDragStart = (e: MouseEvent | TouchEvent) => {
  startDrag(e)
  Clarity.event('clickedDraggingScroll')
}
</script>

<style scoped>
#slider-handle {
  transform: translateY(50%);
}
.progress-bar {
}
.tick {
  transform: translateX(-50%);
}
</style>
