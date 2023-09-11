<script setup>
import { useSpeechRecognition, useSpeechSynthesis } from '@vueuse/core'
import { fetchAnswer } from './fetchAnswer.js';
import { getWikiAnswer } from './getWikiAnswer.js';
import { ref, onMounted } from "vue"
//DATA
const voice = ref(undefined)
const pitch = ref(1)
const rate = ref(0.8)
const answer = ref('')
let synth;
const voices = ref([])
const speech = useSpeechSynthesis(answer, {
  voice,
  pitch,
  rate,
})
const {
  isSupported,
  isListening,
  result,
  start,
  stop,
} = useSpeechRecognition()

//METHODS
const onStart = async () => {
  answer.value = ''
  result.value = ''
  start()
}
const onStop = async () => {
  stop()
  onFinalResult()
}
const onFinalResult = async () => {
  try {
    const question = result.value.trim();
    if (question) {
      // answer.value = await fetchAnswer(question) ask to ai (now it's paid)
      answer.value = await getWikiAnswer(question)
      speech.speak()
    }
  } catch (error) {
    answer.value = error.message
    speech.speak()
    console.error(error.message, error);
  }
}
const changeVoiceType = () => {
  if (isSupported) {
    // load at last
    const TIME = 300
    const VOICE_INDEX = 66
    setTimeout(() => {
      synth = window.speechSynthesis
      voices.value = synth.getVoices()
      voice.value = voices.value[VOICE_INDEX]
    }, TIME)
  }
}
//LIFECYCLE HOOKS
onMounted(() => {
  changeVoiceType()
})
</script>

<template>
  <h1>Ask something:</h1>
  <div class="block">
   <button
        @click="onStart"
        :disabled="isListening"
      >Start</button>
      <button
        @click="onStop"
        :disabled="!isListening"
    >Stop</button>
  </div>
  <div class="block">
   <button
        @click="speech.stop()"
    >Mute</button>
    <button @click="result = answer = ''">Clear</button>
  </div>
   
  <p>Question: {{ result }}</p>
  <hr>
  <p>Answer: {{ answer }}</p>
</template>