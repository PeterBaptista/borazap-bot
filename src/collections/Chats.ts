import { CollectionConfig } from 'payload'

export const Chats: CollectionConfig = {
  slug: 'chats',
  labels: {
    singular: 'Chat',
    plural: 'Chats',
  },
  fields: [
    {
      name: 'userPhone',
      type: 'text',
      required: true,
      unique: true,
      label: 'Número de WhatsApp do Usuário',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'Novo', value: 'new' },
        { label: 'Ativo', value: 'active' },
        { label: 'Inativo', value: 'inactive' },
      ],
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'bot-flow',
      options: [
        { label: 'AI', value: 'ai' },
        { label: 'bot-flow', value: 'bot-flow' },
      ],
    },
    {
      name: 'createdAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      label: 'Data de Criação',
    },
    {
      name: 'updatedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      label: 'Data de Atualização',
    },
  ],
}
