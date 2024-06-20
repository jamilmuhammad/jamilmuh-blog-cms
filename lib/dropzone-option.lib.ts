import type { DropzoneOptions } from 'react-dropzone';

export const DROPZONE_OPTIONS: DropzoneOptions = {
	accept: {
		'image/*': ['.png', '.jpg', '.jpeg', '.gif', 'webp'],
	},
	noClick: true,
	maxFiles: 1,
	maxSize: 11000000,
};
