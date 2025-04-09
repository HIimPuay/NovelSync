import React from 'react';
import { ELEMENT_TYPES, CHARACTER_TYPES } from '../../constants/elementTypes';
import '../styles/editpage.css';

function StyleDropdown({ isOpen, selectedElement, setCharacterType }) {
  const shouldShow = isOpen && selectedElement?.type === ELEMENT_TYPES.CIRCLE;
  
  return (
    <div className={`style-dropdown ${shouldShow ? "open" : ""}`}>
      <ul>
        <li>
          <a href="#" onClick={() => selectedElement && setCharacterType(selectedElement.id, CHARACTER_TYPES.HERO)}>
            Hero
          </a>
        </li>
        <li>
          <a href="#" onClick={() => selectedElement && setCharacterType(selectedElement.id, CHARACTER_TYPES.VILLAIN)}>
            Villain
          </a>
        </li>
        <li>
          <a href="#" onClick={() => selectedElement && setCharacterType(selectedElement.id, CHARACTER_TYPES.SUPPORTER)}>
            Supporter
          </a>
        </li>
        <li>
          <a href="#" onClick={() => selectedElement && setCharacterType(selectedElement.id, CHARACTER_TYPES.NEUTRAL)}>
            Neutral
          </a>
        </li>
      </ul>
    </div>
  );
}

export default StyleDropdown;