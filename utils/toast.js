import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import './toast.css';

export function showToast(message, type = 'success') {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: 'bottom',
    position: 'left',
    stopOnFocus: false,
    className: `bookrealm-toast bookrealm-toast-${type}`,
  }).showToast();
}
