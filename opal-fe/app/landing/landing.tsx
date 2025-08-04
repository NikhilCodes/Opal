import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {MeshDistortMaterial, Sphere, Text, Html} from '@react-three/drei';
import * as THREE from 'three';
import {Bloom, EffectComposer} from "@react-three/postprocessing";
import React, {useEffect, useRef, useState} from "react";
import {createNoise3D} from "simplex-noise";
import {motion} from "motion/react";
import {cn} from "~/utils/styles";
import {useNavigate} from "react-router";
import {useSpring, animated} from '@react-spring/three';
import {PrimaryButton} from "~/components/button";

// export function Landing() {
//   const navigate = useNavigate();
//   const [entering, setEntering] = useState(false);
//
//   const [springProps, api] = useSpring(() => ({
//     scale: [1, 1, 1],
//     position: [0, 0, 0],
//     rotation: [0, 0, 0],
//   }));
//
//   useEffect(() => {
//     if (entering) {
//       api.start({
//         to: async (next) => {
//           await next({ rotation: [-Math.PI / 2, 0, 0] }); // rotate to face top
//           await next({ position: [0, 1.2, 2], scale: [5, 5, 5] }); // move upward into north
//         },
//         config: { mass: 1, tension: 150, friction: 20, duration: 1000 },
//       });
//
//       const timeout = setTimeout(() => {
//         navigate('/projects');
//       }, 1500);
//       return () => clearTimeout(timeout);
//     }
//   }, [entering, api, navigate]);
//
//   return (
//     <div className="flex flex-col items-center justify-center  h-screen bg-black">
//       <Vortex baseHue={100}>
//         <Canvas
//           camera={{position: [0, 0, 5], fov: 35}}
//           style={{width: '100vw', height: '100vh', background: 'transparent'}}
//         >
//           <animated.group
//             scale={springProps.scale as unknown as [number, number, number]}
//             position={springProps.position as unknown as [number, number, number]}
//             rotation={springProps.rotation as unknown as [number, number, number]}
//           >
//             <Text
//               scale={0.4}
//               position={[0, 0, 1]}
//               fontSize={0.7}
//               color="#000000"
//               font={'/CarinoSansBold.ttf'}
//               fontWeight={"bold"}
//               fontStyle={"normal"}
//               material={new THREE.MeshBasicMaterial({color: '#ffffff', reflectivity: 0, opacity: 2})}
//             >
//               Opal
//             </Text>
//             <Html position={[-0.1, -0.15, 2]}>
//               <button
//                 onClick={() => setEntering(true)}
//                 hidden={entering}
//                 className="bg-black text-cyan-300 px-4 py-2 rounded-lg shadow-lg w-28 hover:bg-white transition-colors duration-300">
//                 Dive in!
//               </button>
//             </Html>
//             <Droplet/>
//           </animated.group>
//           <ambientLight intensity={0.1}/>
//           {/* Optional: For rotating with mouse */}
//           {/*<OrbitControls enableZoom={false}/>*/}
//         </Canvas>
//       </Vortex>
//     </div>
//   );
// }

