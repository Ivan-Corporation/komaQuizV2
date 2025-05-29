import api from "./axios";

export const generateQuiz = async (topic: string, numQuestions = 5) => {
  const res = await api.post('/generate-quiz', {
    topic,
    num_questions: numQuestions,
  });
  return res.data;
};