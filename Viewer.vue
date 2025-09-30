<template>
  <div
    class="relative w-full h-full"
    :class="!showingStatic ? 'bg-gray-94' : ''"
  >
    <NavBar
      v-if="!isReduced"
      class="absolute top-0 p-6 z-50 w-fit"
      :showing-static="showingStatic"
      :is-reduced="isReduced"
      @update:showing-static="updateStatic"
    />
    <div
      v-if="!isReduced"
      class="hidden absolute md:flex flex-col gap-2 p-6 top-0 right-0 z-50"
    >
      <FullScreen :class="showingStatic ? 'bg-gray-96/75' : 'bg-white/75'" />
      <Slider
        v-if="!showingStatic"
        v-model="sliderValue"
        :min="min"
        :max="max"
      />
    </div>
    <div class="absolute p-6 bottom-0 z-50 w-full">
      <BottomNav
        v-if="!isReduced"
        v-show="!showingStatic"
        :model-name="glbFile.name.substring(0, glbFile.name.lastIndexOf('.'))"
        :parameters="parameters"
        :source-file="sourceFile"
      />
    </div>
    <div class="w-full h-full">
      <div
        v-show="isLoading"
        class="absolute inset-0 flex items-center justify-center z-20"
      >
        <IconsLoading
          name="eos-icons:loading"
          class="size-16 text-primary-dark-blue"
        />
      </div>

      <ThreeJsPlate
        v-show="!showingStatic"
        :is-loading="isLoading"
        :is-reduced="isReduced"
        :model-id="modelId"
        @started="isStarted = true"
      />

      <div
        v-show="showingStatic"
        class="absolute inset-0 flex items-center justify-center z-20"
      >
        <img
          :src="imageFile.contentUrl"
          alt="Static Preview"
          class="object-contain w-full h-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ViewerAPI } from '@/three/viewer/ViewerAPI.ts'
import type { ModelParameters, CustomFile } from '@/types'

const props = defineProps({
  isReduced: { type: Boolean, default: false },
  modelId: { type: [Number, String], default: null },

  sourceFile: {
    type: Object as PropType<CustomFile | undefined>,
    default: undefined
  },
  glbFile: { type: Object as PropType<CustomFile>, default: () => ({ name: '', contentUrl: '' }) },
  imageFile: { type: Object as PropType<CustomFile>, default: () => ({ name: '', contentUrl: '' }) },
  parameters: {
    type: Object as PropType<ModelParameters>,
    default: () => ({
      nodes: 0,
      lines: 0,
      members: 0,
      surfaces: 0,
      solids: 0,
      loadCases: 0,
      loadCombinations: 0,
      resultCombinations: 0,
      totalWeight: '',
      dimensionsMetric: '',
      dimensionsImperial: ''
    })
  }
})

const render = useRenderer()
const isStarted = ref(false)

const { min, max, sliderValue, start, stop } = useCameraZoom()

onMounted(() => {
  start()
})

onBeforeUnmount(() => {
  stop()
})

const isLoading = ref(true)
const showingStatic = ref(false)

const updateStatic = (value: boolean) => {
  showingStatic.value = value
}

watch(
  isStarted,
  async newVal => {
    if (newVal) {
      await render.rendererRef.value?.loadGLBModel(props.glbFile.contentUrl)
      ViewerAPI.resetToDefaultView()
      isLoading.value = false
    }
  },
  { immediate: true }
)

const onResize = () => {
  ViewerAPI.resetToDefaultView()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>
