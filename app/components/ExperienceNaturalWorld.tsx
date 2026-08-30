"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  Sky,
  useGLTF,
} from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  Color,
  DataTexture,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LinearFilter,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  RepeatWrapping,
  RGBAFormat,
  SRGBColorSpace,
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

type SurfaceKind = "stone" | "bark" | "pine" | "soil";

type SurfaceTextures = {
  colour: DataTexture;
  bump: DataTexture;
  roughness: DataTexture;
};

type SurfaceLibrary = Record<SurfaceKind, SurfaceTextures>;

const SURFACE_SIZE = 256;

function fract(value: number) {
  return value - Math.floor(value);
}

function noise2d(x: number, y: number, seed: number) {
  return fract(Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453);
}

function layeredNoise(x: number, y: number, seed: number) {
  return (
    noise2d(x, y, seed) * 0.52 +
    noise2d(x * 2.07, y * 2.11, seed + 3.1) * 0.27 +
    noise2d(x * 4.23, y * 4.17, seed + 8.7) * 0.14 +
    noise2d(x * 8.31, y * 8.19, seed + 13.4) * 0.07
  );
}

function makeSurfaceTextures(kind: SurfaceKind): SurfaceTextures {
  const colourData = new Uint8Array(SURFACE_SIZE * SURFACE_SIZE * 4);
  const bumpData = new Uint8Array(SURFACE_SIZE * SURFACE_SIZE * 4);
  const roughnessData = new Uint8Array(SURFACE_SIZE * SURFACE_SIZE * 4);
  const seed = kind === "stone" ? 2.7 : kind === "bark" ? 5.3 : kind === "pine" ? 8.1 : 11.9;

  for (let y = 0; y < SURFACE_SIZE; y += 1) {
    for (let x = 0; x < SURFACE_SIZE; x += 1) {
      const offset = (y * SURFACE_SIZE + x) * 4;
      const u = x / SURFACE_SIZE;
      const v = y / SURFACE_SIZE;
      const grain = layeredNoise(x * 0.12, y * 0.12, seed);
      const fine = noise2d(x * 0.71, y * 0.73, seed + 17.2);
      let red = 80;
      let green = 82;
      let blue = 73;
      let height = grain;
      let roughness = 0.82;

      if (kind === "stone") {
        const strata = Math.sin(v * 118 + grain * 7 + Math.sin(u * 15) * 1.8) * 0.5 + 0.5;
        const fissure = Math.pow(Math.max(0, 0.08 - Math.abs(fract(u * 7.4 + grain * 0.36) - 0.5)), 0.42);
        red = 65 + grain * 48 + strata * 18 - fissure * 34;
        green = 66 + grain * 42 + strata * 15 - fissure * 31;
        blue = 59 + grain * 34 + strata * 13 - fissure * 26;
        height = Math.max(0, Math.min(1, grain * 0.58 + strata * 0.34 - fissure * 0.52));
        roughness = 0.74 + fine * 0.24;
      } else if (kind === "bark") {
        const vertical = Math.abs(Math.sin(u * 96 + grain * 8));
        const crevice = Math.pow(1 - vertical, 5.4);
        const knot = Math.sin((u + grain * 0.07) * 31 + v * 4) * 0.5 + 0.5;
        red = 54 + grain * 38 + knot * 11 - crevice * 32;
        green = 35 + grain * 25 + knot * 7 - crevice * 22;
        blue = 23 + grain * 17 + knot * 5 - crevice * 15;
        height = Math.max(0, Math.min(1, vertical * 0.68 + grain * 0.24 - crevice * 0.35));
        roughness = 0.82 + crevice * 0.16;
      } else if (kind === "pine") {
        const needles = Math.pow(fine, 2.2);
        const warmNeedles = noise2d(x * 1.41, y * 1.37, seed + 4.2);
        red = 30 + grain * 27 + warmNeedles * 12;
        green = 54 + grain * 47 + needles * 31;
        blue = 25 + grain * 25 + warmNeedles * 8;
        height = Math.max(0, Math.min(1, grain * 0.45 + needles * 0.55));
        roughness = 0.72 + grain * 0.25;
      } else {
        const pebble = Math.pow(fine, 7.5);
        const rootShadow = Math.sin(u * 41 + v * 17 + grain * 8) * 0.5 + 0.5;
        red = 78 + grain * 54 + pebble * 44;
        green = 62 + grain * 42 + pebble * 36;
        blue = 39 + grain * 28 + rootShadow * 8;
        height = Math.max(0, Math.min(1, grain * 0.62 + pebble * 0.38));
        roughness = 0.8 + grain * 0.19;
      }

      const heightByte = Math.round(height * 255);
      const roughnessByte = Math.round(Math.max(0, Math.min(1, roughness)) * 255);
      colourData.set([
        Math.round(Math.max(0, Math.min(255, red))),
        Math.round(Math.max(0, Math.min(255, green))),
        Math.round(Math.max(0, Math.min(255, blue))),
        255,
      ], offset);
      bumpData.set([heightByte, heightByte, heightByte, 255], offset);
      roughnessData.set([roughnessByte, roughnessByte, roughnessByte, 255], offset);
    }
  }

  const colour = new DataTexture(colourData, SURFACE_SIZE, SURFACE_SIZE, RGBAFormat);
  const bump = new DataTexture(bumpData, SURFACE_SIZE, SURFACE_SIZE, RGBAFormat);
  const roughness = new DataTexture(roughnessData, SURFACE_SIZE, SURFACE_SIZE, RGBAFormat);

  [colour, bump, roughness].forEach((texture) => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.anisotropy = 8;
    texture.repeat.set(kind === "bark" ? 2.5 : 3.8, kind === "bark" ? 4.8 : 3.8);
    texture.needsUpdate = true;
  });
  colour.colorSpace = SRGBColorSpace;

  return { colour, bump, roughness };
}

