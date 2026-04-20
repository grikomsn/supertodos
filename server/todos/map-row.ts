export function mapRow(row: Record<string, unknown>) {
  const id = row.id
  return {
    ...row,
    id: typeof id === 'string' ? Number(id) : Number(id),
  }
}
