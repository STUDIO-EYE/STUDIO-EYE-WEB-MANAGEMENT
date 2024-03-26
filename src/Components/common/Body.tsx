import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Responsive from './responsive';
import NEWheader from "./NEWheader";

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

const Wrapper = styled(Responsive)`
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .right {
    display: flex;
    align-items: center;
  }
`;

const PageBody = styled.div`
  padding-top: 4rem;
  display: flex;
  background-color: #FAFAFA;
`;

const SideDiv = styled.div<{ additionalWidth: number }>`
  width: ${({ additionalWidth }) => additionalWidth}px;
`;

const RealBody = styled.div<{ mainWidth: number }>`
  width: ${({ mainWidth }) => mainWidth}px;
`;

interface BodyProps {
    children: React.ReactNode;
}

const Body = ({ children }: BodyProps) => {
    const [additionalWidth, setAdditionalWidth] = useState(0);
    const [mainWidth, setMainWidth] = useState(0);
    const [mainHeight, setMainHeight] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            if (screenWidth > 1440) {
                setAdditionalWidth((screenWidth - 1440) / 2);
                setMainWidth(1440);
            } else {
                setAdditionalWidth(0);
                setMainWidth(screenWidth);
            }
            setMainHeight(screenHeight);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <NEWheader />
            <PageBody>
                <SideDiv additionalWidth={additionalWidth} />
                <RealBody mainWidth={mainWidth}>{children}</RealBody>
                <SideDiv additionalWidth={additionalWidth} />
            </PageBody>
        </>
    );
};

export default Body;
