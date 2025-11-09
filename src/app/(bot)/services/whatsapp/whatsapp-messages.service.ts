import axios from 'axios'
import { WhatsAppButtonType } from '../../types/whatsapp-type'
import { HttpError } from '../error/http-error.service'

export class WhatsAppMessagesService {
  private token: string
  private phoneId: string
  private metaApiUrl: string

  constructor() {
    this.token = process.env.WHATSAPP_API_TOKEN || ''
    this.phoneId = process.env.WHATSAPP_PHONE_IDENFICATION || ''
    this.metaApiUrl = process.env.META_API_URL || ''
  }

  async sendInteractiveMessage({
    to,
    message,
    footer,
    buttons,
  }: {
    to: string
    message: string
    footer?: string
    buttons: WhatsAppButtonType[]
  }) {
    try {
      console.log('to', to)
      console.log('message', message)
      console.log('footer', footer)
      console.log('buttons', buttons)

      const body = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: message,
          },
          footer: {
            text: footer,
          },
          action: {
            buttons: buttons,
          },
        },
      }

      console.log('body', JSON.stringify(body, null, 2))
      const { data } = await axios.post(`${this.metaApiUrl}/v23.0/${this.phoneId}/messages`, body, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      })
      return data
    } catch (err: any) {
      throw new HttpError(
        err.response?.data?.error?.message || 'Erro ao enviar mensagem para WhatsApp',
        err.response?.status || 500,
        err,
      )
    }
  }

  async sendToWhatsApp({ to, message }: { to: string; message: string }) {
    try {
      const { data } = await axios.post(
        `${this.metaApiUrl}/v23.0/${this.phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      return data
    } catch (err: any) {
      throw new HttpError(
        err.response?.data?.error?.message || 'Erro ao enviar mensagem para WhatsApp',
        err.response?.status || 500,
        err,
      )
    }
  }

  async sendTextMessage({ to, message }: { to: string; message: string }) {
    if (!this.token || !this.phoneId || !this.metaApiUrl) {
      throw new HttpError('Configuração faltando: token, phoneId ou metaApiUrl', 400)
    }

    if (!to || !message) {
      throw new HttpError('Configuração faltando: to ou message', 400)
    }

    return await this.sendToWhatsApp({ to, message })
  }
}
