import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useFullScreen() {
  const isFullScreen = ref(!!document.fullscreenElement)

  const handleFullScreenChange = () => {
    isFullScreen.value = !!document.fullscreenElement
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', handleFullScreenChange)
  })

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen?.()
    }
  }

  return {
    isFullScreen,
    toggleFullScreen
  }
}
