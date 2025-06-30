import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileContactInformation from "../components/Profile/ProfileContactInformation";
import NavBar from "../components/ui/NavBar";

function Profile() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen mt-15 bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ProfileHeader />
          <ProfileContactInformation />
        </div>
      </div>
    </>
  );
}

export default Profile;
