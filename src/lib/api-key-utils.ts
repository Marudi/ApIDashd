
import { mockPolicies } from "@/lib/mock-data";

export const getPolicyName = (policyId: string) => {
  const policy = mockPolicies.find(p => p.id === policyId);
  return policy ? policy.name : "Unknown Policy";
};
