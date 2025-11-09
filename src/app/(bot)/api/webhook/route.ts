import { NextRequest, NextResponse } from 'next/server'
import { HttpError } from '../../services/error/http-error.service'
import { WebhookService } from '../../services/webhook/webhook.service'
import { WhatsAppWebhook } from '../../types/whatsapp-type'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'meu_token_secreto'

// GET webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Erro de verificação', { status: 403 })
}

// POST webhook
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as WhatsAppWebhook

    const webhookService = new WebhookService(body)

    await webhookService.handleWebhook()

    // Sempre responde 200 pro WhatsApp
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (error: any) {
    if (error instanceof HttpError) {
      console.error('Erro customizado:', error.message, error.cause)
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('Erro inesperado:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
