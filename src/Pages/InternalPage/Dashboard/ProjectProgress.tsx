import { TextSm, TitleMd } from 'Components/common/Font';
import React from 'react';
import styled from 'styled-components';

interface ProjectProgressProps {
    completedCount: number;
    totalCount: number;
}

const Container = styled.div`
    padding: 25px;
    margin: 20px auto;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
`;

const ProgressBar = styled.div`
    width: 100%;
    height: 20px;
    background-color: lightgray;
    border-radius: 10px;
`;

const Filler = styled.div<{ percentage: number }>`
    height: 100%;
    width: ${(props) => props.percentage}%;
    background-color: green;
    border-radius: 10px;
`;

const PercentageContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: left;
    margin-top: 20px;
`;

const ProgressContainer = styled.div`
    display: flex;
    margin-right: 50px;
    align-items: center;
`;

const Cylinder = styled.div<{ color: string }>`
    margin-right: 10px;
    width: 30px;
    height: 20px;
    border-radius: 15px;
    background-color: ${(props) => props.color};
`;

const PercentageText = styled.span`
    color: black;
    font-weight: bold;
    margin-top: 5px;
`;

const ProjectProgress: React.FC<ProjectProgressProps> = ({ completedCount, totalCount }) => {
    const percentage = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
    const incompletePercentage = 100 - percentage;

    return (
        <Container>
            <TextSm>프로젝트 진행도<br /></TextSm>
            <TitleMd>{percentage.toFixed(1)}%</TitleMd>
            <ProgressBar>
                <Filler percentage={percentage}></Filler>
            </ProgressBar>
            <PercentageContainer>
                <ProgressContainer>
                    <Cylinder color="green" />
                    <TextSm>완료<br />{percentage.toFixed(1)}%</TextSm>
                </ProgressContainer>
                <ProgressContainer>
                    <Cylinder color="lightgray" />
                    <TextSm>미완료<br />{incompletePercentage.toFixed(1)}%</TextSm>
                </ProgressContainer>
            </PercentageContainer>
        </Container>
    );
}

export default ProjectProgress;
