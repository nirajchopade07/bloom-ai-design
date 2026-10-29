import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { calculatePetalAngle } from '../utils/botanicalData';
import { Maximize2, RotateCcw, Eye, Play, Pause, Sparkles } from 'lucide-react';

interface FloraCanvas3DProps {
  bloomFactor?: number;
  onBloomChange?: (val: number) => void;
  showControls?: boolean;
  className?: string;
  wireframe?: boolean;
  specimenName?: string;
}

export const FloraCanvas3D: React.FC<FloraCanvas3DProps> = ({
  bloomFactor = 0.85,
  onBloomChange,
  showControls = true,
  className = '',
  wireframe: initialWireframe = false,
  specimenName = 'Crystalline Orchid v4.2'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [internalBloom, setInternalBloom] = useState(bloomFactor);
  const [isRotating, setIsRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(initialWireframe);
  const [viewMode, setViewMode] = useState<'refraction' | 'vascular' | 'geometry'>('refraction');

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const flowerGroupRef = useRef<THREE.Group | null>(null);
  const petalMeshesRef = useRef<{ mesh: THREE.Mesh; layerIdx: number; petalIdx: number; totalPetals: number }[]>([]);
  const stamenGroupRef = useRef<THREE.Group | null>(null);
  const vascularLinesRef = useRef<THREE.LineSegments | null>(null);

  // Mouse drag state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  const activeBloom = onBloomChange ? bloomFactor : internalBloom;

  // Update petal angles when activeBloom or viewMode changes
  const updatePetals = useCallback((factor: number) => {
    petalMeshesRef.current.forEach(({ mesh, layerIdx, petalIdx, totalPetals }) => {
      const { rotationZ, rotationX, scale } = calculatePetalAngle(layerIdx, petalIdx, totalPetals, factor);
      mesh.rotation.z = rotationZ;
      mesh.rotation.x = rotationX;
      mesh.scale.set(scale, scale * (1 + factor * 0.4), scale);
    });

    if (stamenGroupRef.current) {
      stamenGroupRef.current.scale.setScalar(0.7 + factor * 0.5);
    }
  }, []);

  useEffect(() => {
    updatePetals(activeBloom);
  }, [activeBloom, updatePetals]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight2.position.set(-5, -6, -4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 2.5, 10);
    pointLight.position.set(0, 0, 1);
    scene.add(pointLight);

    // Flower Root Group
    const flowerGroup = new THREE.Group();
    flowerGroupRef.current = flowerGroup;
    scene.add(flowerGroup);

    // Create Petal Geometry
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.65, 0.9, 0.55, 2.0);
    petalShape.quadraticCurveTo(0.3, 2.5, 0, 2.85);
    petalShape.quadraticCurveTo(-0.3, 2.5, -0.55, 2.0);
    petalShape.quadraticCurveTo(-0.65, 0.9, 0, 0);

    const extrudeSettings = {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.02,
      bevelThickness: 0.02
    };

    const petalGeometry = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
    petalGeometry.center();

    // Petal Materials (Translucent Glass vs Vascular vs Wireframe)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.1,
      transmission: 0.92,
      ior: 1.5,
      thickness: 0.6,
      transparent: true,
      opacity: 0.85,
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      wireframe: isWireframe,
      side: THREE.DoubleSide
    });

    const petalMeshes: { mesh: THREE.Mesh; layerIdx: number; petalIdx: number; totalPetals: number }[] = [];

    // Construct 4 concentric layers
    const layerConfigs = [
      { layer: 0, count: 6, radius: 0.35, scale: 0.65 },
      { layer: 1, count: 8, radius: 0.6, scale: 0.85 },
      { layer: 2, count: 10, radius: 0.95, scale: 1.1 },
      { layer: 3, count: 12, radius: 1.35, scale: 1.35 }
    ];

    layerConfigs.forEach(({ layer, count, radius, scale }) => {
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(petalGeometry, glassMaterial);
        const baseAngle = (i / count) * Math.PI * 2;
        mesh.position.x = Math.cos(baseAngle) * radius;
        mesh.position.y = Math.sin(baseAngle) * radius;
        mesh.position.z = -layer * 0.18;

        const { rotationZ, rotationX } = calculatePetalAngle(layer, i, count, activeBloom);
        mesh.rotation.z = rotationZ;
        mesh.rotation.x = rotationX;
        mesh.scale.set(scale, scale, scale);

        flowerGroup.add(mesh);
        petalMeshes.push({ mesh, layerIdx: layer, petalIdx: i, totalPetals: count });
      }
    });

    petalMeshesRef.current = petalMeshes;

    // Stamen center
    const stamenGroup = new THREE.Group();
    stamenGroupRef.current = stamenGroup;

    const coreGeo = new THREE.IcosahedronGeometry(0.32, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
      wireframe: isWireframe
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    stamenGroup.add(coreMesh);

    // Stamen filaments
    for (let f = 0; f < 18; f++) {
      const filGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 6);
      const filMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: isWireframe });
      const filament = new THREE.Mesh(filGeo, filMat);
      const theta = (f / 18) * Math.PI * 2;
      filament.position.set(Math.cos(theta) * 0.2, Math.sin(theta) * 0.2, 0.25);
      filament.rotation.z = theta;
      filament.rotation.x = 0.35;
      stamenGroup.add(filament);
    }

    flowerGroup.add(stamenGroup);

    // Vascular wire lattice
    const wireGeo = new THREE.WireframeGeometry(petalGeometry);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
    const wireSegments = new THREE.LineSegments(wireGeo, wireMat);
    vascularLinesRef.current = wireSegments;

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let elapsedTime = 0;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      elapsedTime += delta;

      if (isRotating && flowerGroupRef.current) {
        flowerGroupRef.current.rotation.y += delta * 0.35;
        flowerGroupRef.current.rotation.x = Math.sin(elapsedTime * 0.4) * 0.18 + 0.35;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
      petalGeometry.dispose();
      glassMaterial.dispose();
      coreGeo.dispose();
      coreMat.dispose();
    };
  }, [isRotating, isWireframe]);

  // Pointer drag to orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !flowerGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    flowerGroupRef.current.rotation.y += deltaX * 0.01;
    flowerGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInternalBloom(val);
    if (onBloomChange) {
      onBloomChange(val);
    }
  };

  return (
    <div className={`relative flex flex-col w-full h-full select-none ${className}`}>
      {/* 3D Canvas Viewport */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full min-h-[260px] cursor-grab active:cursor-grabbing relative overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Specimen HUD Tag */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs text-white/80 font-medium tracking-tight">
            {specimenName}
          </span>
          <span className="text-[10px] text-white/40 uppercase tracking-widest">
            3D Spatial Voxel
          </span>
        </div>

        {/* Viewport Action Controls */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            aria-label={isRotating ? "Pause rotation" : "Start rotation"}
            className="liquid-glass rounded-full w-8 h-8 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setIsWireframe(!isWireframe)}
            aria-label="Toggle wireframe mesh"
            className={`liquid-glass rounded-full w-8 h-8 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer ${
              isWireframe ? 'bg-white/20' : ''
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="absolute bottom-2 right-3 z-10 pointer-events-none text-[10px] text-white/40">
          Drag to orbit 3D geometry
        </div>
      </div>

      {/* Growth Bloom Slider & Parameters */}
      {showControls && (
        <div className="liquid-glass rounded-2xl p-3.5 flex flex-col gap-2.5 mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              Morphological Growth
            </span>
            <span className="text-white font-mono">{Math.round(activeBloom * 100)}% Bloom</span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={activeBloom}
            onChange={handleSliderChange}
            aria-label="Growth bloom factor"
            className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer appearance-none"
          />

          <div className="flex items-center justify-between text-[11px] text-white/50 pt-0.5">
            <span>Seed Dormant</span>
            <span>Unfolding</span>
            <span>Full Optical Bloom</span>
          </div>
        </div>
      )}
    </div>
  );
};
