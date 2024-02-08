<script setup>
defineProps({
  imageUrl: String,
  description: String,
  title: String
})
</script>

<template>
  <div v-auto-animate class="flex flex-col items-center text-center mt-10">
    <img class="h-70 w-70" :src="imageUrl" alt="{{ title }}" />
    <h2 class="mt-4 text-2xl font-medium">{{ title }}</h2>
    <p class="mt-2 text-slate-400">{{ description }}</p>
  </div>
</template>

<style></style>
