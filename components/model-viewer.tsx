'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Html, OrbitControls, useGLTF } from '@react-three/drei'
import Link from 'next/link'
import * as THREE from 'three'

type ModelProps = {
  paused: boolean
  modelPath: string
}

function Model({ paused, modelPath }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(modelPath)

  const normalizedScene = useMemo(() => {
    const clone = scene.clone(true)

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()

    box.getSize(size)
    box.getCenter(center)

    clone.position.sub(center)

    const maxAxis = Math.max(size.x, size.y, size.z) || 1
    const targetSize = 2.5
    const scale = targetSize / maxAxis
    clone.scale.setScalar(scale)

    return clone
  }, [scene])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (!paused) {
      groupRef.current.rotation.y += delta * 0.25
    }

    const t = performance.now() * 0.001
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.06
  })

  return (
    <group ref={groupRef}>
      <primitive object={normalizedScene} />
    </group>
  )
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="rounded-md bg-white/90 px-3 py-2 text-sm text-[#1a3060] shadow">
        Carregando modelo 3D...
      </div>
    </Html>
  )
}

export default function ModelViewer() {
  const [isInteracting, setIsInteracting] = useState(false)
  const [withMattress, setWithMattress] = useState(false)
  const controlsRef = useRef<any>(null)
  const modelPath = withMattress
    ? '/images/models/Meshy_AI_Adjustable_hospital_b_0330132440_texture.glb'
    : '/images/models/Meshy_AI_Modern_Adjustable_Hos_0330131427_texture.glb'

  const setTopView = () => {
    if (!controlsRef.current) return
    controlsRef.current.object.position.set(0, 5, 0.1)
    controlsRef.current.update()
  }

  const setFrontView = () => {
    if (!controlsRef.current) return
    controlsRef.current.object.position.set(0, 0.8, 4)
    controlsRef.current.update()
  }

  const setSideView = () => {
    if (!controlsRef.current) return
    controlsRef.current.object.position.set(4, 0.8, 0.1)
    controlsRef.current.update()
  }

  const setIsoView = () => {
    if (!controlsRef.current) return
    controlsRef.current.object.position.set(3.2, 2.2, 3.2)
    controlsRef.current.update()
  }

  const handleZoom = (factor: number) => {
    if (!controlsRef.current) return
    const camera = controlsRef.current.object as THREE.PerspectiveCamera
    const offset = new THREE.Vector3().subVectors(camera.position, controlsRef.current.target)
    offset.multiplyScalar(factor)
    camera.position.copy(controlsRef.current.target.clone().add(offset))
    controlsRef.current.update()
  }

  return (
    <section className="mx-auto w-full max-w-[1280px] rounded-[22px] bg-[#f0f4f8] shadow-[0_18px_40px_rgba(15,31,53,0.18)]">
      <header className="flex items-center justify-between rounded-t-[22px] bg-[#0f1f35] px-5 py-4 md:px-8">
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold tracking-wide text-[#1a9c85]">Levita 3D</div>
          <nav className="hidden items-center gap-4 text-sm text-white/70 md:flex">
            <span>Produto</span>
            <span>Visualização</span>
            <span>Ficha Técnica</span>
          </nav>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_340px]">
        <div className="bg-white p-5 md:p-7">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.06em] text-[#6b8a99]">
              Home / Produtos / Cama Fowler
            </p>
            <h2 className="mt-2 text-4xl text-[#0f1f35] [font-family:var(--font-dm-serif)]">
              Cama Fowler
            </h2>
            <p className="mt-1 text-base font-medium text-[#1a9c85]">Experimente em 3D</p>
          </div>

          <div
            className={`relative h-[360px] w-full overflow-hidden rounded-[20px] border border-[#e1e9f0] ${
              isInteracting ? 'cursor-grabbing' : 'cursor-grab'
            } md:h-[520px]`}
            style={{
              background:
                'radial-gradient(ellipse at center, #ddeeff 0%, #c8dff5 40%, #b0cceb 100%)',
            }}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#deebf2]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[410px] w-[410px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#edf3f7]" />

            <Canvas
              camera={{ position: [0, 0.8, 4], fov: 45 }}
              dpr={[1, 2]}
              gl={{ alpha: true, antialias: true }}
              shadows
              onCreated={({ gl }) => {
                gl.setClearColor(0xc8dff5, 1)
              }}
              onPointerDown={() => setIsInteracting(true)}
              onPointerUp={() => setIsInteracting(false)}
              onPointerMissed={() => setIsInteracting(false)}
            >
              <ambientLight intensity={0.3} />
              <hemisphereLight intensity={0.45} groundColor="#dbe8ef" color="#ffffff" />
              <directionalLight
                position={[5, 7, 5]}
                intensity={1.5}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <directionalLight position={[-4, 3, -3]} intensity={0.55} />
              <directionalLight position={[0, 1.5, -6]} intensity={0.28} color="#3dc8d4" />
              <spotLight position={[0, 8, 0]} intensity={0.35} angle={0.45} penumbra={0.35} />
              <Environment preset="studio" />

              <Suspense fallback={<LoadingFallback />}>
                <Model paused={isInteracting} modelPath={modelPath} />
              </Suspense>

              <OrbitControls
                ref={controlsRef}
                enablePan={false}
                enableZoom
                minDistance={2.4}
                maxDistance={6}
                enableDamping
                dampingFactor={0.09}
                onStart={() => setIsInteracting(true)}
                onEnd={() => setIsInteracting(false)}
              />
            </Canvas>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button onClick={setFrontView} className="rounded-full border border-[#d6e1ea] bg-white px-3 py-1.5 text-xs text-[#4f6478]">Frontal</button>
              <button onClick={setTopView} className="rounded-full border border-[#d6e1ea] bg-white px-3 py-1.5 text-xs text-[#4f6478]">Superior</button>
              <button onClick={setSideView} className="rounded-full border border-[#d6e1ea] bg-white px-3 py-1.5 text-xs text-[#4f6478]">Lateral</button>
              <button onClick={setIsoView} className="rounded-full border border-[#d6e1ea] bg-white px-3 py-1.5 text-xs text-[#4f6478]">Isométrica</button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleZoom(1.15)} className="rounded-full border border-[#d6e1ea] bg-white px-3 py-1 text-sm text-[#0f1f35]">-</button>
              <button onClick={() => handleZoom(0.87)} className="rounded-full border border-[#d6e1ea] bg-white px-3 py-1 text-sm text-[#0f1f35]">+</button>
            </div>
          </div>
        </div>

        <aside className="bg-[#0f1f35] p-5 text-white md:p-6">
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Comprimento', '2,10m'],
              ['Largura', '0,90m'],
              ['Altura', '0,65m leito / 1,00m cabeceira'],
              ['Capacidade', 'Até 180Kg'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-[#1a3a5c] p-3">
                <p className="text-xs text-white/70">{k}</p>
                <p className="mt-1 text-lg font-bold">{v}</p>
              </div>
            ))}
          </div>

          <ul className="mt-5 space-y-2">
            {[
              'Estrutura em aço de alta resistência',
              'Regulagem de altura elétrica',
              'Acabamento hospitalar premium',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white/85">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#1a9c85]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <label className="flex items-center justify-between text-sm">
              <span>Colchão</span>
              <button
                type="button"
                onClick={() => setWithMattress((prev) => !prev)}
                className={`h-6 w-11 rounded-full p-1 transition ${
                  withMattress ? 'bg-[#1a9c85]' : 'bg-white/20'
                }`}
              >
                <span
                  className={`block h-4 w-4 rounded-full bg-white transition ${
                    withMattress ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
          </div>

          <div className="mt-6 space-y-2">
            <Link
              href="/contato?assunto=Suporte%20tecnico&mensagem=Ola%2C%20gostaria%20de%20um%20orcamento%20da%20Cama%20Fowler."
              className="block w-full rounded-xl bg-[#1a9c85] px-4 py-3 text-center text-sm font-bold text-white"
            >
              Solicitar Orçamento
            </Link>
            <button className="w-full rounded-xl border border-[#1a9c85] px-4 py-3 text-sm font-semibold text-[#8bd5c7]">
              Baixar Ficha Técnica
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}

useGLTF.preload('/images/models/Meshy_AI_Modern_Adjustable_Hos_0330131427_texture.glb')
useGLTF.preload('/images/models/Meshy_AI_Adjustable_hospital_b_0330132440_texture.glb')
