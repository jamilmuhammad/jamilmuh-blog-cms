import axios from 'axios';
import { toast } from 'react-toastify';

type ImageResponse = {
	url: string;
};

type ApiResponse = {
	data: ImageResponse
	status: boolean
}

type UploadFileProps = {
	formData: FormData | null;
	onUploadProgress: (progress: number) => void;
};

export const uploadFile = async ({ formData, onUploadProgress }: UploadFileProps): Promise<ImageResponse> => {
	const { data } = await axios.request<ApiResponse>({
		method: 'POST',
		headers: { 'Content-Type': 'multipart/form-data' },
		url: `/api/upload`,
		data: formData,
		onUploadProgress(progressEvent) {
			const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
			onUploadProgress(percentCompleted);
		},
	});	

	return { url: data?.data?.url };
};

export async function imageUploadHandler(file: File) {
	const formData = new FormData();
	formData.append('file', file);

	const promise = fetch(`/api/upload`, {
		method: 'POST',
		body: formData,
	});

	toast.promise(
		promise,
		{
			pending: 'Uploading image...',
			success: 'Image uploaded successfully.',
			error: 'Error uploading image',
		}
	);

	try {
		const res = await promise;

		// Successfully uploaded image
		if (res.status === 200) {
			const data = await res.json();
			
			return data.data.url;
		} else if (res.status === 401) {
			throw new Error(res.statusText);
		} else {
			throw new Error('Error uploading image. Please try again.');
		}
	} catch (error) {
		console.error('Error uploading image:', error);
		throw error;
	}
}
