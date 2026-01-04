<script setup>
import '~/assets/css/exercise.css'

const route = useRoute()

const { data: languages_data, pending: languages_pending, error: languages_err,
} = useFetch('/content/languages.json', { server: false })

const { data: exercise_data, pending: exercise_pending, error: exercise_err
} = useFetch(() => `/content/${route.params.language}.json`, { server: false })

const exercise = computed(() => exercise_data.value?.[route.params.exercise])
const language = computed(() => languages_data.value?.find(lang => lang.page_name === route.params.language))


const actual_text = computed(() => exercise.value?.content.substring(0, position.value) || '')
const error_text = computed(() => exercise.value?.content.substring(0, error_position.value) || '')

const curser = useTemplateRef("curser")

const hint_code = useTemplateRef("hint_code")
const typed_code = useTemplateRef("typed_code")
const error_code = useTemplateRef("error_code")

const fasted_time = ref(0)
const latest_time = ref(0)
const elapsed_time = ref(0)

const position = ref(0)
const error_position = ref(0)

let idle = 0
let start_counter
let update_counter
let curser_animation;

const clamp = (num, min, max) => {
  return num <= min ? min : num >= max ? max : num
}

const tick = (now) => {
  elapsed_time.value = (now - start_counter) / 1000
  update_counter = requestAnimationFrame(tick)
}

const key_press_handler = (e) => {
  idle = 0
  curser.value.style.display = "block"
  const char = exercise.value?.content[position.value]
  const max = exercise.value?.content.length

  console.log(e)

  if (e.key == "Enter" && char == "\n" || e.code == "Quote" && char == "\"" || e.code == "Backquote" && char == "`" || e.key == "Tab" && char == "\t" || e.key === char) {
    if (position.value === error_position.value) {
      position.value++
      error_position.value++
    }
  } else if (!e.key.includes("Shift") && e.key !== "Backspace") {
    error_position.value++
  }

  if (e.key === "Backspace") {
    error_position.value--
    if (error_position.value < position.value) {
      position.value--
    }
  }

  position.value = clamp(position.value, 0, max)
  error_position.value = clamp(error_position.value, 0, max)

  if (position.value == 1) {
    start_counter = performance.now()
    update_counter = requestAnimationFrame(tick)
  }

  if (position.value >= max) {
    cancelAnimationFrame(update_counter)
    save_stats()
  }
}

const save_stats = () => {
  let data = JSON.parse(localStorage.getItem("data")) || {}
  const name = route.params.language
  const exc = route.params.exercise


  if (data.hasOwnProperty(name)) {
    if (data[name].hasOwnProperty(exc)) {
      data[name][exc].push(elapsed_time.value)
    } else {
      data[name][exc] = [elapsed_time.value]
    }
  } else {
    const score = {}
    score[exc] = [elapsed_time.value]
    data[name] = score
  }

  localStorage.setItem("data", JSON.stringify(data))
}

const reset = () => {
  position.value = 0
  elapsed_time.value = 0
  error_position.value = 0
  cancelAnimationFrame(update_counter)
  get_local_stats()
}

watch(actual_text, async () => {
  await nextTick()

  const lines = typed_code.value.el.querySelectorAll("span.line")
  const last_line_rect = lines[lines.length - 1].getBoundingClientRect()

  const hint_code_rect = hint_code.value.el.getBoundingClientRect()
  const hint_code_lines = hint_code.value.el.querySelectorAll("span.line").length

  const height_per_line = hint_code_rect.height / hint_code_lines

  curser.value.style.marginLeft = last_line_rect.width + "px"
  curser.value.style.marginTop = (lines.length - 1) * height_per_line + "px"
})

const curser_interval = () => {
  idle++
  if (idle > 2) {
    curser.value.style.display = curser.value.style.display === "block" ? "none" : "block"
  }
}

const get_fasted_time = (elapsed_time, fasted_time, latest_time) => {
  if (latest_time === 0 && fasted_time === 0) return elapsed_time
  if (elapsed_time < fasted_time && elapsed_time !== 0) return elapsed_time
  return fasted_time
}


const get_local_stats = () => {
  const data = JSON.parse(localStorage.getItem("data")) || {}

  const name = route.params.language
  const exc = route.params.exercise

  if (data.hasOwnProperty(name) && data[name].hasOwnProperty(exc)) {
    const list = data[name][exc]

    fasted_time.value = Math.min(...list)
    latest_time.value = list.at(-1)
  }
}

onMounted(() => {
  curser_animation = setInterval(curser_interval, 700)
  get_local_stats()
  document.addEventListener('keydown', key_press_handler)
})

onBeforeUnmount(() => {
  clearInterval(curser_animation)
  cancelAnimationFrame(update_counter)
  document.removeEventListener('keydown', key_press_handler)
})

</script>

<template>

  <div v-if="exercise">

    <div class="title" v-if="language">
      <NuxtImg :src="language.img" width="100" />
      <h1>{{ exercise.name }}</h1>
    </div>

    <div class="score-holder">
      <div class="score">
        <div class="current">
          <TimeDisplay :number="elapsed_time" :font_size=30 :highlight="true" />
        </div>
        <div class="stats">
          <h3>
            <p>Fasted</p>
            <TimeDisplay :number="get_fasted_time(elapsed_time, fasted_time, latest_time)" :highlight="true" />
          </h3>
          <h3>
            <p>Latest</p>
            <TimeDisplay :number="elapsed_time === 0 ? latest_time : elapsed_time" :highlight="true" />
          </h3>
        </div>
      </div>
    </div>

    <div class="tool-tip-holder">
      <div class="tool-tip">
        <h2>The timer begins as soon as you start typing.</h2>
        <h2>{{ actual_text.length }}<span class="high-color"> / </span>{{ exercise.content.length }}</h2>
      </div>
    </div>

    <div class="text-input">
      <span class="textarea" style="white-space: pre-line">

        <Shiki tabindex="-1" lang="python" :code="actual_text" as="span" class="code-text code-text-actual"
          ref="typed_code" />
        <div class="curser-holder">
          <div class="curser" ref="curser" />
        </div>
        <Shiki tabindex="-1" lang="python" :code="error_text" as="span" class="code-text code-text-error"
          ref="error_code" />
        <Shiki tabindex="-1" lang="python" :code="exercise.content" as="span" class="code-text code-text-hint"
          ref="hint_code" />
      </span>
    </div>

    <div class="buttons-holder">
      <div class="buttons">
        <UButton variant="outline" v-on:click="reset">Reset</UButton>
      </div>
    </div>

  </div>
</template>