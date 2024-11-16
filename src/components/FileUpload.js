import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { uploadFile } from '../api/apiService';

const FileUpload = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles) => {
        setUploading(true);
        
        try {
            const formData = new FormData();
            acceptedFiles.forEach(file => {
                formData.append('files[]', file);
            });

            formData.append('count', acceptedFiles.length);
            
            // Single API call for all files
            const response = await uploadFile(formData);
            setUploadedFiles(prevFiles => [...prevFiles, ...response.files.map(file => file.file)]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'video/*': []
        },
        multiple: true  // Explicitly enable multiple file uploads
    });
    
      return (
        <main className='pt-20 mt-20'>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed relative px-8 pb-8 pt-20 rounded-lg text-center cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <div className="page-img">
              <img src="SN.jpeg" alt="Nadia and Stallone" className="" />
            </div>
            <input {...getInputProps()} />
            {uploading ? (
              <p>Uploading...</p>
            ) : isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
    
            <p className="text-sm text-red-500">Due to limited resources there is a limit of 50 files per upload.</p>
          </div>
    
          {/* <div className="mt-8 text-center">
            <Link to="/gallery" className="bg-lavander text-lavander px-4 py-2 rounded-md">
              View Media
            </Link>
          </div> */}
    
          {uploadedFiles.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-4 photo-grid">
              {uploadedFiles.map((file, index) => (
                <div key={`${file.url}-${index}`} className="relative aspect-square">
                  {file.type.includes('image') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-full rounded-lg"
                      controls
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      );
}

export default FileUpload;