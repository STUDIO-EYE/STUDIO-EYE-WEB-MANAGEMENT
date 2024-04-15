
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { BiSave } from "react-icons/bi";
import { LuDelete } from "react-icons/lu";

interface File {
    id: string;
    fileName: string;
    url: string;
}

const Container = styled.div`
  margin-left: 225px;
  display: flex;
`;

const FileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-left: 100px;
`;

const NavBar = styled.div`
  width: 225px;
  height: 100vh;
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

const SaveIcon = styled(BiSave)`
  font-size: 24px;
  margin-bottom: 10px;
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

const FileUploadButtonText = styled.div`
  color: lightgray;
  font-size: 0.7rem;
  font-family: 'Pretendard';
  font-weight: 600;
`;

const FileUploadButton = styled.button`
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
  cursor: pointer;
`;

const UploadedFileButton = styled(FileUploadButton)`
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
  cursor: pointer;
`;

const NavContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const UploadedFilesComponent: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const { projectId } = useParams<{ projectId: string }>(); // URL에서 projectId 추출
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [searchResults, setSearchResults] = useState<{ id: number; title: string; }[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    const MAX_RECENT_SEARCHES = 10;

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`/api/projects/${projectId}/files`);
                if (response.data.success) {
                    setFiles(response.data.list);
                } else {
                    console.error("error: ", response.data.message);
                }
            } catch (error) {
                console.error("error: ", error);
            }
        };

        fetchFiles();
    }, [projectId]);

    const handleSearch = () => {
        // 검색어가 빈 문자열인 경우 전체 파일 목록 보여줌
        if (!searchKeyword.trim()) {
            setFiles(prevFiles => prevFiles);
            return;
        }

        // 검색어에 해당하는 파일만 필터링해서 보여줌
        const results = files.filter(file => file.fileName.includes(searchKeyword));
        setFiles(results);
    };


    const someFunctionToGetSearchResults = (keyword: string) => {
        const mockResults = [
            { id: 1, title: '검색 결과 1' },
            { id: 2, title: '검색 결과 2' },
            { id: 3, title: '검색 결과 3' },
        ];
        return mockResults.filter(result => result.title.includes(keyword));
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
                            <RecentSearchItem>
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
                {files && files.map((file) => (
                    <UploadedFileButton key={file.id}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                            {file.fileName}
                        </a>
                    </UploadedFileButton>
                ))}
            </FileContainer>
        </Container>

    );
};

export default UploadedFilesComponent;
