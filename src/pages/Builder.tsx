import React from "react";
import { BuilderLayout } from "@/components/builder/BuilderLayout";
import { TamboProvider } from "@tambo-ai/react";
import { tamboTools } from "@/lib/tamboTools";

const Builder = () => {
  return (
    <TamboProvider
      apiKey={import.meta.env.VITE_TAMBO_API_KEY || ''}
      tools={tamboTools}
    >
      <BuilderLayout />
    </TamboProvider>
  );
};

export default Builder;
