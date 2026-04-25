import { Button } from "@headlessui/react";
// import { useAuth } from "../../contexts/AuthContext";
import { MyGroupsAPI } from "../../services/groups";
import MainButton from "../../ui/Buttons/MainButton";

function Tribes() {
    // const { accessToken } = useAuth();
    // const data = MyGroupsAPI(accessToken);

    return (
        <div className="flex gap-2">
            <MainButton to="4" className="p-2">
                Go To Kamaa
            </MainButton>
            <MainButton to="1" className="p-2">
                Go To TribeUp
            </MainButton>
        </div>
    );
}

export default Tribes;
