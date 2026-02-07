export async function fetchWords() {
  const res = await fetch('/data/words.json')
  return res.json()
}

export function getRandomWordPair(wordsData) {
  const pairs = wordsData.word_pairs || []
  if (pairs.length === 0) return null
  return pairs[Math.floor(Math.random() * pairs.length)]
}
