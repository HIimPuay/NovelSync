import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import '../components/styles/editpage.css';
import { Pen, FolderOpen, ZoomIn, ZoomOut, MousePointer, Eraser } from "lucide-react";

function EditPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [circles, setCircles] = useState([]);
  const [isErasing, setIsErasing] = useState(false);
  const [lines, setLines] = useState([]);

  const addCircle = (e) => {
    e.preventDefault();
    setCircles([...circles, { 
      id: circles.length, 
      x: 300, 
      y: 200 
    }]);
  };

  const addLine = (e) => {
    e.preventDefault();
    setLines([...lines, {
      id: Date.now(),
      x: 300,
      y: 250
    }]);
  }

  const toggleEdit = () => {
    setEditOpen(!editOpen);
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const removeCircle = (id) => {
    setCircles(circles.filter(circle => circle.id !== id));
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (editOpen && !e.target.closest('.edit-icon') && !e.target.closest('.edit-dropdown')) {
      setEditOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editOpen]);

  return (
    <div className={`edit-page ${isErasing ? "eraser-mode" : ""}`}>
      <div className="toolbar">
        <button className="tool-button folder-icon"><FolderOpen /></button>
        <button className="tool-button zoomOut-icon"><ZoomOut /></button>
        <button className="tool-button zoomIn-icon"><ZoomIn /></button>
        <button className="tool-button cursor-icon"><MousePointer /></button>
        <button className={`tool-button edit-icon ${editOpen ? "active" : ""}`} onClick={toggleEdit}>
          <Pen size={28} />
        </button>
        <button className={`tool-button eraser-icon ${isErasing ? "active eraser-active" : ""}`} onClick={toggleEraser}>
          <Eraser size={28} />
        </button>
      </div>

      <div className={`edit-dropdown ${editOpen ? "open" : ""}`}>
        <ul>
          <li><a href="#" onClick={addCircle}>เพิ่มตัวละคร</a></li>
          <li><a href="#">เพิ่มรูปภาพ</a></li>
          <li><a href="#" onClick={addLine}>เพิ่มความสัมพันธ์</a></li>
          <li><a href="#">เปลี่ยนสีเส้น</a></li>
          <li><a href="#">กล่องข้อความ</a></li>
        </ul>
      </div>

      <div className="edit-container">
        <h1>Tools</h1>
        <div className="canvas-area">
          {circles.map((circle) => (
            <DraggableCircle key={circle.id} circle={circle} isErasing={isErasing} removeCircle={removeCircle} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Separate component for each draggable circle
function DraggableCircle({ circle, isErasing, removeCircle }) {
  const nodeRef = useRef(null);
  
  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: circle.x, y: circle.y }}
    >
      <div 
        ref={nodeRef} 
        className={`circle ${isErasing ? "eraser-active" : ""}`} 
        onClick={() => isErasing ? removeCircle(circle.id) : null}
      >
        {circle.id}
      </div>
    </Draggable>
  );
}

export default EditPage;
