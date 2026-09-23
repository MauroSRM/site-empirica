/**
 * Leitura tolerante dos valores do KV.
 *
 * A coluna value é JSONB e, ao longo do tempo, foi gravada de duas formas:
 * como string JSON (kv.set(k, JSON.stringify(x))) e como objeto nativo.
 * JSON.parse de um objeto produz "[object Object]" e lança — handlers que
 * assumiam string descartavam esses registros no catch, fazendo fundos
 * válidos sumirem das listagens sem erro nenhum.
 */
export function parseKv<T>(raw: unknown): T | null {
  if (raw == null) return null;
  if (typeof raw === "object") return raw as T;
  if (typeof raw !== "string") return null;

  try {
    let v: unknown = JSON.parse(raw);
    // Tolera valores duplamente serializados
    if (typeof v === "string") {
      const s = v.trim();
      if (s.startsWith("{") || s.startsWith("[")) {
        try { v = JSON.parse(s); } catch { /* mantém a string original */ }
      }
    }
    return v as T;
  } catch {
    return null;
  }
}
