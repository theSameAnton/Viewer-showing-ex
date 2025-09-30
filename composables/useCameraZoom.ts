import { ref, watch } from 'vue'
import { ViewerAPI } from '@/three/viewer/ViewerAPI'

const min = 0
const max = 100
const sliderValue = ref(24)
const cameraZoom = ref(0)

function mapSliderValueToZoom(val: number): number {
  return 0.0008 + (val / 100) * 0.5
}
function mapZoomToSliderValue(zoom: number): number {
  return ((zoom - 0.0008) * 100) / 0.5
}

function setCameraZoom(newZoom: number) {
  cameraZoom.value = newZoom
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()
  const cam = ViewerAPI.getSceneCamera()
  if (!cam) return
  const factor = 1 - e.deltaY * 0.001
  const newZoom = cam.zoom * factor
  cam.zoom = newZoom
  cam.updateProjectionMatrix()
  cameraZoom.value = newZoom
}

export function useCameraZoom() {
  const isInitialized = ref(false)
  const start = () => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    const cam = ViewerAPI.getSceneCamera()
    if (cam) {
      cameraZoom.value = cam.zoom
      sliderValue.value = Math.floor(Math.max(min, Math.min(max, mapZoomToSliderValue(cam.zoom))))
    }

    watch(sliderValue, val => {
      const newZoom = mapSliderValueToZoom(val)
      const cam = ViewerAPI.getSceneCamera()
      if (cam) {
        cam.zoom = newZoom
        cam.updateProjectionMatrix()
      }
      cameraZoom.value = newZoom
    })

    watch(cameraZoom, zoom => {
      const newVal = Math.round(Math.max(min, Math.min(max, mapZoomToSliderValue(zoom))))
      if (sliderValue.value !== newVal) {
        sliderValue.value = newVal
      }
      const cam = ViewerAPI.getSceneCamera()
      if (cam && Math.abs(cam.zoom - zoom) > 1e-6) {
        cam.zoom = zoom
        cam.updateProjectionMatrix()
      }
    })

    isInitialized.value = true
  }

  const stop = () => {
    window.removeEventListener('wheel', handleWheel)
    isInitialized.value = false
  }

  return { min, max, sliderValue, cameraZoom, start, stop, setCameraZoom }
}
