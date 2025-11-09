import { CollectionConfig } from 'payload'

export const AiMessages: CollectionConfig = {
  slug: 'ai-messages',
  labels: {
    singular: 'AI Message',
    plural: 'AI Messages',
  },
  fields: [
    {
      name: 'chat',
      type: 'relationship',
      relationTo: 'chats',
      required: true,
      label: 'Chat',
    },
    {
      name: 'userQuestion',
      type: 'relationship',
      relationTo: 'user-messages',
      required: true,
      label: 'Pergunta do Usuário',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Mensagem da IA',
    },

    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      label: 'Data/Hora',
    },
  ],
}
