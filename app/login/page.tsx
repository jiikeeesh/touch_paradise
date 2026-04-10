import PageLayout from "@/components/PageLayout";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin Login | Touch Paradise",
  description: "Secure access to the Touch Paradise administration dashboard.",
};

export default function LoginPage() {
  return (
    <PageLayout hideSocial={true}>
      <LoginForm />
    </PageLayout>
  );
}
