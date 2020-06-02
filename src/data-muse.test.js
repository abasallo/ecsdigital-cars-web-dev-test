import 'dotenv/config'

import { expect } from '@jest/globals'

import { fewWordsSoundingLike } from './data-muse'

const DEFAULT_MAX_PARAGRAPH_LENGTH = 50 // TODO - Extract to common constant holder

test('Should return a short paragraph with words sounding similar to the provided', async () => {
  const similarSoundingParagraph = await fewWordsSoundingLike('test')
  expect(similarSoundingParagraph.length).toBeGreaterThan(0)
  expect(similarSoundingParagraph.length).toBeLessThanOrEqual(
    Number(process.env.WORDS_SOUNDING_SIMILAR_TO_MODEL_MAX_PARAGRAPH_LENGTH) || DEFAULT_MAX_PARAGRAPH_LENGTH
  )
})
