import Body from 'Components/common/Body';
import React from 'react';
import FileManagementMainContent from './FileManagementMainContent';

const FileManagementMain = () => {
  const projectId = 2; // projectId를 숫자 2로 고정

  return (
    <Body>
      <FileManagementMainContent projectId={projectId} />
    </Body>
  );
};

export default FileManagementMain;