import { Input } from "@/components/ui/input";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { PropertyDocumentRow } from "./property-document-row";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PropertyDocument {
  id: string;
  title: string;
  type: string;
  date: string;
  url?: string | null;
  notes?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <View className="mx-5 bg-muted rounded-sm px-4 py-5 items-center">
      <Text className="text-[13px] font-inter text-muted-foreground">
        {message}
      </Text>
    </View>
  );
}

// ─── PropertyDocumentsTab ─────────────────────────────────────────────────────

interface PropertyDocumentsTabProps {
  documents: PropertyDocument[];
  isLoading?: boolean;
}

export function PropertyDocumentsTab({ documents, isLoading }: PropertyDocumentsTabProps) {
  const [search, setSearch] = useState("");

  const filtered =
    search.trim() === ""
      ? documents
      : documents.filter(
          (doc) =>
            doc.title.toLowerCase().includes(search.toLowerCase()) ||
            doc.type.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <View className="pt-4 pb-2 gap-3">
      <View className="px-5">
        <Input
          icon={Search}
          placeholder="Buscar documentos..."
          containerClassName="rounded-full"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
      </View>

      {documents.length === 0 ? (
        <EmptyState message="No hay documentos adjuntos" />
      ) : filtered.length === 0 ? (
        <EmptyState message="No se encontraron documentos" />
      ) : (
        <View className="gap-3">
          {filtered.map((doc) => (
            <PropertyDocumentRow
              key={doc.id}
              title={doc.title}
              type={doc.type}
              date={doc.date}
              url={doc.url}
              notes={doc.notes}
            />
          ))}
        </View>
      )}
    </View>
  );
}
