import axiosInstance from '@/lib/axios'

export async function getAllTagService(search: string) {
  const URL_API = `${process.env.NEXT_PUBLIC_API_URL}tag${search}`
  try {
    const response = await axiosInstance.get(
      URL_API,
    )
    if (response?.status !== 200) return response.data
    return response
  } catch (error) {
    return error
  }
}