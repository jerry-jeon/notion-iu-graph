import { useState } from 'react';

// Define a type for the pages
interface Page {
    id: string;
    title: string;
    urgency: number;
    importance: number;
}

const fakePages: Page[] = [
    {
        id: '1',
        title: 'Task 1',
        urgency: 1,
        importance: 1
    },
    {
        id: '2',
        title: 'Task 3',
        urgency: 1,
        importance: 1,
    },
    {
        id: '3',
        title: 'qwe',
        urgency: 1,
        importance: -1
    },
    {
        id: '4',
        title: 'asd',
        urgency: 1,
        importance: -1,
    },
    {
        id: '5',
        title: 'Task 1',
        urgency: -1,
        importance: -1
    },
    {
        id: '6',
        title: 'Task 3',
        urgency: -1,
        importance: 1,
    },
    {
        id: '7',
        title: 'Task 2',
        urgency: -1,
        importance: 1,
    },
    {
        id: '8',
        title: 'UD#1',
        urgency: 0,
        importance: 0,
    },
    {
        id: '9',
        title: 'UD#2',
        urgency: 0,
        importance: 0,
    },
    {
        id: '10',
        title: 'UD#3',
        urgency: 0,
        importance: 0,
    },
];

// Define the return type for divideByDimensions
function divideByDimensions(
  pages: Page[],
  dimensionChooser: (page: Page) => number
): Page[][] {
    const dimensions: Page[][] = [[], [], [], [], []]; // Last one is undefined

    pages.forEach((page) => {
        dimensions[dimensionChooser(page)].push(page);
    });

    return dimensions;
}

// Define the type for dimensionChooser function
const dimensionChooser = (page: Page): number => {
    const getXFunction = (page: Page) => page.importance === 1;
    const getYFunction = (page: Page) => page.urgency === 1;

    if (page.importance === 0 && page.urgency === 0) return 4;

    // Dimension 3: Low Low
    if (!getXFunction(page) && !getYFunction(page)) {
        return 2;
    } else if (getXFunction(page) && getYFunction(page)) {
        // Dimension 2: High High
        return 1;
    } else if (!getXFunction(page) && getYFunction(page)) {
        // Dimension 1: Low High
        return 0;
    } else if (getXFunction(page) && !getYFunction(page)) {
        // Dimension 4: High Low
        return 3;
    } else {
        return 4;
    }
};

// Define the props types for Graph
interface GraphProps {
    itemByDimensions: Page[][];
    moveToDimension: (page: Page, dimension: number) => void;
}

// Component to render the graph
const Graph = ({ itemByDimensions, moveToDimension }: GraphProps) => {
    return (
      <div className="container">
          <div className="undefined-list">
              {itemByDimensions[4].map((page, index) => (
                <div className="table-cell" key={index}>
                    {page.title}
                </div>
              ))}
          </div>
          <div className="graph-container">
              <div className="header">
                  <div className="space-left">
                      {itemByDimensions[0].map((page, index) => (
                        <div className="table-cell" key={index}>
                            {page.title}
                        </div>
                      ))}
                  </div>
                  <div className="space-right">
                      {itemByDimensions[1].map((page, index) => (
                        <div className="table-cell" key={index}>
                            {page.title}
                        </div>
                      ))}
                  </div>
              </div>
              <div className="header">
                  <div className="space-left">
                      {itemByDimensions[2].map((page, index) => (
                        <div className="table-cell" key={index}>
                            {page.title}
                        </div>
                      ))}
                  </div>
                  <div className="space-right">
                      <div>
                          {itemByDimensions[3].map((page, index) => (
                            <div className="table-cell" key={index}>
                                {page.title}
                            </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
};

// Main component
const IUGraph = () => {
    const [pages, setPages] = useState<Page[]>(fakePages);

    const dimensions = divideByDimensions(pages, dimensionChooser);

    const moveToDimension = (page: Page, dimension: number) => {
        if (dimension === 0) {
            page.importance = -1;
            page.urgency = 1;
        }
        if (dimension === 1) {
            page.importance = 1;
            page.urgency = 1;
        }
        if (dimension === 2) {
            page.importance = -1;
            page.urgency = -1;
        }
        if (dimension === 3) {
            page.importance = 1;
            page.urgency = -1;
        }
    };

    return <Graph itemByDimensions={dimensions} moveToDimension={moveToDimension} />;
};

export default IUGraph;
