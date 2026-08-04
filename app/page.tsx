import { AccessGateway } from "./components/AccessGateway";

export default function Home() {
  return (
    <AccessGateway
      development={process.env.NODE_ENV === "development"}
    />
  );
}
