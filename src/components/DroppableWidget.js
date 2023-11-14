import React from "react";
import { useDrop} from 'react-dnd';
import "../App.css"

const DroppableWidget = ({ onDrop, items }) => {
    const [, drop] = useDrop({
      accept: 'draggable-widget',
      drop: (item) => onDrop(item.type),
    });
  
    return (
      <div
        ref={drop}
        className="droppable-widget"
        style={{
          padding: '8px',
          margin: '4px',
          border: '1px dashed #ddd',
        }}
      >
        {items.map((item, index) => (
          <div key={index} onClick={() => onDrop(item.type)}>
            {item.type}
          </div>
        ))}
        Drop Here
      </div>
    );
  };
  

  
  export default DroppableWidget