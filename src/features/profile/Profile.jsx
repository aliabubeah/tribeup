// import { useEffect, useState } from "react";
// import { getprofile } from "../../services/profile";
import { useAuth } from "../../contexts/AuthContext";

function Profile() {
    const { user } = useAuth();

    return (
        <div>
            <p>iam : {user?.fullName}</p>
            <p>email : {user?.email}</p>
        </div>
    );
}

export default Profile;
