import { CollectionConfig } from 'payload'

export const BotFlows: CollectionConfig = {
  slug: 'bot-flows',
  admin: {
    useAsTitle: 'name',
  },
  labels: {
    singular: 'Bot Flow',
    plural: 'Bot Flows',
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      maxLength: 255,
      unique: true,
      label: 'ID do Fluxo',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome do Fluxo',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Tipo do Fluxo',
      options: [
        { label: 'Botão (interactive)', value: 'button' },
        { label: 'Resposta de Informação (texto)', value: 'text' },
      ],
      defaultValue: 'text',
    },

    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Mensagem Principal',
    },
    {
      name: 'footer',
      type: 'text',
      label: 'Rodapé (opcional)',
      admin: {
        condition: (data) => data.type === 'button',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Botões',
      minRows: 1,
      maxRows: 3,
      admin: {
        condition: (data) => data.type === 'button',
      },
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          label: 'ID do Botão',
          hidden: true,
        },
        {
          name: 'title',
          maxLength: 20,
          type: 'text',
          required: true,
          label: 'Texto do Botão',
        },
        {
          name: 'nextFlow',
          type: 'relationship',
          relationTo: 'bot-flows',
          label: 'Próximo Fluxo (quando clicar)',
          admin: {
            placeholder: 'Selecione um fluxo',
          },
        },
      ],
    },
  ],
}
