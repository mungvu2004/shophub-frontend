import { INVENTORY_STATUS_CONFIG } from '../../logic/inventory.constants';

type InventoryStatusBadgeProps = {
  status: keyof typeof INVENTORY_STATUS_CONFIG;
};

export function InventoryStatusBadge({ status }: InventoryStatusBadgeProps) {
  const config = INVENTORY_STATUS_CONFIG[status];

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 border ${config.bgColor} ${config.textColor} border-current/10`}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span className="text-[11px] font-bold uppercase tracking-tight">{config.label}</span>
    </div>
  );
}
