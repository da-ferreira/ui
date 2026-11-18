export type PropRow = [name: string, type: string, defaultValue: string, description: string]

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead className="bg-surface text-xs text-dim">
          <tr>
            <th className="px-4 py-2.5 font-medium">Prop</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, type, def, description]) => (
            <tr key={name} className="border-t border-hairline align-top">
              <td className="px-4 py-3">
                <code className="font-mono text-[13px] font-medium text-ink">{name}</code>
                {description && <p className="mt-1 text-[13px] text-dim">{description}</p>}
              </td>
              <td className="px-4 py-3">
                <code className="font-mono text-[12.5px] break-words text-brand">{type}</code>
              </td>
              <td className="px-4 py-3 font-mono text-[12.5px] text-dim">{def || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
