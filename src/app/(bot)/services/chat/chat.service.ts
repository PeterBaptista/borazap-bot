import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Chat } from '@/payload-types'

const TWO_HOURS_MS = 2 * 60 * 60 * 1000

export class ChatService {
  async updateChatStatus(chatId: Chat['id'], status: Chat['status']) {
    const payload = await getPayload({
      config: configPromise,
    })
    const chat = await payload.update({
      collection: 'chats',
      id: chatId,
      data: {
        status,
        updatedAt: new Date().toISOString(),
      },
    })
    return chat
  }

  async createChat(waId: string) {
    const payload = await getPayload({
      config: configPromise,
    })
    const chat = await payload.create({
      collection: 'chats',
      data: {
        userPhone: waId,
        status: 'new',
        type: 'bot-flow',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    return chat
  }

  async activateChat(chatId: Chat['id']) {
    const payload = await getPayload({
      config: configPromise,
    })
    const chat = await payload.update({
      collection: 'chats',
      id: chatId,
      data: {
        status: 'active',
        type: 'bot-flow',
        updatedAt: new Date().toISOString(),
      },
    })
    return chat
  }
  async updateChatType(chatId: Chat['id'], type: Chat['type']) {
    const payload = await getPayload({
      config: configPromise,
    })
    console.log('chatId', chatId)
    console.log('type', type)
    const chat = await payload.update({
      collection: 'chats',
      id: chatId,
      data: {
        type,
        updatedAt: new Date().toISOString(),
      },
    })
    return chat
  }
  async invalidateChat(chatId: Chat['id']) {
    const payload = await getPayload({
      config: configPromise,
    })
    const chat = await payload.update({
      collection: 'chats',
      id: chatId,
      data: {
        status: 'inactive',
        type: 'bot-flow',
        updatedAt: new Date().toISOString(),
      },
    })
    return chat
  }

  async getChatByWaId(waId: string) {
    const payload = await getPayload({
      config: configPromise,
    })
    const chat = await payload.find({
      collection: 'chats',
      where: {
        userPhone: {
          equals: waId,
        },
      },
    })

    if (chat.docs?.length === 0) {
      return await this.createChat(waId)
    }

    const existingChat = chat.docs[0]

    const lastUpdated = new Date(existingChat.updatedAt).getTime()
    const now = Date.now()

    if (now - lastUpdated >= TWO_HOURS_MS) {
      return await this.invalidateChat(existingChat.id)
    }

    return existingChat
  }
}
