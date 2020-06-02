import axios from 'axios'

const WORDS_SOUNDING_SIMILAR_TO_MUSE_URL = 'https://api.datamuse.com/words?sl=' // TODO - Extract to common constant holder
const DEFAULT_MAX_PARAGRAPH_LENGTH = 50 // TODO - Extract to common constant holder

export const fewWordsSoundingLike = async (model) => {
  const response = await axios.get(`${WORDS_SOUNDING_SIMILAR_TO_MUSE_URL}${model}`)

  let result = ''
  const maxLength = process.env.WORDS_SOUNDING_SIMILAR_TO_MODEL_MAX_PARAGRAPH_LENGTH || DEFAULT_MAX_PARAGRAPH_LENGTH
  for (const responseObject of response.data) {
    if (maxLength >= result.length + responseObject.word.length) result += responseObject.word + ' '
    else break
  }

  return result.trim()
}
