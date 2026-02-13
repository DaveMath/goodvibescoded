import { useEffect, useState } from "react";

interface VisitorData {
  browser: string;
  os: string;
  ip: string;
  screenRes: string;
  viewport: string;
  language: string;
  timezone: string;
  colorDepth: string;
  cookiesEnabled: string;
  doNotTrack: string;
  platform: string;
  cores: string;
  memory: string;
  connection: string;
  touchScreen: string;
  referrer: string;
}

const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return `Firefox ${ua.split("Firefox/")[1]?.split(" ")[0]}`;
  if (ua.includes("Edg/")) return `Edge ${ua.split("Edg/")[1]?.split(" ")[0]}`;
  if (ua.includes("Chrome/")) return `Chrome ${ua.split("Chrome/")[1]?.split(" ")[0]}`;
  if (ua.includes("Safari/") && !ua.includes("Chrome")) return `Safari ${ua.split("Version/")[1]?.split(" ")[0] || ""}`;
  return ua;
};

const getOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return ua.match(/Windows NT ([\d.]+)/)?.[0]?.replace("Windows NT 10.0", "Windows 10/11") || "Windows";
  if (ua.includes("Mac OS X")) return `macOS ${ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".") || ""}`;
  if (ua.includes("Linux")) return ua.includes("Android") ? `Android ${ua.match(/Android ([\d.]+)/)?.[1] || ""}` : "Linux";
  if (ua.includes("iPhone") || ua.includes("iPad")) return `iOS ${ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, ".") || ""}`;
  return navigator.platform || "Unknown";
};

const VisitorInfo = () => {
  const [data, setData] = useState<VisitorData | null>(null);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const json = await res.json();
        return json.ip;
      } catch {
        return "Unavailable";
      }
    };

    const nav = navigator as any;
    fetchIP().then((ip) => {
      setData({
        browser: getBrowser(),
        os: getOS(),
        ip,
        screenRes: `${screen.width}×${screen.height} @${devicePixelRatio}x`,
        viewport: `${window.innerWidth}×${window.innerHeight}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        colorDepth: `${screen.colorDepth}-bit`,
        cookiesEnabled: navigator.cookieEnabled ? "Yes" : "No",
        doNotTrack: navigator.doNotTrack === "1" ? "Enabled" : "Disabled",
        platform: navigator.platform || "Unknown",
        cores: nav.hardwareConcurrency ? `${nav.hardwareConcurrency} cores` : "Unknown",
        memory: nav.deviceMemory ? `${nav.deviceMemory} GB` : "Unknown",
        connection: nav.connection
          ? `${nav.connection.effectiveType || "?"} · ${nav.connection.downlink || "?"}Mbps`
          : "Unknown",
        touchScreen: navigator.maxTouchPoints > 0 ? `Yes (${navigator.maxTouchPoints} points)` : "No",
        referrer: document.referrer || "Direct",
      });
    });
  }, []);

  if (!data) return null;

  const items: [string, string][] = [
    ["Browser", data.browser],
    ["OS", data.os],
    ["IP", data.ip],
    ["Screen", data.screenRes],
    ["Viewport", data.viewport],
    ["Language", data.language],
    ["Timezone", data.timezone],
    ["Color Depth", data.colorDepth],
    ["Cookies", data.cookiesEnabled],
    ["Do Not Track", data.doNotTrack],
    ["Platform", data.platform],
    ["CPU Cores", data.cores],
    ["Memory", data.memory],
    ["Connection", data.connection],
    ["Touch", data.touchScreen],
    ["Referrer", data.referrer],
  ];

  return (
    <div
      className="mt-3 mx-auto max-w-2xl text-[10px] sm:text-xs leading-relaxed opacity-50 hover:opacity-90 transition-opacity duration-500"
      style={{ fontFamily: "'Fredoka', sans-serif", color: "hsl(var(--retro-brown) / 0.6)" }}
    >
      <p className="flex flex-wrap justify-center gap-x-3 gap-y-0.5">
        {items.map(([label, value]) => (
          <span key={label}>
            <strong>{label}:</strong> {value}
          </span>
        ))}
      </p>
    </div>
  );
};

export default VisitorInfo;
