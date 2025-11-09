import { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const KnowledgeBase: CollectionConfig = {
  slug: 'knowledge-base',
  labels: {
    singular: 'Pergunta e Resposta',
    plural: 'Perguntas e Respostas',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'updatedAt'],
    group: 'IA',
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      label: 'ID',
      required: true,
      unique: true,
      admin: {
        readOnly: true, // evita edição manual pelo painel
      },
    },
    {
      name: 'question',
      type: 'text',
      label: 'Pergunta',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      label: 'Resposta',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoria',
      options: [
        { label: 'Geral', value: 'general' },
        { label: 'Produto', value: 'product' },
        { label: 'Suporte', value: 'support' },
        { label: 'Interno', value: 'internal' },
      ],
      required: true,
      defaultValue: 'general',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Tag',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Ativo',
      defaultValue: true,
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data }: any) => {
        if (!data?.id) {
          data.id = uuidv4() // gera automaticamente o UUID
        }
      },
    ],
  },
  timestamps: true,
}
