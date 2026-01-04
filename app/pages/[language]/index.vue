<script setup>
import '~/assets/css/language.css'

const route = useRoute()

const {
  data: languages_data,
  pending: languages_pending,
  error: languages_err,
} = useFetch('/content/languages.json', { server: false })

const language = computed(() =>
  languages_data.value?.find(lang => lang.page_name === route.params.language)
)

const data = JSON.parse(localStorage.getItem("data")) || {}
const get_local_stats = (index) => {

  const name = route.params.language

  if (data.hasOwnProperty(name) && data[name].hasOwnProperty(index)) {
    const list = data[name][index]

    return [Math.min(...list), list.at(-1)]
  }

  return [0, 0]
}


const {
  data: exercise_data,
  pending: exercise_pending,
  error: exercise_err
} = useFetch(() => `/content/${route.params.language}.json`, {
  server: false
})
</script>

<template>
  <div v-if="languages_data">
    <div class="title">
      <NuxtImg :src="language.img" width="100" />
      <h1>{{ language.display_name }}</h1>
    </div>

    <div v-for="(exercise, index) in exercise_data" class="exercise-holder">
      <NuxtLink class="exercise" :to="`/${language.page_name}/${index}`">
        <div class="info">
          <h1>{{ exercise.name }}</h1>
          <h2>characters: {{ exercise.content.length }}</h2>
        </div>
        <div class="stats">
          <h3>
            <p>Fasted</p>
            <TimeDisplay :number="get_local_stats(index)[0]" :highlight="true" />
          </h3>
          <h3>
            <p>Latest</p>
            <TimeDisplay :number="get_local_stats(index)[1]" :highlight="true" />
          </h3>
        </div>
      </NuxtLink>
    </div>


  </div>
</template>
