import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { BiSave } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { LuDelete } from "react-icons/lu";

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

const FileManagementMainContent = () => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<{ id: number; title: string; }[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    const MAX_RECENT_SEARCHES = 10; // 최대 10개로 설정
    const handleSearch = () => {
        const results = someFunctionToGetSearchResults(searchKeyword);
        setSearchResults(results);

        const newRecentSearches = [searchKeyword, ...recentSearches.slice(0, MAX_RECENT_SEARCHES - 1)];

        // 최대 개수를 초과 --> 가장 오래된 검색어부터 삭제
        if (newRecentSearches.length > MAX_RECENT_SEARCHES) {
            newRecentSearches.pop();
        }
        setRecentSearches(newRecentSearches);
    };

    const someFunctionToGetSearchResults = (keyword: string) => {
        const mockResults = [
            { id: 1, title: '검색 결과 1' },
            { id: 2, title: '검색 결과 2' },
            { id: 3, title: '검색 결과 3' },
        ];
        return mockResults.filter(result => result.title.includes(keyword));
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            setUploadedFiles([...uploadedFiles, file]);
        }
    };

    const handleKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleDeleteRecentSearch = (index: number) => {
        const updatedRecentSearches = [...recentSearches];
        updatedRecentSearches.splice(index, 1);
        setRecentSearches(updatedRecentSearches);
    };

    const mockFiles = [
        { name: 'example_file1.txt', size: 10240 }, // 일단 바이트 단위
        { name: 'example_file2.jpg', size: 204800 },
        { name: 'example_file3.pdf', size: 512000 },
    ];

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
                    <SearchText>
                        최근 검색어
                    </SearchText>
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
                {mockFiles.map((file, index) => (
                    <UploadedFileButton key={index}>
                        <span>{file.name}</span>
                        <span>{(file.size / 1024).toFixed(2)} KB</span>
                    </UploadedFileButton>
                ))}

                {(uploadedFiles.length % 3 !== 0 || uploadedFiles.length === 0) && (
                    <FileUploadButton>
                        <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                        <SaveIcon />
                        <FileUploadButtonText>이곳에 파일을 업로드하세요.</FileUploadButtonText>
                    </FileUploadButton>
                )}
            </FileContainer>
        </Container>
    );
};

export default FileManagementMainContent;
