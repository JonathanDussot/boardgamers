export const ProfileDataProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
      pageProfile: { results: [] },   // Stores data for a user's profile page
    });
  
    const currentUser = useCurrentUser();
  
    return (
      <ProfileDataContext.Provider value={profileData}>
        <SetProfileDataContext.Provider value={setProfileData}>
          {children}
        </SetProfileDataContext.Provider>
      </ProfileDataContext.Provider>
    );
  };
  