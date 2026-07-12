import { useCallback, useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useRouter } from '@adonisjs/inertia/react'
import { Button, LoadingButton } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { ChevronLeftIcon } from 'lucide-react'
import { createIssueSchema, type CreateIssueSchema } from '@/lib/validations/issue'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Textarea } from '@/components/ui/textarea'

export default function BugReport() {
  const formId = useId()
  const router = useRouter()
  const { control, handleSubmit, setError, formState, reset } = useForm<CreateIssueSchema>({
    resolver: zodResolver(createIssueSchema),
  })

  const onSubmit = useCallback(
    (data: CreateIssueSchema) => {
      router.visit(
        {
          route: 'setting.bug.store',
        },
        {
          method: 'post',
          data,
          preserveState: true,
          onError: (errors) => {
            Object.entries(errors).forEach(([field, message]) => {
              setError(field as keyof CreateIssueSchema, {
                message,
              })
            })
          },
          onSuccess: () => {
            toast.success('Pelaporan bug berhasil')
            reset()
          },
        }
      )
    },
    [router, setError, reset]
  )

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <main className="flex-1 flex flex-col py-5 mx-auto w-full max-w-96">
        <section className="flex gap-3 items-center mb-5">
          <Button variant="ghost" size="icon" asChild>
            <Link route="setting.account">
              <ChevronLeftIcon />
            </Link>
          </Button>
          <h1 className="text-lg">Laporkan Bug</h1>
        </section>

        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="report"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  {...field}
                  id={`${formId}-${field.name}`}
                  aria-invalid={fieldState.invalid}
                  placeholder="Laporkan Bug disini..."
                  required
                  className="min-h-64 resize-none bg-white p-8 rounded-xl shadow"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <LoadingButton
            type="submit"
            variant="gradient"
            size="h-auto"
            loading={formState.isSubmitting}
            className="w-full"
          >
            Kirim Laporan
          </LoadingButton>
        </form>
      </main>
    </div>
  )
}
