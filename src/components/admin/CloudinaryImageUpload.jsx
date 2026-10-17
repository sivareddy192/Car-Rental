import React, { useRef, useState } from 'react';
import { ImagePlus, LoaderCircle, Trash2, Upload } from 'lucide-react';
import { CloudinaryImage } from '../common/CloudinaryImage';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MAX_IMAGE_SIZE_KB = 1024;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_KB * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/heic',
  'image/heif',
];

export const CloudinaryImageUpload = ({
  label,
  value = '',
  onChange,
  multiple = false,
  required = false,
}) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [selectedFileSizes, setSelectedFileSizes] = useState([]);
  const imageUrls = Array.isArray(value) ? value : (value ? [value] : []);

  const uploadImage = async (file) => {
    const signatureResponse = await api.post('/uploads/cloudinary-signature');
    const signatureData = signatureResponse.data;
    if (!signatureData.success) {
      throw new Error(signatureData.message || 'Could not prepare a secure image upload.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', String(signatureData.timestamp));
    formData.append('folder', signatureData.folder);
    formData.append('signature', signatureData.signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(signatureData.cloudName)}/image/upload`,
      { method: 'POST', body: formData }
    );
    const result = await response.json();
    if (!response.ok || !result.secure_url) {
      throw new Error(result.error?.message || 'Cloudinary could not upload this image.');
    }
    return result.secure_url;
  };

  const handleFileSelection = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (files.length === 0) return;

    setSelectedFileSizes(files.map((file) => `${file.name}: ${Math.ceil(file.size / 1024)} KB`));

    const invalidType = files.find((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return !ACCEPTED_IMAGE_TYPES.includes(file.type) && !['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'heic', 'heif'].includes(extension);
    });
    if (invalidType) {
      toast.error('Choose a JPG, PNG, WebP, GIF, AVIF, or HEIC image.');
      return;
    }
    const oversized = files.find((file) => file.size > MAX_IMAGE_SIZE);
    if (oversized) {
      toast.error(`Each image must be ${MAX_IMAGE_SIZE_KB} KB or smaller. Selected image: ${Math.ceil(oversized.size / 1024)} KB.`);
      return;
    }

    const selectedFiles = multiple ? files : files.slice(0, 1);
    setIsUploading(true);
    const uploadedUrls = [];
    try {
      for (let index = 0; index < selectedFiles.length; index += 1) {
        setUploadProgress(`Uploading ${index + 1} of ${selectedFiles.length}...`);
        uploadedUrls.push(await uploadImage(selectedFiles[index]));
      }
      onChange(multiple ? [...imageUrls, ...uploadedUrls] : uploadedUrls[0]);
      toast.success(`${uploadedUrls.length === 1 ? 'Image' : 'Images'} uploaded to Cloudinary.`);
    } catch (error) {
      if (multiple && uploadedUrls.length > 0) {
        onChange([...imageUrls, ...uploadedUrls]);
      }
      toast.error(error.response?.data?.message || error.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const applyUrl = () => {
    const trimmedUrl = urlValue.trim();
    if (!trimmedUrl) return;
    onChange(multiple ? [...imageUrls, trimmedUrl] : trimmedUrl);
    setUrlValue('');
  };

  const removeImage = (imageUrl) => {
    onChange(multiple ? imageUrls.filter((url) => url !== imageUrl) : '');
  };

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        {label}
      </span>

      {imageUrls.length > 0 && (
        <div className={multiple ? 'grid grid-cols-2 gap-3 sm:grid-cols-3' : ''}>
          {imageUrls.map((imageUrl, index) => (
            <div key={`${imageUrl}-${index}`} className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
              <CloudinaryImage
                src={imageUrl}
                alt={`${label} preview ${index + 1}`}
                className={`w-full bg-slate-100 object-cover dark:bg-[#0f121d] ${multiple ? 'h-32' : 'max-h-56'}`}
                sizes={multiple ? '(max-width: 640px) 50vw, 33vw' : '600px'}
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => removeImage(imageUrl)}
                aria-label={`Remove ${label} image ${index + 1}`}
                className="absolute right-2 top-2 rounded-lg bg-black/75 p-2 text-white hover:bg-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif"
          multiple={multiple}
          required={required && imageUrls.length === 0 && !urlValue}
          onChange={handleFileSelection}
          className="sr-only"
          aria-label={`${label}: choose image${multiple ? 's' : ''} from device`}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60 dark:border-white/[0.1] dark:bg-[#141724] dark:text-white dark:hover:bg-white/5"
        >
          {isUploading
            ? <LoaderCircle className="h-4 w-4 animate-spin" />
            : <Upload className="h-4 w-4" />}
          {isUploading ? uploadProgress : 'Choose from device'}
        </button>
        <div className="flex min-w-0 flex-1 gap-2">
          <input
            type="url"
            value={urlValue}
            onChange={(event) => setUrlValue(event.target.value)}
            placeholder="Or paste an image URL"
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 dark:border-white/[0.08] dark:bg-[#0f121d] dark:text-white"
          />
          <button
            type="button"
            disabled={!urlValue.trim()}
            onClick={applyUrl}
            aria-label={`Add ${label} image URL`}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-white/[0.1] dark:text-slate-300 dark:hover:bg-white/5"
          >
            <ImagePlus className="h-4 w-4" />
          </button>
        </div>
      </div>
      {isUploading && <p className="text-[11px] text-slate-500" role="status">{uploadProgress}</p>}
      {selectedFileSizes.length > 0 && !isUploading && (
        <ul className="space-y-0.5 text-[10px] text-slate-500 dark:text-slate-400" aria-live="polite">
          {selectedFileSizes.map((size) => <li key={size}>{size}</li>)}
        </ul>
      )}
      <p className="text-[10px] text-slate-500 dark:text-slate-400">
        Choose images from your phone, tablet, or computer. JPG, PNG, WebP, GIF, AVIF, or HEIC up to {MAX_IMAGE_SIZE_KB} KB each.
      </p>
    </div>
  );
};
