import Swal from 'sweetalert2';

const SweetAlertDelete = (deleteApi, data, setData, setFilteredData, searchText) => {
    return async (id) => {
        try {
            // Show confirmation dialog
            const result = await Swal.fire({
                text: 'Are you sure?',
                icon: false,
                showCancelButton: true,
                confirmButtonColor: '#d54443',
                confirmButtonText: 'Yes, delete it!',
                customClass: {
                    popup: 'custom-swal',
                    confirmButton: 'btn-sm',
                    cancelButton: 'bg-gray-500 btn-sm',
                }
            });

            // If confirmed, delete the record
            if (result.isConfirmed) {
                // Call the delete API function
                await deleteApi(id);

                // Update the data state after deletion
                const updatedData = data.filter((item) => item._id !== id);
                setData(updatedData);
                setFilteredData(updatedData);

                // Optionally, if search is active, filter the data again
                if (searchText) {
                    const filtered = updatedData.filter((item) =>
                        item.name.toLowerCase().includes(searchText.toLowerCase())
                    );
                    setFilteredData(filtered);
                }

                // Show success message
                Swal.fire({
                    title: 'Deleted!',
                    icon: 'success',
                    width: '400px',
                    height: '200px',
                    customClass: {
                        title: 'custom-title',
                        icon: 'custom-icon',
                        popup: 'custom-popup' // For overall padding
                    }
                });

            }
        } catch (error) {
            console.error('Error deleting record:', error);
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error',
                width: '400px' // Custom width
            });
        }
    };
};

export default SweetAlertDelete;
