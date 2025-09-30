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
        @mousedown="startDrag"
        @touchstart.prevent="startDrag"
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
import Clarity from '@microsoft/clarity'
import { computed, ref, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{ modelValue: number; min: number; max: number }>()
const emits = defineEmits(['update:modelValue'])
const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  newVal => {
    if (newVal !== internalValue.value) {
      internalValue.value = newVal
    }
  }
)

const sliderContainer = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const percentage = computed(() => {
  if (props.max - props.min === 0) return 0
  return ((internalValue.value - props.min) / (props.max - props.min)) * 100
})

const snapPercentages = [0, 25, 50, 75, 99, 100]

function startDrag(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onMouseMove, { passive: false })
  document.addEventListener('touchend', stopDrag)
  onMouseMove(e)
  Clarity.event('clickedDraggingScroll')
}

function stopDrag() {
  if (!isDragging.value) return

  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onMouseMove)
  document.removeEventListener('touchend', stopDrag)
}

function onMouseMove(e: MouseEvent | TouchEvent) {
  if (!sliderContainer.value) return
  const track = sliderContainer.value.querySelector('.relative.h-48.w-1')
  if (!track) return

  const rect = track.getBoundingClientRect()
  const clientY = 'touches' in e && e.touches.length ? e.touches[0].clientY : (e as MouseEvent).clientY

  let pos = rect.bottom - clientY
  pos = Math.max(0, Math.min(pos, rect.height))

  const valueSpan = props.max - props.min
  const valueFromMouse = props.min + (pos / rect.height) * valueSpan

  const snapThreshold = valueSpan * 0.05

  const snapPoints = snapPercentages.map(p => props.min + (p / 100) * valueSpan)

  let bestSnapValue = null
  let minDifference = Infinity

  for (const sp of snapPoints) {
    const diff = Math.abs(valueFromMouse - sp)
    if (diff <= snapThreshold && diff < minDifference) {
      minDifference = diff
      bestSnapValue = sp
    }
  }

  let finalValue
  if (bestSnapValue !== null) {
    finalValue = Math.round(bestSnapValue)
  } else {
    finalValue = Math.round(valueFromMouse)
  }

  finalValue = Math.max(props.min, Math.min(props.max, finalValue))

  if (internalValue.value !== finalValue) {
    internalValue.value = finalValue
    emits('update:modelValue', finalValue)
  }
}

onBeforeUnmount(() => {
  stopDrag()
})
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
