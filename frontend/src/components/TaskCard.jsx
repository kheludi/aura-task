import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Trash2, Edit2, GripVertical, Clock, Flag } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../api';

const priorityColors = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const priorityIcons = {
  low: <Flag className="w-3 h-3" />,
  medium: <Flag className="w-3 h-3" />,
  high: <Flag className="w-3 h-3" />,
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

function TaskCard({ task, onTaskUpdate, isDragging = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging || isDragging ? 0.5 : 1,
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await api.delete(`/tasks/${task.id}`);
        toast.success('Task deleted successfully');
        onTaskUpdate();
      } catch (error) {
        toast.error('Failed to delete task');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/tasks/${task.id}`, {
        title: editedTask.title,
        description: editedTask.description,
        priority: editedTask.priority,
        category: editedTask.category,
        due_date: editedTask.due_date
      });
      toast.success('Task updated successfully');
      setIsEditing(false);
      onTaskUpdate();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  if (isEditing) {
    return (
      <div className="glass-card p-4 space-y-3 animate-fadeIn">
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          className="w-full px-3 py-2 bg-aura-darker border border-aura-border rounded-lg focus:outline-none focus:border-purple-500 text-white"
          placeholder="Task title"
          autoFocus
        />
        <textarea
          value={editedTask.description || ''}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          className="w-full px-3 py-2 bg-aura-darker border border-aura-border rounded-lg focus:outline-none focus:border-purple-500 text-white"
          placeholder="Description"
          rows="2"
        />
        <select
          value={editedTask.priority}
          onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
          className="w-full px-3 py-2 bg-aura-darker border border-aura-border rounded-lg focus:outline-none focus:border-purple-500 text-white"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <input
          type="text"
          value={editedTask.category || 'General'}
          onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
          className="w-full px-3 py-2 bg-aura-darker border border-aura-border rounded-lg focus:outline-none focus:border-purple-500 text-white"
          placeholder="Category"
        />
        <input
          type="date"
          value={editedTask.due_date ? editedTask.due_date.split('T')[0] : ''}
          onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
          className="w-full px-3 py-2 bg-aura-darker border border-aura-border rounded-lg focus:outline-none focus:border-purple-500 text-white"
        />
        <div className="flex space-x-2">
          <button
            onClick={handleUpdate}
            className="flex-1 px-3 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 px-3 py-2 bg-gray-500/20 rounded-lg hover:bg-gray-500/30 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-card p-4 cursor-move transition-all duration-300 hover:scale-102 hover:shadow-xl border-l-4 ${
        task.priority === 'high' ? 'border-l-red-500' :
        task.priority === 'medium' ? 'border-l-yellow-500' :
        'border-l-green-500'
      } ${isOverdue ? 'bg-red-500/5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing hover:text-purple-400 transition"
            >
              <GripVertical className="w-4 h-4 text-gray-500" />
            </div>
            <h4 className="font-semibold text-white line-clamp-2">{task.title}</h4>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}>
              {priorityIcons[task.priority]}
              {priorityLabels[task.priority]}
            </span>
            
            {task.category && task.category !== 'General' && (
              <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                {task.category}
              </span>
            )}
            
            {task.due_date && (
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full border ${isOverdue ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(task.due_date), 'MMM dd')}</span>
                {isOverdue && <Clock className="w-3 h-3 ml-1" />}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-purple-500/20 rounded-lg transition group"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 hover:bg-red-500/20 rounded-lg transition group"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;