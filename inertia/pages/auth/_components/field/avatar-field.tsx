import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { type CropperAreaData } from '@/components/ui/cropper'
import { FileUpload, FileUploadDropzone, FileUploadTrigger } from '@/components/ui/file-upload'
import { EditImageDialog } from '../dialog/edit-image-dialog'
import { PencilIcon, UploadIcon, XIcon } from '@phosphor-icons/react'

interface FileWithCrop {
  original: File
  cropped?: File
  croppedUrl?: string
}

async function createCroppedImage(
  imageSrc: string | Blob,
  cropData: CropperAreaData,
  rotation: number,
  fileName: string
): Promise<File> {
  let image: ImageBitmap

  if (typeof imageSrc === 'string') {
    const response = await fetch(imageSrc)
    const blobForBitmap = await response.blob()
    image = await createImageBitmap(blobForBitmap)
  } else {
    image = await createImageBitmap(imageSrc)
  }

  const maxSize = Math.max(image.width, image.height)
  const safeArea = Math.ceil(2 * ((maxSize / 2) * Math.sqrt(2)))

  const rotationCanvas = new OffscreenCanvas(safeArea, safeArea)
  const rotCtx = rotationCanvas.getContext('2d')
  if (!rotCtx) throw new Error('Could not get OffscreenCanvas context')

  rotCtx.translate(safeArea / 2, safeArea / 2)
  rotCtx.rotate((rotation * Math.PI) / 180)
  rotCtx.translate(-safeArea / 2, -safeArea / 2)
  rotCtx.drawImage(image, safeArea / 2 - image.width / 2, safeArea / 2 - image.height / 2)

  const imageData = rotCtx.getImageData(0, 0, safeArea, safeArea)

  const cropCanvas = new OffscreenCanvas(cropData.width, cropData.height)
  const cropCtx = cropCanvas.getContext('2d')
  if (!cropCtx) throw new Error('Could not get OffscreenCanvas crop context')

  cropCtx.putImageData(
    imageData,
    Math.round(0 - safeArea / 2 + image.width / 2 - cropData.x),
    Math.round(0 - safeArea / 2 + image.height / 2 - cropData.y)
  )

  const blob = await cropCanvas.convertToBlob({ type: 'image/webp', quality: 1 })
  return new File([blob], `cropped-${fileName}`, { type: 'image/webp' })
}

export function AvatarField({ onChange }: { onChange: (value: File) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [editedFile, setEditedFile] = useState<FileWithCrop | null>(null)
  const [showCropDialog, setShowCropDialog] = useState(false)

  const imageRef = useRef<HTMLImageElement>(null)
  const previewRef = useRef<string | null>(null)

  useEffect(() => {
    if (!file) {
      previewRef.current = null
      return
    }

    const url = URL.createObjectURL(file)
    previewRef.current = url
    if (imageRef.current) imageRef.current.src = url

    return () => {
      URL.revokeObjectURL(url)
      previewRef.current = null
    }
  }, [file])

  const imageRefCallback = useCallback(
    (node: HTMLImageElement | null) => {
      imageRef.current = node

      const src = editedFile?.croppedUrl ?? previewRef.current
      if (!src || !node) return

      node.src = src
    },
    [editedFile]
  )

  const onFilesChange = useCallback(
    (newFiles: File[]) => {
      if (newFiles.length === 0) {
        setFile(null)
        setEditedFile(null)
        return
      }

      setFile(newFiles[0])

      setEditedFile((prev) => {
        if (prev && prev.croppedUrl) {
          URL.revokeObjectURL(prev.croppedUrl)
        }

        return {
          original: newFiles[0],
        }
      })

      onChange(newFiles[0])
    },
    [onChange]
  )

  const onCropApply = useCallback(
    async (data: CropperAreaData, rotation: number) => {
      if (!file || !data) return

      try {
        const currentBlob = new Blob([file])
        const croppedFile = await createCroppedImage(currentBlob, data, rotation, file.name)

        const croppedUrl = URL.createObjectURL(croppedFile)

        setEditedFile((prev) => {
          if (prev?.croppedUrl) URL.revokeObjectURL(prev.croppedUrl)

          return {
            original: prev?.original || file,
            cropped: croppedFile,
            croppedUrl,
          }
        })

        onChange(croppedFile)
      } catch {
        // TODO: surface error via toast/callback
      }
    },
    [onChange, file]
  )

  return (
    <>
      <FileUpload
        value={file ? [file] : []}
        onValueChange={onFilesChange}
        accept="image/*"
        maxFiles={1}
        maxSize={10 * 1024 * 1024}
        className="w-full max-w-lg"
      >
        {file ? (
          <div className="relative w-full overflow-hidden rounded-xl border border-rule bg-surface shadow-sm group h-48">
            <img ref={imageRefCallback} alt={file.name} className="w-full h-full object-cover" />

            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 rounded-xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="size-8 shadow-md bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 dark:bg-zinc-800/90 dark:text-zinc-200 dark:hover:bg-zinc-800"
                title="Edit / crop image"
                onClick={() => setShowCropDialog(true)}
              >
                <PencilIcon />
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="size-8 shadow-md bg-white/90 text-red-500 hover:bg-red-50 hover:text-red-600 dark:bg-zinc-800/90 dark:text-red-400 dark:hover:bg-red-950/60 dark:hover:text-red-400"
                title="Remove image"
                onClick={() => onFilesChange([])}
              >
                <XIcon />
              </Button>
            </div>
          </div>
        ) : (
          <FileUploadDropzone className="h-48">
            <div className="flex flex-col items-center gap-2 text-center">
              <UploadIcon className="size-8 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Drop an image here or click to upload</p>
                <p className="text-muted-foreground text-xs">PNG, JPG, WebP up to 10MB</p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </FileUploadTrigger>
            </div>
          </FileUploadDropzone>
        )}
      </FileUpload>

      <EditImageDialog
        openDialog={showCropDialog}
        onOpenDialogChange={setShowCropDialog}
        handleCrop={onCropApply}
        selectedFile={file}
      />
    </>
  )
}
