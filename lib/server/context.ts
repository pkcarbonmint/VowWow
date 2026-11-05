import { cookies } from "next/headers";
import { applyActive, decodeExperiments, EXPERIMENT_COOKIE, newExperiments, SOURCE_COOKIE } from "../experiments";
import { decodeSource } from "../source";

/** Reads the experiment and first-touch source cookies that proxy.ts guarantees on every page request. */
export async function visitorContext() {
  const jar = await cookies();
  const raw = decodeExperiments(jar.get(EXPERIMENT_COOKIE)?.value) ?? newExperiments();
  return { experiments: applyActive(raw), source: decodeSource(jar.get(SOURCE_COOKIE)?.value) };
}
