import { useState, useRef, memo, useMemo } from 'react'
import styled from 'styled-components'
import { Input } from 'antd'
import { useMemoizedFn } from 'ahooks'
import { nanoid } from 'nanoid'
import { chatToDeepseekApi } from './api'
import hljs from 'highlight.js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css'

const { TextArea } = Input
const LOADING_TIP = 'loading...'

const CodeHighlighter = memo(({ code, language }: any) => {
  const [copied, setCopied] = useState(false)

  const highlightedHtml = useMemo(() => {
    const result = hljs.highlight(code, {
      language: language,
      ignoreIllegals: true
    })
    return result.value
  }, [code, language])

  const handleCopy = useMemoizedFn(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  })

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="language">{language}</span>
        <button onClick={handleCopy} className="copy-btn">
          {copied ? '✓ 已复制' : '📋 复制'}
        </button>
      </div>
      <pre>
        <code
          className={`language-${language} hljs`}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  )
})

function AiChat() {
  const [content, setContent] = useState('')
  const inpKeyRef = useRef(nanoid())
  const [isInpDisabled, setIsInpDisabled] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useMemoizedFn(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  })

  const submitFunc = useMemoizedFn(async (e) => {
    const inpTxt = e?.target?.value?.trim() || ''
    if (!inpTxt) return

    inpKeyRef.current = nanoid()
    setIsInpDisabled(true)
    setContent(LOADING_TIP)

    const res = await chatToDeepseekApi(inpTxt)
    const decoder = new TextDecoder()
    const reader = res.body?.getReader()
    let fullContent = ''

    while (true && reader) {
      const { done, value } = (await reader.read()) as any
      if (done) {
        setIsInpDisabled(false)
        scrollToBottom()
        break
      }

      const lines = decoder
        ?.decode(value)
        ?.split('\n')
        ?.filter((line) => line.startsWith('data:'))

      for (const line of lines) {
        const formatLine = line.slice(6)
        if (formatLine === '[DONE]') break

        const msg = JSON.parse(formatLine)?.choices[0]?.delta?.content || ''
        if (msg) {
          fullContent += msg
          setContent(fullContent) // 实际更新
        }
      }
    }
  })

  return (
    <LayoutWrapper>
      <div className="top">AI Chat</div>
      <div className="content" ref={contentRef}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')
              const language = match ? match[1] : ''

              if (!inline && language) {
                return (
                  <CodeHighlighter language={language} code={String(children).replace(/\n$/, '')} />
                )
              }

              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      <div className="bottom">
        <TextArea
          disabled={isInpDisabled}
          key={inpKeyRef.current}
          onPressEnter={submitFunc}
          placeholder="ask me any question is ok"
          autoSize={{ minRows: 5, maxRows: 5 }}
        />
      </div>
    </LayoutWrapper>
  )
}

export default AiChat

const LayoutWrapper = styled.div`
  background-color: #fff;
  height: 100vh;
  .top {
    height: 30px;
    font-weight: bolder;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #679efe;
  }
  .content {
    > span {
      color: #679efe;
    }
    height: calc(100% - 210px);
    overflow-y: scroll;
    padding-left: 12px;
    &::-webkit-scrollbar {
      width: 12px;
      height: 12px;
      background-color: #fff;
    }
    &::-webkit-scrollbar-track {
      background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 8px;
    }
  }
  .bottom {
    background-color: #fff;
    height: 180px;
    display: flex;
    align-items: center;
    padding: 12px;
    .btn {
      margin-left: auto;
    }
  }
`
