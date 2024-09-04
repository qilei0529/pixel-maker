import { version } from "@/lib/utils"
import MainView from "./views/main"

export default function Home() {
  return (
    <main>
      <div className="absolute top-0 w-screen left-0 z-10 h-[40px] flex items-center p-2 space-x-2 bg-white">
        <span className="text-[18px] font-semibold">Just a Pixel Art Tool</span>
        <span className="text-[12px] mt-1">{version}</span>
      </div>
      <MainView />
    </main>
  )
}
