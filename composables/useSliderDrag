import { computed, ref, onBeforeUnmount, watch } from 'vue'
import type { Ref } from 'vue'

interface SliderProps {
  modelValue: number
  min: number
  max: number
}

export function useSliderDrag(
  sliderContainer: Ref<HTMLElement | null>,
  props: SliderProps,
  emits: (e: 'update:modelValue', value: number) => void
) {
  const internalValue = ref(props.modelValue)
  const isDragging = ref(false)

  const snapPercentages = [0, 25, 50, 75, 99, 100]

  watch(
    () => props.modelValue,
    newVal => {
      if (newVal !== internalValue.value) {
        internalValue.value = newVal
      }
    }
  )

  const percentage = computed(() => {
    if (props.max - props.min === 0) return 0
    return ((internalValue.value - props.min) / (props.max - props.min)) * 100
  })

  function startDrag(e: MouseEvent | TouchEvent) {
    isDragging.value = true
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('touchmove', onMouseMove, { passive: false })
    document.addEventListener('touchend', stopDrag)
    onMouseMove(e)
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

    let bestSnapValue: number | null = null
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

  return {
    internalValue,
    isDragging,
    percentage,
    startDrag
  }
}
