import { Link } from "react-router-dom";
import InfoCard from "@/components/InfoCard";

function NotFoundPage() {
  return (
    <div className="info-grid">
      <InfoCard
        className="surface-card--span-12"
        title="Route not found"
        subtitle="Use the navigation above to return to the platform shell."
      >
        <div className="placeholder-box">
          <p className="muted">
            The requested route does not exist in the Phase 6 skeleton. Return to the
            {" "}
            <Link to="/">overview page</Link>.
          </p>
        </div>
      </InfoCard>
    </div>
  );
}

export default NotFoundPage;
