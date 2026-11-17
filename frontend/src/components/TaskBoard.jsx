import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragOverlay, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Circle, TrendingUp, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import TaskCard from './TaskCard';
import api from '../api';

const columns = [
  { id: 'todo', title: 'To Do', icon: Circle, color: 'text-blue-400' },
  { id: 'doing', title: 'In Progress', icon: TrendingUp, color: 'text-yellow-400' },
  { id: 'completed', title: 'Completed', icon: CheckCircle, color: 'text-green-400' },
  { id: 'overdue', title: 'Overdue (Auto)', icon: AlertCircle, color: 'text-red-400' },
];

function DroppableColumn({ id, children }) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef} className="space-y-3 min-h-[500px]">{children}</div>;
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) { toast.error('Failed to load tasks'); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const overColumnId = tasks.find(t => t.id === over.id)?.status || over.id;

    if (overColumnId === 'overdue') return toast.error('Moved automatically by date');
    if (activeTask.status === 'overdue') return toast.error('Locked. Edit date to unlock.');
    if (activeTask.status === overColumnId) return;

    setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: overColumnId } : t));
    try { await api.patch(`/tasks/${active.id}/status`, { status: overColumnId }); } 
    catch (error) { fetchTasks(); }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragStart={e => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {columns.map((col) => (
          <div key={col.id}>
            <div className="flex items-center space-x-2 mb-4 p-2 bg-aura-card rounded-lg">
              <col.icon className={`w-5 h-5 ${col.color}`} />
              <h3 className="font-semibold text-white">{col.title}</h3>
            </div>
            <SortableContext items={tasks.filter(t => t.status === col.id).map(t => t.id)} strategy={verticalListSortingStrategy}>
              {col.id === 'overdue' ? (
                <div className="space-y-3 min-h-[500px]">
                  {tasks.filter(t => t.status === 'overdue').map(t => <TaskCard key={t.id} task={t} onTaskUpdate={fetchTasks} />)}
                  <div className="text-center p-4 border-2 border-dashed border-aura-border rounded-xl text-gray-500"><Lock className="mx-auto w-6 h-6 mb-2" /> Auto-locked</div>
                </div>
              ) : (
                <DroppableColumn id={col.id}>
                  {tasks.filter(t => t.status === col.id).map(t => <TaskCard key={t.id} task={t} onTaskUpdate={fetchTasks} />)}
                </DroppableColumn>
              )}
            </SortableContext>
          </div>
        ))}
      </div>
      <DragOverlay>{activeId ? <TaskCard task={tasks.find(t => t.id === activeId)} isDragging /> : null}</DragOverlay>
    </DndContext>
  );
}