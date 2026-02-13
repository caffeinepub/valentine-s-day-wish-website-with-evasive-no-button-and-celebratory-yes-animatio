import { ExternalBlob } from '../backend';

export async function fileToExternalBlob(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<ExternalBlob> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  
  const blob = ExternalBlob.fromBytes(bytes);
  
  if (onProgress) {
    return blob.withUploadProgress(onProgress);
  }
  
  return blob;
}
