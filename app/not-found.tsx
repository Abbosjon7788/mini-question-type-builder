import type { Metadata } from "next";
import { NotFoundView } from "@/views/not-found-view";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return <NotFoundView />;
}
