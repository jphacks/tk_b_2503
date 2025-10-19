"use client";

import { useState } from "react";

import { EditSection } from "./edit-section";
import { PreviewSection } from "./preview-section";

type CreateFormProps = {
  diaryId: string;
};

const CreateForm = ({ diaryId }: CreateFormProps) => {
  const [step, setStep] = useState<"edit" | "preview">("edit");

  return (
    <>
      {step === "edit" ? (
        <EditSection
          goNextSection={() => setStep("preview")}
          diaryId={diaryId}
        />
      ) : (
        <PreviewSection
          goPrevSection={() => setStep("edit")}
          diaryId={diaryId}
        />
      )}
    </>
  );
};

export default CreateForm;
