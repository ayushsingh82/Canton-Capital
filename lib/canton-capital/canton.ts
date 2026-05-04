/**
 * Canton JSON API helpers — optional live ledger; demo falls back to in-memory store.
 */

const CANTON_URL =
  process.env.CANTON_URL ??
  process.env.NEXT_PUBLIC_CANTON_JSON_API_URL ??
  "";

export type ActiveContract = {
  contractId?: string;
  templateId: string;
  payload: Record<string, unknown>;
};

export type ActiveContractsResponse = {
  activeContracts?: ActiveContract[];
  result?: { activeContracts?: ActiveContract[] };
};

export async function fetchContracts(
  token: string | undefined,
): Promise<ActiveContractsResponse | null> {
  if (!CANTON_URL || !token) return null;

  const res = await fetch(`${CANTON_URL.replace(/\/$/, "")}/v2/state/active-contracts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: {
        filtersForAnyParty: {
          cumulative: [
            {
              identifierFilter: {
                WildcardFilter: { value: {} },
              },
            },
          ],
        },
      },
    }),
  });

  if (!res.ok) return null;
  return res.json() as Promise<ActiveContractsResponse>;
}

export function contractsArray(data: ActiveContractsResponse | null): ActiveContract[] {
  if (!data) return [];
  return data.activeContracts ?? data.result?.activeContracts ?? [];
}
