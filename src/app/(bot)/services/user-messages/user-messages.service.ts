import { Chat } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { UserMessage } from '@/payload-types'

export class UserMessagesService {
  async createUserMessage({
    chatId,
    content,
    type,
  }: {
    chatId: Chat['id']
    content: string
    type?: UserMessage['type']
  }) {
    const payload = await getPayload({
      config: configPromise,
    })
    const userMessage = await payload.create({
      collection: 'user-messages',
      data: {
        chat: chatId,
        content,
        type: type ?? 'text',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    return userMessage
  }
}
