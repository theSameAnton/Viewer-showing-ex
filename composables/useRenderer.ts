import { ref, markRaw } from 'vue'
import { World } from '@/three/World'

const rendererRef = ref<World>()

export function useRenderer() {
  const setRenderer = (value: World) => {
    rendererRef.value = markRaw(value)
  }

  return {
    rendererRef,
    setRenderer
  }
}
