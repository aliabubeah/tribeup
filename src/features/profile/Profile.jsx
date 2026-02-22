// import { useEffect, useState } from "react";
// import { getprofile } from "../../services/profile";
import { useAuth } from "../../contexts/AuthContext";
import avatar from "../../assets/avatar.jpeg";
import { getCleanImageUrl } from "../../services/http";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./profileSlice";
import { getDateLabel } from "../../utils/helper";

function Profile() {
    const { accessToken } = useAuth();
    const dispatch = useDispatch();
    const { account, isLoading, error } = useSelector((state) => state.profile);
    const user = "AliMohamed";

    useEffect(() => {
        if (!account && accessToken) {
            dispatch(fetchUserProfile({ accessToken, userName: user }));
        }
    }, [account, accessToken, dispatch]);

    if (isLoading) return <div>loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!account) return null;

    const {
        fullName,
        userName,
        bio,
        createdAt,
        profilePicture,
        coverPicture,
        tribesCount,
        postsCount,
        isOwnProfile,
    } = account;

    const displayBio = bio || "You don't have bio yet.";

    return (
        <div className="px-3 py-4">
            <div className="flex flex-col rounded-lg bg-white">
                <div className="relative rounded-t-lg bg-neutral-200">
                    <div>
                        <img
                            src={coverPicture}
                            className="h-44 w-full rounded-t-lg object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-6 left-6 flex">
                        <img
                            src={getCleanImageUrl(profilePicture)}
                            className="h-24 w-24 rounded-full"
                        />
                    </div>
                </div>

                <div className="relative flex flex-col gap-4 p-6 pt-12">
                    <div>
                        <h1 className="font-semibold">{fullName}</h1>
                        <p className="text-neutral-500">{userName}</p>
                        <p className="mt-2 text-sm font-normal">{displayBio}</p>
                    </div>

                    <p className="flex gap-2 text-sm font-normal text-neutral-700">
                        <span className="icon-outlined">calendar_today</span>
                        {getDateLabel(createdAt)}
                    </p>

                    <div className="flex items-center justify-between border-t pt-2">
                        <div className="flex gap-6">
                            <p className="text-neutral-700">
                                <span className="mr-1 font-bold text-neutral-950">
                                    {tribesCount}
                                </span>{" "}
                                Tribes
                            </p>
                            <p className="text-neutral-700">
                                <span className="mr-1 font-bold text-neutral-950">
                                    {postsCount}
                                </span>{" "}
                                Posts
                            </p>
                        </div>
                        {isOwnProfile && (
                            <SecondaryButton
                                to="/settings/account"
                                className="px-6 py-4"
                            >
                                Edit profile
                            </SecondaryButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
