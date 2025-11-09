// services/webhook.service.ts

import { Chat, UserMessage } from '@/payload-types'
import { WhatsAppWebhook, WhatsAppWebhookMessageType } from '../../types/whatsapp-type'
import { TextGenerationService } from '../ai-messages/text-generation.service'
import { BotFlowService } from '../bot-flow/bot-flow.service'
import { ChatService } from '../chat/chat.service'
import { UserMessagesService } from '../user-messages/user-messages.service'

export const IA_ACTIVATE_BUTTON_ID = 'ia-activate'
export class WebhookService {
  private botFlowService: BotFlowService
  private webhook: WhatsAppWebhook
  private userMessagesService: UserMessagesService
  private waId?: string
  private text?: string
  private chatService: ChatService
  private messageType?: WhatsAppWebhookMessageType
  private buttonId?: string
  private buttonTitle?: string

  constructor(webhook: WhatsAppWebhook) {
    this.botFlowService = new BotFlowService()
    this.chatService = new ChatService()
    this.userMessagesService = new UserMessagesService()
    this.webhook = webhook
    this.waId = this.webhook?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id
    this.text = this.webhook?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body
    this.messageType = this.getWebhookType(webhook)
    this.buttonId =
      this.webhook?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.interactive?.button_reply?.id
    this.buttonTitle =
      this.webhook?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.interactive?.button_reply?.title
  }

  getWebhookType(webhook: WhatsAppWebhook): WhatsAppWebhookMessageType {
    if (webhook.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.type === 'text') {
      return 'text'
    }
    if (webhook.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.type === 'interactive') {
      return 'interactive'
    }
    if (!!webhook.entry?.[0]?.changes?.[0]?.value?.statuses?.[0]) {
      return 'status'
    }
    return undefined
  }

  handleEmptyMessage() {
    const change = this.webhook?.entry?.[0]?.changes?.[0]?.value
    const messages = change?.messages

    if (!this.messageType) {
      console.log('Webhook sem tipo, ignorando.')
      return { action: 'noop' }
    }

    if (!messages || messages.length === 0) {
      console.log('Webhook recebido: apenas status, nada a fazer.')
      return { action: 'noop' }
    }

    if (!this.waId && this.messageType === 'text') {
      console.log('Webhook sem wa_id, ignorando.')
      return { action: 'noop' }
    }

    if (!this.text && this.messageType === 'text') {
      console.log('Webhook sem texto, ignorando.')
      return { action: 'noop' }
    }

    if (this.messageType === 'interactive' && (!this.buttonId || !this.buttonTitle)) {
      console.log('Webhook sem botão, ignorando.')
      return { action: 'noop' }
    }
    return { action: 'proceed' }
  }

  async handleInteractiveMessages(chat: Chat) {
    if (chat.status === 'new') {
      return await this.botFlowService.handleFirstMessage({ waId: this.waId ?? '' })
    }
    if (chat.status === 'active' && this.buttonId === IA_ACTIVATE_BUTTON_ID) {
      await this.chatService.updateChatType(chat.id, 'ai')
      return await this.botFlowService.handleFlow({
        waId: this.waId ?? '',
        nextFlowId: this.buttonId ?? '',
      })
    }
    if (chat.status === 'active' && chat.type === 'bot-flow') {
      return await this.botFlowService.handleFlow({
        waId: this.waId ?? '',
        nextFlowId: this.buttonId ?? '',
      })
    }
    if (chat.status === 'inactive') {
      await this.chatService.activateChat(chat.id)
      return await this.botFlowService.handleComebackMessage({ waId: this.waId ?? '' })
    }
    return { action: 'noop' }
  }

  async handleTextMessages(chat: Chat, userMessage: UserMessage) {
    if (chat.status === 'new') {
      await this.chatService.activateChat(chat.id)
      return await this.botFlowService.handleFirstMessage({ waId: this.waId ?? '' })
    }
    if (chat.status === 'active' && chat.type === 'ai') {
      return await this.botFlowService.handleAIResponse({
        waId: this.waId ?? '',
        prompt: this.text ?? '',
        userQuestionId: userMessage.id,
        chatId: chat.id,
      })
    }
    if (chat.status === 'inactive') {
      await this.chatService.activateChat(chat.id)
      await this.botFlowService.handleComebackMessage({ waId: this.waId ?? '' })
      return this.botFlowService.handleFirstMessage({ waId: this.waId ?? '' })
    }
  }

  async handleWebhook() {
    const { action } = this.handleEmptyMessage()

    if (action === 'noop') return { action: 'noop' }

    console.log('Webhook recebido:', JSON.stringify(this.webhook, null, 2))

    const chat = await this.chatService.getChatByWaId(this.waId ?? '')
    if (!chat) {
      return { action: 'noop' }
    }

    const userMessage = await this.userMessagesService.createUserMessage({
      chatId: chat.id,
      content: this.text ?? this.buttonTitle ?? '',
      type: this.messageType,
    })

    if (this.messageType === 'text') {
      return await this.handleTextMessages(chat, userMessage)
    }
    if (this.messageType === 'interactive') {
      return await this.handleInteractiveMessages(chat)
    }

    // Qualquer outra mensagem, não faz nada
    console.log('Mensagem recebida, mas nenhuma ação configurada:')
    return { action: 'noop' }
  }
}
