<template>
  <div
    ref="sceneContainer"
    class="canvas-wrapper h-full w-full relative"
  >
    <!-- Main scene canvas -->
    <canvas
      ref="sceneContainerCanv"
      class="cursor-pointer"
    />

    <!-- Navicube scene -->
    <div
      ref="cubeScene"
      class="hidden md:block absolute cursor-pointer"
      :class="isReduced ? 'right-2' : 'right-16'"
    >
      <canvas ref="cubeSceneCanv" />
    </div>

    <!-- Axis scene -->
    <div
      ref="axisScene"
      class="hidden"
    >
      <canvas ref="axisSceneCanv" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isReduced: { type: Boolean, default: false },
  modelId: { type: [Number, String], default: null }
})

const sceneContainer = ref<HTMLElement | null>(null)
const sceneContainerCanv = ref<HTMLCanvasElement | null>(null)
const cubeScene = ref<HTMLElement | null>(null)
const cubeSceneCanv = ref<HTMLCanvasElement | null>(null)
const axisScene = ref<HTMLElement | null>(null)
const axisSceneCanv = ref<HTMLCanvasElement | null>(null)

const { startWorld } = useThreeJs()

onMounted(() => {
  startWorld(sceneContainer, sceneContainerCanv, cubeScene, cubeSceneCanv, axisScene, axisSceneCanv)
})
</script>
