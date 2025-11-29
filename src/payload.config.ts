// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, TaskConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import QRCodeGlobal from './collections/QrCode'
import { Users } from './collections/Users'
import { Chats } from './collections/Chats'
import { Messages } from './collections/TodoMessages'
import { sendTodoMessageNotificationHandler } from './modules/jobs/send-todo-message-notification'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [Users, Media, Chats, Messages],
  globals: [QRCodeGlobal],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    tasks: [
      {
        // Configure this task to automatically retry
        // up to two times
        retries: 2,

        // This is a unique identifier for the task

        slug: 'sendTodoMessageNotification',

        // These are the arguments that your Task will accept
        inputSchema: [
          {
            name: 'id',
            type: 'text',
            required: true,
          },
        ],

        // These are the properties that the function should output
        outputSchema: [
          {
            name: 'success',
            type: 'checkbox',
            required: true,
          },
        ],
        schedule: [
          {
            cron: '/10 * * * * *',
            queue: 'teste',
          },
        ],

        // This is the function that is run when the task is invoked
        handler: sendTodoMessageNotificationHandler,
      },
    ],
    // autoRun can optionally be a function that receives `payload` as an argument
    autoRun: [
      {
        cron: '/10 * * * * *',
        limit: 100,
        queue: 'teste',
      },
      // add as many cron jobs as you want
    ],

    shouldAutoRun: async (payload) => {
      // Tell Payload if it should run jobs or not. This function is optional and will return true by default.
      // This function will be invoked each time Payload goes to pick up and run jobs.
      // If this function ever returns false, the cron schedule will be stopped.
      return true
    },
  },

  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
