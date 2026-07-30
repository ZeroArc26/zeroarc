"use client";

import * as React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

export const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext =
  React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
  );

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider
      value={{ name: props.name }}
    >
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function useFormField() {
  const fieldContext =
    React.useContext(FormFieldContext);

  const itemContext =
    React.useContext(FormItemContext);

  const { getFieldState, formState } =
    useFormContext();

  const fieldState = getFieldState(
    fieldContext.name,
    formState
  );

  const id = itemContext.id;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

const FormItemContext = React.createContext<{
  id: string;
}>({} as { id: string });

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        className={className}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

export function FormLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const {
    error,
    formItemId,
  } = useFormField();

  return (
    <label
      htmlFor={formItemId}
      className={[
        "text-sm font-medium",
        error && "text-destructive",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function FormControl({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const {
    error,
    formItemId,
    formDescriptionId,
    formMessageId,
  } = useFormField();

  return (
    <div
      id={formItemId}
      aria-describedby={
        error
          ? `${formDescriptionId} ${formMessageId}`
          : formDescriptionId
      }
      aria-invalid={!!error}
      className={className}
      {...props}
    />
  );
}

export function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const {
    formDescriptionId,
  } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={[
        "text-sm text-muted-foreground",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function FormMessage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const {
    error,
    formMessageId,
  } = useFormField();

  const body =
    error?.message?.toString() ?? children;

  if (!body) return null;

  return (
    <p
      id={formMessageId}
      className={[
        "text-sm font-medium text-destructive",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {body}
    </p>
  );
}