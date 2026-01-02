"use client";

import { toggleMCPListingAction } from "@/actions/toggle-mcp-listing";
import { Switch } from "@/components/ui/switch";
import { useOptimisticAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface MCPListingSwitchProps {
  id: string;
  active: boolean;
}

export function MCPListingSwitch({ id, active }: MCPListingSwitchProps) {
  const { execute, optimisticState } = useOptimisticAction(
    toggleMCPListingAction,
    {
      currentState: {
        active,
      },
      updateFn: (currentState, input) => ({
        active: input.active,
      }),
      onSuccess: () => {
        if (optimisticState.active) {
          toast.success("MCP listing is now hidden");
        } else {
          toast.success("MCP listing is now visible");
        }
      },
      onError: () => {
        toast.error("Failed to update MCP listing status");
      },
    },
  );

  const handleToggle = (checked: boolean) => {
    execute({
      id,
      active: checked,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-[#878787]">
        {optimisticState.active ? "Listing is visible" : "Listing is hidden"}
      </span>
      <Switch
        checked={optimisticState.active}
        onCheckedChange={handleToggle}
        disabled={false}
        aria-label="Toggle MCP listing active state"
      />
    </div>
  );
}
