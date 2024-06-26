import React from 'react';
import "./App.css";
import InternalMainpage from "./Pages/InternalPage/InternalMainpage";
import EditNoticeMainpage from "./Pages/NoticeBoardPage/EditNoticePage/EditNoticeMainpage";
import MakingNoticeMainpage from "./Pages/NoticeBoardPage/MakingNoticePage/MakingNoticeMainpage";
import PlanNoticeMainpage from "./Pages/NoticeBoardPage/PlanNoticePage/PlanNoticeMainpage";
import FileManagementMain from "./Pages/NoticeBoardPage/FileManagementPage/FileManagementMain";
import LoginPage from "./Pages/Login/LoginPage";
import SignInPage from "./Pages/Login/SignInPage";
import ProjectMain from "./Pages/ProjectPage/ProjectMain";
import Project from "./Pages/ProjectPage/Project";
import ModifyProject from "./Pages/ProjectPage/ModifyProject";
import { Routes, Route } from "react-router-dom";
import MyPageMain from 'Pages/MyPage/MyPageMain';
import AccountPageMain from 'Pages/Account/AccountPageMain';

function App() {
  return (
      <Routes>
        <Route path="/" element={<ProjectMain />} />
        <Route path="/Manage/:projectId" element={<InternalMainpage />} />
        <Route path="/Manage/:projectId/files" element={<FileManagementMain />} />
        <Route path="/EditMain/:projectId/:postId?" element={<EditNoticeMainpage />} />
        <Route path="/MakingMain/:projectId/:postId?" element={<MakingNoticeMainpage />} />
        <Route path="/PlanMain/:projectId/:postId?" element={<PlanNoticeMainpage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignInPage" element={<SignInPage />} />
        <Route path="/MyPage" element={<MyPageMain />} />
        <Route path="/Account" element={<AccountPageMain />} />
        <Route path="/project" element={<Project />} />
        <Route path="/modify/:projectId" element={<ModifyProject />} />
      </Routes>
  );
}

export default App;