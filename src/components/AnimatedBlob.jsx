import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

function FastShaderBlob() {
  const meshRef = useRef(null);
  const materialRef = useRef(null);

  const geometry = useMemo(() => new THREE.SphereGeometry(1.2, 64, 64), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = -1.33 + Math.sin(t * 0.3) * 0.2;
      meshRef.current.rotation.y = -0.13 + t * 0.2;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      cameraPosition: { value: new THREE.Vector3(0, 0, 4) },
    }),
    []
  );

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;

          void main() {
            vec3 pos = position;
            
            float frequency = 2.0;
            float speed = 1.2;
            
            float w1 = sin(pos.x * frequency + uTime * speed) * cos(pos.y * frequency + uTime * 0.8) * 0.25;
            float w2 = cos(pos.y * 1.5 + uTime * 0.9) * sin(pos.z * 1.5 + uTime * 1.1) * 0.2;
            float w3 = sin(pos.z * frequency + uTime * 0.7) * cos(pos.x * 1.5 + uTime * 1.0) * 0.15;
            
            float distortion = w1 + w2 + w3;
            pos += normal * distortion;

            vNormal = normalize(normalMatrix * normal);
            vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 cameraPosition;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;

          vec3 color1 = vec3(0.937, 0.612, 0.0); // Brand Orange #ef9c00
          vec3 color2 = vec3(1.0, 0.84, 0.0);  // Gold
          vec3 color3 = vec3(0.0, 0.7, 0.9);   // Teal accent
          vec3 purple = vec3(0.5, 0.1, 0.9);

          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(cameraPosition - vWorldPosition);

            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
            float angle = atan(normal.y, normal.x) + uTime * 0.8;
            float pattern = sin(angle * 3.0 + dot(normal, viewDir) * 4.0) * 0.5 + 0.5;

            vec3 baseColor = mix(color1, color2, pattern);
            vec3 edgeColor = mix(color3, purple, fresnel);
            vec3 finalColor = mix(baseColor, edgeColor, fresnel * 0.6);

            vec3 lightDir = normalize(vec3(3.8, 3.7, 4.0));
            float spec = pow(max(dot(normal, normalize(viewDir + lightDir)), 0.0), 32.0);
            finalColor += spec * 0.4;

            gl_FragColor = vec4(finalColor, 0.95);
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
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 4, 4]} intensity={2} />
        <FastShaderBlob />
      </Canvas>
    </div>
  );
};