export function Landing() {
  const navigate = useNavigate();

  const elementsOnScreen = useRef<string[]>([
    'random-1', 'random-2', 'random-3'
  ])

  const addArtifactRandomly = () => {
    const top = (Math.random() * 100) % 90; // Random top position between 10% and 110%
    const left = Math.random() * 35; // Random left position between

    const height = Math.random() * 300 + 50; // Random height between 10px and 30px
    const width = Math.random() * 300 + 50; // Random width between
    const shadowDepth = Math.random() * 20 + 5; // Random shadow depth between 5px and 25px
    const backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random background color
    const randomId = `random-${Math.floor(Math.random() * 10000000) + 3}`; // Generate a unique ID for the new element
    const newElement = document.createElement('div');
    newElement.className = `${randomId}`;
    newElement.style.position = 'absolute';
    newElement.style.top = `${top}%`;
    newElement.style.left = `${left}%`;
    newElement.style.height = `${height}px`;
    newElement.style.width = `${width}px`;
    newElement.style.backgroundColor = backgroundColor;
    newElement.style.border = '2px solid black';
    newElement.style.boxShadow = `${shadowDepth}px ${shadowDepth}px 0 1px #000000`;
    newElement.style.opacity = '0';

    const newElementDup = document.createElement('div');
    newElementDup.className = `${randomId}`;
    newElementDup.style.position = 'absolute';
    newElementDup.style.top = `${top}%`;
    newElementDup.style.right = `${left}%`;
    newElementDup.style.height = `${height}px`;
    newElementDup.style.width = `${width}px`;
    newElementDup.style.backgroundColor = 'white';
    newElementDup.style.border = '2px solid black';
    newElementDup.style.boxShadow = `${shadowDepth}px ${shadowDepth}px 0 1px #000000`;
    newElementDup.style.opacity = '0';

    // Append the new element to the artifacts container
    const artifactsContainer = document.querySelector('.artifacts');
    if (artifactsContainer) {
      const randomDelay = 1000 * (Math.random() * 4 + 1)
      newElement.style.transitionDuration = `${200}ms`;
      newElementDup.style.transitionDuration = `${200}ms`;
      newElement.style.transitionTimingFunction = 'ease-in-out';
      newElementDup.style.transitionTimingFunction = 'ease-in-out';

      setTimeout(() => {
        newElement.style.opacity = '1';
        newElementDup.style.opacity = '1';
      }, 10)

      setTimeout(() => {
        newElement.style.transitionDuration = `${randomDelay - 200}ms`;
        newElement.style.transform = `translate(${shadowDepth / 2}px, ${shadowDepth / 2}px)`
        newElement.style.boxShadow = `0 0 0 0 #000000`;

        newElementDup.style.transitionDuration = `${randomDelay - 200}ms`;
        newElementDup.style.transform = `translate(${shadowDepth / 2}px, ${shadowDepth / 2}px)`
        newElementDup.style.boxShadow = `0 0 0 0 #000000`;
        newElement.style.borderWidth = '0';
      }, 200)

      artifactsContainer.appendChild(newElement);
      artifactsContainer.appendChild(newElementDup);
      elementsOnScreen.current.push(randomId);
      // Remove the element after 5 seconds
      setTimeout(() => {
        newElement.style.transitionDuration = `${200}ms`;
        newElementDup.style.transitionDuration = `${200}ms`;
        newElement.style.opacity = '0';
        newElementDup.style.opacity = '0';
      }, randomDelay - 200)
      setTimeout(() => {
        if (artifactsContainer.contains(newElement)) {
          artifactsContainer.removeChild(newElement);
          artifactsContainer.removeChild(newElementDup);
          elementsOnScreen.current = elementsOnScreen.current.filter(id => id !== randomId);
        }
      }, randomDelay);
    }
  }


  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addArtifactRandomlyRecursive = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    addArtifactRandomly();
    timeoutRef.current = setTimeout(addArtifactRandomlyRecursive, Math.random() * 2000 + 500);
  }

  useEffect(() => {
    addArtifactRandomlyRecursive()
    setTimeout(() => {
      document.querySelectorAll('.artifacts > .random-1')?.forEach(e => e.remove())
    }, 1000 * (Math.random() * 20 + 1));
    setTimeout(() => {
      document.querySelectorAll('.artifacts > .random-2')?.forEach(e => e.remove())
    }, 1000 * (Math.random() * 20 + 1));
    setTimeout(() => {
      document.querySelectorAll('.artifacts > .random-3')?.forEach(e => e.remove())
    }, 1000 * (Math.random() * 20 + 1));


    for (let i = 0; i < 3; i++) {
      addArtifactRandomly()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <div className={'font-manrope space-x-1.5 z-10'}>
        <span className={'text-5xl font-light'}>Opal</span>
        <span className={'text-sm text-white bg-black py-0.5 px-1'}>BETA</span>
      </div>

      <PrimaryButton className={'px-8 z-10'} onClick={() => navigate('/projects')}>Jump In</PrimaryButton>

      <div className={'artifacts absolute [&>div]:absolute w-screen h-screen pointer-events-none z-0'}>
        {/*<div className={'random-1 w-36 aspect-square bg-pink-600 left-1/8 top-1/6 shadow-[10px_10px_0_1px_#000000]'}/>*/}
        {/*<div*/}
        {/*  className={'random-2 w-20 aspect-square bg-teal-500 left-1/4 bottom-1/3 border-2 shadow-[15px_15px_0_1px_#000000]'}/>*/}
        {/*<div className={'random-3 w-40 h-20 bg-blue-500 left-1/5 bottom-1/2 border-2 shadow-[7px_7px_0_1px_#000000]'}/>*/}
        {/**/}
        {/*<div*/}
        {/*  className={'random-1 w-36 aspect-square bg-white right-1/8 top-1/6 border-2 shadow-[10px_10px_0_1px_#000000]'}/>*/}
        {/*<div*/}
        {/*  className={'random-2 w-20 aspect-square bg-white right-1/4 bottom-1/3 border-2 shadow-[15px_15px_0_1px_#000000]'}/>*/}
        {/*<div className={'random-3 w-40 h-20 bg-white right-1/5 bottom-1/2 border-2 shadow-[7px_7px_0_1px_#000000]'}/>*/}
      </div>
    </div>
  )
}

function Droplet() {
  const meshRef = useRef(null)
  const {mouse} = useThree()

  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({clock}) => {
    if (lightRef.current) {
      // Make the light follow the mouse
      lightRef.current.position.x = mouse.x * 5
      lightRef.current.position.y = mouse.y * 5
    }
  })

  return (
    <>
      <EffectComposer>
        <Bloom intensity={1} luminanceThreshold={0.4}/>
      </EffectComposer>

      <spotLight isSpotLight={true} color="#ffaaaa" intensity={300} position={[0, 9, 2]}/>
      <pointLight ref={lightRef} color="#ff0000" intensity={2} position={[1, 0, 2]}/>
      <Sphere args={[1, 64, 64]} ref={meshRef} scale={[0.8, 0.8, 0.8]}>
        <MeshDistortMaterial
          transparent
          color={"#ff0000"}
          emissive={"#00f0f0"}
          emissiveIntensity={2}
          distort={0.5}
          speed={2}
          roughness={0}
          clearcoatRoughness={0}
          thickness={100}
          reflectivity={1}
          clearcoat={0}
          opacity={0.8}
        />
      </Sphere>
    </>
  )
}

