import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Clock, CheckCircle, Circle, AlertCircle, TrendingUp, Filter, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import TaskCard from './TaskCard';
import api from '../api';

const columns = [
  { id: 'todo', title: 'To Do', icon: Circle, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  { id: 'doing', title: 'In Progress', icon: TrendingUp, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
  { id: 'completed', title: 'Completed', icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' },
  { id: 'overdue', title: 'Overdue (Auto)', icon: AlertCircle, color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
];

// This component acts as the drop zone for each column (except Overdue)
function DroppableColumn({ id, children }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="space-y-3 min-h-[500px]">
      {children}
    </div>
  );
}

function TaskBoard({ searchTerm = '' }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, progress: 0, overdue: 0 });
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
      calculateStats(response.data);
      
      const uniqueCategories = [...new Set(response.data.map(t => t.category).filter(c => c))];
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tasksList) => {
    const total = tasksList.length;
    const completed = tasksList.filter(t => t.status === 'completed').length;
    const progress = tasksList.filter(t => t.status === 'doing').length;
    const overdue = tasksList.filter(t => t.status === 'overdue').length;
    setStats({ total, completed, progress, overdue });
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    
    if (!activeTask) return;

    let overColumnId = over.id;
    const overTask = tasks.find(t => t.id === over.id);
    
    if (overTask) {
      overColumnId = overTask.status;
    }

    // --- RULES FOR OVERDUE ---
    // 1. Don't allow dropping INTO the overdue column
    if (overColumnId === 'overdue') {
      toast.error('Tasks are moved to Overdue automatically when the due date passes.');
      return;
    }

    // 2. Don't allow moving a task OUT OF the overdue column
    if (activeTask.status === 'overdue') {
      toast.error('Overdue tasks are locked. Please edit the due date to extend it.');
      return;
    }
    // -------------------------

    if (activeTask.status === overColumnId) return;

    const updatedTasks = tasks.map(t => 
      t.id === active.id ? { ...t, status: overColumnId } : t
    );
    setTasks(updatedTasks);
    calculateStats(updatedTasks);

    try {
      await api.patch(`/tasks/${active.id}/status`, { status: overColumnId });
      toast.success(`Task moved to ${columns.find(c => c.id === overColumnId)?.title}`);
    } catch (error) {
      toast.error('Failed to move task');
      fetchTasks();
    }
  };

  const filterTasks = (tasksList) => {
    let filtered = tasksList;
    
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(task => task.category === filterCategory);
    }
    
    return filtered;
  };

  const getTasksByStatus = (status) => {
    return filterTasks(tasks).filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* ... (Stats cards remain exactly the same) ... */}
        <div className="glass-card p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Tasks</p><p className="text-3xl font-bold text-white">{stats.total}</p></div><div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center"><Clock className="w-6 h-6 text-blue-400" /></div></div></div>
        <div className="glass-card p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">In Progress</p><p className="text-3xl font-bold text-white">{stats.progress}</p></div><div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-yellow-400" /></div></div></div>
        <div className="glass-card p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Completed</p><p className="text-3xl font-bold text-white">{stats.completed}</p></div><div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-400" /></div></div></div>
        <div className="glass-card p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Overdue</p><p className="text-3xl font-bold text-white">{stats.overdue}</p></div><div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center"><AlertCircle className="w-6 h-6 text-red-400" /></div></div></div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Filters:</span>
        </div>
        
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-3 py-1 bg-aura-darker border border-aura-border rounded-lg text-sm focus:outline-none focus:border-purple-500 text-white">
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-1 bg-aura-darker border border-aura-border rounded-lg text-sm focus:outline-none focus:border-purple-500 text-white">
          <option value="all">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Task Board Columns */}
      <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div className={`flex items-center justify-between p-3 rounded-lg ${column.bgColor} border ${column.borderColor}`}>
                <div className="flex items-center space-x-2">
                  <column.icon className={`w-5 h-5 ${column.color}`} />
                  <h3 className="font-semibold text-white">{column.title}</h3>
                </div>
                <span className="text-sm text-gray-400">{getTasksByStatus(column.id).length}</span>
              </div>
              
              <SortableContext items={getTasksByStatus(column.id).map(t => t.id)} strategy={verticalListSortingStrategy}>
                {/* If it's the overdue column, we don't make it a drop zone */}
                {column.id === 'overdue' ? (
                  <div className="space-y-3 min-h-[500px]">
                    {getTasksByStatus(column.id).map((task) => (
                      <TaskCard key={task.id} task={task} onTaskUpdate={fetchTasks} />
                    ))}
                    {getTasksByStatus(column.id).length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-aura-border rounded-xl flex flex-col items-center justify-center">
                        <Lock className="w-6 h-6 mb-2 opacity-50" />
                        No overdue tasks
                      </div>
                    )}
                  </div>
                ) : (
                  <DroppableColumn id={column.id}>
                    {getTasksByStatus(column.id).map((task) => (
                      <TaskCard key={task.id} task={task} onTaskUpdate={fetchTasks} />
                    ))}
                    {getTasksByStatus(column.id).length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-aura-border rounded-xl">
                        Drop tasks here
                      </div>
                    )}
                  </DroppableColumn>
                )}
              </SortableContext>
            </div>
          ))}
        </div>
        
        <DragOverlay>
          {activeId ? <TaskCard task={tasks.find(t => t.id === activeId)} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

export default TaskBoard;