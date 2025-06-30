import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Globe, Mail, MapPin } from "lucide-react";

function ProfileContactInformation() {
  const { user } = useContext(AuthContext);
  return (
    <>
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
                  <p className="text-sm text-muted-foreground">
                    {user.location}
                  </p>
                </div>
              </div>
            )}

            {user.website && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors backdrop-blur-xl">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Website</p>
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
    </>
  );
}

export default ProfileContactInformation;
