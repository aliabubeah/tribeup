import { useEffect, useRef, useCallback } from "react";
import { Room, RoomEvent, Track } from "livekit-client";

export function usePushToTalk({ token, url, enabled }) {
    const roomRef = useRef(null);
    const isConnectedRef = useRef(false);

    // Connect to LiveKit room when component mounts
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

        // Listen for incoming audio from other players!
        room.on(
            RoomEvent.TrackSubscribed,
            (track, publication, participant) => {
                if (track.kind === Track.Kind.Audio) {
                    // track.attach() creates an HTML <audio> element and starts playing it
                    const audioElement = track.attach();
                    // We append it to the body so the browser actually renders and plays it
                    document.body.appendChild(audioElement);
                }
            },
        );

        // Cleanup the audio element when they stop talking or leave
        room.on(
            RoomEvent.TrackUnsubscribed,
            (track, publication, participant) => {
                if (track.kind === Track.Kind.Audio) {
                    track.detach();
                }
            },
        );

        room.connect(url, token)
            .then(async () => {
                isConnectedRef.current = true;

                // Enable mic track but immediately mute it.
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
}
