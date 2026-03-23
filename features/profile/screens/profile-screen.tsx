import { AppHeader } from "@/components/app-header";
import { Screen } from "@/components/ui/screen";
import { useAuth } from "@/features/auth/context/auth-context";
import { ProfileAppearanceSection } from "../components/profile-appearance-section";
import { ProfileAvatar } from "../components/profile-avatar";
import { ProfileInfoSection } from "../components/profile-info-section";
import { ProfileSignOutSection } from "../components/profile-signout-section";

export default function ProfileScreen() {
  const { session, signOut } = useAuth();

  const user = session?.user;
  const metadata = user?.user_metadata ?? {};

  const fullNameFallback: string = metadata.full_name ?? metadata.name ?? "";
  const [fallbackFirst = "", fallbackLast = ""] = fullNameFallback.split(" ");

  const firstName: string =
    metadata.first_name ?? metadata.given_name ?? fallbackFirst;
  const lastName: string =
    metadata.last_name ?? metadata.family_name ?? fallbackLast;
  const email = user?.email ?? "";

  return (
    <Screen header={<AppHeader title="Perfil" />}>
      <ProfileAvatar firstName={firstName} lastName={lastName} email={email} />
      <ProfileInfoSection firstName={firstName} lastName={lastName} />
      <ProfileAppearanceSection />
      <ProfileSignOutSection onSignOut={signOut} />
    </Screen>
  );
}
