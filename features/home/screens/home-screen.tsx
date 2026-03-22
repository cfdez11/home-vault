import { AppHeader } from "@/components/app-header";
import { Screen } from "@/components/ui/screen";
import { useState } from "react";
import { FabMenu } from "@/components/fab-menu";
import { PropertiesSection } from "../components/properties-section";
import { SummarySection } from "../components/summary-section";
import { WelcomeHeader } from "../components/welcome-header";

export default function HomeScreen() {
  const [fabExpanded, setFabExpanded] = useState(false);

  return (
    <Screen
      header={<AppHeader title="Inicio" />}
      fab={
        <FabMenu
          expanded={fabExpanded}
          onToggle={() => setFabExpanded(!fabExpanded)}
        />
      }
    >
      <WelcomeHeader
        name="Carlos"
        subtitle="Bienvenido de nuevo a tu archivo digital inmobiliario"
      />
      <SummarySection openIncidents={3} newDocuments={12} />
      <PropertiesSection />
    </Screen>
  );
}
