import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { BiSave, BiSolidDownload, BiSolidFile, BiSolidFileJpg, BiSolidFilePdf, BiSolidFilePng } from "react-icons/bi";
import { LuDelete } from "react-icons/lu";

interface File {
  id: string;
  fileName: string;
  filePath: string;
}

const Container = styled.div`
  margin-left: 225px;
  display: flex;
`;

const FileContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-left: 100px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const BookmarkIcon = styled(LuDelete)`
  position: fixed;
  right: 20px;
  bottom: 20px;
  font-size: 30px;
  color: gray;
  z-index: 999;
  cursor: pointer;
`;

const NavBar = styled.div`
  width: 225px;
  height: 60vh;
  background-color: #f8f9fa;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
  align-items: center;
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
  margin: 0 5px 10px 0;
  color: gray;
  &:hover {
    cursor: pointer;
    color: #ffa900;
  }
`;

const SearchInput = styled.input`
  font-family: 'Pretendard';
  font-size: 0.9rem;
  width: calc(100% - 30px);
  padding: 10px 10px 10px 20px;
  margin-bottom: 10px;
  border-color: rgba(0, 0, 0, 0.08);
  border-radius: 15px;
  &:focus {
    font-family: 'Pretendard';
    border-color: #ffa900;
    outline: none;
  }
`;

const RecentSearchItemContainer = styled.div`
  position: static;
`;

const RecentSearchItem = styled.div`
  padding: 7.5px 0;
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
  transition: opacity 0.3s;
  ${RecentSearchItem}:hover & {
    opacity: 1;
  }
  &:hover {
    cursor: pointer;
    color: #ffa900;
  }
`;

const SearchText = styled.div`
  margin: 10px 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

const FileText = styled.div`
  width: 80%;
  margin: 10px 0;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const FileIconContainer = styled.div`
  font-size: 50px;
  color: lightgray;
`;

const FileUploadContainer = styled.label`
  font-family: 'Pretendard'; // 왜 안 먹음
  width: 200px;
  height: 200px;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
  border: none;
  color: lightgray;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  input {
    display: none;
  }
`;

const UploadedFileContainer = styled(FileUploadContainer)`
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
`;

const DownloadIconContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 20px;
  color: lightgray;
  &:hover {
    cursor: pointer;
  }
`;

const NavContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const UploadedFilesComponent: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { projectId } = useParams<{ projectId: string }>(); // url에서 projectId 추출
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    return savedSearches ? JSON.parse(savedSearches) : [];
  });
  const MAX_RECENT_SEARCHES = 10;
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDeleteRecentSearch = (index: number) => {
    const updatedRecentSearches = [...recentSearches];
    updatedRecentSearches.splice(index, 1);
    setRecentSearches(updatedRecentSearches);

    localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));
  };

  // 파일 확장자에 따라
  const getFileIcon = (fileName: string): React.ReactNode => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return <BiSolidFilePdf />;
    } else if (extension === 'png') {
      return <BiSolidFilePng />;
    } else if (extension === 'jpg' || extension === 'jpeg') {
      return <BiSolidFileJpg />;
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
              setOriginalFiles(response.data.list);
              //console.log("가져온 파일 목록:", response.data.list);
            } else {
              console.error("파일 목록 재조회 중 오류:", response.data.message);
            }
          } catch (error) {
            console.error("파일 목록 재조회 중 오류:", error);
          }
        };
  
        fetchFiles(); // 파일 목록 업데이트
      } else {
        alert("파일 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("파일 업로드 중 오류:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <NavContainer>
        <NavBar>
          <SearchInputContainer>
            <SearchIcon onClick={handleSearch} />
            <SearchInput
              type="text"
              placeholder="검색어를 입력하세요."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </SearchInputContainer>
          <SearchText>최근 검색어</SearchText>
          {recentSearches.map((search, index) => (
            <RecentSearchItemContainer key={index}>
              <RecentSearchItem onClick={() => { setSearchKeyword(search); handleSearch(); }}>
                {search}
                <RecentSearchItemDeleteButton onClick={() => handleDeleteRecentSearch(index)}>
                  <LuDelete />
                </RecentSearchItemDeleteButton>
              </RecentSearchItem>
            </RecentSearchItemContainer>
          ))}
        </NavBar>
      </NavContainer>
      <FileContainer>

        <FileUploadContainer>
          <input type="file" onChange={handleFileUpload} />
          <span>파일 업로드</span>
        </FileUploadContainer>

        {files && files.map((file) => (
          <UploadedFileContainer key={file.id}>
            <FileIconContainer>
              {getFileIcon(file.fileName)}
            </FileIconContainer>
            <FileText>
              {file.fileName}
            </FileText>
            <a href={file.filePath} target="_blank" rel="noopener noreferrer" download>
              <DownloadIconContainer>
                <BiSolidDownload />
              </DownloadIconContainer>
            </a>
          </UploadedFileContainer>
        ))}
      </FileContainer>
    </Container>
  );
};

export default UploadedFilesComponent;
