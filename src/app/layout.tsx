import type { Metadata, Viewport } from "next";
import "./globals.css";
import ReminderManager from "@/components/ReminderManager";

export const metadata: Metadata = {
    title: "실버 케어 AI",
    description: "자녀 목소리 기반 AI 대화 서비스",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className="antialiased">
                <ReminderManager />
                {children}

                {/* Floating Action Button for Report (Demo) */}
                <div className="fixed bottom-6 right-6 z-50">
                    <a href="/report" className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 text-blue-600 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow text-sm font-semibold">
                        <span>🧠</span>
                        <span>마음 리포트</span>
                    </a>
                </div>
            </body>
        </html>
    );
}
