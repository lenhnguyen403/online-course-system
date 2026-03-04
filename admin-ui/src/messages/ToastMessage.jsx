import { toast } from 'react-toastify'

const ToastMessage = {
    success: (message) => {
        toast.success(message)
    },

    error: (error) => {
        let msg = 'Something went wrong'

        if (typeof error === 'string') {
            msg = error
        } else if (error?.response?.data?.error?.message) {
            // course-server error middleware: { error: { message } }
            msg = error.response.data.error.message
        } else if (error?.response?.data?.message) {
            msg = error.response.data.message
        } else if (error?.message) {
            msg = error.message
        }

        toast.error(msg)
    },

    warning: (message) => {
        toast.warning(message)
    },

    info: (message) => {
        toast.info(message)
    },

    promise: (promise, messages) => {
        toast.promise(promise, {
            pending: messages?.pending || 'Loading...',
            success: messages?.success || 'Success',
            error: messages?.error || 'Failed'
        })
    }
}

export default ToastMessage 
