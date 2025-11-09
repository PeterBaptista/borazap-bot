export interface WhatsAppWebhook {
  object: 'whatsapp_business_account'
  entry: {
    id: string
    changes: {
      field: 'messages'
      value: {
        messaging_product: 'whatsapp'
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        contacts: {
          profile: {
            name: string
          }
          wa_id: string
        }[]
        messages: {
          from: string
          id: string
          timestamp: string
          type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'interactive' | string
          text?: {
            body: string
          }
          image?: {
            caption?: string
            mime_type: string
            sha256: string
            id: string
          }
          audio?: {
            mime_type: string
            sha256: string
            id: string
          }
          video?: {
            caption?: string
            mime_type: string
            sha256: string
            id: string
          }
          document?: {
            filename: string
            mime_type: string
            sha256: string
            id: string
          }
          interactive?: {
            type: 'button_reply' | 'list_reply'
            button_reply?: {
              id: string
              title: string
            }
            list_reply?: {
              id: string
              title: string
              description: string
            }
          }
        }[]
        statuses?: {
          id: string
          status: string
          timestamp: string
          recipient_id: string
          conversation: {
            id: string
            origin: {
              type: 'service'
            }
          }
          pricing: {
            billable: false
            pricing_model: 'PMP'
            category: 'service'
            type: 'free_customer_service'
          }
        }[]
      }
    }[]
  }[]
}

export type WhatsAppButtonType = {
  type: 'reply'
  reply: {
    id: string
    title: string
  }
}

export type WhatsAppWebhookMessageType = 'text' | 'interactive' | 'status' | undefined
