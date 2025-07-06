import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from './useAxiosSecure';

const useTrackingUpdate = () => {
  const axiosSecure = useAxiosSecure();

  const updateTracking = async ({ tracking_id, parcel_id, status, message, updated_by = '' }) => {
    const response = await axiosSecure.post('/tracking', {
      tracking_id,
      parcel_id,
      status,
      message,
      updated_by
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: updateTracking,
    onSuccess: (data) => {
      Swal.fire({
        title: 'Success!',
        text: 'Tracking updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      return data;
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update tracking',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      throw error;
    }
  });

  return {
    updateTracking: mutation.mutate,
    updateTrackingAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data
  };
};

export default useTrackingUpdate;