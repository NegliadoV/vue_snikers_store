<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import CardList from '../components/CardList.vue'

const favorites = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `https://1ae71866a1d4e1f2.mokky.dev/favorites?_relations=items`
    )

    favorites.value = data.map((obj) => obj.item)
  } catch (err) {
    console.log(err)
  }
})
</script>

<template>
  <div class="mt-10 px-10">
    <h2 class="text-3xl font-bold mb-8">Закладки</h2>
    <CardList :items="favorites" is-favorites is-added />
  </div>
</template>
