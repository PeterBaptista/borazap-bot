import axios from 'axios'
import { GlobalConfig } from 'payload'

const QRCodeGlobal: GlobalConfig = {
  slug: 'qrcode-global',
  label: 'QR Code',
  access: {
    read: () => true, // Anyone can view
    update: () => false, // Disable editing
  },
  fields: [
    {
      name: 'qrCode',
      type: 'text',
      admin: {
        readOnly: true,
        components: {
          Field: 'src/app/components/qr-code-field.tsx',
        },
      },
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc }) => {
        try {
          // Fetch QR Code from your Express endpoint
          console.log(process.env.WHATSAPP_BOT_URL)
          const response = await axios.get(`${process.env.WHATSAPP_BOT_URL}/qrcode`)

          // Assuming endpoint returns { qrCodeUrl: "data:image/png;base64,..." }
          doc.qrCode = response.data.qrCodeUrl
        } catch (error: any) {
          console.error('Erro ao buscar QR Code:', error.message)
          doc.qrCode = 'error'
        }

        return doc
      },
    ],
  },
}

export default QRCodeGlobal
