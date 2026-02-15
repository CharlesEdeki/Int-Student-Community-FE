import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// GET example
export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get('/api/users');
      return response.data;
    },
  });
};

// POST example
export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await apiClient.post('/api/users', userData);
      return response.data;
    },
  });
};