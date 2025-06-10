import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useState } from 'react';

// Model component with responsive scaling
function Model({ autoRotate }) {
    const [error, setError] = useState(null);
    const { scene } = useGLTF('/models/mi-smart-tv.glb', undefined, 
        (err) => {
            console.error('Error loading model:', err);
            setError(err);
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

function ResponsiveCanvas({ autoRotate }) {
    const { size } = useThree();
    const isMobile = size.width < 768;

    return (
        <>
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
        </>
    );
}

function TVModelViewer({ autoRotate = false }) {
    return (
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[500px]">
            <Canvas camera={{ position: [2, 1.5, 2.5], fov: 50 }}>
                <ResponsiveCanvas autoRotate={autoRotate} />
            </Canvas>
        </div>
    );
}

export default TVModelViewer;
