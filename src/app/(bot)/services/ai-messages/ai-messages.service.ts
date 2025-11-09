import { Chat, UserMessage } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export class AIMessageService {
  async createAIMessage({
    chatId,
    content,
    userQuestionId,
  }: {
    chatId: Chat['id']
    content: string
    userQuestionId: UserMessage['id']
  }) {
    const payload = await getPayload({
      config: configPromise,
    })
    const aiMessage = await payload.create({
      collection: 'ai-messages',
      data: {
        chat: chatId,
        userQuestion: userQuestionId,
        content,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    return aiMessage
  }
}
