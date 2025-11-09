// services/webhook.service.ts

import axios from 'axios'
import { WhatsAppWebhook, WhatsAppWebhookMessageType } from '../../types/whatsapp-type'
import { WhatsAppMessagesService } from '../whatsapp/whatsapp-messages.service'

export const IA_ACTIVATE_BUTTON_ID = 'ia-activate'
export class WebhookService {
  private webhook: WhatsAppWebhook

  private waId?: string
  private text?: string

  private whatsappMessageService: WhatsAppMessagesService
  private messageType?: WhatsAppWebhookMessageType
  private buttonId?: string
  private buttonTitle?: string

  constructor(webhook: WhatsAppWebhook) {
    this.whatsappMessageService = new WhatsAppMessagesService()
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

  async handleWebhook() {
    const { action } = this.handleEmptyMessage()

    if (action === 'noop') return { action: 'noop' }

    console.log('Webhook recebido:', JSON.stringify(this.webhook, null, 2))

    if (!this.waId) {
      console.error('Cannot find waId')
      return
    }
    this.whatsappMessageService.sendTextMessage({
      to: this.waId ?? '',
      message: 'Oi, safado!',
    })
    // Qualquer outra mensagem, não faz nada
    console.log('Mensagem recebida, mas nenhuma ação configurada:')
    return { action: 'noop' }
  }
}
