export const ByteToGiB = (byte: number) => Number((byte / 1024 ** 3).toFixed(2))
export const GiBToByte = (gib: number): number => gib * 1024 ** 3
export const formatCpu = (cpu: number) => Number(cpu.toFixed(2))
