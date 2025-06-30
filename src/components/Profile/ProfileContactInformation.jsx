import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Briefcase, Github, Globe, Home, Linkedin, Mail, MapPin, Phone } from "lucide-react";

function ProfileContactInformation() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="">
        <Card className="shadow-xl border-border/50 bg-card/95 backdrop-blur-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center">
              Your Information
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
            {user.phone && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors backdrop-blur-xl">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
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
            {user.occupation && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors backdrop-blur-xl">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Occupation
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.occupation}
                  </p>
                </div>
              </div>
            )}
            {user.company && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors backdrop-blur-xl">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Home className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Company</p>
                  <p className="text-sm text-muted-foreground">
                    {user.company}
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
            {user.social?.github && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors backdrop-blur-xl">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Github className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">GitHub</p>
                  <a
                    href={user.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {user.social.github}
                  </a>
                </div>
              </div>
            )}
            {user.social?.linkedin && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors backdrop-blur-xl">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Linkedin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    LinkedIn
                  </p>
                  <a
                    href={user.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {user.social.linkedin}
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
