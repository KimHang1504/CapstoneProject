"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

type Props = {
    onScan: (code: string) => void;
};

export default function QRScanner({ onScan }: Props) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isRunningRef = useRef(false);
    const hasStartedRef = useRef(false);
    const scannedRef = useRef(false);

useEffect(() => {
    console.log("🟢 useEffect RUN");

    if (hasStartedRef.current) {
        console.log("⚠️ already started, skip init");
        return;
    }

    hasStartedRef.current = true;
    console.log("👉 INIT scanner");

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    console.log("👉 CALL start()");
    

    scanner
        .start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                console.log("📸 SCANNED:", decodedText);

                if (scannedRef.current) {
                    console.log("⚠️ already scanned, ignore");
                    return;
                }

                scannedRef.current = true;

                console.log("👉 CALL onScan()");
                onScan(decodedText);

                console.log("👉 after scan, isRunning =", isRunningRef.current);

                if (isRunningRef.current) {
                    console.log("🛑 stopping scanner after scan");

                    scanner
                        .stop()
                        .then(() => {
                            console.log("✅ STOP success (after scan)");
                            return scanner.clear();
                        })
                        .then(() => {
                            console.log("🧹 CLEARED (after scan)");
                        })
                        .catch((err) => {
                            console.warn("⚠️ STOP error (after scan):", err);
                        });

                    isRunningRef.current = false;
                } else {
                    console.log("⚠️ skip stop (not running)");
                }
            },
            () => {
                // silent scan error
            }
        )
        .then(() => {
            console.log("✅ START success");
            isRunningRef.current = true;
        })
        .catch((err) => {
            console.error("❌ Start camera error:", err);
        });

    return () => {
        console.log("🔴 CLEANUP called");

        console.log("👉 isRunning =", isRunningRef.current);
        console.log("👉 scannerRef =", scannerRef.current);

        if (isRunningRef.current && scannerRef.current) {
            console.log("🛑 stopping scanner in cleanup");

            scannerRef.current
                .stop()
                .then(() => {
                    console.log("✅ STOP success (cleanup)");
                })
                .catch((err) => {
                    console.warn("⚠️ STOP error (cleanup):", err);
                });

            isRunningRef.current = false;
        } else {
            console.log("⚠️ skip stop in cleanup");
        }

        if (scannerRef.current) {
            console.log("🧹 clearing scanner");
            scannerRef.current.clear();
        } else {
            console.log("⚠️ scannerRef null, skip clear");
        }
    };
}, [onScan]); 

    return <div id="reader" className="w-full aspect-square max-w-md mx-auto" />;
}