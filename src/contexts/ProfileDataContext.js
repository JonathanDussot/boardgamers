export const ProfileDataProvider = ({ children }) => {
    // Stores data for user's profile page
    const [profileData, setProfileData] = useState({
      pageProfile: { results: [] },
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
  