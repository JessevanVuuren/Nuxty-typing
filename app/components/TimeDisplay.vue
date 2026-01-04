<script setup>


defineProps({
  number: Number,
  font_size: Number,
  highlight: Boolean,
})

const get_ms = (number) => {
  let num = Math.round((number % 1) * 1000)

  if (num < 100) num = "0" + num
  if (num < 10) num = "0" + num

  return num
}

const get_sec = (number) => {
  let num = Math.floor(number % 60)

  if (num < 10) num = "0" + num

  return num
}

const get_min = (number) => {
  let num = Math.floor(number / 60)

  if (num < 10) num = "0" + num

  return num
}

</script>

<style>
.primaryHighlight {
  color: var(--ui-primary);
}
</style>

<template>
  <h1 :style="{ 'font-size': font_size + 'px' }">{{ get_min(number) }}<span
      :class="{ primaryHighlight: highlight }">:</span>{{ get_sec(number) }}<span
      :class="{ primaryHighlight: highlight }">:</span>{{ get_ms(number) }}
  </h1>
</template>