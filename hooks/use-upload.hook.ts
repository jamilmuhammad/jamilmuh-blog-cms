import { type ChangeEvent, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import axios from 'axios';

import { DROPZONE_OPTIONS, uploadFile } from '@/lib';

type ImageRes = {
	preview?: string,
	public_id?: string;
	secure_url?: string;
};

type Files = {
	preview?: string,
	public_id?: string;
	secure_url?: string;
};

const imageTypeRegex = /image\/(png|gif|jpg|jpeg|webp)/gm;

const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export const useUpload = () => {
	const [formatImage, setFormatImage] = useState<FormData | null>(null);
	const [image, setImage] = useState<string | null>(null);
	const [files, setFiles] = useState<string | null>(null);
	const [isFetching, setIsFetching] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [progressStatus, setProgressStatus] = useState(0);

	const inputRef = useRef<HTMLInputElement>(null);

	const handleRemovePreview = <HTMLInputElement>(): void => {
		setFiles(null)
	}

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (!acceptedFiles.length) return;


		const formData = new FormData();
		formData.append('file', acceptedFiles[0]);
		formData.append('upload_preset', CLOUDINARY_PRESET);

		setFiles(URL.createObjectURL(acceptedFiles[0]))
		setFormatImage(formData);
	}, []);

	const { getRootProps, getInputProps, fileRejections, isDragActive } = useDropzone({ ...DROPZONE_OPTIONS, onDrop });

	const onChangeFile = (e: ChangeEvent<HTMLInputElement>): void => {
		const files = e.target?.files!;

		const formData = new FormData();
		const file = files?.[0];

		if (!file?.type.match(imageTypeRegex)) return;

		formData.append('file', file);
		formData.append('upload_preset', CLOUDINARY_PRESET);

		const image = URL.createObjectURL(file)
		setFiles(image)
		setFormatImage(formData);
	};

	useEffect(() => {
		if (fileRejections.length) {
			fileRejections
				.map((el) => el.errors)
				.map((err) => {
					err.map((el) => {
						if (el.code.includes('file-invalid-type')) {
							toast.error('File type must be .png,.jpg,.jpeg,.gif,.webp', { theme: 'light' });
							return;
						}
						if (el.code.includes('file-too-large')) {
							toast.error('File is larger than 10MB', { theme: 'light' });
							return;
						}
					});
				});
		}
	}, [fileRejections]);

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		if (files) {
			URL.revokeObjectURL(files);
		}
	}, [files]);

	// useEffect(() => {
	// 	(async () => {
	// 		if (!formatImage) return;

	// 		try {
	// 			setIsFetching(true);
	// 			const data = await uploadFile({
	// 				formData: formatImage,
	// 				onUploadProgress(progress) {
	// 					setProgressStatus(progress);
	// 				},
	// 			});

	// 			if (data) {
	// 				setFormatImage(null);
	// 				setImage(data);
	// 				setIsFetching(false);
	// 				setIsSuccess(true);
	// 				toast.success('Successfully uploaded!');
	// 			}
	// 		} catch (err) {
	// 			if (axios.isAxiosError<{ message: string }>(err)) {
	// 				toast.error(err.response?.data.message);
	// 			}
	// 			if (err instanceof Error) {
	// 				toast.error(err.message);
	// 			}
	// 			setFormatImage(null);
	// 			setImage(null);
	// 			setIsFetching(false);
	// 			setIsSuccess(false);
	// 		}
	// 	})();
	// }, [formatImage]);

	return {
		isFetching,
		isDragActive,
		isSuccess,
		formatImage,
		image,
		files,
		progressStatus,
		inputRef,
		setProgressStatus,
		setFiles,
		onChangeFile,
		getRootProps,
		getInputProps,
		handleRemovePreview,
	};
};

export default useUpload;