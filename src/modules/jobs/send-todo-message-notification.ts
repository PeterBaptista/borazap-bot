import type { TaskHandler } from 'payload'

export const sendTodoMessageNotificationHandler: TaskHandler<
  'sendTodoMessageNotification'
> = async ({ input, job, req }) => {
  console.log('entrei aqui hehe')
  return {
    output: {
      success: true,
    },
  }
}
