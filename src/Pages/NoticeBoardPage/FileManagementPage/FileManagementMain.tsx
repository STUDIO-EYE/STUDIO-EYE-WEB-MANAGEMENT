import React, { useState } from 'react';
import styled from "styled-components";

const FileManagementMain: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      const fileList = Array.from(uploadedFiles);
      setFiles(prevFiles => [...prevFiles, ...fileList]);
    }
  };

  return (
    <div>
      <h1>File Management</h1>
      <input type="file" multiple onChange={handleFileUpload} />
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FileManagementMain;
