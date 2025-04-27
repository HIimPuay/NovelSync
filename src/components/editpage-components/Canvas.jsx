import React, { useEffect, useRef, useState } from 'react';
import { ELEMENT_TYPES } from '../../constants/elementTypes';
import '../styles/editpage.css';

// Helper function to render elements
const renderElement = (ctx, element, isSelected, zoomLevel) => {
  if (element.hidden) return;

  ctx.save();

  const zoomedX = element.x * zoomLevel;
  const zoomedY = element.y * zoomLevel;

  if (isSelected) {
    ctx.strokeStyle = '#1677ff';
    ctx.lineWidth = 2;
  } else {
    ctx.strokeStyle = element.color || '#000000';
    ctx.lineWidth = 1;
  }

  switch (element.type) {
    case ELEMENT_TYPES.CIRCLE: {
      const radius = (element.width / 2) * zoomLevel;

      ctx.beginPath();
      ctx.arc(zoomedX, zoomedY, radius, 0, Math.PI * 2);

      switch (element.characterType) {
        case 'protagonist':
          ctx.fillStyle = '#e6f7ff';
          break;
        case 'antagonist':
          ctx.fillStyle = '#fff1f0';
          break;
        case 'supporting':
          ctx.fillStyle = '#f6ffed';
          break;
        default:
          ctx.fillStyle = '#ffffff';
      }

      ctx.fill();
      ctx.stroke();

      if (element.profileImage) {
        const img = new Image();
        img.src = element.profileImage;

        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(zoomedX, zoomedY, radius * 0.9, 0, Math.PI * 2);
          ctx.clip();

          const size = radius * 1.8;
          ctx.drawImage(img, zoomedX - size / 2, zoomedY - size / 2, size, size);
          ctx.restore();
        };
      }

      if (element.text) {
        ctx.fillStyle = '#000000';
        ctx.font = `${12 * zoomLevel}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(element.text, zoomedX, zoomedY + radius + 20 * zoomLevel);
      }
      break;
    }

    case ELEMENT_TYPES.TEXTBOX: {
      const width = element.width * zoomLevel;
      const height = element.height * zoomLevel;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(zoomedX - width / 2, zoomedY - height / 2, width, height);
      ctx.strokeRect(zoomedX - width / 2, zoomedY - height / 2, width, height);

      if (element.text) {
        ctx.fillStyle = '#000000';
        ctx.font = `${12 * zoomLevel}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const words = element.text.split(' ');
        const lineHeight = 15 * zoomLevel;
        let line = '';
        let y = zoomedY - height / 2 + lineHeight;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);

          if (metrics.width > width - 10) {
            ctx.fillText(line, zoomedX, y);
            line = words[i] + ' ';
            y += lineHeight;
            if (y > zoomedY + height / 2 - lineHeight) break;
          } else {
            line = testLine;
          }
        }

        ctx.fillText(line, zoomedX, y);
      }
      break;
    }

    case ELEMENT_TYPES.LINE: {
      ctx.beginPath();
      ctx.moveTo(zoomedX, zoomedY);
      ctx.lineTo(zoomedX + (element.width * zoomLevel), zoomedY);
      ctx.stroke();
      break;
    }

    case ELEMENT_TYPES.RELATIONSHIP: {
      const sourceEl = window.elements?.find(el => el.id === element.sourceId);
      const targetEl = window.elements?.find(el => el.id === element.targetId);

      if (sourceEl && targetEl) {
        const sourceX = sourceEl.x * zoomLevel;
        const sourceY = sourceEl.y * zoomLevel;
        const targetX = targetEl.x * zoomLevel;
        const targetY = targetEl.y * zoomLevel;

        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = element.color || '#1677ff';
        ctx.stroke();

        if (element.text) {
          const midX = (sourceX + targetX) / 2;
          const midY = (sourceY + targetY) / 2;

          ctx.font = `${12 * zoomLevel}px Arial`;
          const textMetrics = ctx.measureText(element.text);
          const padding = 5 * zoomLevel;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(midX - textMetrics.width / 2 - padding, midY - 10 * zoomLevel, textMetrics.width + padding * 2, 20 * zoomLevel);

          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(element.text, midX, midY);
        }
      }
      break;
    }

    default:
      break;
  }

  ctx.restore();
};

