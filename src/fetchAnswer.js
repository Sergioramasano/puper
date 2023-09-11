import axios from 'axios';
const OPENAI_API_KEY = import.meta.env.VITE_VUE_APP_OPENAI_API_KEY;
const model = 'ada'
export async function fetchAnswer(question) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
			{
        model,
        organization: "org-home",
        prompt: question,
        max_tokens: 2049, // Adjust this based on your needs
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].text;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}