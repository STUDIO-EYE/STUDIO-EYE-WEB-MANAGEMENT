import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  margin-left: 225px;
  width: calc(100% - 225px);
  border-collapse: collapse;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTh = styled.th`
  border-bottom: 2px solid #ddd;
  padding: 15px 20px;
  text-align: left;
`;

const StyledTd = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 10px 20px;
`;

const SwitchContainer = styled.div<{ approved: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.approved ? 'flex-start' : 'flex-end')};
  background-color: ${(props) => (props.approved ? 'green' : 'red')};
  border-radius: 15px;
  transition: background-color 0.3s;
  width: 100px;
  height: 30px;
  position: relative;
  cursor: pointer;
`;

const SwitchText = styled.div<{ approved: boolean }>`
  font-size: 0.8rem;
  color: white;
  padding: 0 5px;
  z-index: 1;
  position: absolute;
  left: ${(props) => (props.approved ? '60px' : '10px')};
`;

const ToggleSwitch = styled.div<{ approved: boolean }>`
  position: absolute;
  top: 7px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  transition: left 0.3s;
  left: ${(props) => (props.approved ? '5px' : '80px')};
`;

interface Account {
  id: string;
  name: string;
  createdAt: string;
  email: string;
  phoneNumber: string;
  approved: boolean;
}

const AccountPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = sessionStorage.getItem("login-token");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/LoginPage");
      } else {
        fetchAccounts();
      }
    };

    checkLoginStatus();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/user-service/users');
      if (response.data && response.data.success === false) {
        if (response.data.code === 7000) {
          alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common["Authorization"];
          navigate("/LoginPage");
          return;
        }
      }
      setAccounts(response.data);
    } catch (error) {
      alert('사용자 목록을 불러오는 데 실패했습니다.');
    }
  };

  const toggleApproval = async (account: Account) => {
    const userId = sessionStorage.getItem("user-id");
    if (account.approved && userId === account.id?.toString()) {
      alert("본인 계정은 비활성화할 수 없습니다.");
      return;
    }

    let confirmed;
    if (account.approved) {
      confirmed = window.confirm('계정을 비활성화 하시겠습니까?');
    } else {
      confirmed = window.confirm('계정을 활성화 하시겠습니까?');
    }
    if (!confirmed) {
      return;
    }

    const newApprovedStatus = !account.approved;
    try {
      await axios.put(`/user-service/approve?userId=${account.id}&approved=${newApprovedStatus}`);
      setAccounts((prevAccounts) =>
        prevAccounts.map((a) => (a.id === account.id ? { ...a, approved: newApprovedStatus } : a))
      );
    } catch (error) {
      alert('계정을 업데이트하는 데 실패했습니다.');
    }
  };

  const deleteAccount = async (userId: string) => {
    const confirmed = window.confirm('계정을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`/user-service/unregister?userId=${userId}`);
      alert('계정이 삭제되었습니다.');
      fetchAccounts();
    } catch (error) {
      alert('계정을 삭제하는 데 실패했습니다.');
    }
  };

  // useEffect(() => {
  //   fetchAccounts();
  // }, []);

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <StyledTh>이름</StyledTh>
            <StyledTh>계정 생성일</StyledTh>
            <StyledTh>이메일</StyledTh>
            <StyledTh>전화번호</StyledTh>
            <StyledTh>상태</StyledTh>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={index}>
              <StyledTd>{account.name}</StyledTd>
              <StyledTd>{account.createdAt}</StyledTd>
              <StyledTd>{account.email}</StyledTd>
              <StyledTd>{account.phoneNumber}</StyledTd>
              <StyledTd>
                <SwitchContainer approved={account.approved} onClick={() => toggleApproval(account)}>
                  <SwitchText approved={account.approved}>{account.approved ? '승인' : '미승인'}</SwitchText>
                  <ToggleSwitch approved={account.approved} />
                </SwitchContainer>
              </StyledTd>
              {/* <Td>
                <Button isWide onClick={() => deleteAccount(account.id)}>계정 삭제</Button>
              </Td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AccountPage;