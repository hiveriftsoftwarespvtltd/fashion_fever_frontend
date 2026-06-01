import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#ffffff',
  color: '#1f2937',
  customClass: {
    popup: 'rounded-2xl shadow-xl border border-gray-100/50 p-4 font-outfit font-bold uppercase text-xs tracking-normal',
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const toast = {
  success: (message) => {
    Toast.fire({
      icon: 'success',
      title: message || 'Success',
      iconColor: '#008000'
    });
  },
  error: (message) => {
    Toast.fire({
      icon: 'error',
      title: message || 'Something went wrong',
      iconColor: '#ef4444'
    });
  },
  loading: (message) => {
    return Swal.fire({
      title: message || 'Loading...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: '#ffffff',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-3xl border-none p-8 font-outfit uppercase font-bold text-xs text-gray-500 tracking-normal',
        title: 'text-sm font-bold text-gray-800'
      },
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },
  dismiss: () => {
    Swal.close();
  }
};

