import React, { useState, useEffect, useRef, RefObject } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  AiOutlineSearch,
  AiOutlineUnorderedList,
  AiOutlineAppstore,
  AiOutlineUpSquare,
} from "react-icons/ai";
import { BiSolidDownload, BiSolidFile } from "react-icons/bi";
import { PiFilePdfFill, PiFilePptFill } from "react-icons/pi";
import projectApi from "api/projectApi";

interface File {
  id: string;
  fileName: string;
  filePath: string;
}

const Container = styled.div`
  display: flex;
  width: 70vw;
  height: calc(100vh - 4rem);
  flex-direction: column;
  margin: 0 0 10rem 13rem;
`;

const IconBar = styled.div`
  width: 100%;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
`;

const FileContainer = styled.div<{ isGallery: boolean }>`
  display: flex;
  flex-wrap: ${({ isGallery }) => (isGallery ? "wrap" : "nowrap")};
  flex-direction: ${({ isGallery }) => (isGallery ? "row" : "column")};
  gap: 20px;
  justify-content: ${({ isGallery }) => (isGallery ? "flex-start" : "start")};
  align-items: center;
  margin-left: ${({ isGallery }) => (isGallery ? "6%" : "3%")};;
  margin-bottom: 10rem;
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const SearchInput = styled.input`
  font-family: "Pretendard";
  font-size: 0.9rem;
  width: 200px;
  padding: 10px 10px 10px 20px;
  border-color: rgba(0, 0, 0, 0.03);
  border-radius: 15px;
  background-color: white;
  outline: none;
  &:focus {
    outline: none;
  }
