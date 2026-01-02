import { Suspense } from "react";
import { CreateCompanyModal } from "./create-company-modal";

export function GlobalModals() {
  return (
    <Suspense fallback={null}>
      <CreateCompanyModal />
    </Suspense>
  );
}
