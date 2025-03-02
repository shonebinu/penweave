import LinkButton from "@/components/LinkButton.tsx";

export default function Home() {
  return (
    <div>
      <h1>Pen Weave</h1>
      <LinkButton to="/login">Login</LinkButton>
      <LinkButton to="/signup">Sign Up</LinkButton>
      <LinkButton to="/dashboard">Dashboard</LinkButton>
    </div>
  );
}
