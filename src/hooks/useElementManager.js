import { useState, useRef } from 'react';
import { generateId } from '../utils/helpers';
import { ELEMENT_TYPES } from '../constants/elementTypes';
import '../components/styles/editpage.css';

export default function useElementManager(canvasRef) {
  const [elements, setElements] = useState([]);
  const [selectedElements, setSelectedElements] = useState([]);
  const fileInputRef = useRef(null);

  // Element management functions
  const addElement = (type) => (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    const canvasRect = canvasRef?.current?.getBoundingClientRect();
    const centerX = canvasRect ? (canvasRect.width / 2) : 300;
    const centerY = canvasRect ? (canvasRect.height / 2) : 200;
    
    const newElement = { 
      id: generateId(),
      type, 
      x: centerX, // Center in canvas
      y: centerY,
      width: type === ELEMENT_TYPES.LINE ? 100 : 
             type === ELEMENT_TYPES.TEXTBOX ? 150 : 
             type === ELEMENT_TYPES.CIRCLE ? 80 : undefined,
      height: type === ELEMENT_TYPES.TEXTBOX ? 100 : 
              type === ELEMENT_TYPES.CIRCLE ? 80 : undefined,
      rotation: 0,
      color: '#000000',
      text: type === ELEMENT_TYPES.TEXTBOX ? 'Enter text here' : '',
      characterType: type === ELEMENT_TYPES.CIRCLE ? 'neutral' : undefined,
      details: type === ELEMENT_TYPES.CIRCLE ? '' : undefined,
      age: type === ELEMENT_TYPES.CIRCLE ? '' : undefined,
      profileImage: null,
      hidden: false
    };
    
    setElements(prevElements => [...prevElements, newElement]);
    setSelectedElements([newElement.id]);
    return newElement;
  };

  const updateElement = (id, updates) => {
    setElements(elements.map(element => 
      element.id === id ? { ...element, ...updates } : element
    ));
  };

  const removeElement = (id) => {
    // Remove the element itself
    setElements(elements.filter(element => element.id !== id));
    
    // Also remove any relationships connected to this element
    setElements(prevElements => 
      prevElements.filter(element => 
        element.type !== ELEMENT_TYPES.RELATIONSHIP || 
        (element.sourceId !== id && element.targetId !== id)
      )
    );
    
    // Update selection state
    setSelectedElements(prev => prev.filter(selectedId => selectedId !== id));
  };

  const createRelationship = (sourceId, targetId) => {
    // Check if a relationship already exists between these elements
    const relationshipExists = elements.some(el => 
      el.type === ELEMENT_TYPES.RELATIONSHIP && 
      ((el.sourceId === sourceId && el.targetId === targetId) || 
       (el.sourceId === targetId && el.targetId === sourceId))
    );
    
    if (relationshipExists) {
      return null; // Don't create duplicate relationships
    }
    
    const newRelationship = {
      id: generateId(),
      type: ELEMENT_TYPES.RELATIONSHIP,
      sourceId,
      targetId,
      text: "",
      color: "#1677ff",
      hidden: false
    };
    
    setElements([...elements, newRelationship]);
    // return newRelationship;
  };

  const toggleElementVisibility = (id) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      updateElement(id, { hidden: !element.hidden });
    }
  };

  const handleSelectElement = (id, options = {}) => {
    const { isErasing, relationshipMode } = options;
    
    if (isErasing) {
      removeElement(id);
      return;
    }
    
    const element = elements.find(el => el.id === id);
    if (!element) return;
    
    // Handling relationship mode
    if (relationshipMode && element && element.type === ELEMENT_TYPES.CIRCLE) {
      if (selectedElements.includes(id)) {
        // Deselect if already selected
        setSelectedElements(prev => prev.filter(selectedId => selectedId !== id));
      } else {
        // Add to selection or replace single selection
        const newSelection = [...selectedElements, id].slice(-2); // Keep only last 2 selections
        setSelectedElements(newSelection);
        
        // If we have 2 circles selected, create a relationship
        if (newSelection.length === 2) {
          const [sourceId, targetId] = newSelection;
          
          // Check if both are circles
          const source = elements.find(el => el.id === sourceId);
          const target = elements.find(el => el.id === targetId);
          
          if (source?.type === ELEMENT_TYPES.CIRCLE && target?.type === ELEMENT_TYPES.CIRCLE) {
            // Create relationship
            createRelationship(sourceId, targetId);
            // Reset selection
            setSelectedElements([]);
          }
        }
      }
    } else if (activeTool === 'cursor') {
      // Normal selection mode (single selection)
      if (selectedElements.includes(id)) {
        setSelectedElements([]);
      } else {
        setSelectedElements([id]);
      }
    }
  };

  // Add image upload functionality
  const triggerImageUpload = (elementId) => {
    // Create a file input if it doesn't exist
    if (!fileInputRef.current) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      document.body.appendChild(input);
      fileInputRef.current = input;
    }
    
    // Set up the file input change handler
    fileInputRef.current.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        updateElement(elementId, { profileImage: event.target.result });
      };
      reader.readAsDataURL(file);
    };
    
    // Trigger the file input click
    fileInputRef.current.click();
  };

  // Local storage functions for saving/loading
  const saveProject = (project) => {
    try {
      localStorage.setItem('characterDiagram', JSON.stringify(project));
      return true;
    } catch (error) {
      console.error('Failed to save project:', error);
      return false;
    }
  };

  const loadProject = () => {
    try {
      const savedProject = localStorage.getItem('characterDiagram');
      if (savedProject) {
        const parsedProject = JSON.parse(savedProject);
        setElements(parsedProject.elements || []);
        return parsedProject.name;
      }
      return null;
    } catch (error) {
      console.error('Failed to load project:', error);
      return null;
    }
  };

  const clearSelection = () => {
    setSelectedElements([]);
  };

  const setCharacterType = (id, characterType) => {
    updateElement(id, { characterType });
  };

  const getSelectedElement = () => {
    return elements.find(el => selectedElements[0] === el.id);
  };

  return {
    elements,
    selectedElements,
    selectedElement: getSelectedElement(),
    addElement,
    updateElement,
    removeElement,
    createRelationship,
    toggleElementVisibility,
    handleSelectElement,
    clearSelection,
    setCharacterType,
    triggerImageUpload,
    saveProject,
    loadProject
  };
}