import dynamic from 'next/dynamic'

const ModelViewer = dynamic(() => import('@/components/model-viewer'), { ssr: false })

export default function Levita3DPage() {
  return (
    <div className="bg-[#f4f8fa] px-4 py-10 md:px-10">
      <div className="mx-auto w-full max-w-[1280px]">
        <h1 className="mb-6 text-3xl font-bold text-secondary md:text-4xl">Levita 3D</h1>
        <ModelViewer />
      </div>
    </div>
  )
}

