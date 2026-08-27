import { createFileRoute } from "@tanstack/react-router";
import { LedgerApp } from "@/components/calc/ledger-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <LedgerApp />;
}
