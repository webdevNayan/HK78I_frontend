import React from 'react'
import { useDrag} from 'react-dnd';
import "../App.css"

const DraggableWidget = ({ type, onDrop }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'draggable-widget',
      item: { type },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
  
    return (
      <div
        ref={drag}
        className={`draggable-widget ${isDragging ? 'dragging' : ''}`}
        onClick={() => onDrop(type)}
      >
        {type}
      </div>
    );
  };

export default DraggableWidget;