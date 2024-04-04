import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import checkTodoApi from "../../../api/checkTodoApi";
import { TitleSm } from "Components/common/Font";

interface TodoItem {
  todoIndex: number;
  todoContent: string;
  todoEmergency: boolean;
  checked: boolean;
}

function CheckList({ projectId }: { projectId: number }) {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await checkTodoApi.getProjectTodo(projectId);
        if (response.data && response.data.success === false) {
          if (response.data.code === 5005) {
            setMessage(response.data.message); // "내용이 존재하지 않습니다."
          } else if (response.data.code === 7000) {
            alert("로그인을 먼저 진행시켜 주시길 바랍니다.");
            navigate("/LoginPage");
          } else if (response.data.code === 7001) {
            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
            // 토큰 제거
            sessionStorage.removeItem("login-token");
            delete axios.defaults.headers.common["Authorization"];
            navigate("/LoginPage");
          } else if (response.data.code === 8000) {
            alert(
              "해당 사용자는 권한이 없어 프로젝트 내용을 볼 수 없습니다."
            );
            navigate("/");
          }
          return;
        }
        setItems(response.data.list);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [navigate, projectId]);

  const handleCheck = async (id: number) => {
    try {
      const response = await checkTodoApi.completeCheckTodo(id);
      if (response.status === 200) {
        // 상태를 불변하게 유지하며 변경
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.todoIndex === id ? { ...item, checked: !item.checked } : item
          )
        );
      } else {
        console.error("Something error");
      }
    } catch (error) {
      console.error("Error updating check status", error);
    }
  };

  const handleDelete = async (todoIndex: number) => {
    const filteredItems = items.filter((item) => item.todoIndex !== todoIndex);
    setItems(filteredItems);

    try {
      await checkTodoApi.deleteCheckTodo(todoIndex);
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const handleAdd = async () => {
    const newId = items.length
      ? Math.max(...items.map((item) => item.todoIndex)) + 1
      : 1;

    const newItem: TodoItem = {
      todoIndex: newId,
      todoContent: isUrgent ? `${inputText}` : inputText,
      todoEmergency: isUrgent,
      checked: false,
    };

    if (isUrgent) {
      setItems([newItem, ...items]);
    } else {
      setItems([...items, newItem]);
    }

    try {
      await checkTodoApi.createCheckTodo(projectId, {
        todoContent: newItem.todoContent,
        todoEmergency: newItem.todoEmergency,
      });
    } catch (error) {
      console.error("Error adding new item", error);
    }

    setInputText("");
    setIsUrgent(false);
    setShowModal(false);
  };

  const [showModal, setShowModal] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  const sortedItems = [...items].sort((a, b) => {
    if (a.checked && !b.checked) return 1;
    if (!a.checked && b.checked) return -1;
    return 0;
  });

  return (
    <Container>
      <List>
        <TitleSm>CheckList</TitleSm>
        <AddButton type="button" onClick={() => setShowModal(true)}>
          <FaPen />
        </AddButton>
      </List>
      <ItemsList>
        {sortedItems.map((item) => (
          <Item key={item.todoIndex} completed={item.checked}>
            <Checkbox
              type="checkbox"
              checked={item.checked}
              onChange={() => handleCheck(item.todoIndex)}
            />
            {item.todoEmergency ? <UrgencyLabel>[긴급]</UrgencyLabel> : null}
            {item.todoContent}
            <DeleteButton onClick={() => handleDelete(item.todoIndex)}>
              x
            </DeleteButton>
          </Item>
        ))}
      </ItemsList>
      {showModal && (
        <Modal>
          <h2>Add Item</h2>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div>
            <label>
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
              />
              긴급
            </label>
          </div>
          <ModalButton onClick={handleAdd}>Add</ModalButton>
          <ModalButton onClick={() => setShowModal(false)}>Cancel</ModalButton>
        </Modal>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 225px;
  min-height: 150px; /* 기본 높이 설정 */
  background-color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  border-radius: 15px;
`;

const List = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -20px;
`;

const AddButton = styled.button`
  background-color: transparent;
  color: #a9a9a9;
  border: none;
  padding: 8px 16px;
  font-size: 10px;
  text-align: left;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const ItemsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 24px;
`;

const Item = styled.li<{ completed: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0 10px 0;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  overflow-x: auto;

  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.08) white;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })``;

const UrgencyLabel = styled.span`
  margin-right: 10px;
  font-weight: bold;
  color: red;
`;

const DeleteButton = styled.button`
  background-color: transparent;
  color: red;
  border-color: red;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 15px;
  margin-left: auto;

  &:hover {
    background-color: red;
    color: white;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 20px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 1000;
  text-align: center;

  h2 {
    margin-top: 0;
  }
  input {
    font-size: 1.3rem;
  }
`;

const ModalButton = styled.button`
  background-color: white;
  color: #ff5722;
  border-color: #ff5722;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 16px;

  &:hover {
    background-color: #e64a19;
    color: white;
  }
`;

export default CheckList;