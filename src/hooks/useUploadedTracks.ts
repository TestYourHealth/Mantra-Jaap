import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UploadedTrack {
  id: string;
  name: string;
  file_path: string;
  file_url: string;
  created_at: string;
}

export function useUploadedTracks() {
  const [tracks, setTracks] = useState<UploadedTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchTracks = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!supabase) {
        setTracks([]);
        return;
      }
      const { data, error } = await supabase
        .from('ambient_tracks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTracks(data || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const uploadTrack = useCallback(async (file: File) => {
    if (!supabase) {
      toast.error('Supabase not configured');
      return null;
    }
    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return null;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return null;
    }

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { error: uploadError } = await supabase.storage
        .from('ambient-music')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('ambient-music')
        .getPublicUrl(fileName);

      const trackName = file.name.replace(/\.[^/.]+$/, '');

      const { data: trackData, error: insertError } = await supabase
        .from('ambient_tracks')
        .insert({
          name: trackName,
          file_path: fileName,
          file_url: urlData.publicUrl,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setTracks(prev => [trackData, ...prev]);
      toast.success('Track uploaded successfully!');
      return trackData;
    } catch (error) {
      console.error('Error uploading track:', error);
      toast.error('Failed to upload track');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteTrack = useCallback(async (track: UploadedTrack) => {
    try {
      if (!supabase) {
        toast.error('Supabase not configured');
        return;
      }
      const { error: storageError } = await supabase.storage
        .from('ambient-music')
        .remove([track.file_path]);

      if (storageError) console.error('Storage delete error:', storageError);

      const { error: dbError } = await supabase
        .from('ambient_tracks')
        .delete()
        .eq('id', track.id);

      if (dbError) throw dbError;

      setTracks(prev => prev.filter(t => t.id !== track.id));
      toast.success('Track deleted');
    } catch (error) {
      console.error('Error deleting track:', error);
      toast.error('Failed to delete track');
    }
  }, []);

  return {
    tracks,
    isLoading,
    isUploading,
    uploadTrack,
    deleteTrack,
    refetch: fetchTracks,
  };
}
