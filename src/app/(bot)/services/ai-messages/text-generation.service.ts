import { google } from '@/modules/google/google-ai'
import { generateText } from 'ai'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { openai } from '@ai-sdk/openai'

export class TextGenerationService {
  async generateTextWithAI(prompt: string) {
    const model = openai('gpt-4.1')

    const payload = await getPayload({
      config: configPromise,
    })

    const knowledgeBase = await payload.find({
      collection: 'knowledge-base',
      where: {
        isActive: {
          equals: true,
        },
      },
    })

    const { text } = await generateText({
      model: model,

      maxRetries: 3,
      system: `Você é um assistente de whatsapp de portugal que responde como se fosse um assistente real e que adora ajudar e que responde perguntas sobre a trader e youtuber Cryptogirl de forma resumida e direta e você sabe sobre essas perguntas: ${knowledgeBase}, responda `,

      prompt: prompt,

      providerOptions: {
        openai: {
          thinkingConfig: {
            thinkingBudget: 8192,
          },
        },
      },
    })

    return { text }
  }
}
