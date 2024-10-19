import React, { useState, useEffect } from 'react';
import styles from '../../styles/ProfilePage.module.css';
import btnStyles from '../../styles/Button.module.css';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import { Image } from 'react-bootstrap';

const ProfilePage = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}/`);
        setProfileData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [id]);

  return (
    <div className={styles.ProfilePage}>
      {profileData ? (
        <div className={styles.ProfileContainer}>
          <Image src={profileData.image} roundedCircle className={styles.ProfileImage} />
          <h2 className={styles.ProfileName}>{profileData.owner}</h2>
          <p><strong>Name:</strong> {profileData.name || 'N/A'}</p>
          <p><strong>Favourite Game:</strong> {profileData.favourite_game || 'N/A'}</p>
          <p><strong>Member since:</strong> {new Date(profileData.created_at).toLocaleDateString()}</p>          
          <p><strong>Games Posted:</strong> {profileData.games_count}</p>
          <button className={`${btnStyles.Button} ${btnStyles.EditButton}`}>
            Edit Profile
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;
