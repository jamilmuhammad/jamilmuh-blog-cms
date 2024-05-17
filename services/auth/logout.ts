import axiosInstance from '@/lib/axios';

export async function postLogoutService() {
  try {
    const response = await axiosInstance.delete(
      'auth'
    )

    if (response?.status !== 200) return response.data
    return response
  } catch (error) {
    return error
  }
}