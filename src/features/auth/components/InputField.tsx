import type { ChangeEvent, InputHTMLAttributes } from "react";

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({
  id,
  label,
  type,
  value,
  onChange,
  ...rest
}: InputFieldProps) {
  return (
    <>
      <label htmlFor={id} className="label text-sm">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="input w-full"
        value={value}
        onChange={onChange}
        {...rest}
      />
    </>
  );
}
