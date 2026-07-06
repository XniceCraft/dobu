import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileUpload, FileUploadDropzone, FileUploadTrigger } from '@/components/ui/file-upload'
import { PencilIcon, UploadIcon, XIcon } from '@phosphor-icons/react'
import { Cropper, CropperArea, CropperImage, type CropperProps } from '@/components/ui/cropper'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ArrowUpIcon } from '@phosphor-icons/react'
import { Field } from '@/components/ui/field'
import { IMAGE_MAX_FILE_SIZE } from '@/lib/image'

import type { CropperAreaData } from '@/components/ui/cropper'

interface FileWithCrop {
  original: File
  cropped?: File
  croppedUrl?: string
}

interface AspectRatio {
  label: string
  value: number
}

const ASPECT_RATIOS: AspectRatio[] = [
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '1:1', value: 1 },
]

const ROTATION_PRESETS: number[] = [0, 90, 180, 270]

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
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

function CropperCanvas({
  ref,
  file,
  onCropAreaChange,
  onRotationChange,
  defaultAspectRatio,
}: {
  ref: React.Ref<() => void> | undefined
  file: File
  onCropAreaChange: NonNullable<CropperProps['onCropAreaChange']>
  onRotationChange: (rotation: number) => void
  defaultAspectRatio?: number
}) {
  const [aspectRatio, setAspectRatio] = useState<number>(
    defaultAspectRatio ?? ASPECT_RATIOS[0].value
  )
  const [zoom, setZoom] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)

  const imageUrlRef = useRef<string | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!file) return

    const newUrl = URL.createObjectURL(file)
    imageUrlRef.current = newUrl

    if (imageRef.current) imageRef.current.src = newUrl

    return () => {
      URL.revokeObjectURL(newUrl)
      imageUrlRef.current = null
    }
  }, [file])

  const imageRefCallback = useCallback((node: HTMLImageElement | null) => {
    imageRef.current = node
    if (!node || !imageUrlRef.current) return

    node.src = imageUrlRef.current
  }, [])

  const handleRotation = useCallback(
    (rotation: number) => {
      setRotation(rotation)
      onRotationChange(rotation)
    },
    [onRotationChange]
  )

  const handleReset = useCallback(() => {
    setZoom(1)
    setRotation(0)
    setAspectRatio(ASPECT_RATIOS[0].value)
  }, [])

  useImperativeHandle(ref, () => handleReset)

  return (
    <div className="grid grid-cols-[1fr_14rem] gap-4 items-start">
      <div className="h-80">
        <Cropper
          aspectRatio={aspectRatio}
          shape="rectangle"
          zoom={zoom}
          onZoomChange={setZoom}
          rotation={rotation}
          onRotationChange={handleRotation}
          onCropAreaChange={onCropAreaChange}
          className="h-full w-full rounded-lg overflow-hidden"
        >
          <CropperImage ref={imageRefCallback} alt={file.name} crossOrigin="anonymous" />
          <CropperArea withGrid />
        </Cropper>
      </div>

      <div className="space-y-4">
        <Field className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Aspect Ratio
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            {ASPECT_RATIOS.map(({ label, value: ratio }) => (
              <Button
                key={label}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                variant={aspectRatio === ratio ? 'default' : 'outline'}
              >
                {label}
              </Button>
            ))}
          </div>
        </Field>

        <Field>
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Rotation
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            {ROTATION_PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                onClick={() => setRotation(preset)}
                variant={rotation === preset ? 'default' : 'outline'}
              >
                <span
                  className="block text-base leading-none"
                  style={{ transform: `rotate(${preset}deg)` }}
                  aria-hidden="true"
                >
                  <ArrowUpIcon />
                </span>
                <span>{preset}°</span>
              </Button>
            ))}
          </div>
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Zoom
            </Label>
            <span className="text-xs tabular-nums text-muted-foreground">{zoom.toFixed(2)}×</span>
          </div>
          <Slider
            value={[zoom]}
            onValueChange={([z = 1]) => setZoom(z)}
            min={1}
            max={3}
            step={0.01}
          />
        </Field>
      </div>
    </div>
  )
}

function EditImageDialog({
  openDialog,
  onOpenDialogChange,
  selectedFile,
  handleCrop,
  defaultAspectRatio,
}: {
  openDialog: boolean
  onOpenDialogChange: (value: boolean) => void
  handleCrop: (data: CropperAreaData, rotation: number) => Promise<void>
  selectedFile: File | null
  defaultAspectRatio?: number
}) {
  const cropperResetRef = useRef<(() => void) | null>(null)
  const rotationRef = useRef<number>(0)
  const croppedAreaRef = useRef<CropperAreaData | null>(null)

  const onCropAreaChange: NonNullable<CropperProps['onCropAreaChange']> = useCallback(
    (_, croppedAreaPixels) => {
      croppedAreaRef.current = croppedAreaPixels
    },
    []
  )

  const handleRotationChange = useCallback((rotation: number) => {
    rotationRef.current = rotation
  }, [])

  const onCropReset = useCallback(() => {
    croppedAreaRef.current = null
    rotationRef.current = 0

    cropperResetRef.current?.()
  }, [])

  const onCropApply = useCallback(async () => {
    const data = croppedAreaRef.current
    const rotation = rotationRef.current
    if (!data) return

    await handleCrop(data, rotation)
    onOpenDialogChange(false)
  }, [handleCrop, onOpenDialogChange])

  return (
    <Dialog open={openDialog} onOpenChange={onOpenDialogChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Cover Image</DialogTitle>
          <DialogDescription>
            Crop, zoom, and rotate{' '}
            <span className="font-medium text-foreground">{selectedFile?.name}</span>
          </DialogDescription>
        </DialogHeader>

        {selectedFile && (
          <CropperCanvas
            ref={cropperResetRef}
            file={selectedFile}
            onCropAreaChange={onCropAreaChange}
            onRotationChange={handleRotationChange}
            defaultAspectRatio={defaultAspectRatio}
          />
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCropReset}>
            Reset
          </Button>
          <Button type="button" onClick={onCropApply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ImageField({
  onChange,
  existingImage,
  defaultAspectRatio,
}: {
  onChange: (value?: File) => void
  existingImage?: string
  defaultAspectRatio?: number
}) {
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

  useEffect(() => {
    async function loadFile() {
      if (!existingImage) return

      const response = await fetch(existingImage)
      const blob = await response.blob()
      const file = new File([blob], existingImage, { type: blob.type })
      setFile(file)
    }

    loadFile()
  }, [existingImage])

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
        onChange(undefined)
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
            <img
              ref={imageRefCallback}
              alt={file ? file.name : 'Character preview'}
              className="w-full h-full object-cover"
            />

            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 rounded-xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {file && (
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
              )}

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
                <p className="text-muted-foreground text-xs">
                  PNG, JPG, WebP up to {formatBytes(IMAGE_MAX_FILE_SIZE)}
                </p>
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
        defaultAspectRatio={defaultAspectRatio}
      />
    </>
  )
}
