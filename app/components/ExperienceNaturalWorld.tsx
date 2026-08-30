"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import {
  Color,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  ShaderMaterial,
} from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

export type NaturalWorldVariant =
  | "ocean"
  | "coast"
  | "cliff"
  | "crossing"
  | "forest"
  | "return";

type ExperienceNaturalWorldProps = {
  variant: NaturalWorldVariant;
};

const FOREST_MODEL = "/models/el-pinar-de-liencres.glb";

const OCEAN_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  varying float vElevation;
  varying vec3 vWorldPosition;

  void main() {
    vec3 displaced = position;
    float broadWave = sin(displaced.x * 0.72 + uTime * 0.34) * 0.12;
    float crossWave = sin(displaced.y * 1.18 - uTime * 0.46) * 0.075;
    float detailWave = sin((displaced.x + displaced.y) * 2.35 + uTime * 0.28) * 0.024;
    displaced.z += broadWave + crossWave + detailWave;
    vElevation = displaced.z;

    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const OCEAN_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uFoam;
  varying float vElevation;
  varying vec3 vWorldPosition;

  void main() {
    float heightMix = smoothstep(-0.17, 0.17, vElevation);
    vec3 water = mix(uDeep, uShallow, heightMix);
    float fineRipple = sin(vWorldPosition.x * 4.2 + vWorldPosition.z * 2.8) * 0.5 + 0.5;
    float glint = pow(smoothstep(0.76, 1.0, heightMix * 0.72 + fineRipple * 0.28), 5.0);
    vec3 colour = mix(water, uFoam, glint * 0.52);
    gl_FragColor = vec4(colour, 0.92);
  }
`;

function OceanSurface({ quiet = false }: { quiet?: boolean }) {
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new Color(quiet ? "#173b3f" : "#123d48") },
      uShallow: { value: new Color(quiet ? "#4f8179" : "#5b9290") },
      uFoam: { value: new Color("#d9e4dc") },
    }),
    [quiet],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, -1.55, -0.8]} rotation={[-Math.PI / 2, 0, -0.04]}>
      <planeGeometry args={[21, 16, 120, 96]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={OCEAN_VERTEX_SHADER}
        fragmentShader={OCEAN_FRAGMENT_SHADER}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

type RockMassProps = {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  seed?: number;
  warm?: boolean;
};

function RockMass({
  position,
  scale,
  rotation = [0, 0, 0],
  seed = 1,
  warm = false,
}: RockMassProps) {
  const geometry = useMemo(() => {
    const next = new IcosahedronGeometry(1, 4);
    const attribute = next.attributes.position;
    const colours: number[] = [];
    const stoneDark = new Color(warm ? "#5b4636" : "#3e4641");
    const stoneMid = new Color(warm ? "#8b6d50" : "#6f7165");
    const stoneLight = new Color(warm ? "#b08d62" : "#9b9987");

    for (let index = 0; index < attribute.count; index += 1) {
      const x = attribute.getX(index);
      const y = attribute.getY(index);
      const z = attribute.getZ(index);
      const irregularity =
        1 +
        Math.sin(x * 4.7 + y * 3.1 + seed) * 0.075 +
        Math.sin(z * 7.3 - seed * 0.8) * 0.045;

      attribute.setXYZ(
        index,
        x * irregularity,
        y * (0.96 + Math.sin(x * 6.2 + seed) * 0.055),
        z * irregularity,
      );

      const band = Math.abs(Math.sin((y + seed * 0.13) * 15.5));
      const height = Math.max(0, Math.min(1, y * 0.42 + 0.5));
      const colour = stoneDark.clone().lerp(stoneMid, height * 0.72 + band * 0.18);
      colour.lerp(stoneLight, Math.max(0, band - 0.82) * 0.36);
      colours.push(colour.r, colour.g, colour.b);
    }

    attribute.needsUpdate = true;
    next.setAttribute("color", new Float32BufferAttribute(colours, 3));
    next.computeVertexNormals();
    return next;
  }, [seed, warm]);

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        vertexColors
        roughness={0.91}
        metalness={0.035}
        envMapIntensity={0.55}
      />
    </mesh>
  );
}

function ForestModel({
  position = [0, -1.72, -0.35],
  scale = 1.55,
  rotationY = -0.12,
}: {
  position?: [number, number, number];
  scale?: number;
  rotationY?: number;
}) {
  const { scene } = useGLTF(FOREST_MODEL);
  const forest = useMemo(() => {
    const clone = scene.clone(true);
    let meshIndex = 0;

    clone.traverse((object) => {
      if (!(object instanceof Mesh)) return;

      object.geometry.computeBoundingBox();
      const bounds = object.geometry.boundingBox;
      const centreZ = bounds ? (bounds.min.z + bounds.max.z) / 2 : 0;
      const height = bounds ? bounds.max.z - bounds.min.z : 0;
      const isGround = centreZ < 0.24;
      const isTrunk = height > 0.72 && centreZ < 1.35;
      const pineTone = meshIndex % 3 === 0 ? "#3f5832" : "#2d472c";

      object.material = new MeshStandardMaterial({
        color: isGround ? "#716247" : isTrunk ? "#4b3524" : pineTone,
        roughness: isGround ? 0.98 : 0.9,
        metalness: 0,
        envMapIntensity: isGround ? 0.32 : 0.48,
      });
      object.castShadow = true;
      object.receiveShadow = true;
      meshIndex += 1;
    });

    return clone;
  }, [scene]);

  useEffect(
    () => () => {
      forest.traverse((object) => {
        if (object instanceof Mesh && object.material instanceof MeshStandardMaterial) {
          object.material.dispose();
        }
      });
    },
    [forest],
  );

  return (
    <primitive
      object={forest}
      position={position}
      rotation={[-Math.PI / 2, 0, rotationY]}
      scale={scale}
    />
  );
}

function OrganicMotion({
  children,
  amount = 0.018,
}: {
  children: React.ReactNode;
  amount?: number;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(time * 0.12) * amount;
    groupRef.current.position.y = Math.sin(time * 0.18) * amount * 1.8;
  });

  return <group ref={groupRef}>{children}</group>;
}

function CoastScene({ variant }: { variant: NaturalWorldVariant }) {
  const isCliff = variant === "cliff";
  const isCrossing = variant === "crossing";

  return (
    <OrganicMotion amount={isCliff ? 0.012 : 0.02}>
      <OceanSurface quiet={isCrossing} />
      <RockMass
        position={isCliff ? [-3.45, -0.12, -1.45] : [-3.05, -0.72, -1.9]}
        scale={isCliff ? [4.1, 2.75, 2.4] : [3.2, 1.75, 2.1]}
        rotation={[0.08, 0.12, isCliff ? -0.2 : -0.1]}
        seed={2.1}
      />
      <RockMass
        position={[1.95, -0.72, -2.2]}
        scale={[0.72, 1.95, 0.82]}
        rotation={[0.04, -0.3, 0.16]}
        seed={4.4}
        warm
      />
      <RockMass
        position={[3.45, -1.02, -3.7]}
        scale={[1.2, 1.48, 1.15]}
        rotation={[-0.08, 0.5, -0.12]}
        seed={6.2}
      />
      <RockMass
        position={[0.2, -1.25, -3.8]}
        scale={[0.55, 0.88, 0.62]}
        rotation={[0.15, 0.25, 0.04]}
        seed={8.7}
      />
      {isCrossing ? (
        <ForestModel position={[2.1, -1.58, -2.15]} scale={1.08} rotationY={0.2} />
      ) : null}
    </OrganicMotion>
  );
}

function ForestScene({ variant }: { variant: NaturalWorldVariant }) {
  const isReturn = variant === "return";

  return (
    <OrganicMotion amount={isReturn ? 0.01 : 0.018}>
      <ForestModel
        position={isReturn ? [0, -1.88, -1.55] : [0, -1.7, -0.7]}
        scale={isReturn ? 1.34 : 1.72}
      />
      <RockMass
        position={[-3.1, -1.45, -2.35]}
        scale={[1.5, 0.58, 1.15]}
        rotation={[0.08, 0.4, -0.12]}
        seed={10.2}
      />
      <RockMass
        position={[3.25, -1.52, -2.9]}
        scale={[1.32, 0.48, 0.94]}
        rotation={[0.02, -0.35, 0.08]}
        seed={12.7}
      />
    </OrganicMotion>
  );
}

function NaturalScene({ variant }: { variant: NaturalWorldVariant }) {
  const isForest = variant === "forest" || variant === "return";

  return (
    <>
      <fog attach="fog" args={[isForest ? "#0e1710" : "#233b3d", 5.5, 17]} />
      <ambientLight intensity={isForest ? 0.48 : 0.62} color="#b9c6ae" />
      <hemisphereLight
        args={[isForest ? "#ccd9bd" : "#dbe2d6", isForest ? "#172013" : "#172529", 1.7]}
      />
      <directionalLight
        position={[-4, 8, 5]}
        intensity={2.8}
        color="#f1d2a0"
        castShadow
      />
      <directionalLight position={[5, 2, 1]} intensity={0.85} color="#8fb8b2" />
      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#f2efe8"
          position={[-4, 5, 4]}
          scale={[5, 3, 1]}
        />
        <Lightformer
          form="ring"
          intensity={0.85}
          color={isForest ? "#6c8a51" : "#6faca7"}
          position={[4, 1, 1]}
          scale={3}
        />
      </Environment>
      {isForest ? <ForestScene variant={variant} /> : <CoastScene variant={variant} />}
      <ContactShadows
        position={[0, -1.68, 0]}
        opacity={0.42}
        scale={12}
        blur={2.8}
        far={5}
        color={isForest ? "#020603" : "#07100f"}
      />
    </>
  );
}

export function ExperienceNaturalWorld({ variant }: ExperienceNaturalWorldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: "120% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`experience-natural-world experience-natural-world--${variant}`}
    >
      {nearViewport ? (
        <Canvas
          camera={{ position: [0, 0.55, 7.4], fov: 44, near: 0.1, far: 40 }}
          dpr={[1, 1.5]}
          frameloop={reducedMotion ? "demand" : "always"}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          shadows
        >
          <Suspense fallback={null}>
            <NaturalScene variant={variant} />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}

useGLTF.preload(FOREST_MODEL);
