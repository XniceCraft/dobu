import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Cropper,
  CropperArea,
  type CropperAreaData,
  CropperImage,
  type CropperProps,
} from '@/components/ui/cropper'
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

function CropperCanvas({
  ref,
  file,
  onCropAreaChange,
  onRotationChange,
}: {
  ref: React.Ref<() => void> | undefined
  file: File
  onCropAreaChange: NonNullable<CropperProps['onCropAreaChange']>
  onRotationChange: (rotation: number) => void
}) {
  const [aspectRatio, setAspectRatio] = useState<number>(ASPECT_RATIOS[0].value)
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

export function EditImageDialog({
  openDialog,
  onOpenDialogChange,
  selectedFile,
  handleCrop,
}: {
  openDialog: boolean
  onOpenDialogChange: (value: boolean) => void
  handleCrop: (data: CropperAreaData, rotation: number) => Promise<void>
  selectedFile: File | null
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
