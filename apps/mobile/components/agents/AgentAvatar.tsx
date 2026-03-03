import * as React from 'react';
import { type ViewProps } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import type { Agent } from '@/api/types';

interface AgentAvatarProps extends ViewProps {
  agent?: Agent;
  size?: number;
}

/**
 * AgentAvatar Component - Agent-specific wrapper around unified Avatar
 * 
 * Uses the unified Avatar component with agent-specific configuration.
 * Automatically handles:
 * - Agent icon from backend (icon_name)
 * - Agent colors (icon_color, icon_background)
 * - NEXUS/NEXUS SUPER WORKER special case (Nexus symbol)
 * - Fallback to agent name initial
 * 
 * @example
 * <AgentAvatar agent={agent} size={48} />
 */
export function AgentAvatar({ agent, size = 48, style, ...props }: AgentAvatarProps) {
  // Check if this is the NEXUS/NEXUS SUPER WORKER
  const isNexusAgent = agent?.metadata?.is_nexus_default || 
                      agent?.name?.toLowerCase() === 'nexus' ||
                      agent?.name?.toLowerCase() === 'superworker' ||
                      agent?.name?.toLowerCase() === 'nexus super worker';

  return (
    <Avatar
      variant="agent"
      size={size}
      icon={agent?.icon_name || undefined}
      iconColor={isNexusAgent ? undefined : agent?.icon_color}
      backgroundColor={isNexusAgent ? undefined : agent?.icon_background}
      useNexusSymbol={isNexusAgent}
      fallbackText={agent?.name}
      style={style}
      {...props}
    />
  );
}

