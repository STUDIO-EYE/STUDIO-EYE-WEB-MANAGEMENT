import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { FaPen, FaTrash } from "react-icons/fa";
import myPageApi from "../../api/myPageApi";
import { TextSm, TitleSm } from "Components/common/Font";

interface TodoItem {
  userTodoId: number;
  todoContent: string;
  todoEmergency: boolean;
  checked: boolean;
}

const Container = styled.div`
  max-width: 200px;
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

const ItemContent = styled.span`
  cursor: pointer;
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
  white-space: nowrap;

  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.08) white;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })``;

const AddModal = styled.div`
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

  h3 {
    margin-top: 0;
  }
  input {
    font-family: 'Pretendard';
    font-weight: 400;
    border-color: rgba(0, 0, 0, 0.08);
    font-size: 1rem;
    border-radius: 5px;
    &:focus {
      border-color: #ffa900;
      outline: none;
    }
  }
`;

const EditModal = styled.div`
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

  h3 {
    margin-top: 0;
  }
  input {
    font-family: 'Pretendard';
    font-weight: 400;
    border-color: rgba(0, 0, 0, 0.08);
    font-size: 1rem;
    border-radius: 5px;
    &:focus {
      border-color: #ffa900;
      outline: none;
    }
  }
`;

const UrgencyLabel = styled.span`
  margin-right: 5px;
  font-weight: bold;
  color: #ffa900;
  white-space: nowrap;
`;

const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  color: #ffa900;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    color: rgba(0, 0, 0, 0.08);
  }
`;

const AddModalButton = styled.button`
  background-color: #ffa900;
  color: white;
  padding: 5px 15px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  margin: 10px 10px 0 10px;

  &:hover {
    background-color: white;
    color: #ffa900;
  }
`;

const EditModalButton = styled.button`
  background-color: #ffa900;
  color: white;
  padding: 5px 15px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  margin: 10px 10px 0 10px;

  &:hover {
    background-color: white;
    color: #ffa900;
  }
`;


function MyTodo() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await myPageApi.getTodoList();
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
  }, [navigate]);

//   const handleCheck = async (id: number) => {
//     try {
//       const response = await myPageApi.completeCheckTodo(id);
//       if (response.status === 200) {
//         // 상태를 불변하게 유지하며 변경
//         setItems((prevItems) =>
//           prevItems.map((item) =>
//             item.todoIndex === id ? { ...item, checked: !item.checked } : item
//           )
//         );
//       } else {
//         console.error("Something error");
//       }
//     } catch (error) {
//       console.error("Error updating check status", error);
//     }
//   };

  const handleDelete = async (todoIndex: number) => {
    console.log(todoIndex);
    const filteredItems = items.filter((item) => item.userTodoId !== todoIndex);
    setItems(filteredItems);

    try {
      await myPageApi.deleteTodo(todoIndex);
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const handleAdd = async () => {
    const newId = items.length
      ? Math.max(...items.map((item) => item.userTodoId)) + 1
      : 1;

    const newItem: TodoItem = {
      userTodoId: newId,
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
      await myPageApi.createTodo({
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

  const handleEdit = async (todoIndex: number, updatedContent: string) => {
    try {
      const response = await myPageApi.updateToto(todoIndex, {
        todoContent: updatedContent,
        todoEmergency: false
      });
      if (response.status === 200) {
        setItems(prevItems =>
          prevItems.map(item =>
            item.userTodoId === todoIndex ? { ...item, todoContent: updatedContent } : item
          )
        );
      } else {
        console.error("Something error");
      }
    } catch (error) {
      console.error("Error updating todo item", error);
    }

    setEditModal(false);
  };


  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setEditModal] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [editText, setEditText] = useState<string>(inputText);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  const sortedItems = [...items].sort((a, b) => {
    if (a.checked && !b.checked) return 1;
    if (!a.checked && b.checked) return -1;
    return 0;
  });

  return (
    <Container>
      <List>
        <TitleSm>ToDo</TitleSm>
        <AddButton type="button" onClick={() => setShowModal(true)}>
          <FaPen />
        </AddButton>
      </List>
      <ItemsList>
        {sortedItems.map((item) => (
          <Item key={item.userTodoId} completed={item.checked}>
            <Checkbox
              type="checkbox"
              checked={item.checked}
            //   onChange={() => handleCheck(item.todoIndex)}
            />
            {item.todoEmergency ? <UrgencyLabel>[긴급]</UrgencyLabel> : null}
            <ItemContent onClick={() => { setEditIndex(item.userTodoId); setEditText(item.todoContent); setEditModal(true); }}>{item.todoContent}</ItemContent>
            <DeleteButton onClick={() => handleDelete(item.userTodoId)}>
              <FaTrash />
            </DeleteButton>
          </Item>
        ))}


      </ItemsList>
      {showModal && (
        <AddModal>
          <h3>ToDo 추가</h3>
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
          <AddModalButton onClick={handleAdd}>추가</AddModalButton>
          <AddModalButton onClick={() => setShowModal(false)}>취소</AddModalButton>
        </AddModal>
      )}
      {showEditModal && (
        <EditModal>
          <h3>ToDo 수정</h3>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div>

          </div>
          <EditModalButton onClick={() => handleEdit(editIndex, editText)}>Save</EditModalButton>
          <EditModalButton onClick={() => setEditModal(false)}>Cancel</EditModalButton>
        </EditModal>
      )}

    </Container>
  );
}

export default MyTodo;