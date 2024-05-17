interface CheckboxStatusProps {
  isChecked: boolean,
  setIsChecked: (checked: boolean) => void,
  isShow: boolean
}

const CheckboxStatus = ({ isChecked, setIsChecked, isShow }: CheckboxStatusProps) => {

  return (
    <div>
      <label
        htmlFor="checkboxLabelOne"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            readOnly={isShow}
            disabled={isShow}
            id="checkboxLabelOne"
            className="sr-only"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${isChecked && 'border-primary bg-gray dark:bg-transparent'
              }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${isChecked && 'bg-primary'}`}
            ></span>
          </div>
        </div>
        {isChecked ? 'publish' : 'draft'}
      </label>
    </div>
  );
};

export default CheckboxStatus;
