import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';

function Model({ autoRotate }) {
    const [error, setError] = useState(null);
    const { scene } = useGLTF('/models/mi-smart-tv.glb', undefined, 
        (error) => {
            console.error('Error loading model:', error);
            setError(error);
        }
    );

    if (error) {
        return (
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
        );
    }

    return (
        <primitive 
            object={scene} 
            scale={1.2}
            position={[0, -1, 0]}
        />
    );
}

function TVModelViewer({ autoRotate = false }) {
    return (
        <div className="w-full h-[500px] md:h-[500px]">
            <Canvas camera={{ position: [2, 1.5, 2.5], fov: 50 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[2, 5, 2]} intensity={1.5} />
                <Suspense fallback={
                    <mesh>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="gray" />
                    </mesh>
                }>
                    <Model autoRotate={autoRotate} />
                </Suspense>
                <OrbitControls 
                    enableZoom={false} 
                    autoRotate={autoRotate}
                    autoRotateSpeed={2.5}
                    enablePan={false}
                />
            </Canvas>
        </div>
    );
}

export default TVModelViewer;
