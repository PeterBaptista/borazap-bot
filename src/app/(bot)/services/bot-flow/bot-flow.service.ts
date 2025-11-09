import { BotFlow, Chat, UserMessage } from '@/payload-types'
import { WhatsAppMessagesService } from '../whatsapp/whatsapp-messages.service'
import { TextGenerationService } from '../ai-messages/text-generation.service'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { AIMessageService } from '../ai-messages/ai-messages.service'
import { IA_ACTIVATE_BUTTON_ID } from '../webhook/webhook.service'

const FIRST_FLOW_ID = 'welcome'

const COMEBACK_FLOW_MESSAGE =
  'Você ultrapassou o tempo limite de interação com o bot. Por favor, inicie um novo chat para continuar.'
const OUTRO_FLOW_ID = 'outro'
export class BotFlowService {
  private whatsappService: WhatsAppMessagesService
  private textGenerationService: TextGenerationService
  private aiMessageService: AIMessageService

  constructor() {
    this.whatsappService = new WhatsAppMessagesService()
    this.textGenerationService = new TextGenerationService()
    this.aiMessageService = new AIMessageService()
  }
  handleEmptyFlow(flow: BotFlow) {
    if (!flow?.id) {
      throw new Error('Flow not found')
    }
    if (flow?.type === 'button' && flow?.buttons?.length === 0) {
      throw new Error('Flow is a button but has no buttons')
    }

    if (!flow.body) {
      throw new Error('Flow has no body')
    }
  }

  async handleAIResponse({
    waId,
    prompt,
    userQuestionId,
    chatId,
  }: {
    waId: string
    prompt: string
    userQuestionId: UserMessage['id']
    chatId: Chat['id']
  }) {
    const response = await this.textGenerationService.generateTextWithAI(prompt)
    await this.whatsappService.sendTextMessage({
      to: waId,
      message: response.text,
    })
    await this.aiMessageService.createAIMessage({
      chatId: chatId,
      content: response.text,
      userQuestionId: userQuestionId,
    })
    return { action: 'replied', to: waId }
  }

  async handleComebackMessage({ waId }: { waId: string }) {
    await this.whatsappService.sendTextMessage({
      to: waId,
      message: COMEBACK_FLOW_MESSAGE,
    })

    return { action: 'replied', to: waId }
  }

  async handleFirstMessage({ waId }: { waId: string }) {
    const payload = await getPayload({
      config: configPromise,
    })

    const flow = await payload.find({
      collection: 'bot-flows',
      where: {
        id: {
          equals: FIRST_FLOW_ID,
        },
      },
    })

    this.handleEmptyFlow(flow.docs?.[0])

    await this.whatsappService.sendInteractiveMessage({
      to: waId,
      message: flow.docs?.[0].body,
      footer: flow.docs?.[0].footer ?? undefined,
      buttons:
        flow.docs?.[0].buttons?.map((button) => ({
          type: 'reply',
          reply: {
            id: button.nextFlow
              ? typeof button.nextFlow === 'string'
                ? button.nextFlow
                : button.nextFlow.id
              : '',
            title: button.title,
          },
        })) ?? [],
    })

    return { action: 'replied', to: waId }
  }

  async handleOutroMessage({ waId }: { waId: string }) {
    const payload = await getPayload({
      config: configPromise,
    })
    const flow = await payload.find({
      collection: 'bot-flows',
      where: {
        id: {
          equals: OUTRO_FLOW_ID,
        },
      },
    })
    if (!flow.docs?.[0]) {
      throw new Error('Outro flow not found')
    }

    await this.whatsappService.sendInteractiveMessage({
      to: waId,
      message: flow.docs?.[0].body,
      footer: flow.docs?.[0].footer ?? undefined,
      buttons:
        flow.docs?.[0].buttons?.map((button) => ({
          type: 'reply',
          reply: {
            id: button.nextFlow
              ? typeof button.nextFlow === 'string'
                ? button.nextFlow
                : button.nextFlow.id
              : '',
            title: button.title,
          },
        })) ?? [],
    })
    return { action: 'replied', to: waId }
  }

  async handleFlow({ waId, nextFlowId }: { waId: string; nextFlowId: string }) {
    const payload = await getPayload({
      config: configPromise,
    })
    const flow = await payload.find({
      collection: 'bot-flows',
      where: {
        id: {
          equals: nextFlowId,
        },
      },
    })
    this.handleEmptyFlow(flow.docs?.[0])

    if (flow.docs?.[0].type !== 'button') {
      await this.whatsappService.sendTextMessage({
        to: waId,
        message: flow.docs?.[0].body,
      })
      if (nextFlowId !== IA_ACTIVATE_BUTTON_ID) {
        return await this.handleOutroMessage({ waId })
      }

      return { action: 'replied', to: waId }
    }

    await this.whatsappService.sendInteractiveMessage({
      to: waId,
      message: flow.docs?.[0].body,
      footer: flow.docs?.[0].footer ?? undefined,
      buttons:
        flow.docs?.[0].buttons?.map((button) => ({
          type: 'reply',
          reply: {
            id: button.nextFlow
              ? typeof button.nextFlow === 'string'
                ? button.nextFlow
                : button.nextFlow.id
              : '',
            title: button.title,
          },
        })) ?? [],
    })
    return { action: 'replied', to: waId }
  }
}
