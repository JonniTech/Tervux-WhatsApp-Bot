"use client";

import { useState, useRef, useEffect, useMemo, memo } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare, QrCode, Check, Loader2, AlertCircle, Phone,
    Zap, Shield, Clock, Bot, Sparkles, X, Search,
    Settings, Users, Wrench, Gamepad2, GraduationCap, Video,
    Cpu, Star, UserCircle, Layout, Terminal, Briefcase, RefreshCcw,
    Lock, VolumeX, List, HelpCircle, Activity, Heart, Globe,
    AlertTriangle, ExternalLink, Share2, Copy, ShieldAlert, Plus, ArrowLeft, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTheme } from "next-themes";
import { toast } from "@/lib/toast";
import { QRCodeSVG } from "qrcode.react";
import { io } from "socket.io-client";
import { initParticlesEngine, Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { playSound } from "@/lib/sounds";

const BACKEND_URL = process.env.NEXT_PUBLIC_WHATSAPP_BACKEND || "http://localhost:5000";

const features = [
    {
        icon: <Bot className="h-5 w-5" />,
        title: "AI-Powered Commands",
        description: "50+ intelligent commands for automation and productivity"
    },
    {
        icon: <Zap className="h-5 w-5" />,
        title: "Auto Replies",
        description: "Set custom auto-replies for keywords and phrases"
    },
    {
        icon: <Shield className="h-5 w-5" />,
        title: "Privacy First",
        description: "Your data is secured with end-to-end encryption"
    },
    {
        icon: <Clock className="h-5 w-5" />,
        title: "24/7 Active",
        description: "Bot remains active for 3 days per pairing session"
    }
];

const commandCategories = [
    {
        id: "premium",
        name: "Premium",
        icon: <Star className="h-4 w-4" />,
        commands: [
            { cmd: "!alwaysonline [on/off]", desc: "Keep showing online 24/7", example: "!alwaysonline on" },
            { cmd: "!antidelete [on/off]", desc: "Detect and resend deleted messages", example: "!antidelete on" },
            { cmd: "!alwaystyping [on/off]", desc: "Show 'Typing...' status continuously", example: "!alwaystyping on" },
            { cmd: "!alwaysrecording [on/off]", desc: "Show 'Recording...' status continuously", example: "!alwaysrecording on" },
            { cmd: "!anticall [on/off]", desc: "Automatically reject incoming calls", example: "!anticall on" },
            { cmd: "!antiviewonce [on/off]", desc: "Save View-Once media automatically", example: "!antiviewonce on" },
            { cmd: "!antiremove [on/off]", desc: "Auto-re-add yourself if removed from group", example: "!antiremove on" },
            { cmd: "!muteuser @user", desc: "Silently ignore messages from specific user", example: "!muteuser @John" },
            { cmd: "!unmuteuser @user", desc: "Allow messages from a muted user", example: "!unmuteuser @John" }
        ]
    },
    {
        id: "admin",
        name: "Group Admin",
        icon: <Shield className="h-4 w-4" />,
        commands: [
            { cmd: "!kick @user", desc: "Remove a member from the group", example: "!kick @John" },
            { cmd: "!add 254...", desc: "Add a member by phone number", example: "!add 254712345678" },
            { cmd: "!promote @user", desc: "Give admin rights to a member", example: "!promote @John" },
            { cmd: "!demote @user", desc: "Remove admin rights from a member", example: "!demote @John" },
            { cmd: "!tagall", desc: "Mention everyone in the group", example: "!tagall Everyone look!" },
            { cmd: "!hidetag", desc: "Tag everyone without showing names", example: "!hidetag Important update!" },
            { cmd: "!muteall", desc: "Allow only admins to send messages", example: "!muteall" },
            { cmd: "!lock", desc: "Lock group settings to admins only", example: "!lock" },
            { cmd: "!welcome [msg]", desc: "Set custom group welcome message", example: "!welcome Welcome to the squad!" },
            { cmd: "!goodbye [msg]", desc: "Set custom group leave message", example: "!goodbye See you soon!" },
            { cmd: "!groupinfo", desc: "Get detailed group statistics", example: "!groupinfo" },
            { cmd: "!autoadmin", desc: "Make someone as admin in your group (Only works if you are admin)", example: "!autoadmin @someone-number" }
        ]
    },
    {
        id: "leader",
        name: "Leader Tools",
        icon: <Users className="h-4 w-4" />,
        commands: [
            { cmd: "!splitgroups [count]", desc: "Split members into smaller groups", example: "!splitgroups 3" },
            { cmd: "!broadcastpm [msg]", desc: "Send message to everyone's DM", example: "!broadcastpm Team meeting at 5" },
            { cmd: "!extractnums", desc: "Get all group members as CSV/List", example: "!extractnums" },
            { cmd: "!antilink [on/off]", desc: "Auto-kick users who send links", example: "!antilink on" },
            { cmd: "!notice [msg]", desc: "Broadcast a highlighted notice", example: "!notice Class cancelled" },
            { cmd: "!opengroup", desc: "Open group for all members", example: "!opengroup" },
            { cmd: "!closegroup", desc: "Close group for admins only", example: "!closegroup" }
        ]
    },
    {
        id: "automation",
        name: "Automation",
        icon: <RefreshCcw className="h-4 w-4" />,
        commands: [
            { cmd: "!autoreply [key] [msg]", desc: "Set automatic response triggers", example: "!autoreply hello Hi there!" },
            { cmd: "!autolikestatus", desc: "Auto-react to WhatsApp statuses", example: "!autolikestatus on" },
            { cmd: "!autoviewstatus", desc: "Auto-view all statuses instantly", example: "!autoviewstatus on" },
            { cmd: "!autoread", desc: "Auto-mark all messages as read", example: "!autoread on" },
            { cmd: "!reminder [time] [msg]", desc: "Set a timed notification", example: "!reminder 1h Drink water" }
        ]
    },
    {
        id: "tools",
        name: "Utility",
        icon: <Wrench className="h-4 w-4" />,
        commands: [
            { cmd: "!weather [city]", desc: "Get real-time weather info", example: "!weather Nairobi" },
            { cmd: "!translate [lang] [text]", desc: "Translate text to any language", example: "!translate sw Hello" },
            { cmd: "!calc [expression]", desc: "Solve mathematical equations", example: "!calc 50 * (2/5)" },
            { cmd: "!qr [text]", desc: "Convert text into a QR code", example: "!qr My website" }
        ]
    },
    {
        id: "media",
        name: "Media",
        icon: <Video className="h-4 w-4" />,
        commands: [
            { cmd: "!play [query]", desc: "Search and play audio (YouTube)", example: "!play As It Was" },
            { cmd: "!video [query]", desc: "Search and download video", example: "!video NASA tour" },
            { cmd: "!movie [name]", desc: "Get IMDb movie information", example: "!movie Interstellar" },
            { cmd: "!news", desc: "Get top global news/sports", example: "!news" },
            { cmd: "!sport", desc: "Get latest sports updates", example: "!sport" }
        ]
    },
    {
        id: "fun",
        name: "Fun",
        icon: <Gamepad2 className="h-4 w-4" />,
        commands: [
            { cmd: "!joke", desc: "Get a random hilarious joke", example: "!joke" },
            { cmd: "!fact", desc: "Learn an interesting random fact", example: "!fact" },
            { cmd: "!fancy [text]", desc: "Stylish font conversion", example: "!fancy Cool Bot" },
            { cmd: "!ship @user1 @user2", desc: "Check love compatibility", example: "!ship @Me @Her" },
            { cmd: "!dare", desc: "Get a spicy dare challenge", example: "!dare" },
            { cmd: "!truth", desc: "Get a deep truth question", example: "!truth" }
        ]
    },
    {
        id: "campus",
        name: "Campus",
        icon: <GraduationCap className="h-4 w-4" />,
        commands: [
            { cmd: "!gpa [details]", desc: "Calculate your current GPA", example: "!gpa A, B, A" },
            { cmd: "!todo [task]", desc: "Manage academic task list", example: "!todo Submit project" },
            { cmd: "!confess", desc: "Send an anonymous confession", example: "!confess I like pizza" },
            { cmd: "!quote", desc: "Inspirational student quote", example: "!quote" }
        ]
    },
    {
        id: "status",
        name: "Profile",
        icon: <UserCircle className="h-4 w-4" />,
        commands: [
            { cmd: "!status", desc: "Check your current account status", example: "!status" },
            { cmd: "!setname [name]", desc: "Change your WhatsApp display name", example: "!setname Tervux Master" },
            { cmd: "!setbio [bio]", desc: "Change your bio/about info", example: "!setbio Coding 24/7" }
        ]
    },
    {
        id: "general",
        name: "General",
        icon: <HelpCircle className="h-4 w-4" />,
        commands: [
            { cmd: "!ping", desc: "Check bot response speed", example: "!ping" },
            { cmd: "!botstats", desc: "View system performance data", example: "!botstats" },
            { cmd: "!help", desc: "Show full command menu in WhatsApp", example: "!help" },
            { cmd: "!owner", desc: "Get developer contact info", example: "!owner" },
            { cmd: "!block @user", desc: "Block a specific user", example: "!block @Spammer" },
            { cmd: "!unblock @user", desc: "Unblock a blocked user", example: "!unblock @John" }
        ]
    }
];



// Memoized particles component to prevent re-rendering on parent state changes (like typing)
const BotParticlesInternal = ({ resolvedTheme }) => {
    const particlesOptions = useMemo(() => ({
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: {
            detectsOn: "window",
            events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: "repulse" },
                resize: true,
            },
            modes: {
                push: { quantity: 4 },
                repulse: { distance: 100, duration: 0.4 },
            },
        },
        particles: {
            color: { value: resolvedTheme === 'dark' ? "#25D366" : "#15803d" },
            links: {
                color: resolvedTheme === 'dark' ? "#25D366" : "#15803d",
                distance: 150,
                enable: true,
                opacity: resolvedTheme === 'dark' ? 0.2 : 0.6,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 1,
                straight: false,
            },
            number: { density: { enable: true, area: 600 }, value: 250 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    }), [resolvedTheme]);

    return (
        <Particles
            id="tsparticles"
            options={particlesOptions}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
};

const BotParticles = memo(BotParticlesInternal);
BotParticles.displayName = "BotParticles";

export default function WhatsAppBotPage() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [init, setInit] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Delay sound slightly to ensure hydration and allow interaction if navigating
        const timer = setTimeout(() => {
            playSound("bot_maintenance_mode");
        }, 1000);

        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });

        return () => clearTimeout(timer);
    }, []);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [expiresAt, setExpiresAt] = useState("");
    const [pairingCode, setPairingCode] = useState("");
    const [method, setMethod] = useState("qr"); // "qr" or "code"
    const [timeLeft, setTimeLeft] = useState(0);

    const [activeCategory, setActiveCategory] = useState("premium");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLinked, setIsLinked] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const pollingRef = useRef(null);

    // Step Progress State
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [steps, setSteps] = useState([
        { id: 1, text: "Initializing secure connection", status: "pending" }, // pending, processing, completed, error
        { id: 2, text: "Verifying phone number", status: "pending" },
        { id: 3, text: "Connecting to WhatsApp network", status: "pending" },
        { id: 4, text: `Generating ${method === "qr" ? "QR" : "Pairing"} Code`, status: "pending" },
    ]);

    const updateStep = (id, status) => {
        setSteps(prev => prev.map(step => step.id === id ? { ...step, status } : step));
    };

    useEffect(() => {
        if (timeLeft <= 0) return;
        if (isLinked) return;
        if (timeLeft === 1) {
            // Precise Expiration at 0
            const msg = method === "qr"
                ? "QR Code expired. Please generate a new one."
                : "Pairing code expired. Please generate a new one.";
            setError(msg);
            setSuccess(false);
            setQrCode("");
            setPairingCode("");
            setLoading(false);
            isProcessingAuth.current = false;
            if (pollingRef.current) clearInterval(pollingRef.current);
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, method, isLinked]);

    const handleLinkedSuccess = () => {
        setIsLinked(true);
        setSuccess(true);

        // Update success message
        setSuccessMessage("NEURAL_UPLINK_SYNCHRONIZED: Your WhatsApp node is now fully operational. Automation protocols have been initialized successfully.");

        toast.success("Connection Established! Your bot is now active.");

        // Stop countdown immediately
        setTimeLeft(0);
        setExpiresAt("");

        // Stop all polling immediately
        if (pollingRef.current) clearInterval(pollingRef.current);
        if (codePollingRef.current) clearInterval(codePollingRef.current);

        // Prevent any "still processing" UI
        setLoading(false);
        isProcessingAuth.current = false;

        // Big celebration confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Since particles fall down, start a bit higher than random
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#25D366', '#128C7E', '#34B7F1']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#d946ef', '#3b82f6', '#25D366']
            });
        }, 250);
    };

    // Debug Backend URL
    useEffect(() => {
        console.log("🔌 WhatsApp Bot Backend URL:", BACKEND_URL);
    }, []);

    const startPolling = (phone) => {
        if (statusPollingRef.current) clearInterval(statusPollingRef.current);

        const cleanPhone = phone.replace(/\D/g, "");
        console.log(`📡 [${cleanPhone}] Starting status polling...`);

        statusPollingRef.current = setInterval(async () => {
            try {
                // Multi-User Isolation: Check current ref
                const activePhone = phoneNumberRef.current?.replace(/\D/g, "");
                if (cleanPhone !== activePhone) {
                    console.log(`[Polling] Stale session ${cleanPhone} stopped (Active: ${activePhone})`);
                    clearInterval(statusPollingRef.current);
                    return;
                }

                const res = await fetch(`${BACKEND_URL}/api/session-status?phoneNumber=${cleanPhone}`);

                // Safety check for HTML responses (404/500 proxy errors)
                const contentType = res.headers.get("content-type");
                if (!res.ok || (contentType && contentType.includes("text/html"))) {
                    return;
                }

                const data = await res.json();

                if (data.active) {
                    console.log(`✅ [${cleanPhone}] Status Polling detected ACTIVE session.`);
                    handleLinkedSuccess();
                    clearInterval(statusPollingRef.current);
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 3000); // Check every 3 seconds
    };

    const [queuePosition, setQueuePosition] = useState(null);
    const [queueWait, setQueueWait] = useState(null);
    const [isQueueing, setIsQueueing] = useState(false);
    const [totalLinking, setTotalLinking] = useState(0); // Total users currently linking
    const codePollingRef = useRef(null);
    const statusPollingRef = useRef(null);
    const socketRef = useRef(null);
    const isProcessingAuth = useRef(false); // Guard against duplicate calls

    // Refs for safe access in async listeners (avoid stale closures)
    const phoneNumberRef = useRef(phoneNumber);
    const successRef = useRef(success);
    const isLinkedRef = useRef(isLinked);
    const qrCodeRef = useRef(qrCode);
    const pairingCodeRef = useRef(pairingCode);

    // Keep refs in sync
    useEffect(() => { phoneNumberRef.current = phoneNumber; }, [phoneNumber]);
    useEffect(() => { successRef.current = success; }, [success]);
    useEffect(() => { isLinkedRef.current = isLinked; }, [isLinked]);
    useEffect(() => { qrCodeRef.current = qrCode; }, [qrCode]);
    useEffect(() => { pairingCodeRef.current = pairingCode; }, [pairingCode]);

    // Stop all polling on unmount
    useEffect(() => {
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (codePollingRef.current) clearInterval(codePollingRef.current);
            if (statusPollingRef.current) clearInterval(statusPollingRef.current);
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    // Socket.IO hook for Queue Updates
    useEffect(() => {
        let socket;
        import("socket.io-client").then(({ io }) => {
            socket = io(BACKEND_URL);
            socketRef.current = socket;

            socket.on("connect", () => {
                console.log("🔌 Connected to Socket.IO");
            });

            socket.on("stats_update", (data) => {
                try {
                    const currentPhone = phoneNumberRef.current?.replace(/\D/g, "");
                    if (!currentPhone) return;
                    if (!data || data.event !== "new_pairing_success") return;

                    // Multi-User Isolation: Strictly verify phone matches
                    if (data.phone !== currentPhone) {
                        console.log(`[Socket] Success for ${data.phone} ignored (Current: ${currentPhone})`);
                        return;
                    }
                    if (isLinkedRef.current) return;

                    console.log("✅ [Pairing Success] Instant stats_update received for", currentPhone);
                    handleLinkedSuccess();
                } catch (e) {
                    console.error("stats_update handler error:", e);
                }
            });

            socket.on("queue_update", (data) => {
                const currentPhone = phoneNumberRef.current?.replace(/\D/g, "");
                if (!currentPhone) return;

                // Ignore updates if we are already processing or already have results
                if (isProcessingAuth.current || successRef.current || qrCodeRef.current || pairingCodeRef.current) return;

                console.log("⚡ [Queue Update]", data);
                if (data.totalLinking !== undefined) {
                    setTotalLinking(data.totalLinking);
                }

                // Find our position in the queueList
                const mySpot = data.queueList.find(q => q.sessionId === currentPhone);

                if (mySpot) {
                    // Update position ONLY if we are already actively queuing
                    // This prevents "ghost popups" for idle users with prefilled numbers
                    if (isQueueing) {
                        setQueuePosition(mySpot.position);
                        setQueueWait(mySpot.waitTime);
                        setLoading(true); // Keep loading state active while in queue
                    }
                    // REMOVED: Auto-enter queuing step from input.
                    // We only enter 'queuing' if the user explicitly clicked 'Initialize Handshake'
                } else if (data.currentlyLinking === 1 && data.currentSlotUser === currentPhone) {
                    // We are ACTIVE!
                    console.log(`[DEBUG] Slot detected for ${currentPhone}. isQueueing: ${isQueueing}, Loading: ${loading}, isProcessingAuth: ${isProcessingAuth.current}`);

                    // ONLY auto-transition if we were already in queueing state and not already processing
                    if (isQueueing && !isProcessingAuth.current) {
                        console.log("🚀 Queue finished! Starting pairing...");
                        setIsQueueing(false);
                        setQueuePosition(null);
                        setQueueWait(null);
                        setLoading(false); // Reset loading before starting pairing
                        setShowProgressModal(true);
                        handlePair(true); // Treat as retry (instant transition without re-initializing steps)
                    }
                } else {
                    // Not in queue and not active -> reset queue UI
                    // Only if we were previously queueing and not currently processing/success
                    if (isQueueing && !isProcessingAuth.current && !success) {
                        setIsQueueing(false);
                        setQueuePosition(null);
                        setQueueWait(null);
                    }
                }
            });
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, [phoneNumber, isQueueing, method, success, qrCode, pairingCode, isLinked]);

    // Remove old poller functionality
    const startQueuePolling = (phone, pollUrl) => {
        console.log("⚠️ Using Socket.IO for queue updates instead of polling.");
    };

    const handleCancelQueue = async () => {
        try {
            const cleanPhone = phoneNumber.replace(/\D/g, "");
            await fetch(`${BACKEND_URL}/api/pair/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: cleanPhone })
            });

            // Cleanup all timers
            if (codePollingRef.current) clearInterval(codePollingRef.current);
            if (statusPollingRef.current) clearInterval(statusPollingRef.current);
            if (pollingRef.current) clearInterval(pollingRef.current);

            setIsQueueing(false);
            setQueuePosition(null);
            setLoading(false);
            setSuccess(false);
            setQrCode("");
            setPairingCode("");
            isProcessingAuth.current = false;
            setShowProgressModal(false);
            toast.info("Linking request cancelled");
        } catch (e) {
            console.error("Failed to cancel queue:", e);
        }
    };

    const startCodePolling = (phone) => {
        if (codePollingRef.current) clearInterval(codePollingRef.current);

        codePollingRef.current = setInterval(async () => {
            try {
                const cleanPhone = phone.replace(/\D/g, "");
                const res = await fetch(`${BACKEND_URL}/api/pair/code/${cleanPhone}`);

                if (res.ok) {
                    const data = await res.json();
                    if (data.code && data.code !== pairingCode) {
                        setPairingCode(data.code);
                        setExpiresAt(Date.now() + (data.expiresInSeconds || 90) * 1000);
                        setTimeLeft(data.expiresInSeconds || 90);
                        clearInterval(codePollingRef.current); // Stop polling once we have it
                    }
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    if (res.status !== 404) {
                        console.error("Code polling error:", errorData.error);
                        const friendlyError = errorData.error === "Connection Closed"
                            ? "Connection lost. Please try again."
                            : (errorData.error || "Failed to fetch pairing code");
                        setError(friendlyError);
                        clearInterval(codePollingRef.current);
                        setSuccess(false);
                        setLoading(false);
                        isProcessingAuth.current = false;
                    } else {
                        // 404 is normal while generating, just continue
                    }
                }
            } catch (err) {
                console.error("Code polling error:", err);
                clearInterval(codePollingRef.current);
            }
        }, 3000); // 3s polling for better responsiveness
    };

    const startQrPolling = (phone) => {
        if (pollingRef.current) clearInterval(pollingRef.current);

        pollingRef.current = setInterval(async () => {
            try {
                const cleanPhone = phone.replace(/\D/g, "");
                const res = await fetch(`${BACKEND_URL}/api/pair/qr/${cleanPhone}`);

                if (res.ok) {
                    const data = await res.json();
                    if (data.qr && data.qr !== qrCode) {
                        setQrCode(data.qr);
                        setExpiresAt(Date.now() + (data.expiresInSeconds || 90) * 1000);
                        setTimeLeft(data.expiresInSeconds || 90);
                        clearInterval(pollingRef.current);
                    }
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    if (res.status !== 404) {
                        console.error("QR polling error:", errorData.error);
                        setError(errorData.error || "Failed to fetch QR code");
                        clearInterval(pollingRef.current);
                        setSuccess(false);
                        setLoading(false);
                        isProcessingAuth.current = false;
                    }
                }
            } catch (err) {
                console.error("QR polling error:", err);
                clearInterval(pollingRef.current);
            }
        }, 3000);
    };

    const handlePair = async (isRetry = false) => {
        if (isProcessingAuth.current) return;
        isProcessingAuth.current = true; // Lock

        const cleanPhone = phoneNumber.replace(/\D/g, "");
        if (!cleanPhone || cleanPhone.length < 10) {
            setError("Please enter a valid phone number (min 10 digits)");
            isProcessingAuth.current = false; // Unlock
            return;
        }
        if (cleanPhone.startsWith("0")) {
            setError("Please use Country Code (e.g., 254...), do NOT start with 0");
            isProcessingAuth.current = false; // Unlock
            return;
        }

        setLoading(true);
        setError("");

        if (!isRetry) {
            if (statusPollingRef.current) clearInterval(statusPollingRef.current);
            setQrCode("");
            setPairingCode("");
            setSuccess(false);
            setQueuePosition(null);
            setIsQueueing(false);

            // Reset Steps
            setSteps([
                { id: 1, text: "Initializing secure connection", status: "pending" },
                { id: 2, text: "Verifying phone number", status: "pending" },
                { id: 3, text: "Connecting to WhatsApp network", status: "pending" },
                { id: 4, text: `Generating ${method === "qr" ? "QR" : "Pairing"} Code`, status: "pending" },
            ]);
            setShowProgressModal(true);
        }

        const wait = (ms) => new Promise(res => setTimeout(res, ms));

        try {
            // Only show progress steps if not instant retry from queue
            if (!isRetry) {
                updateStep(1, "processing");
                await wait(800);
                updateStep(1, "completed");

                updateStep(2, "completed");

                updateStep(3, "processing");
            }

            // Actual API Call
            const controller = new AbortController();
            const requestTimeout = setTimeout(() => controller.abort(), 15000);
            let response;
            try {
                response = await fetch(`${BACKEND_URL}/api/pair`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ phoneNumber, method }),
                    signal: controller.signal
                });
            } catch (e) {
                if (e?.name === "AbortError") {
                    throw new Error("Backend request timed out. Please ensure whatsapp-bot-backend is running and reachable.");
                }
                throw e;
            } finally {
                clearTimeout(requestTimeout);
            }

            // Safety check for HTML responses
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("text/html")) {
                const text = await response.text();
                console.error("API returned HTML:", text.substring(0, 100)); // Log first 100 chars
                throw new Error("Backend connection failed (received HTML). Check console for details.");
            }

            const data = await response.json();

            // Handle Queue Full
            if (response.status === 429) {
                throw new Error(data.message || "Server is busy. Please try again later.");
            }

            // Handle Queued
            if (response.status === 202) {
                setIsQueueing(true);
                setQueuePosition(data.position);
                setQueueWait(data.estimatedWaitSeconds);

                // Close modal to show the Queue UI on the main page
                setShowProgressModal(false);

                // No polling needed, Socket.IO handles it
                return; // Stop here, polling will resume handlePair when active
            }

            // If we proceeds here, we are active (not queued)
            setIsQueueing(false);

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate pairing info");
            }

            if (!isRetry) updateStep(3, "completed");

            // Step 4: Generate
            if (!isRetry) {
                updateStep(4, "processing");
                await wait(800);
            }

            // If we receive a valid QR or code, or if this is the initial response with null code (which is expected)
            if (data.type === 'qr' || data.type === 'code' || data.qr || data.code) {
                // Determine actual data presence
                const hasCode = !!data.code;
                const hasQr = !!data.qr;

                if (hasQr) {
                    setQrCode(data.qr);
                    setExpiresAt(data.expiresAt);
                    setTimeLeft(Math.ceil((new Date(data.expiresAt) - new Date()) / 1000));
                    setError("");
                    updateStep(3, "completed");
                    updateStep(4, "processing");
                } else if (hasCode) {
                    setPairingCode(data.code);
                    setExpiresAt(data.expiresAt);
                    setTimeLeft(Math.ceil((new Date(data.expiresAt) - new Date()) / 1000));
                    setError("");
                    updateStep(3, "completed");
                    updateStep(4, "processing");
                } else {
                    // This is the initial response (handshake), just update the step
                    updateStep(3, "completed");
                    updateStep(4, "processing");
                    setError("");
                }

                // CRITICAL: Force immediate polling start if we don't have the final data yet
                if (!hasQr && !hasCode) {
                    console.log("🚀 Handshake received. Forcing immediate polling...");
                    if (method === "qr") {
                        startQrPolling(phoneNumber);
                    } else {
                        startCodePolling(phoneNumber);
                    }
                }

                setSuccess(true);
                updateStep(4, "completed");
            }
            else if (data.status === "active" || data.message === "Session already active") {
                // Already paired, show full success confetti
                handleLinkedSuccess();
            } else if (data.message === "Already paired") {
                setSuccess(true);
                updateStep(4, "completed");
                setExpiresAt(data.expiresAt);
                setError("This number is already paired! Bot is active.");
            } else if (data.error) {
                // Show error message from backend
                setError(data.error);
                updateStep(4, "error");
            } else {
                // If we get here, it means we didn't get a QR or code, but also no error
                // This could be a transient state, so we'll wait for the next poll
                console.log("Waiting for QR/pairing code...");
                // Don't show an error message to avoid confusing the user
                setError("");
                throw new Error("No QR code or pairing code received");
            }

            if (!isRetry) await wait(800);
            setShowProgressModal(false);

            // Final data check to start polling for connection (after QR/Code is visible)
            if (data.qr || data.code) {
                startPolling(phoneNumber);

                // Small celebration for generating the code (not full linked celebration)
                import("canvas-confetti").then((confetti) => {
                    confetti.default({
                        particleCount: 80,
                        spread: 60,
                        origin: { y: 0.7 },
                        colors: ['#25D366', '#d946ef', '#3b82f6']
                    });
                });
            }

        } catch (err) {
            // Find current processing step and mark as error
            setSteps(prev => {
                const processing = prev.find(s => s.status === "processing");
                if (processing) {
                    return prev.map(s => s.id === processing.id ? { ...s, status: "error" } : s);
                }
                return prev;
            });
            await wait(1500); // Show error state briefly
            setError(err.message || "Failed to connect to backend");
            setShowProgressModal(false);
            setIsQueueing(false);
        } finally {
            isProcessingAuth.current = false; // Unlock
            if (!isQueueing) setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-primary/30">
            {/* tsparticles Background - Memoized to prevent re-stacking during state updates */}
            {init && mounted && (
                <BotParticles resolvedTheme={resolvedTheme} />
            )}

            {/* Refined Header/Hero */}
            <div className="relative z-10 container mx-auto px-4 pt-16 pb-12 lg:pt-28 lg:pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-6 max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-primary"
                        />
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary">System Online</span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold tracking-tight leading-tight text-foreground">
                        UPLINK <span className="text-primary italic">V2.0</span>
                    </h1>
                    <p className="text-xs sm:text-base text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed px-4">
                        Establish a high-bandwidth neural connection to your WhatsApp instance.
                        Encrypted. Autonomous. Irrelevant of physical proximity.
                    </p>
                </motion.div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Main Content Sections */}

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 mb-12 lg:mb-32">
                        {/* Left: Pairing Console (Terminal) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="lg:col-span-7 space-y-6 lg:space-y-8"
                        >
                            <div className="group relative">
                                {/* Glowing Border Effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/0 rounded-3xl blur opacity-20 transition duration-1000"></div>

                                <div className="relative p-6 lg:p-8 rounded-3xl border border-border bg-card/90 dark:bg-card/50 backdrop-blur-2xl shadow-xl overflow-hidden">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <h2 className="text-lg lg:text-xl font-semibold tracking-tight text-foreground flex items-center gap-3">
                                                <Terminal className="h-5 w-5 text-primary" />
                                                UPLINK_TERMINAL
                                            </h2>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Secure Handshake Protocol</p>
                                        </div>
                                        <div className="flex gap-1.5 opacity-30">
                                            <div className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                                        </div>
                                    </div>

                                    {/* Action Toggle */}
                                    <div className="inline-flex p-1 bg-muted/50 rounded-xl mb-8 border border-border/20">
                                        {["qr", "code"].map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => setMethod(m)}
                                                className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${method === m ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                                                disabled={loading || success || isQueueing}
                                            >
                                                {m === "qr" ? "Optical Scan" : "Neural Code"}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Content States */}
                                    {success ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-8 py-4"
                                        >
                                            <div className="flex flex-col items-center text-center space-y-4">
                                                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                    <Check className="h-8 w-8 text-primary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-bold tracking-tight text-primary flex items-center justify-center gap-2">
                                                        <Sparkles className="h-5 w-5 animate-pulse" />
                                                        {isLinked ? "UPLINK_SUCCESS" : "AUTHORIZATION_PENDING"}
                                                        <Sparkles className="h-5 w-5 animate-pulse" />
                                                    </h3>
                                                    <div className="relative group/msg">
                                                        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed p-4 rounded-2xl bg-primary/5 border border-primary/10 transition-colors group-hover/msg:bg-primary/10">
                                                            {isLinked
                                                                ? successMessage || "Neural uplink complete. Bot modules are now autonomous. You may close this terminal."
                                                                : (method === "qr"
                                                                    ? "Optical pattern generated. Point your primary device at the sensor array below."
                                                                    : "8-digit neural key generated. Input this string into your WhatsApp 'Linked Devices' module.")}
                                                        </p>
                                                    </div>
                                                    {isLinked && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="pt-2"
                                                        >
                                                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] animate-pulse">
                                                                [ SYSTEM_100%_OPERATIONAL ]
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Code Display logic remains same but with better styling */}
                                            <div className="flex justify-center min-h-[200px] items-center">
                                                {!isLinked && !qrCode && !pairingCode && (
                                                    <div className="flex flex-col items-center gap-4 text-primary/50">
                                                        <Loader2 className="h-10 w-10 animate-spin" />
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Generating Digital Signature...</p>
                                                    </div>
                                                )}
                                                {qrCode && !isLinked && (
                                                    <div className="p-4 bg-white rounded-2xl shadow-xl transition-transform hover:scale-105 duration-500 border border-border/40">
                                                        <QRCodeSVG value={qrCode} size={200} level={"H"} />
                                                    </div>
                                                )}
                                                {pairingCode && !isLinked && (
                                                    <div className="flex flex-col items-center gap-6">
                                                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 cursor-pointer group" onClick={() => { navigator.clipboard.writeText(pairingCode); toast.success("Neural Key Copied"); }}>
                                                            {pairingCode.split("").map((char, i) => (
                                                                <div key={i} className="w-9 h-12 bg-muted/30 border border-border/40 rounded-xl flex items-center justify-center text-xl font-bold text-primary group-hover:border-primary/50 transition-all shadow-sm">
                                                                    {char}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Copy & Share Actions */}
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="flex items-center gap-3"
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-9 px-4 rounded-xl border-border bg-card/50 hover:bg-muted text-[9px] font-bold uppercase tracking-widest gap-2"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(pairingCode);
                                                                    toast.success("Pairing Code copied to repository!");
                                                                }}
                                                            >
                                                                <Copy size={12} /> COPY_KEY
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-9 px-4 rounded-xl border-border bg-card/50 hover:bg-muted text-[9px] font-bold uppercase tracking-widest gap-2"
                                                                onClick={() => {
                                                                    if (navigator.share) {
                                                                        navigator.share({
                                                                            title: 'Tervux Bot Neural Key',
                                                                            text: `My Tervux Bot Pairing Code is: ${pairingCode}. Use this to link your WhatsApp instance.`,
                                                                        }).catch(() => { });
                                                                    } else {
                                                                        toast.error("Sharing not supported on this browser.");
                                                                    }
                                                                }}
                                                            >
                                                                <Share2 size={12} /> SHARE_TOKEN
                                                            </Button>
                                                        </motion.div>
                                                    </div>
                                                )}
                                            </div>

                                            {expiresAt && timeLeft > 0 && (
                                                <div className="flex justify-center">
                                                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                                        <Clock className="h-3 w-3" />
                                                        Uplink Expiry: {timeLeft}S
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                                <Button onClick={() => { handleCancelQueue(); setSuccess(false); setQrCode(""); setPairingCode(""); setPhoneNumber(""); setIsLinked(false); }} variant="outline" className="flex-1 h-12 rounded-xl border-border bg-card hover:bg-muted text-foreground font-bold text-xs tracking-widest uppercase">
                                                    Reset Uplink
                                                </Button>
                                                {isLinked && (
                                                    <Button onClick={() => window.location.reload()} className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-xs tracking-widest uppercase shadow-lg shadow-primary/20">
                                                        Network Status
                                                    </Button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : isQueueing ? (
                                        <div className="py-8 space-y-8">
                                            <div className="flex flex-col items-center text-center space-y-4">
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-full border-2 border-primary/20 animate-spin" style={{ borderTopColor: "var(--primary)" }} />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Activity className="h-8 w-8 text-primary animate-pulse" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-xl tracking-tight">TRAFFIC_CONTROL</h3>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Position in Buffer: #{queuePosition}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-center">
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Queue Status</p>
                                                    <p className="text-lg text-foreground">{queuePosition === 1 ? "PRIORITY" : "WAITING"}</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-center">
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Estimated Delay</p>
                                                    <p className="text-lg text-foreground">{!queueWait || queueWait < 60 ? "< 1M" : `~${Math.ceil(queueWait / 60)}M`}</p>
                                                </div>
                                            </div>

                                            {/* Infrastructure Notice */}
                                            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                                                <div className="flex items-center gap-2 text-primary">
                                                    <ShieldCheck className="h-4 w-4" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Infrastructure_Notice</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                                    Due to limited infrastructure, only one user can perform linking at a time.
                                                    <span className="text-foreground font-bold"> Please wait for your turn;</span> your session will begin automatically as soon as those ahead of you have finished.
                                                </p>
                                            </div>

                                            <Button onClick={handleCancelQueue} variant="ghost" className="w-full text-destructive hover:text-destructive/80 hover:bg-destructive/10 text-[10px] uppercase tracking-widest">
                                                Terminate Buffer Request_
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                        <Globe className="h-3 w-3" />
                                                        International_Uplink_Node
                                                    </label>
                                                    <span className="text-[10px] font-bold text-primary/70 uppercase">Input: Phone_Num</span>
                                                </div>
                                                <div className="relative group/input">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within/input:text-primary transition-colors">
                                                        <Plus className="h-4 w-4" />
                                                    </div>
                                                    <Input
                                                        type="tel"
                                                        placeholder="Phone Module ID (e.g. 255...)"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className="w-full h-14 pl-11 bg-muted/30 border-border/60 group-hover/input:border-border focus:border-primary/50 text-base font-semibold tracking-tight text-foreground placeholder:text-muted-foreground/30 transition-all rounded-xl"
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <p className="text-[9px] text-muted-foreground/60 font-medium uppercase tracking-wider ml-1">
                                                    * Omit leading zero. Include country prefix for global signal lock.
                                                </p>
                                            </div>

                                            <Button
                                                onClick={() => handlePair(false)}
                                                disabled={loading || !phoneNumber}
                                                className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group/btn"
                                            >
                                                {loading ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        {method === "qr" ? "GENERATE_OPTICAL_KEY" : "GENERATE_NEURAL_KEY"}
                                                        <Zap className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl bg-destructive/5 border border-destructive/20 flex items-center gap-3 text-destructive">
                                            <AlertCircle className="h-4 w-4 shrink-0" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{error}</span>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Signal Strength / Stats Display */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "LATENCY", val: "14ms", icon: Activity },
                                    { label: "ENCRYPTION", val: "AES-256", icon: Shield },
                                    { label: "UPTIME", val: "99.9%", icon: RefreshCcw }
                                ].map((s, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-border/40 bg-muted/20 flex flex-col items-center text-center space-y-1 hover:bg-muted/30 transition-colors cursor-default">
                                        <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">{s.label}</p>
                                        <p className="text-[10px] font-semibold text-foreground tracking-widest">{s.val}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: Core Features (Grid) */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="lg:col-span-5 space-y-6"
                        >
                            <div className="flex flex-col h-full">
                                <div className="p-6 lg:p-8 rounded-3xl border border-border bg-card/90 dark:bg-card/50 backdrop-blur-md flex-1">
                                    <div className="space-y-1 mb-8">
                                        <h2 className="text-base lg:text-lg font-semibold text-foreground tracking-tight uppercase">Core_Modules</h2>
                                        <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Advanced Automation Suite</p>
                                    </div>

                                    <div className="grid gap-3 lg:gap-4">
                                        {features.map((f, i) => (
                                            <div key={i} className="group flex gap-4 p-4 rounded-xl bg-muted/50 dark:bg-muted/30 border border-border/60 dark:border-border/20 hover:bg-muted/70 dark:hover:bg-muted/50 hover:border-primary/20 transition-all duration-300">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-card border border-border/80 dark:border-border flex items-center justify-center text-foreground/70 dark:text-muted-foreground group-hover:text-primary transition-colors">
                                                    {f.icon}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h3 className="text-xs font-bold text-foreground tracking-tight uppercase group-hover:text-primary transition-colors">{f.title}</h3>
                                                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">{f.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
                                        <div className="flex items-center gap-3 text-primary">
                                            <Sparkles className="h-4 w-4 animate-spin-slow" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Premium_Protocol</span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic">
                                            "Every node is optimized for maximum performance and stealth, ensuring 100% detection avoidance."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Disclaimer & Anti-Scam Card */}
                    {/* Disclaimer & Security Protocol */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 lg:mb-32"
                    >
                        <div className="relative group p-1 rounded-3xl bg-gradient-to-br from-amber-500/20 via-transparent to-amber-500/5 overflow-hidden">
                            <div className="absolute inset-0 bg-card/90 dark:bg-card/60 backdrop-blur-3xl rounded-3xl" />
                            <div className="relative p-6 lg:p-12 flex flex-col lg:flex-row items-center gap-10">
                                <div className="flex-shrink-0 relative">
                                    <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5">
                                        <ShieldAlert size={32} className="animate-pulse" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center animate-bounce shadow-md">
                                        <AlertTriangle size={10} className="text-black font-bold" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6 text-center lg:text-left">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-semibold tracking-tight text-foreground uppercase">
                                            SECURITY_DISCLAIMER <span className="text-amber-500 font-normal">v1.2</span>
                                        </h2>
                                        <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">Official Safety Protocol</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-3 p-6 rounded-2xl bg-muted/20 border border-border/40 group-hover:bg-muted/30 transition-all">
                                            <div className="flex items-center gap-2 text-amber-500">
                                                <Zap size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Zero_Cost_Neural_Link</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                                Tervux WhatsApp modules are <span className="text-foreground font-bold">100% FREE</span>.
                                                If any entity requests currency for this uplink, terminate the connection immediately.
                                            </p>
                                        </div>
                                        <div className="space-y-3 p-6 rounded-2xl bg-muted/20 border border-border/40 group-hover:bg-muted/30 transition-all">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Cpu size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">BETA_OS_CAUTION</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                                This system is in autonomous beta. Algorithmic errors may occur.
                                                Do not rely on this node for mission-critical data.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            Help us optimize the network. Report anomalies below.
                                        </p>
                                        <Button variant="outline" className="h-10 px-6 rounded-xl border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 font-bold text-[9px] uppercase tracking-widest group/rep" asChild>
                                            <Link href="/contact" className="gap-2">
                                                FILE_INCIDENT_REPORT <ExternalLink size={12} className="group-hover/rep:translate-x-0.5 group-hover/rep:-translate-y-0.5 transition-transform" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Detailed Command Directory */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="mb-20 lg:mb-32"
                    >
                        <div className="text-center space-y-3 mb-16">
                            <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-foreground uppercase">
                                COMMAND_CORE
                            </h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Centralized Control Interface</p>
                        </div>

                        <div className="relative group">
                            {/* Inner Terminal Look */}
                            <div className="p-1 rounded-3xl bg-muted/20 border border-border shadow-lg">
                                <div className="bg-card/95 dark:bg-card/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl">

                                    {/* Tabs Header */}
                                    <div className="flex flex-col xl:flex-row xl:items-stretch border-b border-border bg-muted/30 dark:bg-muted/20">
                                        <div className="flex flex-wrap lg:flex-nowrap overflow-x-auto no-scrollbar xl:flex-1 p-2 gap-1.5">
                                            {commandCategories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setActiveCategory(cat.id)}
                                                    className={`flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${activeCategory === cat.id ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                                                >
                                                    <span className={`${activeCategory === cat.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"} transition-colors`}>{cat.icon}</span>
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="p-3 xl:border-l border-border flex items-center bg-background/60 dark:bg-background/40">
                                            <div className="relative w-full xl:w-72">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <input
                                                    type="text"
                                                    placeholder="Search_System_Database..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full h-10 bg-muted/50 dark:bg-background/50 border border-border focus:border-primary/50 focus:ring-0 rounded-xl py-2 pl-11 pr-4 text-xs font-semibold text-foreground placeholder:text-muted-foreground/30 transition-all uppercase tracking-widest"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Commands Display */}
                                    <div className="p-6 lg:p-12 min-h-[400px] lg:min-h-[600px]">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeCategory + searchQuery}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.3 }}
                                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                                            >
                                                {commandCategories
                                                    .find(c => c.id === activeCategory)
                                                    ?.commands
                                                    .filter(cmd =>
                                                        cmd.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                        cmd.desc.toLowerCase().includes(searchQuery.toLowerCase())
                                                    )
                                                    .map((cmd, i) => (
                                                        <motion.div
                                                            key={cmd.cmd}
                                                            initial={{ opacity: 0, y: 15 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="group/card relative p-4 lg:p-5 rounded-2xl bg-muted/20 dark:bg-muted/10 border border-border/80 dark:border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-md"
                                                        >
                                                            <div className="absolute top-4 right-4 text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest group-hover/card:text-primary/40 transition-colors">
                                                                ID_{i.toString().padStart(3, '0')}
                                                            </div>
                                                            <div className="space-y-3 lg:space-y-4">
                                                                <code className="block text-sm lg:text-base font-bold text-foreground tracking-tight group-hover/card:text-primary transition-colors">
                                                                    {cmd.cmd}
                                                                </code>
                                                                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed uppercase tracking-tight">
                                                                    {cmd.desc}
                                                                </p>
                                                                <div className="space-y-1.5 pointer-events-none">
                                                                    <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Execute:</span>
                                                                    <div className="p-3 bg-muted/30 border border-border/40 rounded-xl font-mono text-[10px] text-muted-foreground group-hover/card:text-foreground transition-colors overflow-hidden truncate">
                                                                        <span className="text-primary/40 mr-1">$</span> {cmd.example}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                }
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* Empty State */}
                                        {commandCategories
                                            .find(c => c.id === activeCategory)
                                            ?.commands
                                            .filter(cmd =>
                                                cmd.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                cmd.desc.toLowerCase().includes(searchQuery.toLowerCase())
                                            ).length === 0 && (
                                                <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50 italic">
                                                    <Search size={40} className="text-zinc-800" />
                                                    <p className="text-zinc-600 font-black uppercase tracking-widest text-xs">No matching system commands found_</p>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Return to Sector_A */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="pb-24 text-center"
                    >
                        <Button variant="outline" size="lg" asChild className="h-14 px-10 rounded-xl border-border bg-card hover:bg-muted text-foreground font-bold text-[9px] uppercase tracking-[0.2em] group">
                            <Link href="/products" className="gap-3">
                                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1.5 transition-transform" />
                                Return_to_Main_Grid
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Pairing Progress Modal */}
            <AnimatePresence>
                {showProgressModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/60 bg-card p-8 shadow-2xl"
                        >
                            <div className="text-center mb-8 relative z-10">
                                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Loader2 className="h-7 w-7 animate-spin" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-foreground tracking-tight">Setting Up Bot</h3>
                                <p className="text-xs text-muted-foreground mt-1.5">Initializing your premium assistant session</p>
                            </div>

                            <div className="space-y-5 relative z-10">
                                {steps.map((step, i) => (
                                    <div key={step.id} className="flex items-center gap-4">
                                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step.status === "completed" ? "bg-primary border-primary text-primary-foreground shadow-sm" :
                                            step.status === "processing" ? "border-primary text-primary animate-pulse" :
                                                step.status === "error" ? "border-destructive text-destructive" :
                                                    "border-border/60 text-muted-foreground/20"
                                            }`}>
                                            {step.status === "completed" && <Check className="h-3.5 w-3.5" />}
                                            {step.status === "processing" && <div className="w-2 h-2 bg-current rounded-full" />}
                                            {step.status === "error" && <AlertCircle className="h-3.5 w-3.5" />}
                                            {step.status === "pending" && <span className="text-[10px] font-bold">{i + 1}</span>}
                                        </div>
                                        <span className={`text-[13px] font-semibold transition-colors duration-300 ${step.status === "completed" ? "text-foreground" :
                                            step.status === "processing" ? "text-primary font-bold" :
                                                step.status === "error" ? "text-destructive" :
                                                    "text-muted-foreground/50"
                                            }`}>
                                            {step.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowProgressModal(false)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
