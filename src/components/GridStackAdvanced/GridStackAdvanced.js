import React, { useEffect } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GridStackAdvanced.css"; 

const GridStackAdvanced = () => {
  useEffect(() => {
    const children = [
      { x: 0, y: 0, w: 4, h: 2, content: "1" },
      {
        x: 4,
        y: 0,
        w: 4,
        h: 4,
        locked: true,
        content: "I can't be moved or dragged, nor pushed by others!<br><ion-icon name='lock-closed'></ion-icon>",
      },
      {
        x: 8,
        y: 0,
        w: 2,
        h: 2,
        minW: 2,
        noResize: true,
        content: `<p class="text-center">Drag me!</p><p class="text-center"><ion-icon name="hand"></ion-icon></p><p class="text-center">...but don't resize me!</p>`,
      },
      { x: 10, y: 0, w: 2, h: 2, content: "4" },
      { x: 0, y: 2, w: 2, h: 2, content: "5" },
      { x: 2, y: 2, w: 2, h: 4, content: "6" },
      { x: 8, y: 2, w: 4, h: 2, content: "7" },
      { x: 0, y: 4, w: 2, h: 2, content: "8" },
      { x: 4, y: 4, w: 4, h: 2, content: "9" },
      { x: 8, y: 4, w: 2, h: 2, content: "10" },
      { x: 10, y: 4, w: 2, h: 2, content: "11" },
    ];
    const insert = [{ h: 2, content: "new item" }];

    const grid = GridStack.init({
      cellHeight: 70,
      acceptWidgets: true,
      removable: "#trash", // Enable dragging out to remove
      children,
    });

    GridStack.setupDragIn(".sidepanel>.grid-stack-item", undefined, insert);

    grid.on("added removed change", function (e, items) {
      let str = "";
      items.forEach((item) => (str += ` (x,y)=${item.x},${item.y}`));
      console.log(`${e.type} ${items.length} items: ${str}`);
    });

    return () => grid.destroy(); // Cleanup on unmount
  }, []);

  return (
    <div className="container-fluid">
      <h2>Advanced Grid Demo</h2>
      <div className="row">
        {/* Sidebar with Drag Items */}
        <div className="sidepanel col-md-2 d-none d-md-block">
          <div id="trash" className="sidepanel-item">
            <ion-icon name="trash"></ion-icon>
            <div>Drop here to remove!</div>
          </div>
          <div className="grid-stack-item sidepanel-item">
            <ion-icon name="add-circle"></ion-icon>
            <div>Drag me into the dashboard!</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="col-md-10">
          <div className="grid-stack"></div>
        </div>
      </div>
    </div>
  );
};

export default GridStackAdvanced;
