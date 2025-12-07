import type { Metadata } from "next";
import "./globals.css";
import ReminderManager from "@/components/ReminderManager";

export const metadata: Metadata = {
    title: "실버 케어 AI",
    description: "자녀 목소리 기반 AI 대화 서비스",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body>
                <ReminderManager />
                {children}
            </body>
        </html>
    );
}
