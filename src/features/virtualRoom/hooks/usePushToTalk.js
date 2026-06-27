import { useEffect, useRef, useState, useCallback } from "react";
import { Room, RoomEvent, Track } from "livekit-client";

export function usePushToTalk({ token, url, enabled }) {
    const roomRef = useRef(null);
    const isConnectedRef = useRef(false);
    // NEW: State to track who is currently talking
    const [activeSpeakers, setActiveSpeakers] = useState([]);

    // Connect to LiveKit room when component mounts
    useEffect(() => {
        if (!token || !url || !enabled) return;

        const room = new Room({
            audioCaptureDefaults: {
                echoCancellation: true,
                noiseSuppression: true,
            },
        });

        roomRef.current = room;

        room.on(
            RoomEvent.TrackSubscribed,
            (track, publication, participant) => {
                if (track.kind === Track.Kind.Audio) {
                    const audioElement = track.attach();
                    document.body.appendChild(audioElement);
                }
            },
        );

        room.on(
            RoomEvent.TrackUnsubscribed,
            (track, publication, participant) => {
                if (track.kind === Track.Kind.Audio) {
                    track.detach();
                }
            },
        );

        // NEW: Listen for the active speakers changing
        room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
            // 'speakers' is an array of Participant objects.
            // We extract their identity/name to display in the UI.
            setActiveSpeakers(speakers.map((p) => p.name || p.identity));
        });

        room.connect(url, token)
            .then(async () => {
                isConnectedRef.current = true;
                await room.localParticipant.setMicrophoneEnabled(true);
                const micPub = room.localParticipant.getTrackPublication(
                    Track.Source.Microphone,
                );
                if (micPub) await micPub.mute();
            })
            .catch((err) => {
                console.error("LiveKit connect failed:", err);
            });

        return () => {
            room.disconnect();
            roomRef.current = null;
            isConnectedRef.current = false;
        };
    }, [token, url, enabled]);

    // Push to talk: unmute on keydown, mute on keyup
    useEffect(() => {
        if (!enabled) return;

        const onKeyDown = async (e) => {
            if (e.code !== "KeyV" || e.repeat) return;
            if (!isConnectedRef.current || !roomRef.current) return;

            const micPub = roomRef.current.localParticipant.getTrackPublication(
                Track.Source.Microphone,
            );
            if (micPub?.isMuted) await micPub.unmute();
        };

        const onKeyUp = async (e) => {
            if (e.code !== "KeyV") return;
            if (!isConnectedRef.current || !roomRef.current) return;

            const micPub = roomRef.current.localParticipant.getTrackPublication(
                Track.Source.Microphone,
            );
            if (micPub && !micPub.isMuted) await micPub.mute();
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, [enabled]);

    // NEW: Expose the active speakers array to the component that calls this hook
    return { activeSpeakers };
}
