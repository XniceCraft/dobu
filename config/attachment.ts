import type { InferConverters } from '@jrmc/adonis-attachment/types/config'
import { defineConfig } from '@jrmc/adonis-attachment'
// import sharp from 'sharp'

/**
 * Documentation: https://adonis-attachment.jrmc.dev/guide/essentials/configuration
 */

const attachmentConfig = defineConfig({
  /**
   * Enable the preComputeUrl flag to pre compute the URLs after SELECT queries. (default: false)
   */
  // preComputeUrl: true,

  /**
   * Enable the meta informations after upload. (default: false)
   */
  // meta: true,

  /**
   * Enable file rename after upload. (default: true)
   */
  // rename: false,

  /**
   * Specify binary path
   */
  // bin: { // [!code focus:8]
  //   ffmpegPath: 'ffmpeg_path', // the full path of the binary
  //   ffprobePath: 'ffprobe_path', // the full path of the binary
  //   pdftoppmPath: 'pdftoppm_path' // the full path of the binary
  //   pdfinfoPath: 'pdfinfo_path' // the full path of the binary
  //   sofficePath: 'soffice_path', // the full path of the binary (libreoffice/openoffice)
  // },

  /**
   * Queue configuration for file processing.
   * By default, 1 task is processed concurrently. A task corresponds to a model attribute.
   * For example, if a model has a logo attribute and an avatar attribute,
   * this represents 2 tasks, regardless of the number of concerts per attribute.
   *
   * Increasing concurrency can improve performance but consumes more resources.
   * A value too high may lead to memory or CPU issues.
   *
   */
  // queue: {
  //   concurrency: 2
  // },

  /**
   * Maximum duration (in milliseconds) that an operation can take before being interrupted.
   * Default: 30_000 (30 seconds)
   *
   * This timeout applies to each individual operation conversion.
   * If an operation exceeds this time limit, it will be interrupted and an error will be thrown.
   *
   * Increase this value if you're processing large files or if your operations
   * require more time (e.g., long video conversion).
   *
   */
  // timeout: 40_000,

  /**
   * Configure how variants are stored relative to the original file.
   *
   * - 'basePath': Define a custom base path where all variants will be stored.
   *   By default, variants are stored in the same folder as the original file.
   *
   * - 'ignoreFolder': When set to 'true', the variant will not include the parent
   *   folder from the original attachment.
   */
  // variant: {
  //  basePath: 'variants',
  //  ignoreFolder: true,
  // },

  /**
   *
   */
  converters: {
    thumbnail: {
      converter: () => import('@jrmc/adonis-attachment/converters/image_converter'),
      resize: {
        width: 300,
        height: 300,
        position: 'center',
      },
      format: 'webp',
    },
    small: {
      converter: () => import('@jrmc/adonis-attachment/converters/image_converter'),
      resize: {
        width: 500,
        height: 500,
        position: 'center',
      },
      format: 'webp',
    },
    medium: {
      converter: () => import('@jrmc/adonis-attachment/converters/image_converter'),
      resize: {
        width: 800,
        height: 800,
        position: 'center',
      },
      format: 'webp',
    },
  },
})

export default attachmentConfig

declare module '@jrmc/adonis-attachment' {
  interface AttachmentVariants extends InferConverters<typeof attachmentConfig> {}
}
