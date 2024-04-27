import React from 'react';
import styled from 'styled-components';

const Container = styled.table`
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
    padding: 10px;
    text-align: left;
`;

const Td = styled.td`
    border-bottom: 1px solid #ddd;
    padding: 10px;
`;

const Button = styled.button<{ primary?: boolean }>`
    padding: 8px 12px;
    background-color: ${(props) => (props.primary ? '#007bff' : '#dc3545')};
    margin-right: 5px;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    //display: flex;
    align-items: center;
    &:hover {
        opacity: 0.5;
    }
`;

interface Account {
    name: string;
    date: string;
    email: string;
    phone: string;
    role: '승인' | '미승인';
}

const accounts: Account[] = [
    {
        name: '김아무개',
        date: '2024-04-25',
        email: 'test2@gmail.com',
        phone: '010-1111-1234',
        role: '미승인',
    },
    {
        name: '멍수빈',
        date: '2024-04-25',
        email: 'test3@gmail.com',
        phone: '010-1111-1254',
        role: '승인',
    },
];

const AccountPage: React.FC = () => {
    return (
        <Container>
            <Table>
                <thead>
                    <tr>
                        <Th>이름</Th>
                        <Th>신청 날짜</Th>
                        <Th>이메일</Th>
                        <Th>전화번호</Th>
                        <Th>권한</Th>
                        <Th>액션</Th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account, index) => (
                        <tr key={index}>
                            <Td>{account.name}</Td>
                            <Td>{account.date}</Td>
                            <Td>{account.email}</Td>
                            <Td>{account.phone}</Td>
                            <Td>{account.role}</Td>
                            <Td>
                                {account.role === '승인' ? (
                                    <Button>계정 삭제</Button>
                                ) : (
                                    <>
                                        <Button primary>허가</Button>
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
