"use client";

import { useState } from "react";
import { futureInsightData } from "@/data/future_insight";
import { charactersByRarity, Character } from "@/data/characters";
import { banners } from "@/data/banners";
import { version } from "@/data/version";
import Image from "next/image";

function getCharNameById(id: number | Character | undefined): string {
  if (typeof id === "object" && id !== null && "name" in id) {
    return id.name;
  }
  if (typeof id === "number") {
    for (const rarity of [6, 5, 4, 3, 2]) {
      const char = charactersByRarity[rarity]?.find((c) => c.id === id);
      if (char) return char.name;
    }
    return `ID ${id}`;
  }
  return "-";
}

function getVersionStatus(startDateStr: string, endDateStr: string): { label: string; days: number } {
  const today = new Date();
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (today < startDate) {
    const days = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { label: "예정", days };
  } else if (today >= startDate && today <= endDate) {
    const days = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { label: "진행중", days };
  } else {
    return { label: "종료", days: 0 };
  }
}

function getUpcomingStandardPoolChars(versionStr: string): Character[] {
  const targetVersion = (parseFloat(versionStr) - 0.3).toFixed(1);
  const allChars = Object.values(charactersByRarity).flat();
  return allChars.filter((char) => char.version === targetVersion && !char.exclude_gacha);
}

export default function FutureInsightPage() {
  const [showOldVersions, setShowOldVersions] = useState(false);

  const current = parseFloat(version);
  const currentAndFuture = futureInsightData.filter((item) => parseFloat(item.version) >= current);
  const pastVersions = futureInsightData.filter((item) => parseFloat(item.version) < current);

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4 text-zinc-900 dark:text-zinc-100">
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mt-8 text-center">미래시 정리</h1>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-1 mt-0">
        향후 버전의 캐릭터 이름을 포함한 모든 번역은 의역입니다. 실제 정발 명칭과 다를 수 있습니다.
      </p>

      {[...currentAndFuture, ...(showOldVersions ? pastVersions : [])].map((item) => {
        const status = getVersionStatus(item.period.start, item.period.end);
        const upcomingStandardChars = getUpcomingStandardPoolChars(item.version);

        return (
          <div key={item.version} className="p-4 rounded-2xl shadow bg-white dark:bg-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                {item.title} (v{item.version})
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  status.label === "진행중"
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : status.label === "예정"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                }`}
              >
                {status.label}
                {status.label !== "종료" && ` (${status.days}일 ${status.label === "예정" ? "후" : "남음"})`}
              </span>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {item.period.start} ~ {item.period.end}
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3">
              <h2 className="font-bold mb-1 text-zinc-800 dark:text-zinc-100">🎯 고음 카운터</h2>
              <p>6성: {getCharNameById(item.album_shop.rare6)}</p>
              <p>5성: {getCharNameById(item.album_shop.rare5)}</p>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3">
              <h2 className="font-bold mb-2 text-zinc-800 dark:text-zinc-100">📌 픽업 배너</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {item.banners.map((bannerId, idx) => {
                  const banner = banners.find((b) => b.id === bannerId);
                  if (!banner) return null;

                  const pickup6 =
                    banner.bannerType === "doublePick"
                      ? (banner.twoPickup6 ?? []).map(getCharNameById).join(" / ")
                      : getCharNameById(banner.pickup6 as number);

                  const pickup5 = (banner.pickup5 ?? []).map((id) => getCharNameById(id as number)).join(", ");

                  const halfLabel = idx === 0 ? "전반기" : "후반기";

                  return (
                    <div
                      key={banner.id}
                      className="relative rounded-xl border border-zinc-300 dark:border-zinc-600 p-3 bg-zinc-100 dark:bg-zinc-700"
                    >
                      <Image
                        src={`/infos/banner_img/${banner.id}.png`}
                        alt={banner.name}
                        className="w-full rounded-md mb-2 border border-zinc-300 dark:border-zinc-600"
                        width={1200}
                        height={600}
                      />
                      <div className="flex items-center gap-2">
                        <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded">{halfLabel}</span>
                        <p className="font-semibold text-zinc-800 dark:text-zinc-100">{banner.name}</p>
                      </div>
                      <p><strong>6성:</strong> {pickup6 || "-"}</p>
                      <p><strong>5성:</strong> {pickup5 || "-"}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3">
              <h2 className="font-bold mb-1 text-zinc-800 dark:text-zinc-100">🌀 광상 목록</h2>
              <p><strong>6성:</strong> {item.euphoria.star6.map(getCharNameById).join(", ") || "-"}</p>
              <p><strong>5성:</strong> {item.euphoria.star5.map(getCharNameById).join(", ") || "-"}</p>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3">
              <h2 className="font-bold mb-1 text-zinc-800 dark:text-zinc-100">📒 상시 편입 추가</h2>
              {upcomingStandardChars.length === 0 ? (
                <p className="text-sm text-gray-400">예정된 상시 캐릭터 없음</p>
              ) : (
                <ul className="list-disc pl-5">
                  {upcomingStandardChars.map((char) => (
                    <li key={char.id}>
                      {char.rarity}성 - {char.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3">
              <a
                href={`/skin?version=${item.version}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                👕 {item.version} 버전 스킨 보기 →
              </a>
            </div>
          </div>
        );
      })}

      {pastVersions.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowOldVersions(!showOldVersions)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showOldVersions ? "▲ 예전 버전 정보 닫기" : "▼ 예전 버전 정보 보기"}
          </button>
        </div>
      )}
    </div>
  );
}
