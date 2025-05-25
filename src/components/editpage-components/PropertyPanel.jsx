import React from 'react';
import { ELEMENT_TYPES } from '../../constants/elementTypes';
import '../styles/editpage.css'; 

const PropertyPanel = ({ 
  selectedElement,
  updateElement,
  removeElement,
  toggleElementVisibility,
  triggerImageUpload
}) => {
  if (!selectedElement) return null;
  
  const handleTextChange = (e) => {
    updateElement(selectedElement.id, { text: e.target.value });
  };
  
  const handleColorChange = (e) => {
    updateElement(selectedElement.id, { color: e.target.value });
  };
  
  const handleProfileImageClick = () => {
    triggerImageUpload(selectedElement.id);
  };
  
  // Determine what fields to show based on element type
  const renderFields = () => {
    switch (selectedElement.type) {
      case ELEMENT_TYPES.CIRCLE:
        return (
          <>
            <div className="property-field">
              <label>Name:</label>
              <input 
                type="text" 
                value={selectedElement.text || ''} 
                onChange={handleTextChange} 
                placeholder="Character name"
              />
            </div>
            
            <div className="property-field">
              <label>Details:</label>
              <input 
                type="text" 
                value={selectedElement.details || ''} 
                onChange={(e) => updateElement(selectedElement.id, { details: e.target.value })} 
                placeholder="Character details"
              />
            </div>
            
            <div className="property-field">
              <label>Age:</label>
              <input 
                type="text" 
                value={selectedElement.age || ''} 
                onChange={(e) => updateElement(selectedElement.id, { age: e.target.value })} 
                placeholder="Character age"
              />
            </div>
            
            {/* <div className="property-field">
              <label>Character Type:</label>
              <select 
                value={selectedElement.characterType || 'neutral'} 
                onChange={(e) => updateElement(selectedElement.id, { characterType: e.target.value })}
              >
                <option value="neutral">Neutral</option>
                <option value="protagonist">Protagonist</option>
                <option value="antagonist">Antagonist</option>
                <option value="supporting">Supporting</option>
              </select>
            </div> */}
            
            <div className="property-field">
              <label>Color:</label>
              <input 
                type="color" 
                value={selectedElement.color || '#000000'} 
                onChange={handleColorChange}
              />
            </div>
            
            <div className="property-field image-upload-field">
              <label>Profile Image:</label>
              <div 
                className="image-placeholder" 
                onClick={handleProfileImageClick}
              >
                {selectedElement.profileImage ? (
                  <img 
                    src={selectedElement.profileImage} 
                    alt="Character" 
                    className="preview-image"
                  />
                ) : (
                  <span>Click to upload image</span>
                )}
              </div>
            </div>
          </>
        );
        
      case ELEMENT_TYPES.TEXTBOX:
      return (
        <>
          <div className="property-field">
            <label>Text:</label>
            <textarea 
              value={selectedElement.text || ''} 
              onChange={handleTextChange} 
              rows={4}
              placeholder="Enter text here"
              style={{ resize: 'none' }}
            />
          </div>

          <div className="property-field">
            <label>Font Size:</label>
            <input
              type="number"
              min={10}
              max={72}
              value={selectedElement.fontSize || 14}
              onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
            />
          </div>
      
          <div className="property-field">
            <label>Box color:</label>
            <input 
              type="color"
              value={selectedElement.color || '#000000'}
              onChange={handleColorChange}
            />
          </div>
      
          <div className="property-field">
            <label>Text color:</label>
            <input 
              type="color"
              value={selectedElement.fontColor || '#000000'}
              onChange={(e) => updateElement(selectedElement.id, { fontColor: e.target.value })}
            />
          </div>
      
          <div className="property-field">
            <label>Width:</label>
            <input 
              type="number" 
              value={selectedElement.width || 150}
              onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
              min="50"
            />
          </div>
      
          <div className="property-field">
            <label>Height:</label>
            <input 
              type="number" 
              value={selectedElement.height || 100}
              onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
              min="30"
            />
          </div>
        </>
      );

        
      case ELEMENT_TYPES.LINE:
        return (
          <>
            <div className="property-field">
              <label>Length:</label>
              <input 
                type="range" 
                min="10" 
                max="300" 
                value={selectedElement.width || 100} 
                onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
              />
              <span>{selectedElement.width || 100}px</span>
            </div>
            
            <div className="property-field">
              <label>Color:</label>
              <input 
                type="color" 
                value={selectedElement.color || '#000000'} 
                onChange={handleColorChange}
              />
            </div>
          </>
        );
        
      case ELEMENT_TYPES.RELATIONSHIP:
        return (
          <>
            <div className="property-field">
              <label>Relationship Label:</label>
              <input 
                type="text" 
                value={selectedElement.text || ''} 
                onChange={handleTextChange} 
                placeholder="e.g. Friend, Enemy, Mentor"
              />
            </div>
            
            <div className="property-field">
              <label>Line Color:</label>
              <input 
                type="color" 
                value={selectedElement.color || '#1677ff'} 
                onChange={handleColorChange}
              />
            </div>
          </>
        );
        
      default:
        return <p>Select an element to edit its properties</p>;
    }
  };
  
  return (
    <div className="property-panel">
      <h3>Properties</h3>
      
      <div className="element-type-label">
        {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
      </div>
      
      {renderFields()}
      
      <div className="property-actions">
        <button 
          className="action-button visibility-toggle"
          onClick={() => toggleElementVisibility(selectedElement.id)}
        >
          {selectedElement.hidden ? 'Show Element' : 'Hide Element'}
        </button>
        
        <button 
          className="action-button delete-button"
          onClick={() => removeElement(selectedElement.id)}
        >
          Delete Element
        </button>
      </div>
    </div>
  );
};

export default PropertyPanel;