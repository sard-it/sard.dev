import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

function FastShaderBlob() {
  const meshRef = useRef(null);
  const materialRef = useRef(null);

  const geometry = useMemo(() => new THREE.SphereGeometry(1.3, 64, 64), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.3;
      meshRef.current.rotation.y = t * 0.3;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vNormal = normalMatrix * normal;
            vec3 pos = position;

            float speed = 1.2;
            float distortion = sin(pos.x * 2.5 + uTime * speed) * cos(pos.y * 2.5 + uTime * 0.9) * 0.25
                             + cos(pos.z * 2.0 + uTime * 1.1) * 0.15;

            pos += normal * distortion;
            vPosition = pos;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = vec3(0.0, 0.0, 1.0);

            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

            vec3 orangeColor = vec3(0.937, 0.612, 0.0); // Brand Orange #ef9c00
            vec3 goldColor   = vec3(1.0, 0.8, 0.2);
            vec3 cyanAccent  = vec3(0.1, 0.7, 0.9);

            float noise = sin(vPosition.x * 3.0 + vPosition.y * 3.0 + uTime * 1.5) * 0.5 + 0.5;
            vec3 base = mix(orangeColor, goldColor, noise);
            vec3 color = mix(base, cyanAccent, fresnel * 0.5);

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export const AnimatedBlob = ({ width = "md:w-full", height = "h-[300px]" }) => {
  return (
    <div className={`${width} ${height}`}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[3, 3, 3]} intensity={1.5} />
        <FastShaderBlob />
      </Canvas>
    </div>
  );
};