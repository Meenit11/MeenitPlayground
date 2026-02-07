export function getQuestionTier(playerCount) {
  if (playerCount >= 10) return 'tier1_broad'
  if (playerCount >= 5) return 'tier2_medium'
  return 'tier3_narrow'
}

export async function fetchQuestions() {
  const res = await fetch('/data/questions.json')
  return res.json()
}

export function getRandomQuestion(questionsData, tier) {
  const tierData = questionsData[tier]
  if (!tierData || !tierData.questions?.length) return null
  const questions = tierData.questions
  return questions[Math.floor(Math.random() * questions.length)]
}