const Canvas = ({ 
  canvasRef,
  elements, 
  selectedElements, 
  zoomLevel, 
  isErasing,
  relationshipMode,
  handleSelectElement, 
  updateElement,
  handleCanvasClick 
}) => {
  const canvasContext = useRef(null);
  
  // State for dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Initialize canvas on mount
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvasContext.current = ctx;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Make elements globally available for rendering relationships
    window.elements = elements;
    
    // Initial render
    renderCanvas();
    
    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      renderCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef]);
  
  // Re-render when elements or selection changes
  useEffect(() => {
    window.elements = elements;
    renderCanvas();
  }, [elements, selectedElements, zoomLevel]);
  
  // Function to render all elements on the canvas
  const renderCanvas = () => {
    if (!canvasRef.current || !canvasContext.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvasContext.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid (optional)
    drawGrid(ctx, canvas.width, canvas.height, zoomLevel);
    
    // Render elements in order
    elements.forEach(element => {
      renderElement(
        ctx, 
        element, 
        selectedElements.includes(element.id),
        zoomLevel
      );
    });
  };
  
  // Draw a grid on the canvas
  const drawGrid = (ctx, width, height, zoom) => {
    const gridSize = 20 * zoom;
    
    ctx.save();
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    ctx.restore();
  };
  
  // Function to check if a point is within an element
  const isPointInElement = (x, y, element) => {
    if (element.hidden) return false;
    
    switch (element.type) {
      case ELEMENT_TYPES.CIRCLE:
        const radius = element.width / 2;
        const distance = Math.sqrt(
          Math.pow(element.x - x, 2) + Math.pow(element.y - y, 2)
        );
        return distance <= radius;
        
      case ELEMENT_TYPES.TEXTBOX:
        return (
          x >= element.x - element.width/2 &&
          x <= element.x + element.width/2 &&
          y >= element.y - element.height/2 &&
          y <= element.y + element.height/2
        );
        
      case ELEMENT_TYPES.LINE:
        const lineEndX = element.x + element.width;
        // For simplicity, we'll consider a small area around the line
        return (
          x >= element.x - 5 &&
          x <= lineEndX + 5 &&
          y >= element.y - 5 &&
          y <= element.y + 5
        );
        
      case ELEMENT_TYPES.RELATIONSHIP:
        // Not directly selectable/draggable from canvas
        return false;
        
      default:
        return false;
    }
  };
  
  // Handle mouse down for starting drag
  const handleMouseDown = (e) => {
    if (isErasing || relationshipMode) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;
    
    // Find clicked element (in reverse order to get topmost first)
    const clickedElement = [...elements].reverse().find(element => 
      isPointInElement(x, y, element)
    );
    
    if (clickedElement) {
      // Select the element if it's not already selected
      if (!selectedElements.includes(clickedElement.id)) {
        handleSelectElement(clickedElement.id, { isErasing, relationshipMode });
      }
      
      // Start dragging
      setIsDragging(true);
      setDragStart({ x, y });
      
      // Close any open dropdowns
      if (handleCanvasClick) {
        handleCanvasClick();
      }
    } else {
      // Clear selection if clicking empty space
      handleSelectElement(null);
      
      // Close any open dropdowns
      if (handleCanvasClick) {
        handleCanvasClick();
      }
    }
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElements.length || isErasing || relationshipMode) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;
    
    // Calculate distance moved
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    
    // Update position for all selected elements
    selectedElements.forEach(id => {
      const element = elements.find(el => el.id === id);
      if (element && element.type !== ELEMENT_TYPES.RELATIONSHIP) {
        updateElement(id, {
          x: element.x + dx,
          y: element.y + dy
        });
      }
    });
    
    // Update starting position for next move
    setDragStart({ x, y });
  };
  
  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle mouse out to end dragging if cursor leaves canvas
  const handleMouseOut = () => {
    setIsDragging(false);
  };
  
  // Handle canvas click for selection
  const handleCanvasClicked = (e) => {
    // Already handled in mouseDown
  };
  
  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="diagram-canvas"
        onClick={handleCanvasClicked}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      />
    </div>
  );
};

export default Canvas;