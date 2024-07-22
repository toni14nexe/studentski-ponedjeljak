import type { PostAssembly } from "@/types/assembly";

export async function POST_assembly(assembly: PostAssembly) {
  const response = await fetch("/api/assemblies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...assembly }),
  });

  return response;
}
