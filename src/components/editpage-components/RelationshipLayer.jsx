import React from 'react';
import { calculateRelationshipPosition } from '../../utils/helpers';
import { ELEMENT_TYPES } from '../../constants/elementTypes';
import '../styles/editpage.css';

function RelationshipLayer({
  elements,
  selectedElements,
  handleSelectElement,
  updateElement,
  removeElement // ✅ เพิ่มเข้ามา
}) {
  const getElementById = (id) => elements.find(el => el.id === id);

  const validRelationships = elements
    .filter(element =>
      element.type === ELEMENT_TYPES.RELATIONSHIP &&
      !element.hidden &&
      element.sourceId &&
      element.targetId &&
      getElementById(element.sourceId) &&
      getElementById(element.targetId) &&
      !getElementById(element.sourceId).hidden &&
      !getElementById(element.targetId).hidden
    )
    .map(relationship => {
      const position = calculateRelationshipPosition(relationship, elements);
      return { relationship, position, isValid: !!position };
    });

  const renderArrowMarker = () => (
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#1677ff" />
      </marker>
    </defs>
  );

  return (
    <svg className="relationships-layer">
      {renderArrowMarker()}

      {validRelationships
        .filter(rel => rel.isValid)
        .map(({ relationship, position }) => {
          if (!position) return null;

          const { x1, y1, x2, y2 } = position;
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
          const isVertical = Math.abs(angle) > 45 && Math.abs(angle) < 135;
          const isSelected = selectedElements.includes(relationship.id);
          const labelOffset = isVertical ? 25 : 15;
          
          const isChild = relationship.relationshipType === 'child-of';
          const color = isChild ? '#fa541c' : '#1677ff';
          const label = relationship.text || (isChild ? 'child of' : '');


          return (
            <g key={relationship.id}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={relationship.color || "#1677ff"}
                strokeWidth={isSelected ? 3 : 2}
                markerEnd={relationship.directed ? "url(#arrowhead)" : ""}
                className={`relationship-line ${isSelected ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectElement(relationship.id);
                }}
              />

              {(relationship.text || isSelected) && (
                <foreignObject
                  x={midX - 60}
                  y={isVertical ? midY - labelOffset : midY - 15}
                  width={120}
                  height={30}
                  className="relationship-label-container"
                >
                  <input
                    type="text"
                    value={relationship.text || ''}
                    placeholder="Relationship type"
                    className={`relationship-label ${isSelected ? 'editing' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectElement(relationship.id);
                    }}
                    onChange={(e) => updateElement(relationship.id, { text: e.target.value })}
                    readOnly={!isSelected}
                  />
                </foreignObject>
              )}

              {isSelected && (
                <foreignObject
                  x={midX + 65}
                  y={midY - 15}
                  width={30}
                  height={30}
                >
                  <button
                    className="relationship-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(relationship.id); // ✅ เรียกใช้จริง
                    }}
                  >
                    ×
                  </button>
                </foreignObject>
              )}
            </g>
          );
        })}
    </svg>
  );
}

export default RelationshipLayer;
