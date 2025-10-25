import { Link } from "react-router";

interface AuthRedirectProps {
  text: string;
  linkText: string;
  link: string;
}

export default function AuthRedirect({
  text,
  linkText,
  link,
}: AuthRedirectProps) {
  return (
    <p className="text-center text-sm">
      {text}{" "}
      <Link to={link} className="link">
        {linkText}
      </Link>
    </p>
  );
}
