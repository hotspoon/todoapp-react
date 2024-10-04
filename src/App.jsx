import React, { useState, useEffect } from "react"
import { Pencil, Trash2 } from "lucide-react"

export default function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e) => {
    e.preventDefault()
    if (newTask.trim() === "") return

    const currentDateTime = new Date()
    const formattedDate = currentDateTime.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
    const formattedTime = currentDateTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    })

    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, title: newTask, date: formattedDate, time: formattedTime }
            : task
        )
      )
      setEditingTask(null)
    } else {
      const newTaskObj = {
        id: Date.now(),
        title: newTask,
        completed: false,
        date: formattedDate,
        time: formattedTime
      }
      setTasks([...tasks, newTaskObj])
    }
    setNewTask("")
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const startEditing = (task) => {
    setEditingTask(task)
    setNewTask(task.title)
  }

  const cancelEditing = () => {
    setEditingTask(null)
    setNewTask("")
  }

  const ongoingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const completedTasks = tasks
    .filter((task) => task.completed)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="mb-4 text-4xl text-center text-gray-900">Task Management</h1>
          <form onSubmit={addTask} className="mb-4">
            <label htmlFor="task" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="task"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1ea8f8] focus:border-blue-500"
            />
            <div className="mt-2">
              {editingTask ? (
                <>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="mr-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#FFB46F] hover:bg-[#ff8c20]"
                    >
                      Update Task
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-white bg-[#FF6F6F] hover:bg-[#ff2020]"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#0F0F0F] bg-[#6FCBFF] hover:bg-[#27b0ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Task
                  </button>
                </div>
              )}
            </div>
          </form>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Ongoing Tasks</h2>
            {ongoingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onToggle={toggleComplete}
                onEdit={startEditing}
              />
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Completed Tasks</h2>
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onToggle={toggleComplete}
                onEdit={startEditing}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskItem({ task, onDelete, onToggle, onEdit }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-md bg-[#D0D0D0]">
      <div className="flex items-start space-x-2">
        <div>
          <span
            className={`text-sm ${
              task.completed ? "line-through text-[#000000]" : "text-gray-900"
            }`}
          >
            {task.title}
          </span>
          <br />
          <span className="text-xs text-[#000000]">
            {task.date} {task.time}
          </span>
        </div>
        <div>
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-[#33363F] rounded-full hover:text-[#000000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-[#33363F] rounded-full hover:text-[#000000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-4 w-4 text-[#33363F]  border-[#33363F] rounded"
        />
      </div>
    </div>
  )
}
