import NavBar from "../components/ui/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

import { Badge } from "../components/ui/badge";
import { Calendar, Mail, MapPin, Globe, Image, Edit2 } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../components/context/AuthContextProvider";
import { uploadImageToImgBb, validateImage } from "../utils/imageUpload";
import { updateProfile } from "firebase/auth";
import { useState } from "react";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const updateProfileImage = async (imageFile) => {
    if (!validateImage(imageFile)) return;

    try {
      setLoading(true);
      const imageUrlResponse = await uploadImageToImgBb(imageFile);
      const url = imageUrlResponse;
      await updateProfile(user, { photoURL: url });
      await user.reload();

      setUser(user);
      // Update all posts by this user with the new photoURL
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const updatePromises = [];
      querySnapshot.forEach((docSnap) => {
        updatePromises.push(updateDoc(docSnap.ref, { photoURL: url }));
      });
      await Promise.all(updatePromises);
      setLoading(false);
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };
  const handleEditProfile = () => {};
  return (
    <>
      <NavBar />
      <div className="min-h-screen mt-15 bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="mb-8 shadow-2xl border-border/50 bg-card/95 backdrop-blur-2xl">
            <CardHeader className="pb-8">
              <div className="flex flex-col items-center space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center h-32 w-32">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/90 border-t-transparent" />
                  </div>
                ) : (
                  <div className="relative group">
                    <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-xl">
                      <AvatarImage src={user.photoURL} alt={user.displayName} />
                      <AvatarFallback className="text-3xl bg-primary/90 text-primary-foreground">
                        {user.displayName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="profileImage"
                      className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                    >
                      <Edit2 className="h-6 w-6 text-white" />
                      <input
                        id="profileImage"
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={(e) => updateProfileImage(e.target.files[0])}
                      />
                    </label>
                  </div>
                )}
                <div className="text-center space-y-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    {user.displayName}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    @{user.displayName?.toLowerCase().replace(/\s+/g, "")}
                  </p>

                  {user.bio && (
                    <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                      {user.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      Joined{" | "}
                      {new Date(user.metadata.creationTime).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleEditProfile}
                  className="bg-primary/90 text-primary-foreground hover:bg-primary px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-xl"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="">
            <Card className="shadow-xl border-border/50 bg-card/95 backdrop-blur-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.email && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors backdrop-blur-xl">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}

                {user.location && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors backdrop-blur-xl">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Location
                      </p>
                      <p className="text-sm text-muted-foreground">{user.location}</p>
                    </div>
                  </div>
                )}

                {user.website && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors backdrop-blur-xl">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Website
                      </p>
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        {user.website}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
