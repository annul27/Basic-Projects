import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { MdDelete } from "react-icons/md";
import { FaEdit } from 'react-icons/fa';
import Header from './components/Header';

function App() {

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState(null)
  const [showFinished, setshowFinished] = useState(false)

  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const guest = localStorage.getItem("guest");
    if (!user && !guest) navigate("/welcome");
  }, []);

  // Load todos from localStorage on mount
  useEffect(() => {
    let todos = JSON.parse(localStorage.getItem("todos")) || []
    setTodos(todos)
  }, [])

  // Save todos to localStorage whenever todos changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const toggleFinished = () => {
    setshowFinished(!showFinished)
    if (showFinished) {
      setTodos(todos.filter(item => !item.isCompleted))
    } else {
      let todos = JSON.parse(localStorage.getItem("todos")) || []
      setTodos(todos)
    }
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleAddOrSave = () => {
    if (isEdit) {
      setTodos(todos.map(item =>
        item.id === editId ? { ...item, todo } : item
      ))
      setIsEdit(false)
      setEditId(null)
    } else {
      setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    }
    setTodo("")
  }

  const handleCheckbox = (e) => {
    let id = e.target.name
    let index = todos.findIndex(item => item.id === id)
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    setTodos(newTodos)
  }

  const handleEdit = (e, id) => {
    const item = todos.find(item => item.id === id)
    setTodo(item.todo)
    setIsEdit(true)
    setEditId(id)
  }

  const handleDel = (e, id) => {
    let newTodos = todos.filter(item => item.id !== id)
    setTodos(newTodos)
    // If deleting the item being edited, reset edit state
    if (isEdit && editId === id) {
      setIsEdit(false)
      setEditId(null)
      setTodo("")
    }
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto my-5 rounded-xl bg-[#854F6C] p-5 min-h-[85vh] max-w-3xl">
        <div className="addTodo">
          <Header/>
          <h2 className='text-[#DFB6B2] text-lg font-bold'>Add a Todo</h2>
          <div className='flex items-center gap-1'>
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              placeholder="Enter your todo"
              className="w-full p-2 rounded-md bg-[#FBE4D8] text-[#2B124C] focus:outline-none focus:ring-2 focus:ring-[#DFB6B2]"
            />
            <button onClick={handleAddOrSave} disabled={todo.length <= 3} className="disabled:bg-[#190019] px-4 py-2 bg-[#522B5B] text-[#FBE4D8] rounded-md hover:bg-[#2B124C] transition-colors">
              {isEdit ? "Save" : "Add"}
            </button>
          </div>
        </div>
        <div className='flex items-center justify-between mt-6'>
          <h2 className='text-[#FBE4D8] text-lg font-bold'>Your Todos</h2>
          <div className='flex items-center gap-1'>
            <input onChange={toggleFinished} type="checkbox" checked={showFinished} name="" id="" />
            <span className='text-[#b38268] font-medium'>Show Finished</span>
          </div>
        </div>
        <div className="todos max-h-[72vh] overflow-y-auto scrollbar-hide">
          {todos.length === 0 && <p className='text-[#FBE4D8]'>No todos added yet!</p>}
          {todos.map(item => (
            <div key={item.id} className="todo flex justify-between items-center py-1 bg-[#a56386] px-3 rounded-md mb-2 gap-24">
              <div className='flex items-center gap-2'>
                <input
                  onChange={handleCheckbox}
                  className='accent-[#522B5B] cursor-pointer'
                  type="checkbox" checked={item.isCompleted} name={item.id} id='' />
                <div className={`font-bold break-word text-[#3a205c] ${item.isCompleted ? " line-through" : ""}`}>{item.todo}</div>
              </div>
              <div className="buttons gap-1 flex">
                <button onClick={(e) => { handleEdit(e, item.id) }} className=" px-2.5 py-1 bg-[#522B5B] text-[#FBE4D8] rounded-md hover:bg-[#2B124C] transition-colors"><FaEdit /></button>
                <button onClick={(e) => { handleDel(e, item.id) }} className=" px-2.5 py-1 bg-[#522B5B] text-[#FBE4D8] rounded-md hover:bg-[#2B124C] transition-colors"><MdDelete /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App