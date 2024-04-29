import React, { useState, useEffect, useRef, RefObject } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  AiOutlineSearch,
  AiOutlineUnorderedList,
  AiOutlineAppstore,
  AiTwotoneFileAdd,
  AiOutlineUpSquare,
} from "react-icons/ai";
import { BiSolidDownload, BiSolidFile, BiSolidFileJpg, BiSolidFilePdf, BiSolidFilePng } from "react-icons/bi";
import { LuDelete } from "react-icons/lu";
import { SiMicrosoftpowerpoint } from "react-icons/si";
import { PiFilePdfFill, PiFilePptFill } from "react-icons/pi";

interface File {
  id: string;
  fileName: string;
  filePath: string;
}

const Container = styled.div`
  display: flex;
  width: calc(90vw - 150px);
  height: calc(100vh - 4rem);
  flex-direction: column;
  margin-left: 185px;
`;

const NavigationToggle = styled.button`
  background: none;
  border: none;
  font-size: 25px;
  padding: 10px;
  &:hover {
    color: #FFC83D;
  }
`;

const IconBar = styled.div`
  width: 100%;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 50px;
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
  margin-bottom: 100px;
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const SearchIcon = styled(AiOutlineSearch)`
  font-size: 20px;
  position: absolute;
  right: 10px;
  color: gray;
  &:hover {
    cursor: pointer;
    color: #ffa900;
  }
`;

const SearchInput = styled.input`
  font-family: "Pretendard";
  font-size: 0.9rem;
  width: 200px;
  padding: 10px 10px 10px 20px;
  border-color: rgba(0, 0, 0, 0.08);
  border-radius: 15px;
  background-color: white;
  &:focus {
    border-color: #ffa900;
    outline: none;
  }
`;

const RecentSearchesDropdown = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  background-color: rgba(243, 243, 243, 0.5);
  border-radius: 15px;
  z-index: 100;
  display: ${({ visible }) => (visible ? "block" : "none")};
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

const RecentSearchItemDeleteButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: gray;
  opacity: 0;
  ${RecentSearchItem}:hover & {
    opacity: 1;
  }
  &:hover {
    cursor: pointer;
    color: #ffa900;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const FileManagement: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { projectId } = useParams<{ projectId: string }>();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    return savedSearches ? JSON.parse(savedSearches) : [];
  });
  const [isGallery, setIsGallery] = useState(true); // 갤러리/리스트 형식 구분
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const toggleNavBar = () => {
    setIsNavVisible(!isNavVisible);
  };

  const getExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toLowerCase();
  };

  const isImage = (fileName: string) => {
    const extension = getExtension(fileName);
    return ["jpg", "jpeg", "png", "gif"].includes(extension || "");
  };

  const MAX_RECENT_SEARCHES = 10;

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

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      setFiles(originalFiles); // 전체 파일 목록으로 재설정
      return;
    }

    const results = originalFiles.filter(file => file.fileName.includes(searchKeyword));
    setFiles(results);

    if (!recentSearches.includes(searchKeyword)) {
      const newRecentSearches = [searchKeyword, ...recentSearches.slice(0, MAX_RECENT_SEARCHES - 1)];
      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeleteRecentSearch = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // 이벤트 버블링 방지

    const updatedRecentSearches = [...recentSearches];
    updatedRecentSearches.splice(index, 1);

    setRecentSearches(updatedRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));
  };

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
        <SearchInputContainer ref={searchInputRef} onClick={toggleRecentSearches}>
          <SearchIcon onClick={handleSearch} />
          <SearchInput
            type="text"
            placeholder="검색어를 입력하세요."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <RecentSearchesDropdown visible={showRecentSearches}>
            {recentSearches.map((search, index) => (
              <RecentSearchItem
                key={index}
                onClick={() => {
                  setSearchKeyword(search);
                  handleSearch();
                  setShowRecentSearches(false);
                }}
              >
                {search}
                <RecentSearchItemDeleteButton onClick={(event) => handleDeleteRecentSearch(index, event)}>
                  <LuDelete />
                </RecentSearchItemDeleteButton>
              </RecentSearchItem>
            ))}
          </RecentSearchesDropdown>
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
                {/* <ListFileExtension>{getExtension(file.fileName)}</ListFileExtension> */}
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