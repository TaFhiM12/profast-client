import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useUserRole = () => {
  const { user } = useAuth(); // user.email will be used
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading, refetch} = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data.role;
    },
  });

  return { role, isLoading, refetch };
};

export default useUserRole;
