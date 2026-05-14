const DeepseekApiAuthorization = import.meta.env.VITE_DEEPSEEK_API_KEY
const OpenAIApiAuthorization = import.meta.env.VITE_OPENAI_API_KEY
const QianWenApiAuthorization = import.meta.env.VITE_QIANWEN_API_KEY

export const chatToDeepseekApi = ({ prompt, signal }: { prompt: string; signal: any }) =>
  fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: DeepseekApiAuthorization
    },
    signal,
    body: JSON.stringify({
      model: 'deepseek-v4-flash',
      messages: [{ role: 'user', content: prompt }],
      stream: true
    })
  })

export const getDeepSeekImageApi = (content: string) =>
  fetch('https://api.deepseek.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: DeepseekApiAuthorization
    },
    body: JSON.stringify({
      model: 'deepseek-v4',
      prompt: content,
      size: '1024x1024',
      quality: 'hd',
      n: 1
    })
  })

export const chatToOpenAIApi = (content: string) =>
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: OpenAIApiAuthorization
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content }],
      stream: true
    })
  })

export const chatToQianWenApi = (content: string) =>
  fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: QianWenApiAuthorization
    },
    body: JSON.stringify({
      // model: 'qwen-max',
      model: 'qwen-plus',
      // model: 'qwen3.6-plus',
      messages: [{ role: 'user', content }],
      stream: true
    })
  })

export const getQianWenImageApi = (content: string) =>
  fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: QianWenApiAuthorization,
      'X-DashScope-Async': 'enable'
    },
    body: JSON.stringify({
      model: 'qwen-image-plus',
      input: {
        prompt: content
      },
      parameters: {
        size: '1024*1024',
        n: 1
      }
    })
  })

export const getQianWenImageTaskIdApi = (prompt: string) =>
  fetch('/api/dashscope/api/v1/services/aigc/text2image/image-synthesis', {
    method: 'POST',
    headers: {
      Authorization: QianWenApiAuthorization,
      'Content-Type': 'application/json',
      'X-DashScope-Async': 'enable' // 关键：启用异步
    },
    body: JSON.stringify({
      model: 'qwen-image-plus',
      input: {
        prompt
      },
      parameters: {
        size: '928*1664',
        n: 1
      }
    })
  })

export const getQianWenPollImageApi = (taskId: string) =>
  fetch(`/api/dashscope/api/v1/tasks/${taskId}`, {
    headers: {
      Authorization: QianWenApiAuthorization
    }
  })

export const editQianWenImageApi = (prompt: string, imageUrl: string) =>
  fetch('/api/dashscope/api/v1/services/aigc/multimodal-generation/generation', {
    method: 'POST',
    headers: {
      Authorization: QianWenApiAuthorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen-image-2.0-pro',
      input: {
        messages: [
          {
            role: 'user',
            content: [
              {
                // image: 'https://himg2.huanqiucdn.cn/attachment2010/2020/0531/20200531081222501.jpg'
                image: imageUrl
              },
              {
                text: prompt
              }
            ]
          }
        ]
      },
      parameters: {
        n: 1
      }
    })
  })
