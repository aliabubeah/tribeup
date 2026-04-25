import { Button } from "@headlessui/react";
import { useAuth } from "../../contexts/AuthContext";
import { MyGroupsAPI } from "../../services/groups";
import MainButton from "../../ui/Buttons/MainButton";
import { useQuery } from "@tanstack/react-query";

function Tribes() {
    const { accessToken } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ["tribes"],
        queryFn: () => MyGroupsAPI(accessToken),
    });
    console.log(data);

    if (isLoading) return <p>loading...</p>;
    if (error) return <p>{error.message}</p>;

    return (
        <div className="flex gap-2">
            {data.items.map((tribe) => (
                <MainButton key={tribe.id} to={`${tribe.id}`} className="p-2">
                    go to {tribe.groupName}
                </MainButton>
            ))}
        </div>
    );
}

export default Tribes;
