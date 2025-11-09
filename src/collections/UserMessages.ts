import { CollectionConfig } from 'payload'

export const UserMessages: CollectionConfig = {
  slug: 'user-messages',
  labels: {
    singular: 'User Message',
    plural: 'User Messages',
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

export default UserMessages
