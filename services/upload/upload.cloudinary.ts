import axiosInstance from '@/lib/axios'

export async function uploadService(body: FormData) {
  const URL_API = `${process.env.NEXT_PUBLIC_API_URL}upload`
  try {
    const response = await axiosInstance.postForm(
      URL_API,
      body
    )        
    
    if (response?.status !== 200) return response.data
    return response
  } catch (error) {
    return error
  }
}