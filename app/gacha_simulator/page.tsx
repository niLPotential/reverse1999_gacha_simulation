import GachaGame from "@/components/gacha_simulator/GachaGame";
import { version } from "@/data/version";


export default function GachaSimulatorPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <GachaGame />
    </div>
  );
}

export const metadata = {
  metadataBase: new URL("https://www.reverse1999-simulator.com"),
  title: "리버스 1999 가챠 시뮬레이터",
  description: "리버스 1999 가챠를 무제한으로 뽑아보세요.",
  icons: {
    icon: "/pwa_icon.png", // PWA 아이콘
  },
  manifest: "/manifest.json", // PWA manifest 파일
  openGraph: {
    title: "리버스 1999 가챠 시뮬레이터",
    description: "리버스 1999 가챠를 무제한으로 뽑아보세요!!",
    url: "https://www.reverse1999-simulator.com/gacha_simulator",
    siteName: "버틴의 여행가방",
    images: [
      {
        url: `/infos/link_img/${version}_img.png`,
        width: 1200,
        height: 630,
        alt: "리버스 1999 가챠 시뮬레이터 미리보기 이미지",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "리버스 1999 가챠 시뮬레이터",
    description: "리버스 1999 가챠를 무제한으로 뽑아보세요!!",
    images: [`/infos/link_img/${version}_img.png`],
  },
};