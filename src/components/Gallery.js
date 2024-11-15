import { useState, useCallback, useEffect } from "react";
import { Gallery } from "react-grid-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { getFiles } from '../api/apiService';

export default function GalleryPage() {
  const [index, setIndex] = useState(-1);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate current, next, and prev media items
  const currentMedia = mediaFiles[index];
  const nextIndex = (index + 1) % mediaFiles.length;
  const nextMedia = mediaFiles[nextIndex] || currentMedia;
  const prevIndex = (index + mediaFiles.length - 1) % mediaFiles.length;
  const prevMedia = mediaFiles[prevIndex] || currentMedia;

  const fetchMediaFiles = useCallback(async () => {    
    try {
      setError(null);
      const response = await getFiles();
      
      const formattedFiles = response.files.map(file => ({
        src: file.url,
        original: file.url,
        thumbnail: file.url,
        caption: file.name,
        isVideo: file.type.startsWith('video/'),
        width: 320,
        height: 320,
        // Additional props required by react-grid-gallery
        thumbnailWidth: 320,
        thumbnailHeight: 320,
      }));
      setMediaFiles(formattedFiles);
    } catch (error) {
      setError('Failed to load media files');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // if (token) {
      fetchMediaFiles();
    // }
    return () => {
      setMediaFiles([]);
      setLoading(true);
    };
  }, [fetchMediaFiles]);

  const handleClick = useCallback((index) => setIndex(index), []);
  const handleClose = useCallback(() => setIndex(-1), []);
  const handleMovePrev = useCallback(() => setIndex(prevIndex), [prevIndex]);
  const handleMoveNext = useCallback(() => setIndex(nextIndex), [nextIndex]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="container mx-auto p-4">
      <Gallery
        images={mediaFiles}
        onClick={handleClick}
        enableImageSelection={false}
        rowHeight={320}
        margin={4}
        thumbnailImageComponent={({ item }) => (
          item.isVideo ? (
            <video
              src={item.src}
              className="w-full h-full object-cover"
              controls
              width={400}
              height={220}
            />
          ) : (
            <img
              alt={item.caption}
              src={item.src}
              className="w-full h-full object-cover"
            />
          )
        )}
      />

      {currentMedia && !currentMedia.isVideo && (
        <Lightbox
          mainSrc={currentMedia.original}
          imageTitle={currentMedia.caption}
          mainSrcThumbnail={currentMedia.src}
          nextSrc={nextMedia.original}
          nextSrcThumbnail={nextMedia.src}
          prevSrc={prevMedia.original}
          prevSrcThumbnail={prevMedia.src}
          onCloseRequest={handleClose}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
        />
      )}

      {currentMedia && currentMedia.isVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-white text-xl z-10 bg-black bg-opacity-50 w-8 h-8 rounded-full hover:bg-opacity-75 transition-colors"
            >
              ×
            </button>
            <video
              src={currentMedia.original}
              controls
              className="w-full"
              autoPlay
            />
          </div>
        </div>
      )}
    </div>
  );
}