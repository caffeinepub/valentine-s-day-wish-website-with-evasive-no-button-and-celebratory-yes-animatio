import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAddMemory } from '../../hooks/useMemories';
import { fileToExternalBlob } from '../../lib/fileToExternalBlob';
import { getCurrentTime } from '../../lib/time';
import { Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface MemoryUploadCardProps {
  disabled?: boolean;
}

export function MemoryUploadCard({ disabled = false }: MemoryUploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const addMemory = useAddMemory();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadProgress(0);
      const blob = await fileToExternalBlob(selectedFile, (percentage) => {
        setUploadProgress(percentage);
      });

      await addMemory.mutateAsync({
        caption: caption.trim() || null,
        dateTaken: getCurrentTime(),
        photo: blob,
      });

      toast.success('Memory uploaded successfully!');
      setCaption('');
      handleClearFile();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload memory');
    }
  };

  const isUploading = addMemory.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload a Memory
        </CardTitle>
        <CardDescription>
          Share a special photo from your moments together
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          <div>
            <Label htmlFor="photo-upload" className="cursor-pointer">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to select a photo
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPEG, WebP supported
                </p>
              </div>
            </Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled || isUploading}
              className="hidden"
            />
          </div>
        ) : (
          <>
            <div className="relative">
              <img
                src={previewUrl!}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleClearFile}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption (optional)</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                disabled={disabled || isUploading}
              />
            </div>

            {isUploading && uploadProgress > 0 && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-xs text-center text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={disabled || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Memory
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
