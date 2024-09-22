import { version } from "@/lib/utils"
import MainView from "./views/main"
import { Icons } from "@/shared/icons"

export default function Home() {
  return (
    <main>
      <div className="absolute top-0 w-screen left-0 z-10 h-[40px] flex items-center p-2 space-x-2 bg-white">
        <span className="text-[18px] font-semibold">Just a Pixel Art Tool</span>
        <span className="text-[12px] mt-1">{version}</span>
      </div>
      <MainView />
      <div className="absolute bottom-0 w-screen left-0 z-10">
        <div className="flex flex-row items-center p-2 space-x-2 h-[40px] ">
          <div className="flex-1"></div>
          <div className="flex flex-row items-center space-x-1">
            <span className="text-[14px]">Follow</span>
            <a
              href="https://x.com/qilei"
              className="flex flex-row items-center justify-center text-[12px] w-6 h-6 bg-black hover:bg-blue-600 text-white"
              target="_blank"
            >
              <Icons.twitter className="w-3 h-3 text-white" />
            </a>
          </div>
          <div className="text-gray-300">|</div>
          <span className="text-[14px]">© JAN STUDIO</span>
        </div>
      </div>
    </main>
  )
}
