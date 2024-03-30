import axios from 'axios';

const processWikipediaResponse = (response) => {
  const sentences = response.data.extract.split(/[.!?]/);
  let speech = "";
  sentences.forEach((sentence) => {
    const trimmedSentence = sentence.trim();
    if (trimmedSentence.length === 0) {
      return;
    }
    speech += trimmedSentence + " ";
  });
  return `<speak>(Wiki): ${speech}</speak>`;
};

export async function getWikiAnswer(question) {
  try {
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${question}`, {
      maxRedirects: 5, // Allow up to 5 redirects
    });
    const statusCode = response.status;
    // Access and return the content only if the status code is 200
    if (response.status === 200) {
      return processWikipediaResponse(response);
    } else {
      console.error('Wikipedia returned a non-200 status code:', statusCode);
      // Optionally, you can throw an error here if you want to handle it differently
    }
  } catch (error) {
    console.error('An error occurred while fetching Wikipedia data:', error);
    throw error;
  }
}