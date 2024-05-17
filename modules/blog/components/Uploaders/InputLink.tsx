import { toast } from 'react-toastify';

import { Suspense, type FC } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { FiCopy } from 'react-icons/fi';

type InputLinkProps<T extends FieldValues> = {
	name: Path<T>
	value: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	register: UseFormRegister<T>;
	errors: string | undefined;
	placeholder: string | undefined
};

export const InputLink = <T extends FieldValues>({ value, handleChange, name, register, errors, placeholder }: InputLinkProps<T>) => {
	return (
		<div className='relative w-full'>
			<label className='relative bg-green-300'>
				<input
					{...(register ? register(name) : {})}
					placeholder={placeholder}
					type='text'
					name={name}
					value={value || ""}
					onChange={handleChange}
					className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
				/>

				<button
					type='button'
					title='Press to copy'
					className='absolute top-1/2 -translate-y-1/2 block right-1 bg-blue-500 hover:bg-blue-600 transition-colors text-gray-50 text-sm w-20 h-8 rounded-lg shadow-xl shadow-blue-500/50'
					onClick={
						() => {
							navigator.clipboard.writeText(value ?? "")
								.then(() => {
									toast.success('Copy to clipboard', { theme: 'light' });
								})
								.catch(() => {
									toast.error('Failed to copy', { theme: 'light' });
								});
						}
					}
				>
					<Suspense>
						<FiCopy />
					</Suspense>
				</button>
			</label>
			{errors && <span>{`${errors}`}</span>}
		</div>
	);
};
