/** Canton Capital Daml package — align with `daml/CantonCapital.daml` after `daml build`. */

export const DAML_PACKAGE_ID =
  process.env.NEXT_PUBLIC_DAML_PACKAGE_ID ?? "";

export const MODULE_NAME = "CantonCapital";

export const LEDGER_ID =
  process.env.NEXT_PUBLIC_CANTON_LEDGER_ID ?? "sandbox";

export const APPLICATION_ID =
  process.env.NEXT_PUBLIC_CANTON_APPLICATION_ID ?? "canton-analytics";

export function templateId(templateName: string): string {
  if (DAML_PACKAGE_ID) {
    return `${DAML_PACKAGE_ID}:${MODULE_NAME}:${templateName}`;
  }
  return `${MODULE_NAME}:${templateName}`;
}
