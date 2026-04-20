const Authorization = import.meta.env.VITE_DEEPSEEK_API_KEY

export const chatToDeepseekApi = (content: string) =>
  fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content }],
      stream: true
    })
  })
