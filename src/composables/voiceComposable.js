import { useSpeechRecognition, useSpeechSynthesis } from '@vueuse/core'
import { getWikiAnswer } from '../getWikiAnswer.js'
import { ref, onMounted, computed, watch } from 'vue'

export const useVoice = () => {
  //DATA
  const voice = ref(undefined)
  const pitch = ref(1)
  const rate = ref(0.7)
  const answer = ref('')

  //COMPOSABLES
  const speech = useSpeechSynthesis(answer, {
    voice,
    pitch,
    rate
  })

  const { isSupported, isListening, result, start, stop } =
    useSpeechRecognition()

  //METHODS
  const onStart = async () => {
    if (isListening.value) {
      stop()
      onFinalResult()
    } else {
      answer.value = ''
      result.value = ''
      start()
    }
  }
  const onStop = async () => {
    stop()
    speech.stop()
    result.value = ''
  }
  const onFinalResult = async () => {
    try {
      const question = result.value.trim()
      if (question) {
        answer.value = await getWikiAnswer(question)
        speech.speak()
      }
    } catch (error) {
      answer.value = error.message
      speech.speak()
      console.error(error.message, error)
    }
  }
  const changeVoiceType = () => {
    if (isSupported) {
      const TIME = 300
      setTimeout(() => {
        const synth = window.speechSynthesis
        const textToSpeak = 'Hello'
        const voices = synth.getVoices()

        const getLanguageFromVoice = (voice) => {
          return voice.lang.split('-')[0]
        }

        const textLanguage = detectLanguage(textToSpeak)

        const matchingVoice = voices.find((voice) => {
          const voiceLanguage = getLanguageFromVoice(voice)
          return voiceLanguage === textLanguage
        })

        if (matchingVoice) {
          voice.value = matchingVoice
        } else {
          voice.value = voices[0]
        }
      }, TIME)
    }
  }

  const detectLanguage = (text) => {
    return 'en'
  }

  const isPlaying = computed(() => {
    return speech.isPlaying
  })

  //WATCH
  watch(speech.isPlaying, (newValue) => {
    if (!newValue) {
      result.value = ''
    }
  })

  //LIFECYCLE HOOKS
  onMounted(() => {
    changeVoiceType()
	})
	
  return {
    isSupported,
    isListening,
    result,
    answer,
    onStart,
    onStop,
    onFinalResult,
    isPlaying
  }
}
