<template>
  <h1>Ask Wiki:</h1>
  <div class="block">
    <button v-if="isListening" @click="onStart">Send</button>
    <button v-else @click="onStart" :disabled="isPlaying && result.length">
      Start
    </button>
    <button @click="onStop">Stop</button>
  </div>
  <div class="block">
    <button @click="speech.stop()">Mute</button>
    <button @click="result = answer = ''">Clear</button>
  </div>

  <p v-if="result">Question: {{ result }}</p>
  <hr />
  <p>Answer: {{ answer }}</p>
</template>
<script setup>
  import { useVoice } from './composables/voiceComposable.js'
  const { isListening, result, answer, onStart, onStop, isPlaying } = useVoice()
</script>