function useSurfaceLibrary() {
  const surfaces = useMemo<SurfaceLibrary>(() => ({
    stone: makeSurfaceTextures("stone"),
    bark: makeSurfaceTextures("bark"),
    pine: makeSurfaceTextures("pine"),
    soil: makeSurfaceTextures("soil"),
  }), []);

  useEffect(
    () => () => {
      Object.values(surfaces).forEach((surface) => {
        surface.colour.dispose();
        surface.bump.dispose();
        surface.roughness.dispose();
      });
    },
    [surfaces],
  );

  return surfaces;
}

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
    vec3 normal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
    if (normal.y < 0.0) normal *= -1.0;
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 sunDirection = normalize(vec3(-0.42, 0.82, 0.38));
    float heightMix = smoothstep(-0.19, 0.18, vElevation);
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 4.2);
    float diffuse = max(dot(normal, sunDirection), 0.0);
    float specular = pow(max(dot(reflect(-sunDirection, normal), viewDirection), 0.0), 128.0);
    float fineRipple = sin(vWorldPosition.x * 7.2 + vWorldPosition.z * 5.8) * 0.5 + 0.5;
    float foam = smoothstep(0.13, 0.2, vElevation) * smoothstep(0.58, 0.92, fineRipple);
    vec3 water = mix(uDeep, uShallow, heightMix * 0.72 + diffuse * 0.24);
    vec3 skyReflection = mix(vec3(0.24, 0.39, 0.43), vec3(0.72, 0.74, 0.67), diffuse);
    vec3 colour = mix(water, skyReflection, fresnel * 0.58);
    colour += vec3(1.0, 0.82, 0.58) * specular * 1.45;
    colour = mix(colour, uFoam, foam * 0.56);
    gl_FragColor = vec4(colour, 0.98);
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
  surface: SurfaceTextures;
};

function RockMass({
  position,
  scale,
  rotation = [0, 0, 0],
  seed = 1,
  warm = false,
  surface,
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
        map={surface.colour}
        bumpMap={surface.bump}
        bumpScale={0.075}
        roughnessMap={surface.roughness}
        roughness={0.94}
        metalness={0.018}
        envMapIntensity={0.72}
      />
    </mesh>
  );
}

