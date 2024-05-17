import axiosInstance from '@/lib/axios'

export async function postLoginService(formData: FormData) {
  const URL_API = `${process.env.NEXT_PUBLIC_API_URL}auth/login/cms`
  try {
    const response = await axiosInstance.post(
      URL_API,
      formData,
    )
    if (response?.status !== 200) return response.data
    return response
  } catch (error) {
    return error
  }
}