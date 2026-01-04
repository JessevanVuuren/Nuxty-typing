<!-- https://github.com/devicons/devicon -->
<!-- https://svgl.app/?search=python -->
<script setup>
import '~/assets/css/index.css'

const { data, pending, error, refresh } = await useFetch("/content/languages.json", {server:false})

</script>

<template>
  <div class="languages-holder">
    <div v-for="lang in data">
      <NuxtLink class="language" :to="`/${lang.page_name}`">
        <div class="language-hover">
          <NuxtImg :src="lang.img" width="100" />
        </div>
        <NuxtImg :src="lang.img" width="60" />
        <div class="language-text">
          <h1>{{ lang.display_name }}</h1>
          <h2>exercises: {{ lang.exercises }}</h2>
        </div>
      </NuxtLink>
    </div>
  </div>



</template>
