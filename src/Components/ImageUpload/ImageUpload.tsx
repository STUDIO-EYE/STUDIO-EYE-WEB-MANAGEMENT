import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ImageUploadProps {
    value?: File | File[];
    onChange: (newImage: File | File[]) => void;
  }
  
  const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
    const [images, setImages] = useState<File[]>([]);
    const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  
    useEffect(() => {
      if (value) {
        const files = Array.isArray(value) ? value : [value];
        if (files.every((file) => file instanceof File)) {
          setImages(files);
          setPreviewURLs(files.map((file) => URL.createObjectURL(file)));
        }
      }
    }, [value]);
  
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const selectedFiles = Array.from(event.target.files);
        const newFiles = selectedFiles.slice(0, 3); // 최대 3개의 파일만 선택
  
        const newPreviewURLs = newFiles.map((file) => URL.createObjectURL(file));
  
        const updatedImages = [...images, ...newFiles];
        const updatedPreviewURLs = [...previewURLs, ...newPreviewURLs];
  
        setImages(updatedImages.slice(0, 3)); // 최대 3개의 파일로 제한
        setPreviewURLs(updatedPreviewURLs.slice(0, 3)); // 최대 3개의 미리보기 URL로 제한
  
        onChange(updatedImages.slice(0, 3)); // 변경된 이미지를 부모 컴포넌트에 전달
      }
    };
  
    const handleDeleteImage = (index: number) => {
      const updatedImages = images.filter((_, i) => i !== index);
      const updatedPreviewURLs = previewURLs.filter((_, i) => i !== index);
      setImages(updatedImages);
      setPreviewURLs(updatedPreviewURLs);
      onChange(updatedImages);
    };
  
    return (
      <div>
        {/* 이미지 업로드 및 미리보기를 표시하는 UI */}
        <input type="file" accept="image/*" onChange={handleImageChange} multiple />
        {/* 이미지 미리보기를 표시하는 UI */}
        {previewURLs.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Preview ${index}`} />
            <button onClick={() => handleDeleteImage(index)}>Delete</button>
          </div>
        ))}
      </div>
    );
  };
  
export default ImageUpload;

const ImageUploadContainer = styled.div`
  display: flex;
  font-family: 'pretendard-regular';
`;

const UploadLabel = styled.label`
  cursor: pointer;
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #5a6268;
  }
`;

const ImagesPreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const ImagePreviewWrapper = styled.div`
  position: relative;
  display: inline-block;
  max-width: 100%;
  max-height: 200px;

  &:hover button {
    display: block;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 5px;
  margin-top: 5px;
`;

const DeleteButton = styled.button`
  display: none;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'pretendard-regular';

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;
