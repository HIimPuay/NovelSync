import { useState } from 'react';
import Draggable from 'react-draggable';
import '../components/styles/editpage.css';
import { PenIcon, FolderOpen, ZoomIn, ZoomOut, MousePointer } from "lucide-react";

function EditPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [circles, setCircles] = useState([]);

  const addCircle = () => {
    setCircles([...circles, { id: circles.length }]);
  };

  return (
    <div>
      <div className="folder-icon"><FolderOpen /></div>
      <div className="zoomOut-icon"><ZoomOut /></div>
      <div className="zoomIn-icon"><ZoomIn /></div>
      <div className="cursor-icon"><MousePointer /></div>
      <div className="edit-icon" onClick={() => setEditOpen(!editOpen)}>
        <PenIcon size={28} />
      </div>
      <div className={`edit-dropdown ${editOpen ? "open" : ""}`}>
        <ul>
          <li><a href="#" onClick={addCircle}>เพิ่มตัวละคร</a></li>
          <li><a href="#">เพิ่มรูปภาพ</a></li>
          <li><a href="#">เพิ่มความสัมพันธ์</a></li>
          <li><a href="#">เปลี่ยนสีเส้น</a></li>
          <li><a href="#">กล่องข้อความ</a></li>
          <li><a href="#">ลบตัวละคร</a></li>
        </ul>
      </div>
      <div className="edit-container">
        <h1>Tools</h1>
        {circles.map(circle => (
          <Draggable key={circle.id}>
            <div className="circle"></div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}

export default EditPage;