import React, { useEffect, useRef, useState } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack-extra.min.css";
import "./GridStackNested.css";

const GridStackNested = () => {
  const gridRef = useRef(null);
  const [grid, setGrid] = useState(null);
  let count = 0;

  useEffect(() => {
    if (gridRef.current) {
      let sub1 = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }];
      let sub2 = [{ x: 0, y: 0, h: 2 }, { x: 1, y: 1, w: 2 }];
      [...sub1, ...sub2].forEach((d) => (d.content = String(count++)));

      let options = {
        staticGrid: false,
        cellHeight: 50,
        margin: 5,
        minRow: 2,
        acceptWidgets: true,
        id: "main",
        resizable: { handles: "se,e,s,sw,w" },
        children: [
          { x: 0, y: 0, content: "regular item" },
          { x: 1, y: 0, w: 4, h: 4, sizeToContent: true, content: "<div>Nested Grid 1</div>", subGridOpts: { children: sub1, id: "sub1_grid", class: "sub1" } },
          { x: 5, y: 0, w: 3, h: 4, subGridOpts: { children: sub2, id: "sub2_grid", class: "sub2" } },
        ],
      };

      let newGrid = GridStack.addGrid(gridRef.current, options);
      setGrid(newGrid);
    }
  }, []);

  const addWidget = () => {
    if (grid) {
      grid.addWidget({ x: 0, y: 100, content: "New Item" });
    }
  };

  return (
    <div>
      <h2>Nested Grids Demo</h2>
      <button onClick={addWidget}>Add Widget</button>
      <div ref={gridRef} className="grid-stack"></div>
    </div>
  );
};

export default GridStackNested;
