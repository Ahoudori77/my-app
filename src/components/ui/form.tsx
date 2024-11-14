import React, { ReactNode, ReactElement } from 'react';
import { Control, Controller, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from 'react-hook-form';

interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  render: (props: {
    field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
    fieldState: any;
    formState: UseFormStateReturn<TFieldValues>;
  }) => ReactElement; // renderの戻り値をReactElementに変更
}

export function Form({ children, ...props }: { children?: ReactNode }) {
  return <form {...props}>{children}</form>;
}

export function FormControl({ children }: { children?: ReactNode }) {
  return <div>{children}</div>;
}

export function FormItem({ children }: { children?: ReactNode }) {
  return <div>{children}</div>;
}

export function FormLabel({ children }: { children?: ReactNode }) {
  return <label>{children}</label>;
}

export function FormMessage({ children }: { children?: ReactNode }) {
  return <p>{children}</p>;
}

export function FormDescription({ children }: { children?: ReactNode }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}

export function FormField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  render,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => render({ field, fieldState, formState }) as ReactElement} // as ReactElementを追加
    />
  );
}
