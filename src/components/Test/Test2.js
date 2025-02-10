import React, { useEffect, useRef, useState } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack-extra.min.css";
import "./Test.css";

const GridStackNestedAdvanced = () => {
  const gridStackRef = useRef(null);
  const [grid, setGrid] = useState(null); // We will store the grid instance
  let count = 0;

  useEffect(() => {
    if (gridStackRef.current) {
      const gridInstance = GridStack.init(
        {
          cellHeight: 70,
          acceptWidgets: true,
          removable: "#trash", // drag-out delete class
          resizable: {
            handles: "e, se, s, sw, w", // Resizable on certain sides
          },
        },
        gridStackRef.current
      );

      // Store grid instance in state
      setGrid(gridInstance);

      // Setup for dragging widgets into the grid
      const insert = [{ h: 2, content: "new item" }];
      GridStack.setupDragIn(".sidepanel>.grid-stack-item", undefined, insert);

      // Event listener for grid changes
      gridInstance.on("added removed change", function (e, items) {
        let str = "";
        items.forEach(function (item) {
          str += " (x,y)=" + item.x + "," + item.y;
        });
        console.log(e.type + " " + items.length + " items:" + str);
      });

      // Add initial nested grids
      let sub1 = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];
      let sub2 = [
        { x: 0, y: 0, h: 2 },
        { x: 1, y: 1, w: 2 },
      ];
      [...sub1, ...sub2].forEach((d) => (d.content = String(count++)));
      gridInstance.addWidget({
        x: 1,
        y: 0,
        w: 4,
        h: 4,
        sizeToContent: true,
        content: "<div>Nested Grid 1</div>",
        subGridOpts: { children: sub1, id: "sub1_grid", class: "sub1" },
      });
      gridInstance.addWidget({
        x: 5,
        y: 0,
        w: 3,
        h: 4,
        subGridOpts: { children: sub2, id: "sub2_grid", class: "sub2" },
      });
    }
  }, []);

  // Function to add a new widget (grid item)
  const addWidget = () => {
    if (grid) {
      const newWidget = document.createElement("div");
      newWidget.className = "grid-stack-item";
      newWidget.innerHTML =
        '<div class="grid-stack-item-content">New Widget</div>';
      grid.addWidget(newWidget, {
        x: 0,
        y: 0,
        w: 4,
        h: 4,
      });
    }
  };

  // Function to add a new nested grid
  const addNestedGrid = () => {
    if (grid) {
      let sub = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];
      sub.forEach((d) => (d.content = String(count++)));
      grid.addWidget({
        x: 0,
        y: 0,
        w: 4,
        h: 4,
        content: "<div>New Nested Grid</div>",
        subGridOpts: { children: sub, id: `sub_grid_${count}`, class: "sub" },
      });
    }
  };

  // Function to save the current grid's HTML structure
  const saveHTML = () => {
    if (grid) {
      const gridContainer = gridStackRef.current;
      const innerContent = gridContainer.innerHTML;
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>New Website</title>
</head>
<body>
  <h2>New Website</h2>
  <div class="container">${innerContent}</div>
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "grid.html";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Function to load an HTML file into the grid
  const loadHTML = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        grid.removeAll(); // Clear the current grid
        gridStackRef.current.innerHTML = content; // Load the new HTML
        grid.load(grid.getGridItems()); // Reinitialize the grid with loaded items
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="">
      <div className="row">
        {/* Sidebar */}
        <div className="col-3 sidepanel">
          <div className="grid-stack-item sidepanel-item">
            <button onClick={addWidget}>Add Widget</button>
          </div>
          <div className="grid-stack-item sidepanel-item">
            <button onClick={addNestedGrid}>Add Nested Grid</button>
          </div>
          <div className="grid-stack-item sidepanel-item">
            <ion-icon name="add-circle"></ion-icon>
            <div>Drag me into the dashboard!</div>
          </div>
          <div id="trash" className="sidepanel-item">
            <ion-icon name="trash"></ion-icon>
            <div>Drop here to remove!</div>
          </div>
        </div>

        {/* Main Grid Area */}
        <div className="col-9 bg-light d-flex flex-column" style={{ minHeight: "100vh" }}>
          <div className="grid-stack flex-grow-1" ref={gridStackRef}></div>
        </div>
      </div>

      {/* Fixed Buttons */}
      <div
        className="d-flex justify-content-end align-items-end p-3"
        style={{
          position: "fixed",
          bottom: "0",
          right: "0",
          zIndex: "1000",
        }}
      >
        <button onClick={saveHTML} className="btn btn-primary">
          Save HTML
        </button>
        <input
          type="file"
          accept=".html"
          onChange={loadHTML}
          className="btn btn-primary ms-2"
          style={{ marginTop: "10px" }}
        />
      </div>
    </div>
  );
};

export default GridStackNestedAdvanced;