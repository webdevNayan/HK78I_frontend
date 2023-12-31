import React from 'react';
import DraggableWidget from './components/DraggableWidget';
import DroppableWidget from './components/DroppableWidget';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import './App.css';
import Swal from 'sweetalert2'


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
          borderRadius: buttonRadius,
        };
      } else if (selectedWidget === 'textbox') {
        newWidget = {
          widget: selectedWidget,
          text: widgetText,
        };
      }
  
      await axios.post('http://localhost:5000/api/widgets', newWidget);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Widget data saved successfully!',
        showConfirmButton: true,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error saving widget data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="#">Error saving widget data. Please try again.</a>',
      });
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
          <h2>Left Section <br/> <small> (Widgets) </small></h2>
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
              <button onClick={handleClear}>Reset Default</button>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
