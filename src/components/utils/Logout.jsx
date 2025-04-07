import Swal from "sweetalert2";

export const handleLogout = () => {
    Swal.fire({
        text: 'Are you sure?',
        icon: false,
        showCancelButton: true,
        confirmButtonColor: '#d54443',
        confirmButtonText: 'Yes, Logout!',
        customClass: {
            popup: 'custom-swal',
            confirmButton: 'btn-sm',
            cancelButton: 'bg-gray-500 btn-sm',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    });
};