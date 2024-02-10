import NextImage from 'next/image';

import type { FC } from 'react';

type PreviewImageProps = {
	imageUrl: string,
	removePreview<HTMLInputElement>(): void,
	isShow: boolean
};

export const PreviewImage: FC<PreviewImageProps> = ({ imageUrl = '', removePreview, isShow }) => {
	
	return (
		<div className='w-[338px] h-[220px] rounded-xl'>
			{!isShow && <button
				className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
				onClick={removePreview}
			>
				<span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
					×
				</span>
			</button>}
			<div className=' w-auto h-auto'>
				<NextImage
					src={imageUrl}
					width={450}
					height={450}
					alt='image'
					priority
					unoptimized
					className="h-55 w-55 rounded-md dark:shadow-gray-800"
					placeholder="blur"
					blurDataURL="images/loader/placeholder.png"
					// sizes='(min-width: 768px) 100%'
					onLoad={() => { URL.revokeObjectURL(imageUrl) }}
				/>
				{/* <button
					className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
					onClick={removePreview}
				>
					<span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
						×
					</span>
				</button> */}
			</div>
		</div>
	);
};
