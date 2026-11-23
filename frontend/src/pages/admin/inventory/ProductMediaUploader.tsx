// src/pages/admin/inventory/ProductMediaUploader.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Film, ImagePlus, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { cn } from "../../../utils/cn";
import { PRODUCT_FORM_FIELDS } from "../../../constants/productFields";
import type { ProductMediaDTO } from "../../../types/inventory";

interface PreviewItem {
  id: string;
  file: File;
  previewUrl: string;
}

export interface ProductMediaUploaderProps {
  disabled?: boolean;
  error?: string;
  existingMedia?: ProductMediaDTO[];
}

const MAX_GALLERY_IMAGES = 6;
const MAX_VIDEOS = 2;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 50;

export const ProductMediaUploader = ({
  disabled = false,
  error,
  existingMedia = [],
}: ProductMediaUploaderProps) => {
  const [thumbnail, setThumbnail] = useState<PreviewItem | null>(null);
  const [gallery, setGallery] = useState<PreviewItem[]>([]);
  const [videos, setVideos] = useState<PreviewItem[]>([]);
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videosInputRef = useRef<HTMLInputElement>(null);

  console.log(existingMedia);
  // Partition active existing Cloudinary media (excluding IDs marked for deletion)
  const retainedExistingThumbnail = useMemo(
    () =>
      existingMedia.find((m) => m.isMain && !removedIds.includes(m.id)) ?? null,
    [existingMedia, removedIds],
  );

  const retainedExistingGallery = useMemo(
    () =>
      existingMedia.filter(
        (m) => !m.isMain && m.type === "IMAGE" && !removedIds.includes(m.id),
      ),
    [existingMedia, removedIds],
  );

  const retainedExistingVideos = useMemo(
    () =>
      existingMedia.filter(
        (m) => m.type === "VIDEO" && !removedIds.includes(m.id),
      ),
    [existingMedia, removedIds],
  );

  const totalGalleryCount = retainedExistingGallery.length + gallery.length;
  const totalVideosCount = retainedExistingVideos.length + videos.length;
  const hasAnyThumbnail = Boolean(thumbnail || retainedExistingThumbnail);

  // Revoke object URLs on unmount
  const cleanupRef = useRef<PreviewItem[]>([]);
  cleanupRef.current = [
    ...(thumbnail ? [thumbnail] : []),
    ...gallery,
    ...videos,
  ];

  useEffect(() => {
    return () => {
      cleanupRef.current.forEach((item) =>
        URL.revokeObjectURL(item.previewUrl),
      );
    };
  }, []);

  const syncFilesToInput = (input: HTMLInputElement | null, files: File[]) => {
    if (!input) return;
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
  };

  const markExistingMediaRemoved = (id: number) => {
    setRemovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // --- 1. Main Thumbnail Handlers ---
  const handleThumbnailChange = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLocalError("Main thumbnail must be an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setLocalError(`Thumbnail must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setLocalError(null);
    if (thumbnail) URL.revokeObjectURL(thumbnail.previewUrl);

    // If replacing an existing Cloudinary main thumbnail, mark the old one for deletion
    // if (retainedExistingThumbnail) {
    //   markExistingMediaRemoved(retainedExistingThumbnail.id);
    // }

    const nextItem: PreviewItem = {
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    };
    setThumbnail(nextItem);
    syncFilesToInput(thumbnailInputRef.current, [file]);
  };

  // --- Gallery Images Handlers (Up to 6 combined) ---
  const addGalleryFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setLocalError(null);

    const incoming = Array.from(fileList);
    const validImages: PreviewItem[] = [];

    for (const file of incoming) {
      if (!file.type.startsWith("image/")) {
        setLocalError("Only image files are allowed in the photo gallery.");
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

    const remainingSlots = Math.max(
      0,
      MAX_GALLERY_IMAGES - retainedExistingGallery.length,
    );

    setGallery((prev) => {
      const combined = [...prev, ...validImages];
      if (combined.length > remainingSlots) {
        setLocalError(
          `Maximum of ${MAX_GALLERY_IMAGES} gallery images allowed.`,
        );
        combined
          .slice(remainingSlots)
          .forEach((item) => URL.revokeObjectURL(item.previewUrl));
      }
      const trimmed = combined.slice(0, remainingSlots);
      syncFilesToInput(
        galleryInputRef.current,
        trimmed.map((item) => item.file),
      );
      return trimmed;
    });
  };

  const removeNewGalleryImage = (id: string) => {
    setGallery((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);

      const next = prev.filter((item) => item.id !== id);
      syncFilesToInput(
        galleryInputRef.current,
        next.map((item) => item.file),
      );
      return next;
    });
  };

  // --- 3. Video Handlers (Up to 2 combined) ---
  const addVideoFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setLocalError(null);

    const incoming = Array.from(fileList);
    const validVideos: PreviewItem[] = [];

    for (const file of incoming) {
      if (!file.type.startsWith("video/")) {
        setLocalError("Only video files (MP4, WebM, MOV) are allowed.");
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

    const remainingSlots = Math.max(
      0,
      MAX_VIDEOS - retainedExistingVideos.length,
    );

    setVideos((prev) => {
      const combined = [...prev, ...validVideos];
      if (combined.length > remainingSlots) {
        setLocalError(`Maximum of ${MAX_VIDEOS} videos allowed.`);
        combined
          .slice(remainingSlots)
          .forEach((item) => URL.revokeObjectURL(item.previewUrl));
      }
      const trimmed = combined.slice(0, remainingSlots);
      syncFilesToInput(
        videosInputRef.current,
        trimmed.map((item) => item.file),
      );
      return trimmed;
    });
  };

  const removeNewVideo = (id: string) => {
    setVideos((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);

      const next = prev.filter((item) => item.id !== id);
      syncFilesToInput(
        videosInputRef.current,
        next.map((item) => item.file),
      );
      return next;
    });
  };

  const activeError = error || localError;
  const activeThumbnailPreview =
    thumbnail?.previewUrl || retainedExistingThumbnail?.url || null;
  const activeThumbnailLabel =
    thumbnail?.file.name ||
    (retainedExistingThumbnail ? "Current saved thumbnail" : "");

  return (
    <div className="space-y-6">
      {/* Hidden state inputs consumed by editProductAction */}
      <input
        type="hidden"
        name="hasExistingThumbnail"
        value={retainedExistingThumbnail ? "true" : "false"}
      />
      <input
        type="hidden"
        name="removedMediaIds"
        value={JSON.stringify(removedIds)}
      />

      {activeError && (
        <div
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {activeError}
        </div>
      )}

      {/* ================= 1. MAIN THUMBNAIL ================= */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-ink-label">
            Main Thumbnail <span className="text-red-500">*</span>
          </h3>
          <span className="text-[11px] text-ink-muted">
            Max {MAX_IMAGE_SIZE_MB}MB
          </span>
        </div>

        <input
          ref={thumbnailInputRef}
          type="file"
          name={PRODUCT_FORM_FIELDS.thumbnail}
          accept="image/*"
          required={!hasAnyThumbnail}
          disabled={disabled}
          onChange={(e) => handleThumbnailChange(e.target.files)}
          className="sr-only"
        />

        {activeThumbnailPreview ? (
          <div className="flex items-center gap-3 rounded-md border border-brand-border bg-surface-input p-2">
            <img
              src={activeThumbnailPreview}
              alt="Main product thumbnail preview"
              className="h-20 w-20 shrink-0 rounded object-cover border border-brand-border bg-white"
            />

            <div className="flex-1 min-w-0 space-y-1.5">
              <p className="truncate text-xs font-medium text-ink-primary">
                {activeThumbnailLabel}
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
              <p className="text-xs font-medium text-ink-primary">
                Upload Main Thumbnail
              </p>
              <p className="text-[11px] text-ink-muted">
                PNG, JPG, or WebP (Required)
              </p>
            </div>
          </button>
        )}
      </div>

      {/* ================= GALLERY PHOTOS (UP TO 6) ================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-ink-label">Gallery Photos</h3>
          <span className="text-xs text-ink-muted">
            {totalGalleryCount}/{MAX_GALLERY_IMAGES}
          </span>
        </div>

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

        {totalGalleryCount < MAX_GALLERY_IMAGES && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => !disabled && galleryInputRef.current?.click()}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !disabled) {
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
              "flex flex-col items-center justify-center gap-1.5 rounded-sm border-2 border-dashed p-4 text-center transition cursor-pointer",
              isDraggingGallery
                ? "border-brand bg-brand/5"
                : "border-brand-border bg-surface-input hover:border-brand",
              disabled && "opacity-50 pointer-events-none",
            )}
          >
            <UploadCloud className="h-5 w-5 text-brand" />
            <p className="text-xs font-medium text-ink-primary">
              Drop photos here or{" "}
              <span className="text-brand underline">browse</span>
            </p>
            <p className="text-[11px] text-ink-muted">
              Up to {MAX_GALLERY_IMAGES} photos ({MAX_IMAGE_SIZE_MB}MB each)
            </p>
          </div>
        )}

        {totalGalleryCount > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {/* Retained Existing Cloudinary Gallery Photos */}
            {retainedExistingGallery.map((item, idx) => (
              <div
                key={`existing-${item.id}`}
                className="group relative aspect-square overflow-hidden rounded-sm border border-brand-border bg-surface-input"
              >
                <img
                  src={item.url}
                  alt={`Saved gallery ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => markExistingMediaRemoved(item.id)}
                  aria-label={`Remove saved gallery image ${idx + 1}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 group-hover:opacity-100 focus:opacity-100 transition cursor-pointer"
                >
                  <span className="rounded-full bg-red-600 p-1.5 text-white shadow">
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                </button>
              </div>
            ))}

            {/* Newly Selected Local Gallery Photos */}
            {gallery.map((item, idx) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-sm border border-brand-border bg-surface-input"
              >
                <img
                  src={item.previewUrl}
                  alt={`New gallery preview ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeNewGalleryImage(item.id)}
                  aria-label={`Remove new gallery image ${idx + 1}`}
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
            {totalVideosCount}/{MAX_VIDEOS}
          </span>
        </div>

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

        {totalVideosCount < MAX_VIDEOS && (
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

                {totalVideosCount > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {/* Retained Existing Cloudinary Videos */}
            {retainedExistingVideos.map((item, idx) => (
              <div
                key={`existing-video-${item.id}`}
                className="group relative aspect-video min-w-0 overflow-hidden rounded-sm border border-brand-border bg-black"
              >
                <video
                  src={`${item.url}#t=0.1`}
                  controls
                  muted
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => markExistingMediaRemoved(item.id)}
                  aria-label={`Remove saved video ${idx + 1}`}
                  className="absolute top-1 right-1 z-10 rounded-full bg-red-600/90 hover:bg-red-600 p-1 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Newly Selected Local Videos */}
            {videos.map((item, idx) => (
              <div
                key={item.id}
                className="group relative aspect-video min-w-0 overflow-hidden rounded-sm border border-brand-border bg-black"
              >
                <video
                  src={`${item.previewUrl}#t=0.1`}
                  controls
                  muted
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeNewVideo(item.id)}
                  aria-label={`Remove new video ${idx + 1}`}
                  className="absolute top-1 right-1 z-10 rounded-full bg-red-600/90 hover:bg-red-600 p-1 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
