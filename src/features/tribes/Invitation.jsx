import { Link, useNavigate, useParams } from "react-router-dom";
import SplashScreen from "../../ui/SplashScreen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { acceptInviteAPI, invitationInfoAPI } from "../../services/groups";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

function Invitation() {
    const { accessToken } = useAuth();
    const { token } = useParams();
    const navigate = useNavigate();

    const {
        data: inviteData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["invitationInfo", token],
        queryFn: () => invitationInfoAPI(accessToken, token),
        enabled: !!token && !!accessToken,
    });

    const { mutate: accept, isPending: isAccepting } = useMutation({
        mutationFn: acceptInviteAPI,
        onSuccess: () => {
            toast.success("Joined successfully");
            if (!inviteData?.groupId) return;
            navigate(`/tribes/${inviteData?.groupId}`);
        },
        onError: (err) => toast.error(err.message),
    });

    function handleAccept() {
        accept({ accessToken, token });
    }

    if (isLoading) return <p>loading </p>;

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-tribe-600">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
                {/* Image */}
                <img
                    src={inviteData?.groupPicture}
                    alt="group"
                    className="mx-auto mb-4 h-20 w-20 rounded-lg object-cover"
                />

                {/* Text */}
                <p className="text-sm text-gray-500">
                    You&apos;ve been invited to join
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                    {inviteData?.groupName}
                </h2>

                <p className="text-xs text-gray-400">
                    {inviteData?.membersCount}
                </p>

                {/* Actions */}
                <div className="mt-5 flex gap-2">
                    <button
                        onClick={handleAccept}
                        disabled={isAccepting}
                        className="flex-1 rounded-lg bg-tribe-600 py-2 text-sm font-medium text-white transition hover:bg-tribe-700 disabled:opacity-50"
                    >
                        {isAccepting ? "Joining..." : "Accept"}
                    </button>

                    <Link
                        to="/"
                        className="flex-1 rounded-lg border border-red-400 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    >
                        decline
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Invitation;