`;

const RecentSearchItem = styled.div`
  padding: 15px 20px;
  font-size: 0.8rem;
  color: gray;
  position: relative;
  &:hover {
    cursor: pointer;
    color: #ffa900;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto; // 오른쪽으로 정렬
`;

const ViewModeButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: gray;
  cursor: pointer;
  &:hover {
    color: #ffa900;
  }
`;

const FileUploadIcon = styled.label`
  background: none;
  margin-right: 5px;
  border: none;
  font-size: 1.5rem;
  color: gray;
  cursor: pointer;
  &:hover {
    color: #ffa900;
  }
  input {
    display: none;
  }
`;

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipText = styled.div`
  font-size: 0.8rem;
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 5px;
  position: absolute;
  top: 150%;
  left: -100%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
`;

const FileText = styled.div`
  width: 80%;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const GalleryFileContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  overflow: hidden;

  &:hover .overlay {
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
`;

const ImageFileNameLink = styled.a`
  color: white;
  font-size: 1rem;
  width: 80%;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    text-decoration: underline;
  }
`;

const ListFileContainer = styled.div`
  height: 40px;
  width: 80%;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
  border: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
`;

const FileNameLink = styled.a`
  color: black;
  font-size: 1rem;
  width: 80%;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    text-decoration: underline;
  }
`;

const DownloadIcon = styled.div`
  font-size: 20px;
  color: lightgray;
  &:hover {
    cursor: pointer;
    color: #ffa900;
  }
`;

const StyledFileIcon = styled.div`
  font-size: 100px;
  margin-bottom: -15px;
`;

const ProjectName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-right: 20px;
`;

const FileManagement: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { projectId } = useParams<{ projectId: string }>();
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [isGallery, setIsGallery] = useState(true);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [projectName, setProjectName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const response = await projectApi.getProjectDetails(Number(projectId));
        if (response.data.success) {
          setProjectName(response.data.data.name);
        } else {
          console.error("프로젝트 정보를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("프로젝트 정보를 가져오는 중 오류:", error);
      }
    };

    fetchProjectName();
  }, [projectId]);

  const getExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toLowerCase();
  };

  const isImage = (fileName: string) => {
    const extension = getExtension(fileName);
    return ["jpg", "jpeg", "png", "gif"].includes(extension || "");
  };

  const handleSearchChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const filteredFiles = originalFiles.filter(file =>
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiles(filteredFiles);
  }, [searchQuery, originalFiles]);

  useEffect(() => {
    // 서버에서 전체 파일 목록을 가져와서 originalFiles 상태 변수 업데이트
    const fetchAllFiles = async () => {
      try {
        const response = await axios.get(`/api/projects/${projectId}/files`);
        if (response.data.success) {
          setFiles(response.data.list);
          setOriginalFiles(response.data.list);
        } else {
          console.error("error: ", response.data.message);
        }
      } catch (error) {
        console.error("error: ", error);
      }
    };
    fetchAllFiles();
  }, [projectId]);

  const getFileIcon = (fileName: string): React.ReactNode => {
    const extension = getExtension(fileName);
    if (extension === "pdf") {
      return <PiFilePdfFill color="red" />;
    } else if (extension === "ppt" || extension === "pptx") {
      return <PiFilePptFill color="red" />;
    }
    return <BiSolidFile />;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = event.target.files;
    if (!inputFiles || inputFiles.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append("files", inputFiles[0]);

    try {
      const response = await axios.post(`/api/projects/${projectId}/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("파일이 성공적으로 업로드되었습니다.");
        const fetchFiles = async () => {
          try {
            const response = await axios.get(`/api/projects/${projectId}/files`);
            if (response.data.success) {
              setFiles(response.data.list);
            } else {
              console.error("파일 목록 재조회 중 오류:", response.data.message);
            }
          } catch (error) {
            console.error("파일 목록 재조회 중 오류:", error);
          }
        };

        fetchFiles();
      } else {
        alert("파일 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("파일 업로드 중 오류:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  const searchInputRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowRecentSearches(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleRecentSearches = () => {
    setShowRecentSearches((prev) => !prev);
  };

  return (
    <Container>
      <IconBar>
        <ProjectName>프로젝트 {projectName}</ProjectName>
        <SearchInputContainer ref={searchInputRef} onClick={toggleRecentSearches}>
          <SearchInput
            type="text"
            placeholder="검색어를 입력하세요."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchInputContainer>
        <IconContainer>
          <TooltipContainer>
            <FileUploadIcon>
              <input type="file" onChange={handleFileUpload} />
              <AiOutlineUpSquare />
            </FileUploadIcon>
            <TooltipText className="tooltip">파일 업로드</TooltipText>
          </TooltipContainer>

          <TooltipContainer>
            <ViewModeButton onClick={() => setIsGallery(true)}>
              <AiOutlineAppstore />
            </ViewModeButton>
            <TooltipText className="tooltip">갤러리 보기</TooltipText>
          </TooltipContainer>

          <TooltipContainer>
            <ViewModeButton onClick={() => setIsGallery(false)}>
              <AiOutlineUnorderedList />
            </ViewModeButton>
            <TooltipText className="tooltip">리스트 보기</TooltipText>
          </TooltipContainer>
        </IconContainer>
      </IconBar>

      <FileContainer isGallery={isGallery}>
        {files.map((file) => {
          if (isGallery) {
            return (
              <GalleryFileContainer key={file.id}>
                {isImage(file.fileName) ? (
                  <>
                    <img
                      src={file.filePath}
                      alt={file.fileName}
                      style={{ width: "130%", height: "130%", objectFit: "cover" }}
                    />
                    <Overlay className="overlay">
                      <ImageFileNameLink href={file.filePath} download>
                        {file.fileName}
                      </ImageFileNameLink>
                    </Overlay>
                  </>
                ) : (
                  <>
                    <StyledFileIcon>
                      {getFileIcon(file.fileName)}
                    </StyledFileIcon>
                    <FileNameLink href={file.filePath} download>
                      {file.fileName}
                    </FileNameLink>
                  </>
                )}
              </GalleryFileContainer>
            );
          } else {
            return (
              <ListFileContainer key={file.id}>
                <FileText>{file.fileName}</FileText>
                <a href={file.filePath} download>
                  <DownloadIcon>
                    <BiSolidDownload />
                  </DownloadIcon>
                </a>
              </ListFileContainer>
            );
          }
        })}
      </FileContainer>
    </Container>
  );
}

export default FileManagement;