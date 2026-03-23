import PropertyDetailScreen, {
  type PropertyDetail,
} from "@/features/properties/screens/property-detail-screen";
import { useLocalSearchParams } from "expo-router";

// TODO: replace with real Supabase data fetch
const DEMO_PROPERTY: PropertyDetail = {
  id: "1",
  name: "Loft Malasaña",
  address: "Calle Fuencarral 12, 4A, Madrid",
  type: "apartment",
  size: 85,
  year: 2019,
  documents: [
    {
      id: "d1",
      title: "Escritura de compraventa",
      type: "deed",
      date: "2019-06-15",
      url: null,
      notes: "Notaría Pérez & Asociados",
    },
    {
      id: "d2",
      title: "Seguro del hogar 2024",
      type: "insurance",
      date: "2024-01-01",
      url: "https://example.com/seguro.pdf",
    },
  ],
  incidents: [
    {
      id: "i1",
      title: "Fuga de agua en el baño",
      description: "Goteo constante bajo el lavabo desde hace tres días. Posible rotura de tubería.",
      status: "open",
      priority: "high",
      date: "2024-11-20",
      cost: null,
      companyName: "Fontanería Martínez",
    },
    {
      id: "i2",
      title: "Avería aire acondicionado",
      description: "El split del salón no enfría. Revisión pendiente.",
      status: "in_progress",
      priority: "medium",
      date: "2024-10-05",
      cost: 120,
      companyName: null,
    },
    {
      id: "i3",
      title: "Cambio de cerradura",
      description: "Sustitución de cerradura principal por pérdida de llaves.",
      status: "resolved",
      priority: "low",
      date: "2024-08-12",
      cost: 85,
      companyName: "Cerrajería Rápida SL",
    },
  ],
};

export default function PropertyDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: fetch property by id from Supabase
  const property = { ...DEMO_PROPERTY, id: id ?? DEMO_PROPERTY.id };
  return <PropertyDetailScreen property={property} />;
}
