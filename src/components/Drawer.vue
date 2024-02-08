<script setup>
import { ref, watch, inject, computed } from 'vue'
import axios from 'axios'
import DrawerHead from './DrawerHead.vue'
import CartListItem from './CartListItem.vue'
import infoBlock from './infoBlock.vue'

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number
})

const isCreating = ref(false)
const orderId = ref(null)

const { cart, closeDrawer } = inject('cart')

const createOrder = async () => {
  try {
    isCreating.value = true
    const { data } = await axios.post(`https://1ae71866a1d4e1f2.mokky.dev/orders`, {
      items: cart.value,
      totalPrice: props.totalPrice.value
    })

    cart.value = []
    orderId.value = data.id
    return data
  } catch (err) {
    console.error(err)
  } finally {
    isCreating.value = false
  }
}

const cartIsEmpty = computed(() => cart.value.length === 0)

const cartButtonDisabled = computed(() => isCreating.value || cartIsEmpty.value)
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black opacity-70 z-10"></div>
  <div class="bg-white w-96 h-full z-20 fixed top-0 right-0 p-8">
    <DrawerHead />
    <div v-show="!totalPrice || orderId">
      <infoBlock
        title="Корзина пуста"
        imageUrl="/package-icon.png"
        description="Добавьте хотябы один товар, чтобы сделать заказ."
        v-show="!totalPrice && !orderId"
      />

      <infoBlock
        title="Заказ оформлен"
        imageUrl="/order-success-icon.png"
        :description="`Ваш заказ #${orderId} скоро будет передан курьерской доставке`"
        v-show="orderId"
      />
    </div>

    <CartListItem />

    <div v-show="!cartButtonDisabled" class="flex flex-col gap-4 mt-7">
      <div class="flex gap-2">
        <span>Итого:</span>
        <div class="flex-1 border-b border-dashed"></div>
        <b>{{ totalPrice }} руб.</b>
      </div>

      <div class="flex gap-2">
        <span>Налог 5%:</span>
        <div class="flex-1 border-b border-dashed"></div>
        <b>{{ vatPrice }} руб.</b>
      </div>
      <button
        :disabled="cartButtonDisabled"
        @click="createOrder"
        class="mt-4 disabled:bg-slate-400 cursor-pointer bg-lime-500 w-full rounded-xl py-3 text-white hover:bg-lime-600 transition-all active:bg-lime-700"
      >
        Оформить заказ
      </button>
    </div>
  </div>
</template>
