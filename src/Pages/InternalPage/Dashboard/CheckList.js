import React, { useState, useEffect } from "react";
import styled from "styled-components";
import checkTodoApi from "../../../api/checkTodoApi";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import axios from "axios";

function CheckList({ projectId }) {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
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
            alert("해당 사용자는 권한이 없어 프로젝트 내용을 볼 수 없습니다.");
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
  }, []);

  const handleCheck = async (id) => {
    try {
      const response = await checkTodoApi.completeCheckTodo(id);
      if (response.status === 200) {
        // 상태를 불변하게 유지하며 변경
        setItems(
          items.map((item) =>
            item.todoIndex === id ? { ...item, checked: !item.checked } : item
          )
        );
      } else {
        // 여기서는 오류 처리를 하면 됩니다. 예를 들어:
        console.error("Something error");
      }
    } catch (error) {
      console.error("Error updating check status", error);
    }
  };

  const handleDelete = async (todoIndex) => {
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
    const finalText = isUrgent ? `${inputText}` : inputText;
    const newItem = {
      todoIndex: newId,
      todoContent: finalText,
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
        todoContent: finalText,
        todoEmergency: isUrgent,
      });
    } catch (error) {
      console.error("Error adding new item", error);
    }

    setInputText("");
    setIsUrgent(false);
    setShowModal(false);
  };

  const [showModal, setShowModal] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const sortedItems = [...items].sort((a, b) => {
    if (a.checked && !b.checked) return 1;
    if (!a.checked && b.checked) return -1;
    return 0;
  });

  return (
    <Container>
      <List>
        <Title>CheckList</Title>
        <AddButton type="button" onClick={() => setShowModal(true)}>
          <FaPen />
        </AddButton>
      </List>
      <ItemsList>
        {sortedItems.map((item) => (
          <Item completed={item.checked}>
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
  font-family: Arial, sans-serif;
  max-width: 600px;
  max-height: 300px; // 최대 높이 설정
  overflow-y: auto; // 스크롤 기능 활성화
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  margin-left: -15px;
`;

const List = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -20px;
`;

const Title = styled.text`
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 15px;
`;

const AddButton = styled.button`
  background-color: white;
  color: #a9a9a9;
  border: none;
  padding: 8px 16px;
  font-size: 20px;
  text-align: left;
  cursor: pointer;
  border-radius: 5px;
  margin-right: -24px;
  transition: background-color 0.3s;

  &:hover {
    background-color: whitesmoke;
  }
`;

const ItemsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 24px;
`;

const Item = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  border-radius: 5px;

  margin-bottom: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })``;

const UrgencyLabel = styled.span`
  margin-right: 10px;
  font-weight: bold;
  color: red;
`;

const DeleteButton = styled.button`
  background-color: white;
  color: #ff5722;
  border-color: #ff5722;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 16px;
  margin-left: auto;

  &:hover {
    background-color: #e64a19;
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
