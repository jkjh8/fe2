import { useQuasar } from 'quasar'

export const useNotify = () => {
  const $q = useQuasar()

  return {
    info: (msg) => {
      $q.notify({
        icon: 'info',
        message: typeof msg === 'string' ? msg : msg.message,
        caption: msg.caption ?? '',
        position: 'top',
        color: 'positive',
        actions: [
          {
            icon: 'close',
            round: true,
            size: 'sm',
            color: 'white',
            handler: () => {}
          }
        ]
      })
    },
    warn: (msg) => {
      $q.notify({
        icon: 'warning',
        message: typeof msg === 'string' ? msg : msg.message,
        caption: msg.caption ?? '',
        position: 'top',
        color: 'orange',
        actions: [
          {
            icon: 'close',
            round: true,
            size: 'sm',
            color: 'white',
            handler: () => {}
          }
        ]
      })
    },
    error: (msg) => {
      $q.notify({
        icon: 'error',
        message: typeof msg === 'string' ? msg : msg.message,
        caption: msg.caption
          ? msg.caption
          : '잠시후에 다시 시도해주세요. 문제가 계속 되면 관리자에게 문의해 주세요',
        position: 'top',
        color: 'negative',
        textColor: 'white',
        actions: [
          {
            icon: 'close',
            round: true,
            size: 'sm',
            color: 'white',
            handler: () => {}
          }
        ]
      })
    }
  }
}
