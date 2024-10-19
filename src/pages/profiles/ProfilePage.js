import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Card } from 'react-bootstrap';
import logo from "../../assets/logo.png";
import styles from '../../styles/ProfilePage.module.css';
import appStyles from '../../App.module.css';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import { ProfileEditDropdown } from "../../components/MoreDropdown";

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
    <div className={appStyles.Content}>
      {profileData ? (
        <Card className="mb-4" style={{ padding: '5px', borderRadius: '10px' }}>
          <Row className="text-center">
            <Col xs={12} md={4} className="d-flex justify-content-center align-items-center mb-2 mb-md-0">
              <Image src={logo} alt="logo" height="75" />
            </Col>
            <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
              <Image
                src={profileData.image}
                roundedCircle
                className={styles.ProfileImage}
              />
            </Col>
          </Row>
          {profileData?.is_owner && <ProfileEditDropdown id={profileData?.id} />}
          <Card.Body className="text-center">
            <Card.Title className={`${styles.ProfileName} mb-3`}>{profileData.owner}</Card.Title>
            <Card.Text className={`${styles.ProfileInfo} text-muted`}>
              <strong>Name:</strong> {profileData.name || 'N/A'}
            </Card.Text>
            <Card.Text className={`${styles.ProfileInfo} text-muted`}>
              <strong>Favourite Game:</strong> {profileData.favourite_game || 'N/A'}
            </Card.Text>
            <Card.Text className={`${styles.ProfileInfo} text-muted`}>
              <strong>Member since:</strong> {new Date(profileData.created_at).toLocaleDateString()}
            </Card.Text>
            <Card.Text className={`${styles.ProfileInfo} text-muted`}>
              <strong>Games Posted:</strong> {profileData.games_count}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;
