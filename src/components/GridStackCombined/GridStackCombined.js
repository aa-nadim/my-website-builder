import React, { useEffect, useRef, useState } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack-extra.min.css";
import "./GridStackCombined.css";

const GridStackNestedAdvanced = () => {
  const gridStackRef = useRef(null);
  const [grid, setGrid] = useState(null); // We will store the grid instance
  let count = 0;

  useEffect(() => {
    if (gridStackRef.current) {
      const gridInstance = GridStack.init({
        cellHeight: 70,
        acceptWidgets: true,
        removable: '#trash', // drag-out delete class
        resizable: {
          handles: 'e, se, s, sw, w', // Resizable on certain sides
        },
      }, gridStackRef.current);
      
      // Store grid instance in state
      setGrid(gridInstance);

      // Setup for dragging widgets into the grid
      const insert = [{ h: 2, content: 'new item' }];
      GridStack.setupDragIn('.sidepanel>.grid-stack-item', undefined, insert);

      // Event listener for grid changes
      gridInstance.on('added removed change', function (e, items) {
        let str = '';
        items.forEach(function (item) {
          str += ' (x,y)=' + item.x + ',' + item.y;
        });
        console.log(e.type + ' ' + items.length + ' items:' + str);
      });

      // Add initial nested grids
      let sub1 = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }];
      let sub2 = [{ x: 0, y: 0, h: 2 }, { x: 1, y: 1, w: 2 }];
      [...sub1, ...sub2].forEach((d) => (d.content = String(count++)));

      gridInstance.addWidget({ x: 1, y: 0, w: 4, h: 4, sizeToContent: true, content: "<div>Nested Grid 1</div>", subGridOpts: { children: sub1, id: "sub1_grid", class: "sub1" } });
      gridInstance.addWidget({ x: 5, y: 0, w: 3, h: 4, subGridOpts: { children: sub2, id: "sub2_grid", class: "sub2" } });
    }
  }, []);

  // Function to add a new widget (grid item)
  const addWidget = () => {
    if (grid) {
      // Create a new widget
      const newWidget = document.createElement('div');
      newWidget.className = 'grid-stack-item';
      newWidget.innerHTML = '<div class="grid-stack-item-content">New Widget</div>';

      // Add it to the grid
      grid.addWidget(newWidget, {
        x: 0,
        y: 0,
        w: 4,
        h: 4
      });
    }
  };

  // Function to add a new nested grid
  const addNestedGrid = () => {
    if (grid) {
      let sub = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }];
      sub.forEach((d) => (d.content = String(count++)));

      grid.addWidget({
        x: 0,
        y: 0,
        w: 4,
        h: 4,
        content: "<div>New Nested Grid</div>",
        subGridOpts: { children: sub, id: `sub_grid_${count}`, class: "sub" }
      });
    }
  };

  return (
    <div className=""> 
      <h2>Advanced Nested Grid Demo</h2>
      <div className="row">
        <div className="col-3">
            <button onClick={addWidget}>Add Widget</button>
            <button onClick={addNestedGrid}>Add Nested Grid</button>
      
            <div className="sidepanel">
                <div id="trash" className="sidepanel-item">
                <ion-icon name="trash"></ion-icon>
                <div>Drop here to remove!</div>
                </div>
                <div className="grid-stack-item sidepanel-item">
                <ion-icon name="add-circle"></ion-icon>
                <div>Drag me into the dashboard!</div>
                </div>
            </div>
        </div>

        <div className="col-9 bg-light">
            <div className="grid-stack" ref={gridStackRef}></div>
        </div>
      </div>
    </div>
  );
};

export default GridStackNestedAdvanced;