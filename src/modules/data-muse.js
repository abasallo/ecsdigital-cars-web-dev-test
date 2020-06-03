import constants from './constants'

import axios from 'axios'

export const fewWordsSoundingLike = async (model) => {
  const response = await axios.get(`${constants.WORDS_SOUNDING_SIMILAR_TO_MUSE_URL}${model}`)

  let result = ''
  const maxLength = process.env.WORDS_SOUNDING_SIMILAR_TO_MODEL_MAX_PARAGRAPH_LENGTH || constants.DEFAULT_MAX_PARAGRAPH_LENGTH
  for (const responseObject of response.data) {
    if (maxLength >= result.length + responseObject.word.length) result += responseObject.word + ' '
    else break
  }

  return result.trim()
}
