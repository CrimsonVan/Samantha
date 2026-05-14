import React, { memo, useMemo, useState } from 'react'

import { Table, message } from 'antd'

import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

// 递归提取 React 节点中的纯文本
const extractTextFromNode = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join('')
  }
  if (React.isValidElement(node)) {
    return extractTextFromNode(node.props?.children)
  }
  return ''
}

function AiReplyContent({
  content,
  getContainer = () => document.body
}: {
  content: string
  getContainer?: () => HTMLElement
}) {
  const reactMarkdownComponent: any = useMemo(() => {
    return {
      code: ({ inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '')
        const language = match ? match[1] : ''
        const [copied, setCopied] = useState(false)
        const handleCopy = async () => {
          const codeText = extractTextFromNode(children)
          try {
            await navigator.clipboard.writeText(codeText)
            setCopied(true)
            message.success('代码已复制')
            setTimeout(() => setCopied(false), 2000)
          } catch (err) {
            message.error('复制失败，请手动复制')
          }
        }
        if (!inline && language) {
          return (
            <CodeBlockWrapper className="hljs">
              <div className="code-header hljs">
                <span className="language">{language}</span>
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? '✅ 已复制' : '📋 复制'}
                </button>
              </div>
              <pre className="code-block">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </CodeBlockWrapper>
          )
        }

        return (
          <code className={className} {...props}>
            {children}
          </code>
        )
      },
      table: ({ children }) => {
        // 直接通过元素类型识别，而不是 className
        let theadNode = null
        let tbodyNode = null

        // children 可能是数组或单个元素
        const childrenArray = React.Children.toArray(children)

        childrenArray.forEach((child) => {
          // 检查元素的 type 属性（即 HTML 标签名）
          if (child.type === 'thead') {
            theadNode = child
          } else if (child.type === 'tbody') {
            tbodyNode = child
          }
        })

        if (!theadNode || !tbodyNode) {
          // 解析失败时回退到原生表格
          return children
        }

        // 获取表头行
        const theadChildren = React.Children.toArray(theadNode?.props?.children || [])
        const headerRow = theadChildren[0] // thead 下通常直接是 tr

        // 获取表体行
        const tbodyChildren = React.Children.toArray(tbodyNode?.props?.children || [])

        // 解析表头
        const headerCells = React.Children.toArray(headerRow?.props?.children || [])
        const columns = headerCells.map((cell, idx) => {
          return {
            title: cell?.props?.children || '',
            dataIndex: `col_${idx}`,
            key: `col_${idx}`,
            render: (text: any) => (text ? <div title={text}>{text}</div> : '-')
          }
        })
        // 解析表体数据
        const dataSource = tbodyChildren.map((row: any, rowIndex: number) => {
          const cells = React.Children.toArray(row?.props?.children || [])
          const record = { key: rowIndex }
          cells.forEach((cell: any, colIndex: any) => {
            record[`col_${colIndex}`] = cell?.props?.children || '-'
          })
          return record
        })

        return (
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            size="middle"
            scroll={{ x: '100%' }}
            sticky={{ offsetHeader: 0, getContainer }}
          />
        )
      }
    }
  }, [getContainer]) // 添加 getContainer 依赖，避免表格部分不更新
  const remarkPlugins = useMemo(() => [remarkGfm], [])
  const rehypePlugins = useMemo(() => [rehypeHighlight], [])
  return content ? (
    <ReactMarkdown
      rehypePlugins={rehypePlugins}
      remarkPlugins={remarkPlugins}
      components={reactMarkdownComponent}
    >
      {content}
    </ReactMarkdown>
  ) : null
}

export default memo(AiReplyContent)

const CodeBlockWrapper = styled.div`
  border-radius: 12px;
  position: relative;
  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    padding: 12px 12px 0;
    position: sticky;
    top: 0;
    z-index: 6;
  }
`
