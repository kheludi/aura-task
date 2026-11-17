import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical, Lock } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api';

export default function TaskCard({ task, onTaskUpdate, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const handleDelete = async () => {
    if (window.confirm('Delete task?')) {
      await api.delete(`/tasks/${task.id}`);
      onTaskUpdate();
    }
  };

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`glass-card p-4 mb-3 border-l-4 ${task.priority === 'high' ? 'border-l-red-500' : task.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'} ${isDragging ? 'opacity-50' : ''}`}>
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          {task.status !== 'overdue' ? (
            <div {...attributes} {...listeners} className="cursor-grab"><GripVertical className="w-4 h-4 text-gray-500" /></div>
          ) : <Lock className="w-4 h-4 text-red-500" />}
          <h4 className="font-semibold text-white">{task.title}</h4>
        </div>
        <button onClick={handleDelete} className="text-gray-500 hover:text-red-400 text-xs">✕</button>
      </div>

      <p className="text-sm text-gray-400 mb-3">{task.description}</p>
      
      <div className="flex space-x-2 text-xs">
        <span className="px-2 py-1 bg-aura-darker rounded text-gray-300">{task.category}</span>
        {task.due_date && <span className="px-2 py-1 bg-aura-darker rounded text-gray-300 flex items-center"><Calendar className="w-3 h-3 mr-1" /> {format(new Date(task.due_date), 'MMM dd')}</span>}
      </div>
    </div>
  );
}