import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial } from '@react-three/drei';

// Blob component with morphing shape matching blobmixer algorithm
function MorphingBlob() {
  const meshRef = useRef(null);
  const matRef = useRef(null);
  const originalPositionsRef = useRef(null);

  // Generate geometry once using useMemo
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);
    originalPositionsRef.current = new Float32Array(geo.attributes.position.array);
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (meshRef.current && geometry && originalPositionsRef.current) {
      const positions = geometry.attributes.position;
      const count = positions.count;

      // Parameters from blobmixer URL - INCREASED SPEED
      const frequency = 2.77;
      const numWaves = 3.4;
      const surfaceDistort = 3.6;
      const surfaceFrequency = 1.62;
      const speed = 1; // Increased from 1 to 2.5 for faster animation
      const distort = 0.08;
      const surfaceSpeed = 1; // Increased from 1 to 2.5 for faster animation

      // Distance parameters
      const dist1 = 20;
      const dist2 = 9.53;
      const dist3 = 8.2;

      // Angle parameters
      const angle1 = 0.22;
      const angle2 = 0.31;
      const angle3 = 1.57;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = originalPositionsRef.current[i3];
        const y = originalPositionsRef.current[i3 + 1];
        const z = originalPositionsRef.current[i3 + 2];

        const wave1 = Math.sin((x * frequency + t * speed) * numWaves + angle1)
          * Math.cos((y * frequency + t * speed * 0.7) * numWaves + angle2)
          * (dist1 / 100);

        const wave2 = Math.cos((y * surfaceFrequency + t * surfaceSpeed * 1.2) * numWaves + angle2)
          * Math.sin((z * surfaceFrequency + t * surfaceSpeed * 0.9) * numWaves + angle3)
          * (dist2 / 100);

        const wave3 = Math.sin((z * frequency + t * speed * 0.8) * numWaves + angle3)
          * Math.cos((x * surfaceFrequency + t * surfaceSpeed * 1.1) * numWaves + angle1)
          * (dist3 / 100);

        const surfaceWave1 = Math.sin((x * surfaceFrequency * 1.5 + t * surfaceSpeed * 0.5) * numWaves);
        const surfaceWave2 = Math.cos((y * frequency * 1.3 + t * speed * 1.1) * numWaves);
        const surfaceWave3 = Math.sin((z * surfaceFrequency * 0.8 + t * surfaceSpeed * 1.3) * numWaves);

        const distortion = wave1 * 0.4 + wave2 * 0.35 + wave3 * 0.25 + (surfaceWave1 + surfaceWave2 + surfaceWave3) * 0.05;

        const scale = 1 + distortion * surfaceDistort * distort;

        positions.setXYZ(i, x * scale, y * scale, z * scale);
      }

      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      meshRef.current.rotation.x = -1.33 + Math.sin(t * 0.5) * 0.3; // Faster rotation
      meshRef.current.rotation.y = -0.13 + t * 0.25; // Faster rotation
      meshRef.current.rotation.z = -2;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <MeshTransmissionMaterial
        ref={matRef} transmission={1} roughness={0.32} metalness={0.73} reflectivity={1} ior={2.33} clearcoat={0.13} clearcoatRoughness={1} color="#f09f01" attenuationColor="#f09f01" thickness={0.5} envMapIntensity={0.95}
      />

    </mesh>
  );
}

// Iridescent gradient overlay matching blobmixer colors
function IridescentOverlay() {
  const meshRef = useRef(null);
  const materialRef = useRef(null);

  const geometry = useMemo(() => new THREE.SphereGeometry(1.01, 128, 128), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = -1.33 + Math.sin(t * 0.5) * 0.3; // Faster rotation
      meshRef.current.rotation.y = -0.13 + t * 0.25; // Faster rotation
      meshRef.current.rotation.z = -2;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = t * 2.5; // Faster iridescent animation
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        transparent
        opacity={1}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec3 cameraPosition;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;

          vec3 color1 = vec3(0.0, 0.06, 1.0);
          vec3 color2 = vec3(1.0, 1.0, 0.0);
          vec3 color3 = vec3(0.46, 0.0, 1.0);
          vec3 teal = vec3(0.0, 0.8, 0.9);
          vec3 magenta = vec3(1.0, 0.0, 0.8);
          vec3 gold = vec3(1.0, 0.84, 0.0);

          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(cameraPosition - vWorldPosition);

            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0); // stronger edges
            float angle = atan(normal.y, normal.x) + time * 1.25; // Faster iridescent effect
            float iridescent = sin(angle * 3.0 + dot(normal, viewDir) * 5.0) * 0.5 + 0.5;

            vec3 color = mix(
              mix(teal, color1, 0.3),
              mix(color3, magenta, 0.5),
              iridescent * 0.6 + fresnel * 0.4
            );

            float highlight = pow(fresnel, 0.5) * (1.0 - abs(dot(normal, vec3(0.0, 1.0, 0.0))));
            color = mix(color, gold, highlight * 0.4);
            color = mix(color, color2, highlight * 0.3);
            color = mix(color, color2, iridescent * 0.2);

            float maxComponent = max(max(color.r, color.g), color.b);
            if (maxComponent > 0.0) {
              color = color / maxComponent;
              color = pow(color, vec3(0.9));
              color *= 1.3;
            }

            float metallic = 0.73;
            float roughness = 0.32;
            vec3 lightDir = normalize(vec3(3.87, -3.73, 1.93));
            vec3 halfDir = normalize(viewDir + lightDir);
            float specular = pow(max(dot(normal, halfDir), 0.0), (1.0 - roughness) * 128.0);
            vec3 finalColor = color + specular * 0.5 * metallic;

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
        uniforms={{
          time: { value: 0 },
          cameraPosition: { value: new THREE.Vector3(0, 0, 4) }
        }}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Main component
export const AnimatedBlob = ({ width = "md:w-full", height = "h-[300px]" }) => {
  return (
    <div className={`${width} ${height}`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Environment background={false} preset="sunset" /> {/* Transparent background */}

        <ambientLight intensity={0} />

        <directionalLight position={[3.87, -3.73, 1.93]} intensity={5} color="#ffffff" />
        <directionalLight position={[-2.8, -6.67, 5.73]} intensity={0.7} color="#ffffff" />
        <directionalLight position={[1.33, -0.27, 7.13]} intensity={5} color="#ffffff" />
        <directionalLight position={[3.07, 0, 3.53]} intensity={0} color="#ffffff" />
        <directionalLight position={[0, 0, 6.2]} intensity={0.63} color="#ffffff" />

        <MorphingBlob />
        <IridescentOverlay />
      </Canvas>
    </div>
  );
};
