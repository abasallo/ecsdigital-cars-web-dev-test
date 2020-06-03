import 'dotenv/config'

import constants from './constants'

import { expect } from '@jest/globals'

import { fewWordsSoundingLike } from './data-muse'

import axios from 'axios'

jest.mock('axios')

test('Should return a short paragraph with words sounding similar to the provided', async () => {
  axios.get.mockImplementationOnce((_) => ({ data: [{ word: _ }] }))

  const similarSoundingParagraph = await fewWordsSoundingLike('test')

  expect(similarSoundingParagraph).toBe(`${constants.WORDS_SOUNDING_SIMILAR_TO_MUSE_URL}test`)
})
