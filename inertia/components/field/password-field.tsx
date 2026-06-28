import { Controller } from 'react-hook-form'
import { EyeClosedIcon, EyeIcon } from 'lucide-react'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { useState } from 'react'

import type { FieldValues, Control, Path } from 'react-hook-form'

interface PasswordFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  placeholder?: string
}

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              autoComplete="off"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2"
            >
              {showPassword ? <EyeClosedIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
