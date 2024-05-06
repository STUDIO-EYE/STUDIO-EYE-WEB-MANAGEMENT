import React, { useState, useEffect, ReactNode, useRef } from 'react';
import styled from 'styled-components';
import { FaEllipsisH, FaEllipsisV } from 'react-icons/fa';
import { IoEllipsisHorizontalCircleSharp } from 'react-icons/io5';
import { MdMenu } from "react-icons/md";

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
font-size: 1.2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  &:hover {
    color: #ccc;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 1.5rem;
  right: 0.5rem;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  display: ${({ isOpen }) => (isOpen ? 'inline-block' : 'none')};
  white-space: nowrap;
`;

const DropdownItem = styled.div`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

interface DropdownProps {
  children: ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setIsOpen(!isOpen);
  };

  const closeDropdown = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdown);

    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={toggleDropdown}>
        <MdMenu />
      </DropdownButton>
      <DropdownMenu isOpen={isOpen}>{children}</DropdownMenu>
    </DropdownContainer>
  );
};

export { Dropdown, DropdownItem };