function addProjectedUvs(mesh: Mesh, kind: SurfaceKind) {
  const geometry = mesh.geometry.clone();
  const position = geometry.attributes.position;
  const uvs: number[] = [];

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);

    if (kind === "bark") {
      uvs.push(Math.atan2(y, x) / (Math.PI * 2) + 0.5, z * 0.72);
    } else if (kind === "pine") {
      uvs.push(x * 0.82 + z * 0.16, y * 0.82 + z * 0.1);
    } else {
      uvs.push(x * 0.58, y * 0.58);
    }
  }

  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  mesh.geometry = geometry;
}

function ForestModel({
  surfaces,
  position = [0, -1.72, -0.35],
  scale = 1.55,
  rotationY = -0.12,
}: {
  surfaces: SurfaceLibrary;
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
      const width = bounds ? bounds.max.x - bounds.min.x : 0;
      const depth = bounds ? bounds.max.y - bounds.min.y : 0;
      const isGround = centreZ < 0.24 && height < 0.62;
      const isTrunk = height > 0.7 && height > Math.max(width, depth) * 1.08;
      const kind: SurfaceKind = isGround ? "soil" : isTrunk ? "bark" : "pine";
      const surface = surfaces[kind];
      const pineTint = meshIndex % 3 === 0 ? "#759069" : "#66815b";

      addProjectedUvs(object, kind);
      object.material = new MeshPhysicalMaterial({
        color: isGround ? "#b3a284" : isTrunk ? "#a78368" : pineTint,
        map: surface.colour,
        bumpMap: surface.bump,
        bumpScale: isGround ? 0.052 : isTrunk ? 0.082 : 0.032,
        roughnessMap: surface.roughness,
        roughness: isGround ? 0.98 : isTrunk ? 0.93 : 0.86,
        metalness: 0,
        envMapIntensity: isGround ? 0.42 : isTrunk ? 0.5 : 0.66,
        sheen: isGround || isTrunk ? 0 : 0.18,
        sheenColor: new Color("#a9bc82"),
        sheenRoughness: 0.82,
      });
      object.castShadow = true;
      object.receiveShadow = true;
      meshIndex += 1;
    });

    return clone;
  }, [scene, surfaces]);

  useEffect(
    () => () => {
      forest.traverse((object) => {
        if (object instanceof Mesh && object.material instanceof MeshStandardMaterial) {
          object.material.dispose();
          object.geometry.dispose();
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

function GrassTufts({ count = 180 }: { count?: number }) {
  const meshRef = useRef<InstancedMesh>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new Object3D();
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let index = 0; index < count; index += 1) {
      const radius = Math.sqrt((index + 0.5) / count) * 3.7;
      const angle = index * goldenAngle;
      const variation = noise2d(index, index * 0.31, 14.2);
      dummy.position.set(
        Math.cos(angle) * radius,
        -1.47 + variation * 0.035,
        Math.sin(angle) * radius - 1.22,
      );
      dummy.rotation.set(0, angle + variation, (variation - 0.5) * 0.18);
      dummy.scale.set(0.65 + variation * 0.62, 0.62 + variation * 1.12, 0.65 + variation * 0.62);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <coneGeometry args={[0.018, 0.32, 3]} />
      <meshStandardMaterial
        color="#49643b"
        roughness={0.96}
        side={DoubleSide}
        envMapIntensity={0.38}
      />
    </instancedMesh>
  );
}

function FoamRing({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0.08]} scale={scale}>
      <torusGeometry args={[0.76, 0.035, 10, 96]} />
      <meshPhysicalMaterial
        color="#e7eee8"
        transparent
        opacity={0.42}
        roughness={0.24}
        transmission={0.12}
        depthWrite={false}
      />
    </mesh>
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

function CoastScene({
  variant,
  surfaces,
}: {
  variant: NaturalWorldVariant;
  surfaces: SurfaceLibrary;
}) {
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
        surface={surfaces.stone}
      />
      <RockMass
        position={[1.95, -0.72, -2.2]}
        scale={[0.72, 1.95, 0.82]}
        rotation={[0.04, -0.3, 0.16]}
        seed={4.4}
        warm
        surface={surfaces.stone}
      />
      <RockMass
        position={[3.45, -1.02, -3.7]}
        scale={[1.2, 1.48, 1.15]}
        rotation={[-0.08, 0.5, -0.12]}
        seed={6.2}
        surface={surfaces.stone}
      />
      <RockMass
        position={[0.2, -1.25, -3.8]}
        scale={[0.55, 0.88, 0.62]}
        rotation={[0.15, 0.25, 0.04]}
        seed={8.7}
        surface={surfaces.stone}
      />
      <FoamRing position={[1.95, -1.48, -2.2]} scale={[1.15, 0.66, 1]} />
      <FoamRing position={[3.42, -1.49, -3.68]} scale={[1.18, 0.72, 1]} />
      {isCrossing ? (
        <ForestModel
          surfaces={surfaces}
          position={[2.1, -1.58, -2.15]}
          scale={1.08}
          rotationY={0.2}
        />
      ) : null}
    </OrganicMotion>
  );
}

function ForestScene({
  variant,
  surfaces,
}: {
  variant: NaturalWorldVariant;
  surfaces: SurfaceLibrary;
}) {
  const isReturn = variant === "return";

  return (
    <OrganicMotion amount={isReturn ? 0.01 : 0.018}>
      <ForestModel
        surfaces={surfaces}
        position={isReturn ? [0, -1.88, -1.55] : [0, -1.7, -0.7]}
        scale={isReturn ? 1.34 : 1.72}
      />
      <RockMass
        position={[-3.1, -1.45, -2.35]}
        scale={[1.5, 0.58, 1.15]}
        rotation={[0.08, 0.4, -0.12]}
        seed={10.2}
        surface={surfaces.stone}
      />
      <RockMass
        position={[3.25, -1.52, -2.9]}
        scale={[1.32, 0.48, 0.94]}
        rotation={[0.02, -0.35, 0.08]}
        seed={12.7}
        surface={surfaces.stone}
      />
      {!isReturn ? <GrassTufts /> : null}
    </OrganicMotion>
  );
}

function NaturalScene({ variant }: { variant: NaturalWorldVariant }) {
  const isForest = variant === "forest" || variant === "return";
  const surfaces = useSurfaceLibrary();

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={isForest ? [-3, 2.4, -7] : [-4, 1.4, -8]}
        turbidity={isForest ? 8.5 : 6.2}
        rayleigh={isForest ? 1.35 : 2.15}
        mieCoefficient={0.008}
        mieDirectionalG={0.84}
      />
      <fog attach="fog" args={[isForest ? "#1d2a1d" : "#526b6e", 4.8, 18]} />
      <ambientLight intensity={isForest ? 0.34 : 0.46} color="#b9c6ae" />
      <hemisphereLight
        args={[isForest ? "#d7ddc7" : "#e0e5db", isForest ? "#182013" : "#16272a", 1.3]}
      />
      <directionalLight
        position={[-4, 8, 5]}
        intensity={3.15}
        color="#f1d2a0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.00018}
      />
      <directionalLight position={[5, 2, 1]} intensity={0.64} color="#8fb8b2" />
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={2.7}
          color="#f2efe8"
          position={[-4, 5, 4]}
          scale={[5, 3, 1]}
        />
        <Lightformer
          form="ring"
          intensity={1.05}
          color={isForest ? "#6c8a51" : "#6faca7"}
          position={[4, 1, 1]}
          scale={3}
        />
      </Environment>
      {isForest ? (
        <ForestScene variant={variant} surfaces={surfaces} />
      ) : (
        <CoastScene variant={variant} surfaces={surfaces} />
      )}
      <ContactShadows
        position={[0, -1.68, 0]}
        opacity={0.54}
        scale={12}
        blur={2.15}
        far={5.5}
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
          dpr={[1, 1.75]}
          frameloop={reducedMotion ? "demand" : "always"}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.08;
            gl.outputColorSpace = SRGBColorSpace;
            gl.shadowMap.type = PCFSoftShadowMap;
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
