import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
    margin-left: 225px;
    width: calc(100% - 225px);
    border-collapse: collapse;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const Th = styled.th`
    border-bottom: 2px solid #ddd;
    padding: 15px 20px;
    text-align: left;
    &:last-child {
        text-align: right;
    }
`;

const Td = styled.td`
    border-bottom: 1px solid #ddd;
    padding: 10px 20px;
    &:last-child {
        text-align: right;
    }
`;

const Button = styled.button<{ primary?: boolean; isWide?: boolean }>`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 1rem;

    transition: background-color 0.3s;

    width: ${(props) => (props.isWide ? '14.3rem' : '7rem')};
    height: 3rem;

    padding: 8px 12px;
    background-color: ${(props) => (props.primary ? '#FFC83D' : 'black')};
    color: ${(props) => (props.primary ? 'black' : '#FFC83D')};
    margin-right: 5px;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    align-items: center;
    
    &:hover {
        background-color: ${(props) => (props.primary ? 'black' : '#FFC83D')};
        color: ${(props) => (props.primary ? '#FFC83D' : 'black')};
    }
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

    const fetchAccounts = async () => {
        try {
            const response = await axios.get('/user-service/users');
            setAccounts(response.data);
        } catch (error) {
            alert('사용자 목록을 불러오는 데 실패했습니다.');
        }
    };

    const approveAccount = async (userId: string) => {
        try {
            await axios.put(`/user-service/approve?userId=${userId}&approved=true`);
            fetchAccounts();
        } catch (error) {
            alert('계정을 승인하는 데 실패했습니다.');
        }
    };

    const deleteAccount = async (userId: string) => {
        try {
            await axios.delete(`/user-service/unregister?userId=${userId}`);
            alert('계정이 삭제되었습니다.');
            fetchAccounts();
        } catch (error) {
            alert('계정을 삭제하는 데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <Container>
            <Table>
                <thead>
                    <tr>
                        <Th>이름</Th>
                        <Th>계정 생성일</Th>
                        <Th>이메일</Th>
                        <Th>전화번호</Th>
                        <Th>상태</Th>
                        <Th> </Th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account, index) => (
                        <tr key={index}>
                            <Td>{account.name}</Td>
                            <Td>{account.createdAt}</Td>
                            <Td>{account.email}</Td>
                            <Td>{account.phoneNumber}</Td>
                            <Td>{account.approved ? '승인' : '미승인'}</Td>
                            <Td>
                                {account.approved ? (
                                    <Button isWide onClick={() => deleteAccount(account.id)}>계정 삭제</Button> 
                                ) : (
                                    <>
                                        <Button primary onClick={() => approveAccount(account.id)}>허가</Button>
                                        <Button>비허가</Button>
                                    </>
                                )}
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default AccountPage;
