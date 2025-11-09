import { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
  slug: 'Messages',
  labels: {
    singular: 'Message',
    plural: 'Messages',
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
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Mensagem do Usuário',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'text',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Interactive', value: 'interactive' },
        { label: 'Status', value: 'status' },
        {
          label: 'Todo',
          value: 'todo',
        },
      ],
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
