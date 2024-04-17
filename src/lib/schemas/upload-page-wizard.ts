import { z } from "zod";

export const uploadWizardStepSchema = z.object({ step: z.number() });
