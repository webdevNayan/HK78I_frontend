import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import './App.css';

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


const App = () => {
  const [widgets, setWidgets] = React.useState([]);
  const [selectedWidget, setSelectedWidget] = React.useState(null);
  const [widgetText, setWidgetText] = React.useState('');
  const [buttonText, setButtonText] = React.useState('');
  const [buttonRadius, setButtonRadius] = React.useState('');

  const handleDrop = (type) => {
    setWidgets([...widgets, { type }]);
  };

  const handleSave = async () => {
    try {
      let newWidget;
  
      if (selectedWidget === 'button') {
        newWidget = {
          widget: selectedWidget,
          text: buttonText,
          'border-radius': buttonRadius,
        };
      } else if (selectedWidget === 'textbox') {
        newWidget = {
          widget: selectedWidget,
          text: widgetText,
        };
      } else {
        // Assuming the widgets array contains both 'button' and 'textbox'
        newWidget = widgets.map((widget) => {
          if (widget.type === 'button') {
            return {
              widget: widget.type,
              text: buttonText,
              'border-radius': buttonRadius,
            };
          } else if (widget.type === 'textbox') {
            return {
              widget: widget.type,
              text: widgetText,
            };
          }
          return null;
        });
      }
  
      await axios.post('http://localhost:5000/api/widgets', newWidget);
      alert('Widget data saved successfully!');
    } catch (error) {
      console.error('Error saving widget data:', error);
      alert('Error saving widget data. Please try again.');
    }
  };
  
  const handleClear = () => {
    setWidgets([]);
    setSelectedWidget(null);
    setWidgetText('');
    setButtonText('');
    setButtonRadius('');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="left-section">
          <h2>Left Section</h2>
          <DraggableWidget type="textbox" onDrop={handleDrop} />
          <DraggableWidget type="button" onDrop={handleDrop} />
        </div>
        <div className="middle-section">
          <h2>Middle Section</h2>
          <DroppableWidget onDrop={(item) => setSelectedWidget(item)} items={widgets} />
        </div>
        <div className="right-section">
          <h2>Right Section</h2>
          {selectedWidget && (
            <div>
              <h3>{selectedWidget} Properties:</h3>
              {selectedWidget === 'textbox' && (
                <>
                  <label>Text:</label>
                  <input
                    type="text"
                    value={widgetText}
                    onChange={(e) => setWidgetText(e.target.value)}
                  />
                </>
              )}
              {selectedWidget === 'button' && (
                <>
                  <label>Button Text:</label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                  />
                  <br />
                  <label>Button Radius:</label>
                  <input
                    type="text"
                    value={buttonRadius}
                    onChange={(e) => setButtonRadius(e.target.value)}
                  />
                </>
              )}
              <br />
              <button onClick={handleSave}>Save</button>
              <button onClick={handleClear}>Clear</button>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