interface VortexProps {
  children?: any;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

export const Vortex = (props: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef(null);
  const animationFrameId = useRef<number>(null);
  const particleCount = props.particleCount || 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = props.rangeY || 100;
  const baseTTL = 50;
  const rangeTTL = 150;
  const baseSpeed = props.baseSpeed || 0.0;
  const rangeSpeed = props.rangeSpeed || 1.5;
  const baseRadius = props.baseRadius || 1;
  const rangeRadius = props.rangeRadius || 2;
  const baseHue = props.baseHue || 220;
  const rangeHue = 100;
  const noiseSteps = 3;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;
  const backgroundColor = props.backgroundColor || "#000000";
  let tick = 0;
  const noise3D = createNoise3D();
  let particleProps = new Float32Array(particlePropsLength);
  let center: [number, number] = [0, 0];

  const HALF_PI: number = 0.5 * Math.PI;
  const TAU: number = 2 * Math.PI;
  const TO_RAD: number = Math.PI / 180;
  const rand = (n: number): number => n * Math.random();
  const randRange = (n: number): number => n - rand(2 * n);
  const fadeInOut = (t: number, m: number): number => {
    let hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1: number, n2: number, speed: number): number =>
    (1 - speed) * n1 + speed * n2;

  const setup = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        resize(canvas, ctx);
        initParticles();
        draw(canvas, ctx);
      }
    }
  };

  const initParticles = () => {
    tick = 0;
    // simplex = new SimplexNoise();
    particleProps = new Float32Array(particlePropsLength);

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  };

  const initParticle = (i: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let x, y, vx, vy, life, ttl, speed, radius, hue;

    x = rand(canvas.width);
    y = center[1] + randRange(rangeY);
    vx = 0;
    vy = 0;
    life = 0;
    ttl = baseTTL + rand(rangeTTL);
    speed = baseSpeed + rand(rangeSpeed);
    radius = baseRadius + rand(rangeRadius);
    hue = baseHue + rand(rangeHue);

    particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
  };

  const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    tick++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawParticles(ctx);
    renderGlow(canvas, ctx);
    renderToScreen(canvas, ctx);

    animationFrameId.current = window.requestAnimationFrame(() =>
      draw(canvas, ctx),
    );
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx);
    }
  };

  const updateParticle = (i: number, ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i;
    let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

    x = particleProps[i];
    y = particleProps[i2];
    n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
    vx = lerp(particleProps[i3], Math.cos(n), 0.5);
    vy = lerp(particleProps[i4], Math.sin(n), 0.5);
    life = particleProps[i5];
    ttl = particleProps[i6];
    speed = particleProps[i7];
    x2 = x + vx * speed;
    y2 = y + vy * speed;
    radius = particleProps[i8];
    hue = particleProps[i9];

    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

    life++;

    particleProps[i] = x2;
    particleProps[i2] = y2;
    particleProps[i3] = vx;
    particleProps[i4] = vy;
    particleProps[i5] = life;

    (checkBounds(x, y, canvas) || life > ttl) && initParticle(i);
  };

  const drawParticle = (
    x: number,
    y: number,
    x2: number,
    y2: number,
    life: number,
    ttl: number,
    radius: number,
    hue: number,
    ctx: CanvasRenderingContext2D,
  ) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const checkBounds = (x: number, y: number, canvas: HTMLCanvasElement) => {
    return x > canvas.width || x < 0 || y > canvas.height || y < 0;
  };

  const resize = (
    canvas: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D,
  ) => {
    const {innerWidth, innerHeight} = window;

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    center[0] = 0.5 * canvas.width;
    center[1] = 0.5 * canvas.height;
  };

  const renderGlow = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
  ) => {
    ctx.save();
    ctx.filter = "blur(8px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = "blur(4px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const renderToScreen = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      resize(canvas, ctx);
    }
  };

  useEffect(() => {
    setup();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative h-full w-full justify-center items-center flex", props.containerClassName)}>
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        ref={containerRef}
        className="absolute inset-0 z-0 flex h-full w-full items-center justify-center bg-transparent"
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>

      <div className={cn("relative z-10", props.className)}>
        {props.children}
      </div>
    </div>
  );
};
