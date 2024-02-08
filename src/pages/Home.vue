<script setup>
import { ref, onMounted, reactive, watch, inject } from 'vue'
import axios from 'axios'
import CardList from '../components/CardList.vue'

const { cart, addToCart, removeFromCart } = inject('cart')

const items = ref([])

const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}
const onInputSearch = (event) => {
  filters.searchQuery = event.target.value
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        parentId: item.id,
        item_id: item.id
      }
      const { data } = await axios.post(`https://1ae71866a1d4e1f2.mokky.dev/favorites`, obj)

      item.isFavorite = true
      item.favoriteId = data.id
    } else {
      await axios.delete(`https://1ae71866a1d4e1f2.mokky.dev/favorites/${item.favoriteId}`)

      item.isFavorite = false
      item.favoriteId = null
    }
  } catch (err) {
    console.error(err)
  }
}

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
    }

    if (filters.searchQuery) params.title = `*${filters.searchQuery}*`

    const { data } = await axios.get(`https://1ae71866a1d4e1f2.mokky.dev/items`, {
      params
    })
    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      isAdded: false
    }))
  } catch (err) {
    console.error(err)
  }
}

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`https://1ae71866a1d4e1f2.mokky.dev/favorites`)

    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.parentId === item.id)

      if (!favorite) {
        return item
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id,
        isAdded: false
      }
    })
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  const localCart = localStorage.getItem('cart')

  cart.value = localCart ? JSON.parse(localCart) : []

  await fetchItems()
  await fetchFavorites()

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false
  }))
})

watch(filters, fetchItems)
</script>

<template>
  <div class="p-10 gap-4">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

      <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
        <option value="name">По названию</option>
        <option value="price">По цене(Дешевые)</option>
        <option value="-price">По цене(Дорогие)</option>
      </select>

      <div class="relative">
        <img class="absolute left-4 top-3" src="/search.svg" alt="search" />
        <input
          @input="onInputSearch"
          type="text"
          placeholder="Поиск..."
          class="w-full border rounded-md py-2 pl-10 pr-4 outline-none focus:border-gray-400"
        />
      </div>
    </div>
  </div>
  <div>
    <CardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="onClickAddPlus" />
  </div>
</template>
