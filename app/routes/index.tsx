import { Link } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export default function Index() {
  return (
    <AppLayout>
      <Link to='/about'>
        about
      </Link>
    </AppLayout>
  );
}
