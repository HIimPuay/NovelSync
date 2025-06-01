import React, { useEffect, useRef, useState } from 'react';
import '../components/styles/editpage.css';
import { BookOpen } from 'lucide-react';

import useElementManager from '../hooks/useElementManager';
import useToolManager from '../hooks/useToolManager';

import ProjectName from '../components/editpage-components/ProjectName';
import Toolbar from '../components/editpage-components/Toolbar';
import Canvas from '../components/editpage-components/Canvas';

import axios from 'axios';
import { useParams } from 'react-router-dom';

function ViewOnlyEditPage() {
  const canvasRef = useRef(null);
  const { projectId } = useParams(); // ✅ รับ id จาก URL เช่น /view/:projectId

  const [projectName, setProjectName] = useState("Loading...");
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    elements,
    selectedElements,
    selectedElement,
    handleSelectElement,
    loadProject,
    clearSelection
  } = useElementManager(canvasRef);

  const {
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    resetZoom
  } = useToolManager();

   useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/project/${projectId}`);
        setProject(response.data.data); // สมมติว่าข้อมูลอยู่ใน response.data.data
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') clearSelection();
    };
    const handleClickOutside = (event) => {
      const isPanel = event.target.closest('.property-panel');
      if (!isPanel && !canvasRef.current?.contains(event.target)) {
        clearSelection();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [clearSelection, projectId]);

  return (
    <div className="edit-page view-only-mode">
      <div className="view-only-banner">
        <span><BookOpen /> View Only Mode - No editing allowed</span>
      </div>

      <div className="top-bar">
        <ProjectName
          initialName={projectName}
          onNameChange={() => {}}
          unsavedChanges={false}
          readOnly={true}
        />
        <Toolbar
          zoomLevel={zoomLevel}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          resetZoom={resetZoom}
          onLoad={() => {}}
        />
      </div>

      <ViewOnlyRelationshipLayer
        elements={elements}
        selectedElements={selectedElements}
        handleSelectElement={handleSelectElement}
      />

      <div className="main-content">
        <Canvas
          canvasRef={canvasRef}
          elements={elements}
          selectedElements={selectedElements}
          zoomLevel={zoomLevel}
          handleSelectElement={handleSelectElement}
          handleCanvasClick={() => {}}
        />

        {selectedElement && (
          <ViewOnlyPropertyPanel selectedElement={selectedElement} />
        )}
      </div>

      <div className="status-bar">
        <div className="status-info">
          <span className="status-mode">View Only Mode</span>
          <span className="zoom-level">Zoom: {Math.round(zoomLevel * 100)}%</span>
          {selectedElements.length > 0 && (
            <span className="selection-info">
              {selectedElements.length} item{selectedElements.length !== 1 ? 's' : ''} selected
            </span>
          )}
          <span className="element-count">
            Total Elements: {elements.length}
          </span>
        </div>
      </div>
    </div>
  );
}

const ViewOnlyRelationshipLayer = ({ elements, selectedElements, handleSelectElement }) => (
  <div className="relationship-layer view-only">
    {elements
      .filter(el => el.type === 'relationship')
      .map(relationship => (
        <div
          key={relationship.id}
          className={`relationship-item ${selectedElements.includes(relationship.id) ? 'selected' : ''}`}
          onClick={() => handleSelectElement(relationship.id)}
          style={{ cursor: 'pointer' }}
        />
      ))}
  </div>
);

const ViewOnlyPropertyPanel = ({ selectedElement }) => (
  <div className="property-panel view-only-property-panel">
    <div className="property-header">
      <h3>Details (Read Only)</h3>
    </div>
    <div className="property-content">
      <div className="property-group"><label>Element Type:</label><div className="property-value">{selectedElement.type}</div></div>
      <div className="property-group"><label>Name/Text:</label><div className="property-value">{selectedElement.text || 'No text'}</div></div>
      {selectedElement.characterType && (
        <div className="property-group"><label>Character Type:</label><div className="property-value">{selectedElement.characterType}</div></div>
      )}
      <div className="property-group"><label>Details:</label><div className="property-value">{selectedElement.details || 'No details'}</div></div>
      {selectedElement.type === 'relationship' && (
        <>
          <div className="property-group"><label>Source ID:</label><div className="property-value">{selectedElement.sourceId}</div></div>
          <div className="property-group"><label>Target ID:</label><div className="property-value">{selectedElement.targetId}</div></div>
          <div className="property-group"><label>Relationship Type:</label><div className="property-value">{selectedElement.relationshipType}</div></div>
        </>
      )}
      <div className="property-group"><label>Element ID:</label><div className="property-value" style={{ fontSize: 12, color: '#666' }}>{selectedElement.id}</div></div>
    </div>
    <div className="property-footer">
      <p style={{ fontSize: 12, color: '#666', fontStyle: 'italic' }}>
        All properties are displayed in read-only mode. No modifications can be made.
      </p>
    </div>
  </div>
);

export default ViewOnlyEditPage;
