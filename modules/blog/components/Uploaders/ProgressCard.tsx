import type { FC } from 'react';

type ProgressCardProps = {
	progressStatus: number;
};

export const ProgressCard: FC<ProgressCardProps> = ({ progressStatus }) => {
	const width = progressStatus.toString().concat('%');

	return (
		<div className='w-[402px] h-[144px] px-8 py-8 flex flex-col gap-8 justify-center items-center bg-white rounded-xl shadow-lg shadow-gray'>
			<h2 className='w-full capitalize text-xl text-left text-graydark font-semibold'>Please wait...</h2>
			<div className='relative w-full h-2 bg-success rounded'>
				<div className='absolute inset-y-0 h-full bg-gray transition-[width] rounded' style={{ width }} />
			</div>
		</div>
	);
};
