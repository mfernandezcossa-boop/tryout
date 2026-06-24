import { useState } from "react";
import BrilersLayout from "@/components/brilers/BrilersLayout";
import BrilersDashboard from "@/components/brilers/BrilersDashboard";
import BrilersApplications from "@/components/brilers/BrilersApplications";
import BrilersModules from "@/components/brilers/BrilersModules";
import BrilersQuizTracking from "@/components/brilers/BrilersQuizTracking";
import BrilersMetrics from "@/components/brilers/BrilersMetrics";
import BrilersKnowledgeBase from "@/components/brilers/BrilersKnowledgeBase";

const AdminBrilers = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <BrilersLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {activeSection === "dashboard" && <BrilersDashboard />}
      {activeSection === "applications" && <BrilersApplications />}
      {activeSection === "modules" && <BrilersModules />}
      {activeSection === "quiz-tracking" && <BrilersQuizTracking />}
      {activeSection === "metrics" && <BrilersMetrics />}
      {activeSection === "knowledge-base" && <BrilersKnowledgeBase />}
    </BrilersLayout>
  );
};

export default AdminBrilers;
