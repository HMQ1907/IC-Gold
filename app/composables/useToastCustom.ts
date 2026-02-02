interface ToastOptions {
  title: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
}

// Global toast state
const toasts = ref<Array<ToastOptions & { id: number }>>([])
let toastId = 0

export function useToastCustom() {
  function add(options: ToastOptions) {
    const id = ++toastId
    toasts.value.push({
      ...options,
      type: options.type || 'info',
      id
    })
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      remove(id)
    }, 5000)
    
    return id
  }
  
  function remove(id: number) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  function success(title: string, description?: string) {
    return add({ title, description, type: 'success' })
  }
  
  function error(title: string, description?: string) {
    return add({ title, description, type: 'error' })
  }
  
  function warning(title: string, description?: string) {
    return add({ title, description, type: 'warning' })
  }
  
  function info(title: string, description?: string) {
    return add({ title, description, type: 'info' })
  }
  
  return {
    toasts: readonly(toasts),
    add,
    remove,
    success,
    error,
    warning,
    info
  }
}
