import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import NetworkBanner from "@/components/NetworkBanner";
import WalletConnector from "@/components/WalletConnector";
import useWallet from "@/hooks/useWallet";

function AppShell() {
  const wallet = useWallet();

  return (
    <div className="app-shell">
      <div className="app-shell__frame">
        <Navbar />
        <div className="hero-bar">
          <section className="hero-card">
            <span className="hero-card__eyebrow">Phase 9 privileged controls</span>
            <h1>Trust, donations, and moderation now share the same local prototype.</h1>
            <p>
              The frontend now supports campaign discovery, donation tracking, and verifier/admin
              lifecycle controls on top of the Phase 6 wallet and network foundation.
            </p>
          </section>
          <WalletConnector wallet={wallet} />
        </div>
        <div className="content-grid">
          <NetworkBanner wallet={wallet} />
          <Outlet context={{ wallet }} />
        </div>
      </div>
    </div>
  );
}

export default AppShell;
