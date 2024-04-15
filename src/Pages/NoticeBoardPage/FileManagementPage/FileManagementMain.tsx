import Body from 'Components/common/Body';
import React from 'react';
import FileManagementMainContent from './FileManagementMainContent';
import UploadedFilesComponent from './UploadedFilesComponent';

const FileManagementMain = () => {

  return (
    <Body>
      <UploadedFilesComponent />
    </Body>
  );
};

export default FileManagementMain;