import { useEffect, useRef, useState } from 'react';
import {
  Film,
  ImagePlus,
  RefreshCw,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { PRODUCT_FORM_FIELDS } from '../../../constants/productFields';


interface PreviewItem {
  id: string;
  file: File;
  previewUrl: string;
}

export interface ProductMediaUploaderProps {
  disabled?: boolean;
  error?: string;
}

const MAX_GALLERY_IMAGES = 6;
const MAX_VIDEOS = 2;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 50;

export const ProductMediaUploader = ({
  disabled = false,
  error,
}: ProductMediaUploaderProps) => {
  const [thumbnail, setThumbnail] = useState<PreviewItem | null>(null);
  const [gallery, setGallery] = useState<PreviewItem[]>([]);
  const [videos, setVideos] = useState<PreviewItem[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);

  // Hidden native inputs synced via DataTransfer for React Router <Form>
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videosInputRef = useRef<HTMLInputElement>(null);

  // Keep latest previews in a ref to clean up blob URLs on unmount
  const cleanupRef = useRef<PreviewItem[]>([]);
  cleanupRef.current = [
    ...(thumbnail ? [thumbnail] : []),
    ...gallery,
    ...videos,
  ];

  useEffect(() => {
    return () => {
      cleanupRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  // Sync a React File[] state into a native <input type="file">
  const syncFilesToInput = (
    input: HTMLInputElement | null,
    files: File[]
  ) => {
    if (!input) return;
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
  };

  // --- Main Thumbnail Handlers ---
  const handleThumbnailChange = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLocalError('Main thumbnail must be an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setLocalError(`Thumbnail must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setLocalError(null);
    if (thumbnail) URL.revokeObjectURL(thumbnail.previewUrl);

    const nextItem: PreviewItem = {
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    };
    setThumbnail(nextItem);
    syncFilesToInput(thumbnailInputRef.current, [file]);
  };

  // --- Gallery Images Handlers (Up to 6) ---
  const addGalleryFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setLocalError(null);

    const incoming = Array.from(fileList);
    const validImages: PreviewItem[] = [];

    for (const file of incoming) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Only image files are allowed in the photo gallery.');
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setLocalError(`Each image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
        continue;
      }
      validImages.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    setGallery((prev) => {
      const combined = [...prev, ...validImages];
      if (combined.length > MAX_GALLERY_IMAGES) {
        setLocalError(`Maximum of ${MAX_GALLERY_IMAGES} gallery images allowed.`);
        // Revoke any excess previews that won't be kept
        combined
          .slice(MAX_GALLERY_IMAGES)
          .forEach((item) => URL.revokeObjectURL(item.previewUrl));
      }
      const trimmed = combined.slice(0, MAX_GALLERY_IMAGES);
      syncFilesToInput(
        galleryInputRef.current,
        trimmed.map((item) => item.file)
      );
      return trimmed;
    });
  };

  const removeGalleryImage = (id: string) => {
    setGallery((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);

      const next = prev.filter((item) => item.id !== id);
      syncFilesToInput(
        galleryInputRef.current,
        next.map((item) => item.file)
      );
      return next;
    });
  };

  // --- 3. Video Handlers (Up to 2) ---
  const addVideoFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setLocalError(null);

    const incoming = Array.from(fileList);
    const validVideos: PreviewItem[] = [];

    for (const file of incoming) {
      if (!file.type.startsWith('video/')) {
        setLocalError('Only video files (MP4, WebM, MOV) are allowed.');
        continue;
      }
      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        setLocalError(`Each video must be under ${MAX_VIDEO_SIZE_MB}MB.`);
        continue;
      }
      validVideos.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    setVideos((prev) => {
      const combined = [...prev, ...validVideos];
      if (combined.length > MAX_VIDEOS) {
        setLocalError(`Maximum of ${MAX_VIDEOS} videos allowed.`);
        combined
          .slice(MAX_VIDEOS)
          .forEach((item) => URL.revokeObjectURL(item.previewUrl));
      }
      const trimmed = combined.slice(0, MAX_VIDEOS);
      syncFilesToInput(
        videosInputRef.current,
        trimmed.map((item) => item.file)
      );
      return trimmed;
    });
  };

  const removeVideo = (id: string) => {
    setVideos((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);

      const next = prev.filter((item) => item.id !== id);
      syncFilesToInput(
        videosInputRef.current,
        next.map((item) => item.file)
      );
      return next;
    });
  };

  const activeError = error || localError;

  return (
    <div className="space-y-6">
      {activeError && (
        <div
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {activeError}
        </div>
      )}

      {/* ================= MAIN THUMBNAIL ================= */}
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-ink-label">
          Main Thumbnail <span className="text-red-500">*</span>
        </h3>
        <span className="text-[11px] text-ink-muted">Max {MAX_IMAGE_SIZE_MB}MB</span>
      </div>

      <input
        ref={thumbnailInputRef}
        type="file"
        name={PRODUCT_FORM_FIELDS.thumbnail}
        accept="image/*"
        required={!thumbnail}
        disabled={disabled}
        onChange={(e) => handleThumbnailChange(e.target.files)}
        className="sr-only"
      />

      {thumbnail ? (
        <div className="flex items-center gap-3 rounded-md border border-brand-border bg-surface-input p-2">
          <img
            src={thumbnail.previewUrl}
            alt="Main product thumbnail preview"
            className="h-20 w-20 shrink-0 rounded object-cover border border-brand-border bg-white"
          />

          <div className="flex-1 min-w-0 space-y-1.5">
            <p className="truncate text-xs font-medium text-ink-primary">
              {thumbnail.file.name}
            </p>
            <button
              type="button"
              disabled={disabled}
              onClick={() => thumbnailInputRef.current?.click()}
              className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-md border border-brand-border bg-surface-card hover:bg-white text-xs font-medium text-ink-primary transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="h-3 w-3 text-brand" />
              Replace
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => thumbnailInputRef.current?.click()}
          className="w-full h-24 flex items-center justify-center gap-3 rounded-md border-2 border-dashed border-brand-border bg-surface-input hover:border-brand transition px-4 text-left cursor-pointer disabled:opacity-50"
        >
          <ImagePlus className="h-6 w-6 shrink-0 text-brand" />
          <div>
            <p className="text-xs font-medium text-accent">
              Upload Main Thumbnail
            </p>
            <p className="text-[11px] text-ink-muted">
              PNG, JPG, or WebP (Required)
            </p>
          </div>
        </button>
      )}
    </div>


      {/* =================  GALLERY PHOTOS (UP TO 6) ================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-ink-label">Gallery Photos</h3>
          <span className="text-xs text-ink-muted">
            {gallery.length}/{MAX_GALLERY_IMAGES}
          </span>
        </div>

        {/* Hidden input bound to React Router FormData ("galleryImages") */}
        <input
          ref={galleryInputRef}
          type="file"
          name={PRODUCT_FORM_FIELDS.galleryImages}
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={(e) => addGalleryFiles(e.target.files)}
          className="sr-only"
        />

        {/* Drag and Drop Zone (shown while under 6 images) */}
        {gallery.length < MAX_GALLERY_IMAGES && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => !disabled && galleryInputRef.current?.click()}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                e.preventDefault();
                galleryInputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled) setIsDraggingGallery(true);
            }}
            onDragLeave={() => setIsDraggingGallery(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingGallery(false);
              if (!disabled) addGalleryFiles(e.dataTransfer.files);
            }}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 rounded-sm border-2 border-dashed p-4 text-center transition cursor-pointer',
              isDraggingGallery
                ? 'border-brand bg-brand/5'
                : 'border-brand-border bg-surface-input hover:border-brand',
              disabled && 'opacity-50 pointer-events-none'
            )}
          >
            <UploadCloud className="h-5 w-5 text-brand" />
            <p className="text-xs font-medium text-ink-primary">
              Drop photos here or <span className="text-accent underline">browse</span>
            </p>
            <p className="text-[11px] text-ink-muted">
              Up to {MAX_GALLERY_IMAGES} photos ({MAX_IMAGE_SIZE_MB}MB each)
            </p>
          </div>
        )}

        {/* Thumbnail Grid with Hover Delete */}
        {gallery.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((item, idx) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-sm border border-brand-border bg-surface-input"
              >
                <img
                  src={item.previewUrl}
                  alt={`Gallery preview ${idx + 1}`}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeGalleryImage(item.id)}
                  aria-label={`Remove gallery image ${idx + 1}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 group-hover:opacity-100 focus:opacity-100 transition cursor-pointer"
                >
                  <span className="rounded-full bg-red-600 p-1.5 text-white shadow">
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= 3. VIDEOS (UP TO 2) ================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-ink-label">Product Videos</h3>
          <span className="text-xs text-ink-muted">
            {videos.length}/{MAX_VIDEOS}
          </span>
        </div>

        {/* Hidden input bound to React Router FormData ("videos") */}
        <input
          ref={videosInputRef}
          type="file"
          name={PRODUCT_FORM_FIELDS.videos}
          accept="video/*"
          multiple
          disabled={disabled}
          onChange={(e) => addVideoFiles(e.target.files)}
          className="sr-only"
        />

        {videos.length < MAX_VIDEOS && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => videosInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-sm border-2 border-dashed border-brand-border bg-surface-input hover:border-brand px-3 py-3 text-xs font-medium text-ink-primary transition cursor-pointer disabled:opacity-50"
          >
            <Film className="h-4 w-4 text-brand" />
            Add Video (Max {MAX_VIDEO_SIZE_MB}MB)
          </button>
        )}

        {videos.length > 0 && (
          <div className="space-y-2">
            {videos.map((item, idx) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-sm border border-brand-border bg-black"
              >
                <video
                  src={item.previewUrl}
                  controls
                  muted
                  className="aspect-video w-full object-cover"
                />
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeVideo(item.id)}
                  aria-label={`Remove video ${idx + 1}`}
                  className="absolute top-2 right-2 rounded-full bg-red-600/90 hover:bg-red-600 p-1.5 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};