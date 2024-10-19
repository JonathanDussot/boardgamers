import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        // we will use the pageProfile later!
        pageProfile: { results: [] },
    });

    const currentUser = useCurrentUser();

    useEffect(() => {
        if (currentUser) {
            const fetchProfile = async () => {
                try {
                    const { data } = await axiosReq.get(`/profiles/${currentUser.profile_id}/`);
                    setProfileData({ pageProfile: data });
                } catch (err) {
                    console.log(err);
                }
            };

            fetchProfile();
        }
    }, [currentUser]);

    return (
        <ProfileDataContext.Provider value={profileData}>
            <SetProfileDataContext.Provider value={setProfileData}>
                {children}
            </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
    );
};