
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface File {
  id: string;
  fileName: string;
  url: string;
}

const UploadedFilesComponent: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { projectId } = useParams<{ projectId: string }>(); // URL에서 projectId 추출

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`/api/projects/${projectId}/files`);
        if (response.data.success) {
          setFiles(response.data.list);
        } else {
          console.error("Failed to fetch files:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [projectId]);

  return (
    <div>
      <h2>Uploaded Files for Project ID: {projectId}</h2>
      <ul>
        {files && files.map((file) => (
          <li key={file.id}>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.fileName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadedFilesComponent;
