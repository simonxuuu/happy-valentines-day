'use client'
import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

const FlowerCreator = () => {
  const [availableFlowers] = useState([
    { id: 'rose', name: 'Rose', imageUrl: '/flowers/rose.png' },
    { id: 'tulip', name: 'Tulip', imageUrl: '/flowers/tulip.png' },
    { id: 'lily', name: 'Lily', imageUrl: '/flowers/lily.png' },
  ]);

  const [availableVases] = useState([
    { id: 'vase1', name: 'Vase 1', imageUrl: '/vases/vase1.png' },
    { id: 'vase2', name: 'Vase 2', imageUrl: '/vases/vase2.png' },
    { id: 'vase3', name: 'Vase 3', imageUrl: '/vases/vase3.png' },
  ]);

  const [selectedVase, setSelectedVase] = useState(null);
  const [placedFlowers, setPlacedFlowers] = useState([]);
  const bouquetCanvasRef = useRef(null);
  const flowerRefs = useRef([]);
  const isNewFlowerRef = useRef(true);

  useEffect(() => {
    // Any client-side code can go here
  }, []);

  const handleDragStart = (flowerId) => {
    isNewFlowerRef.current = !placedFlowers.some(flower => flower.id === flowerId);
  };

  const handleDragStop = (e, data, flower) => {
    if (isNewFlowerRef.current) {
      const canvasRect = bouquetCanvasRef.current.getBoundingClientRect();
      const newFlower = {
        id: uuidv4(),
        type: flower.id,
        name: flower.name,
        imageUrl: flower.imageUrl,
        x: data.lastX - canvasRect.left,
        y: data.lastY - canvasRect.top,
      };
      setPlacedFlowers((prevFlowers) => [...prevFlowers, newFlower]);
    }
  };

  const handleDrag = (e, data, flowerId) => {
    setPlacedFlowers((prevFlowers) =>
      prevFlowers.map((flower) =>
        flower.id === flowerId ? { ...flower, x: data.x, y: data.y } : flower
      )
    );
  };

  const handleVaseSelect = (vase) => {
    setSelectedVase(vase);
  };

  return (
    <div className="flower-creator-container">
      <div className="flower-library">
        <h3>Flower Library</h3>
        <ul className="flower-list">
          {availableFlowers.map((flower, index) => {
            flowerRefs.current[index] = flowerRefs.current[index] || React.createRef();
            return (
              <Draggable
                key={flower.id}
                onStart={() => handleDragStart(flower.id)}
                onStop={(e, data) => handleDragStop(e, data, flower)}
                position={{ x: 0, y: 0 }}
                nodeRef={flowerRefs.current[index]}
                handle=".drag-handle"
              >
                <li className="flower-item" ref={flowerRefs.current[index]}>
                  <div className="drag-handle" style={{ cursor: 'grab' }}>
                    <Image
                      src={flower.imageUrl}
                      alt={flower.name}
                      width={50}
                      height={50}
                      style={{ userSelect: 'none' }}
                      draggable="false"
                    />
                    <span>{flower.name}</span>
                  </div>
                </li>
              </Draggable>
            );
          })}
        </ul>
      </div>

      <div className="vase-library">
        <h3>Choose a Vase</h3>
        <ul className="vase-list">
          {availableVases.map((vase) => (
            <li key={vase.id} className="vase-item" onClick={() => handleVaseSelect(vase)}>
              <Image
                src={vase.imageUrl}
                alt={vase.name}
                width={50}
                height={50}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                draggable="false"
              />
              <span>{vase.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bouquet-canvas" ref={bouquetCanvasRef}>
        <h3>Create Your Bouquet</h3>
        {selectedVase && (
          <div className="selected-vase" style={{ zIndex: 10 }}>
            <Image
              src={selectedVase.imageUrl}
              alt={selectedVase.name}
              width={100}
              height={100}
              style={{ userSelect: 'none' }}
              draggable="false"
            />
          </div>
        )}
        {placedFlowers.map((flower, index) => {
          flowerRefs.current[index] = flowerRefs.current[index] || React.createRef();
          return (
            <Draggable
              key={flower.id}
              onStart={() => handleDragStart(flower.id)}
              onDrag={(e, data) => handleDrag(e, data, flower.id)}
              onStop={(e, data) => handleDragStop(e, data, flower)}
              position={{ x: flower.x, y: flower.y }}
              nodeRef={flowerRefs.current[index]}
              handle=".drag-handle"
            >
              <div ref={flowerRefs.current[index]} style={{ position: 'absolute', zIndex: 5 }}>
                <div className="drag-handle" style={{ cursor: 'grab' }}>
                  <Image
                    src={flower.imageUrl}
                    alt={flower.name}
                    width={80}
                    height={80}
                    style={{ userSelect: 'none' }}
                    draggable="false"
                  />
                </div>
              </div>
            </Draggable>
          );
        })}
      </div>

      <style jsx>{`
        .flower-creator-container {
          display: flex;
          gap: 20px;
          padding: 20px;
        }

        .flower-library, .vase-library {
          border: 1px solid #ccc;
          padding: 15px;
          width: 200px;
        }

        .flower-list, .vase-list {
          list-style: none;
          padding: 0;
        }

        .flower-item, .vase-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          cursor: pointer;
        }

        .bouquet-canvas {
          border: 1px solid #ccc;
          min-height: 400px;
          width: 600px;
          position: relative;
        }

        .selected-vase {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>
    </div>
  );
};

export default FlowerCreator;