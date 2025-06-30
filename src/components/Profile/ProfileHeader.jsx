import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";

import { Card, CardHeader } from "../ui/card";
import { Calendar, Check, Edit2, X } from "lucide-react";
import ProfilePicture from "./ProfilePicture";
import EditUserProfile from "./EditUserProfile";
import { useState } from "react";

function ProfileHeader() {
  const { user } = useContext(AuthContext);
  const [showEditModal, setShowEditModal] = useState(false);
  return (
    <>
      <Card className="mb-8 shadow-2xl border-border/50 bg-card/95 backdrop-blur-2xl">
        <CardHeader className="pb-8">
          <div className="flex flex-col items-center space-y-6">
            <ProfilePicture />

            {!showEditModal && (
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
            )}
            <EditUserProfile
              showEditModal={showEditModal}
              setShowEditModal={setShowEditModal}
            />
          </div>
        </CardHeader>
      </Card>
    </>
  );
}

export default ProfileHeader;
