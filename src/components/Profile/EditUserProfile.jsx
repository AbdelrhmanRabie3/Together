import {
  Briefcase,
  Check,
  Edit2,
  Github,
  Globe,
  Linkedin,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "./../../utils/schema";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
function EditUserProfile({ showEditModal, setShowEditModal }) {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user.displayName || "",
      bio: user.bio || "",
      phone: user.phone || "",
      location: user.location || "",
      occupation: user.occupation || "",
      company: user.company || "",
      website: user.website || "",
      social: {
        github: user.social?.github || "",
        linkedin: user.social?.linkedin || "",
      },
    },
  });
  const handleCancel = () => {
    reset();
    setShowEditModal(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const updatedData = {
      displayName: data.displayName.trim(),
      bio: data.bio.trim(),
      phone: data.phone.trim(),
      location: data.location.trim(),
      occupation: data.occupation.trim(),
      company: data.company.trim(),
      website: data.website.trim(),
      social: {
        github: data.social.github.trim(),
        linkedin: data.social.linkedin.trim(),
      },
    };
    try {
      const auth = getAuth();
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, updatedData);
      await auth.currentUser.reload();
      const userSnap = await getDoc(userRef);
      const firestoreData = userSnap.data();
      setUser((prevUser) => ({
        ...prevUser,
        ...firestoreData,
      }));
      setLoading(false);
      setShowEditModal(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <>
      {showEditModal ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 text-center">
            <div className="space-y-4 ">
              <h3 className="text-lg font-semibold text-foreground">
                Basic Information
              </h3>
              <input
                {...register("displayName")}
                className="text-center text-xl font-bold bg-transparent border-primary/20 focus:border-primary/50"
                placeholder="Your name"
              />
              {errors.displayName && (
                <span className="text-red-500 text-xs">
                  {errors.displayName.message}
                </span>
              )}
              <Textarea
                {...register("bio")}
                className="min-h-[100px] text-center bg-transparent border-primary/20 focus:border-primary/50 resize-none"
                placeholder="Write something about yourself..."
              />
              {errors.bio && (
                <span className="text-red-500 text-xs">
                  {errors.bio.message}
                </span>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Contact Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                  <Phone className="h-4 w-4 text-primary/80" />
                  <Input
                    {...register("phone")}
                    className="bg-transparent border-none text-sm"
                    placeholder="Phone number"
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-xs">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-primary/80" />
                  <Input
                    {...register("location")}
                    className="bg-transparent border-none text-sm"
                    placeholder="Your location"
                  />
                </div>
                {errors.location && (
                  <span className="text-red-500 text-xs">
                    {errors.location.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Professional Information
              </h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                  <Briefcase className="h-4 w-4 text-primary/80" />
                  <Input
                    {...register("occupation")}
                    className="bg-transparent border-none text-sm"
                    placeholder="Occupation"
                  />
                </div>
                {errors.occupation && (
                  <span className="text-red-500 text-xs">
                    {errors.occupation.message}
                  </span>
                )}
                <Input
                  {...register("company")}
                  className="bg-transparent border-primary/20 focus:border-primary/50 text-sm"
                  placeholder="Company"
                />
                {errors.company && (
                  <span className="text-red-500 text-xs">
                    {errors.company.message}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Social Links
              </h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                  <Globe className="h-4 w-4 text-primary/80" />
                  <Input
                    {...register("website")}
                    className="bg-transparent border-none text-sm"
                    placeholder="Personal website"
                    type="url"
                  />
                </div>
                {errors.website && (
                  <span className="text-red-500 text-xs">
                    {errors.website.message}
                  </span>
                )}
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                  <Github className="h-4 w-4 text-primary/80" />
                  <Input
                    {...register("social.github")}
                    className="bg-transparent border-none text-sm"
                    placeholder="GitHub profile"
                  />
                </div>
                {errors.social?.github && (
                  <span className="text-red-500 text-xs">
                    {errors.social.github.message}
                  </span>
                )}
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                  <Linkedin className="h-4 w-4 text-primary/80" />
                  <Input
                    {...register("social.linkedin")}
                    className="bg-transparent border-none text-sm"
                    placeholder="LinkedIn profile"
                  />
                </div>
                {errors.social?.linkedin && (
                  <span className="text-red-500 text-xs">
                    {errors.social.linkedin.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <Button type="submit" disabled={loading} className="gap-2">
              <Check className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={handleCancel} className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setShowEditModal(true)}
          className="bg-primary/90 text-primary-foreground hover:bg-primary px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-xl"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      )}
    </>
  );
}

export default EditUserProfile;
